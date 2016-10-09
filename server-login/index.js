var fs = require('fs');
var mysql = require("mysql");
//var jsock = require('jsock');
//var net = require('net');
var WebSocketServer = require('ws').Server;

console.log(getFormattedTime() + ": Starting login server...");

var config = {};
config.global = JSON.parse(fs.readFileSync("./config-global.json"));
var wss = new WebSocketServer({port: config.global.ports.login});
//var clients = {}

var con = mysql.createConnection({
	host: "localhost",
	user: "nodejs",
	password: "lo12345.",
	database: 'nodejs'
});

//var server = null;

con.connect(function(err) {
	if(err) {
		console.log(getFormattedTime() + ": An error occured while trying to connect to the database.");
		console.log(err);
		return;
	}
	console.log(getFormattedTime() + ": Connection with the database established.");
	postDatabaseConnection();
});

//WARN: Doesn't support client disconnecting and reconneting.
function postDatabaseConnection() {
	wss.on('connection', function(ws) {
		//Same as data according to the doc.
		console.log(getFormattedTime() + ": Client logged in from %s", "[Insert something here...]");
		//console.log(ws);
		
		ws.on('message', function(message) {
			//console.log(message);
			try {
				var data = JSON.parse(message);
				if(data.type == undefined) {
					console.log(getFormattedTime() + ": Received incorrectly formatted data: %s", message);
				} else if(data.type === "request") {
					//console.log(getFormattedTime() + ": Received a request.");
					if(data.requestType == undefined) {
						console.log(getFormattedTime() + ": Received incorrectly formatted data: %s", message);
					} else if(data.requestType === "tokenValidity") {
						checkTokenValidity(ws, data);
					}
				}
			} catch(err) {
				console.log(getFormattedTime() + ": Received non-parsable data: %s", message);
				console.log(err);
			}
		});
		//ws.send('something');
	});
	
	/*server = net.createServer(function(client) {
		var client = jsock(client)
		client.on('data', function(data) {
			console.log("Received data:", data);
			
			//console.log(data.type);
			//console.log(data.contents);
			//client.write({type: 'ack', contents: 'Welcome client!'});
		});
		
	});
	
	server.listen(config.global.ports.login);/**/
	
	//console.log(getFormattedTime() + ": Listenning on *:" + config.global.ports.login);
	//checkTokenValidity("cleanertest1", null);
	//checkTokenValidity("fsm", null);
	//checkTokenValidity("cleanertest2", null);
}

function checkTokenValidity(client, data) {
	var isTokenValid = false;
	var errorMessage = null;
	
	if(data.requestData.username === null || data.requestData.token === null) {
		errorMessage = "The username or token is null";
	} else if(data.requestData.username === undefined || data.requestData.token === undefined) {
		errorMessage = "The username or token is undefined";
	} else {
		//isTokenValid = checkTokenValidity(data.requestData.username, data.requestData.token);
		//console.log(isTokenValid);
	}
	
	//TODO: Add token and username verification
	//TODO: !Escape SQL to prevent SQL injection!
	
	//SELECT `token` FROM `accounts` WHERE `accounts`.`username` = "cleanertest1"
	//Don't add the fields thingy.
	if(errorMessage === null) {
		con.query("SELECT `token` FROM `accounts` WHERE `accounts`.`username`=\"" + data.requestData.username + "\"", function(err, rows) {
			if(err) {
				console.log(getFormattedTime() + ": An error occured while trying to check a user token");
				console.log(err);
				return false;
			} else {
				if(rows.length != 1) {
					console.log(getFormattedTime() + ": A token validity request has returned something unexpected: %s -> %s", data.requestData.username, JSON.stringify(rows));
					//add success here
					//return false;
				} else if(rows[0].token === null && rows[0].token === undefined) {
					//console.log(1);
					//return false;
				} else if(rows[0].token === data.requestData.token) {
					//console.log(2);
					//return true;
					isTokenValid = true;
				}
				//console.log(username + " - " + JSON.stringify(rows));
				//return false;
				//Send START
				client.send(
					JSON.stringify(
						{
							type:"response",
							responseData:{
								origin:data.requestType,
								success:true,
								error: null,
								isTokenValid:isTokenValid,
								username:data.requestData.username,
								token:data.requestData.token
							}
						}
					)
				);
				//Send END
			}
		});
	} else {
		client.send(
			JSON.stringify(
				{
					type:"response",
					responseData:{
						origin:data.requestType,
						success:false,
						error: errorMessage,
						isTokenValid:isTokenValid,
						username:data.requestData.username,
						token:data.requestData.token
					}
				}
			)
		);
	}
}

function getFormattedTime() {
	return (new Date()).toISOString().replace(/T/, ' ').replace(/\..+/, '');
}

function shutdown() {
	console.log(getFormattedTime() + ": Starting shutdown sequence...");
	
	con.end(function(err) {
		console.log(getFormattedTime() + ": Closing SQL connection...");
	});
}