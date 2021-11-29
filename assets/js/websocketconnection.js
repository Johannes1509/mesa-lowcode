/*

Websocket connection - basic functions

*/
var connection = new WebSocket('ws://localhost:7700/server');
connection.onopen = function () {
  main.__loadModelFromServer()
};

// Log errors
connection.onerror = function (error) {
  console.log('WebSocket Error ' + error);
};

// Log messages from the server
connection.onmessage = function (e) {
  let serverData = JSON.parse(e.data)
  if(serverData.type == "loadedmodel"){
    main.__getModelDataFromServer(serverData.data)
  }
  console.log('Server: ' + e.data);
};
