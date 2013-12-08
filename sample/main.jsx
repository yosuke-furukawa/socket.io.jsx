import "socket.io.jsx";

class _Main {
  static function main(args : string[]) : void {
    var io = SocketIO.listen(5000);
    io.sockets.on("connection", function(socket : Socket) {
      socket.emit("news", {"hello":"world"});
      socket.on("my other event", function(data) {
        log data;
      });
    });
  }
}

