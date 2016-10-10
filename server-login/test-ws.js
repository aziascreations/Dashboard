var fs = require('fs');
//var WebSocketServer = require('ws').Server;

console.log(getFormattedTime() + ": Starting test-ws...");

var config = {};
config.global = JSON.parse(fs.readFileSync("./config-global.json"));

//var wss = new WebSocketServer({port: config.global.ports.login});

var WebSocket = require('ws')
  , ws = new WebSocket('ws://localhost:'+config.global.ports.login);

ws.on('open', function() {
	console.log(getFormattedTime() + ": Connection established");
    ws.send(JSON.stringify({type:"request", requestType:"tokenValidity", requestData:{username:"cleanertest2", token:"abc123"}}));
    ws.send(JSON.stringify({type:"request", requestType:"tokenValidity", requestData:{username:"cleanertest1"}}));
    ws.send(JSON.stringify({type:"request", requestType:"tokenValidity", requestData:{token:"abc123"}, senderData: "HOOOooo 123"}));
    ws.send(JSON.stringify({type:"request", requestType:"tokenValidity", requestData:{username:"cleanertest1", token:"abc123"}, senderData: "HOOOooo 123"}));
    //ws.send(JSON.stringify({requestType:"tokenValidity", requestData:{username:"cleanertest1", token:"abc123"}})); //error test1
});

ws.on('message', function(message) {
    //console.log('received: %s', message);
	console.log(JSON.parse(message));
});

ws.on('error', function(error) {
    console.log('error: %s', error);
});

function getFormattedTime() {
	return (new Date()).toISOString().replace(/T/, ' ').replace(/\..+/, '');
}