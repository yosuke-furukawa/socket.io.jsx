
native __fake__ class SocketIOWebClient {
  function connect(url:string) : WebClientSocket;
  function connect(url:string, opts : Map.<variant>) : WebClientSocket;
}

native __fake__ class WebClientSocket {
  function emit(event:string, ...value:variant) : void;
  function on(event:string, callback :(variant)->void):void;
}
