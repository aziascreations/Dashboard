var mysql = require("mysql");

console.log(getFormattedTime() + ": Starting daily token cleanup...");

var con = mysql.createConnection({
	host: "localhost",
	user: "nodejs",
	password: "lo12345.",
	database: 'nodejs'
});

con.connect(function(err){
	if(err) {
		console.log(getFormattedTime() + ": An error occured while trying to connect to the database.");
		console.log(err);
		return;
	}
	console.log(getFormattedTime() + ": Connection established.");
	onConnected();
});

function onConnected() {
	con.query("UPDATE accounts SET token = null", function(err, rows, fields) {
		if(err) {
			console.log(err);
		} else {
			console.log(getFormattedTime() + ": Successfully cleaned all the users tokens");
		}
	});
	
	con.end(function(err) {
		console.log(getFormattedTime() + ": Closing connection...");
	});
}

function getFormattedTime() {
	return (new Date()).toISOString().replace(/T/, ' ').replace(/\..+/, '');
}