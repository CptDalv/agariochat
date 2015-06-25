function Commands() {
	this.list = { };
	// Empty
}

module.exports = Commands;
Commands.list = {
	status : function(chatServer, split) {
		console.log('');
		console.log('[Console] Current Status');
		console.log('[Console] Port: ' + chatServer.port);
		console.log('[Console] Online users: ' + chatServer.totalnum + '/' + chatServer.maxClients);
		console.log('[Console] Server has been running for ' + process.uptime() + ' seconds.');
		console.log('[Console] Current memory usage: ' + process.memoryUsage().heapUsed / 1000 + '/' + process.memoryUsage().heapTotal / 1000 + ' kb');
		console.log('[Console] RECEIVED / FORWARDED messages: ' + chatServer.totalreceived + '/' + chatServer.totalsend);
	},
};
