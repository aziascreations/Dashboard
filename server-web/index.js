//var S = require('string');
var fs = require('fs');
var fileExists = require('file-exists');

var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

console.log(getFormattedTime() + " Starting web/core server...");

var config = {};
config.global = JSON.parse(fs.readFileSync("./config-global.json"));

app.get('/', function(req, res) {
	res.sendFile(__dirname + '/index.html');
	//console.log(req.url);
});

//TODO: Find a better way to detect images
//Should work fine now - Yep, perfect
app.get("/img/*", function(req, res) {
	//console.log("Image requested: " + req.url);
	if(fileExists(__dirname + config.global.web.dataDirectory + req.url)) {
		res.sendFile(__dirname + config.global.web.dataDirectory + req.url);
	} else {
		console.log("Unable to find: " + req.url);
		res.status(404).send('Image not found');
	}
});
app.get("/css/*", function(req, res) {
	if(fileExists(__dirname + config.global.web.dataDirectory + req.url)) {
		res.sendFile(__dirname + config.global.web.dataDirectory + req.url);
	} else {
		console.log("Unable to find: " + req.url);
		res.status(404).send('CSS file not found');
	}
});
app.get("/js/*", function(req, res) {
	if(fileExists(__dirname + config.global.web.dataDirectory + req.url)) {
		res.sendFile(__dirname + config.global.web.dataDirectory + req.url);
	} else {
		console.log("Unable to find: " + req.url);
		res.status(404).send('JavaScript file not found');
	}
});

io.on('connection', function(socket) {
	console.log('a user connected');
	//console.log(socket);
});

http.listen(config.global.ports.web, function() {
	console.log('listening on *:'+config.global.ports.web);
});

function getFormattedTime() {
	return (new Date()).toISOString().replace(/T/, ' ').replace(/\..+/, '');
}
