import "nodejs/*.jsx";
import "socket.io.jsx";
import "socket.io-client.jsx";
import "test-case.jsx";
import "timer.jsx";

native class TimeoutServer extends HTTPServer {
  var timeout : number;
}

native class http_timeout extends http  {
  static function createServer(
		requestListener : function(:ServerRequest,:ServerResponse):void
  ) : TimeoutServer;
} = "require('http')";

class _Test extends TestCase {
  function setupServer(async: AsyncContext, port : int) : TimeoutServer {
    var server = http_timeout.createServer(function(req, res) {
      res.writeHead(200, {});
      res.end("HelloWorld", "utf-8");
    });
    server.timeout = 1000;
    server.listen(port);
    server.on("close", function() {
      log "close";
      async.done();
    });
    return server;
  }
  /**
   * test for socket.io listen and get socket.io.js
   */
  function testListenServer() : void {
    this.async((async) -> {
      var server = this.setupServer(async, 5000);
      SocketIO.listen(server); 
      http.get("http://localhost:5000/socket.io/socket.io.js", function(res) {
        this.expect(res.statusCode).toBe(200);
        this.expect(res.headers['content-type']).toBe('application/javascript');
        var buffer = "";
        res.on("readable", function() {
          buffer += res.read() as string;
        });
        res.on("end", function() {
          server.close();
        });
      });
    }, 2000);
  }

  /**
   * socket.io-client connects socket.io-server
   */
  function testSocketIOConnetToServer() : void {
    this.async((async) -> {
      var server = this.setupServer(async, 5000);
      var io = SocketIO.listen(server); 
      io.sockets.on('connection', function(socket:Socket) {
        socket.on("disconnect", function() {
          log "disconnect";
          server.close();
        });
      });
      var client = SocketIOClient.connect("http://localhost:5000/");
      client.on('connect', function() {
        this.pass("Connect success");
        client.socket.disconnect();
      });
    }, 2000);
  }

  /**
   * socket.io-client connects socket.io-server
   */
  function testSocketIOSendMessageFromServer() : void {
    this.async((async) -> {
      var server = this.setupServer(async, 5001);
      var io = SocketIO.listen(server); 
      io.sockets.on('connection', function(socket:Socket) {
        socket.emit("ping", "hello");
        socket.on("disconnect", function() {
          log "disconnect";
          server.close();
        });
      });
      var client = SocketIOClient.connect("http://localhost:5001/");
      client.on('ping', function(message) {
        this.expect(message).toBe("hello");
        client.socket.disconnect();
      });
    }, 3000);
  }


  /**
   * broadcast clients
   */
  function testSocketIOSendBroadcastMessageFromServer() : void {
    this.async((async) -> {
      var server = this.setupServer(async, 5002);
      var io = SocketIO.listen(server); 
      io.sockets.on('connection', function(socket:Socket) {
        socket.on("ping", function(data) {
          socket.broadcast.emit("ping", data);
        });
      });
      var client1 = SocketIOClient.connect("http://localhost:5002/", {"force new connection" : true});
      var client2 = SocketIOClient.connect("http://localhost:5002/", {"force new connection" : true});
      client1.on('connect', function() {
        client1.emit('ping', "hello2");
      });
      client2.on('ping', function(message) {
        this.expect(message).toBe("hello2");
        client1.socket.disconnect();
        client2.socket.disconnect();
        server.close();
      });
    }, 3000);
  }

  /**
   * broadcast json clients
   */
  function testSocketIOSendBroadcastJsonMessageFromServer() : void {
    this.async((async) -> {
      var server = this.setupServer(async, 5003);
      var io = SocketIO.listen(server); 
      io.sockets.on('connection', function(socket:Socket) {
        socket.on("ping", function(data) {
          socket.broadcast.json.emit("ping", data);
        });
      });
      var client1 = SocketIOClient.connect("http://localhost:5003/", {"force new connection" : true});
      var client2 = SocketIOClient.connect("http://localhost:5003/", {"force new connection" : true});
      client1.on('connect', function() {
        client1.emit('ping', {"hello" : "world"});
      });
      client2.on('ping', function(message) {
        this.expect(
          JSON.stringify(message as Map.<string>)
        ).toBe(
          JSON.stringify({"hello" : "world"})
        );
        client1.socket.disconnect();
        client2.socket.disconnect();
        server.close();
      });
    }, 3000);
  }
}
