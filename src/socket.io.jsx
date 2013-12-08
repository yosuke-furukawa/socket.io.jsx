/**
 * socket.io.jsx provides socket.io interface.
 * written by Yosuke Furukawa
 **/

import "nodejs/*.jsx";

native class SocketIO {
  static function listen(port : int) : SocketIO;
  static function listen(port : int, callback : ()->void) : SocketIO;
  static function listen(server : HTTPServer) : SocketIO;
  static function listen(server : HTTPServer, options : Map.<variant>) : SocketIO;
  static function listen(server : HTTPServer, options : Map.<variant>, callback : ()->void) : SocketIO;

  __readonly__ var sockets : Manager;

} = " require('socket.io') ";

native class Manager extends EventEmitter {
  function get(key : string) : variant;
  function set(key : string, value : variant) : Manager;
  function enable(key : string) : Manager;
  function disable(key : string) : Manager;
  function enabled(key : string) : boolean;
  function disabled(key : string) : boolean;
  var onHandshake : function(id : string, data : variant) : void;
  var onConnect : function(id : string) : void;
  var onDisConnect : function(id : string, local : string) : void;
  function on(event : string, callback: (Socket) -> void): void;

} = "require('socket.io').Manager";

native class Socket extends EventEmitter {
  function to(room : string) : Socket;
  function join(name : string) : Socket;
  function leave(name : string) : Socket;
  var broadcast : Socket;
  var volatile : Socket;
  var json : Socket;
} = "require('socket.io').Socket";
