//var S = require('string');
var fs = require('fs');
var fileExists = require('file-exists');

var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var jsock = require('jsock');
var net = require('net');

console.log(getFormattedTime() + ": Starting web/core server...");

var config = {};
config.global = JSON.parse(fs.readFileSync("./config-global.json"));

var subServersClients = {};
//subServersClients.login = {}; //Declare it here ?

app.get('/', function(req, res) {
	//TODO: Load special info about user.
	//In html part, check if user is valid, else redirect index.
	res.sendFile(__dirname + config.global.web.dataDirectory + '/index.html');
	//console.log(req.url);
});

//TODO: Find a better way to detect images - Should work fine now - Yep, perfect
//TODO: Combine all of these together ?
app.get("/img/*", function(req, res) {
	//console.log("Image requested: " + req.url);
	if(fileExists(__dirname + config.global.web.dataDirectory + req.url)) {
		res.sendFile(__dirname + config.global.web.dataDirectory + req.url);
	} else {
		console.log(getFormattedTime() + "ERROR: Unable to find: " + req.url);
		res.status(404).send('Image not found');
	}
});
app.get("/css/*", function(req, res) {
	if(fileExists(__dirname + config.global.web.dataDirectory + req.url)) {
		res.sendFile(__dirname + config.global.web.dataDirectory + req.url);
	} else {
		console.log(getFormattedTime() + "ERROR: Unable to find: " + req.url);
		res.status(404).send('CSS file not found');
	}
});
app.get("/js/*", function(req, res) {
	if(fileExists(__dirname + config.global.web.dataDirectory + req.url)) {
		res.sendFile(__dirname + config.global.web.dataDirectory + req.url);
	} else {
		console.log(getFormattedTime() + "ERROR: Unable to find: " + req.url);
		res.status(404).send('JavaScript file not found');
	}
});

io.on('connection', function(socket) {
	console.log('a user connected');
	//console.log(socket);
});

http.listen(config.global.ports.web, function() {
	console.log(getFormattedTime() + ": Server started !");
	console.log(getFormattedTime() + ": listening on *:"+config.global.ports.web);
	
	connectToSubServers();
});

function connectToSubServers() {
	console.log(getFormattedTime() + ": Connecting to sub-servers...");
	
	console.log(getFormattedTime() + ": Connecting to the login server at ?:" + config.global.ports.login);
	subServersClients.login = jsock(net.createConnection(config.global.ports.login));
	
}

/* Other functions */
function getFormattedTime() {
	return (new Date()).toISOString().replace(/T/, ' ').replace(/\..+/, '');
}
