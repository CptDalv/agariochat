var Commands = require('./CommandList');
var ChatServer = require('./ChatServer');

var chatServer = new ChatServer();
chatServer.start();
chatServer.commands = Commands.list;

var readline = require('readline');
var in_ = readline.createInterface({
	input : process.stdin,
	output : process.stdout
});
setTimeout(prompt, 100);

function prompt() {
	in_.question("", function(str) {
		parseCommands(str);
		return prompt();
	});
};

function parseCommands(str) {
	var split = str.split(" ");
	var first = split[0].toLowerCase();
	var execute = chatServer.commands[first];
	if ( typeof execute != 'undefined') {
		execute(chatServer, split);
	} else {
		console.log("[ChatServer] '" + first + "' is not a valid command!");
	}
};
