/**
 * socket.io-client.jsx provides socket.io interface.
 * written by Yosuke Furukawa
 **/

import "nodejs/*.jsx";

native class SocketIOClient extends EventEmitter {
  static function connect(uri :string) : SocketIOClientManager;
  static function connect(uri :string, opts : Map.<variant>) : SocketIOClientManager;
  static function lookup(uri :string) : SocketIOClientManager;
  static function lookup(uri :string, opts : Map.<variant>) : SocketIOClientManager;

} = "require('socket.io-client')";

native class SocketIOClientManager extends EventEmitter {
  var socket : SocketIOClientSocket;
} = "require('socket.io-client').Manager";

native class SocketIOClientSocket extends EventEmitter {
  function close() : SocketIOClientSocket;
  function disconnect() : SocketIOClientSocket;
} = "require('socket.io-client').Socket";
