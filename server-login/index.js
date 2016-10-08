var jsock = require('jsock');
var net = require('net');
var fs = require('fs');
var mysql = require("mysql");

console.log(getFormattedTime() + " Starting login server...");

var config = {};
config.global = JSON.parse(fs.readFileSync("./config-global.json"));

var con = mysql.createConnection({
	host: "localhost",
	user: "nodejs",
	password: "lo12345.",
	database: 'nodejs'
});

var server = null;

con.connect(function(err){
	if(err) {
		console.log(getFormattedTime() + " An error occured while trying to connect to the database.");
		console.log(err);
		return;
	}
	console.log(getFormattedTime() + " Connection established.");
	postDatabaseConnection();
});

function postDatabaseConnection() {
	server = net.createServer(function(client) {
		var client = jsock(client)
		client.on('data', function(data) {
			console.log("Received data:", data);
			
			//console.log(data.type);
			//console.log(data.contents);
			//client.write({type: 'ack', contents: 'Welcome client!'});
		});
		
	});

	server.listen(config.global.ports.login);
	
	checkTokenValidity("cleanertest1", null);
}


function checkTokenValidity(username, token) {
	/*if(token === null) {
		
	}*/
	//TODO: Add token and username verification
	//TODO: !Escape SQL to prevent SQL injection!
	con.query("SELECT `token` FROM `accounts` WHERE `username`=\"" + username + "\"", function(err, rows, fields) {
		if(err) {
			console.log(getFormattedTime() + " An error occured while trying to check a user token", err);
		} else {
			//console.log(getFormattedTime() + " Successfully cleaned all the users tokens");
			if(row != null) {
				console.log(row);
			}
			if(fields != null) {
				console.log(fields);
			}
		}
	});
}

function getFormattedTime() {
	return (new Date()).toISOString().replace(/T/, ' ').replace(/\..+/, '');
}

function shutdown() {
	console.log(getFormattedTime() + " Starting shutdown sequence...");
	
	con.end(function(err) {
		console.log(getFormattedTime() + " Closing SQL connection...");
	});
}