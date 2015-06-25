var express = require('express'), app = express(), server = require('http').createServer(app), io = require('socket.io').listen(server), conf = require('./config.json');
function ChatServer() {
	this.commands
	this.port = conf.port; // Port to listen
	this.maxClients = conf.maxClients;
	this.waitMSG = conf.waitMsg;
	this.unnamed = conf.unnamed;
	
	
	this.totalnum = 0;
	this.roomnum = 0;
	this.totalreceived = 0;
	this.totalsend = 0;
}

module.exports = ChatServer;

ChatServer.prototype.validateMSG = function(socket, data) {
	current = Date.now();
	if (current - socket.msgTime < this.waitMSG) {
		return 'Please wait ' + (Math.floor((this.waitMSG - (current - socket.msgTime))/1000)+1) + ' second(s).'; 
	}
	else if (data.text.length > 140) {
		return 'The given Message is too long.'; 
	}
	socket.msgTime = current;
	if(socket.lastMsg == data.text)
		socket.msgTime = current+(this.waitMSG*3)
	socket.lastMsg = data.text;
	return "OK";
}

ChatServer.prototype.start = function() {

	srv = this;
	server.listen(this.port);
	console.log("[ChatServer] Listen on port " + this.port);

	io.sockets.on('connection', function(socket) {

		// On user join
		socket.emit('init', {});
		srv.totalnum++;
		socket.leave(socket.room);
		
		socket.msgTime = Date.now() - srv.waitMSG;
		
		if (srv.totalnum > srv.maxClients) {
			socket.emit('info', {
				msg : 'You cannot connect because there are to many clients connected.'
			});
			socket.disconnect();
		}

		// On user disconnect
		socket.on('disconnect', function() {
			socket.leave(socket.room);
			srv.totalnum--;
		});
		
		
		// On heartbeat
		socket.on('heartbeat', function() {
			if ( typeof socket.room == 'undefined') {
				socket.emit('reconnect');
			}
		});

		// User joins room
		socket.on('join', function(data) {
			socket.leave(socket.room);
			socket.join(data.ip);
			socket.room = data.ip;

			inRoom = io.sockets.adapter.rooms[socket.room];
			clientnum = 0;
			if(typeof inRoom == 'object') {
				clientnum = Object.keys(inRoom).length;
			}
			socket.emit('Connected', {
				room : socket.room,
				num : clientnum
			});

		});

		// User sends msg
		socket.on('chat', function(data) {
			srv.totalreceived++;
			msgresult = srv.validateMSG(socket, data);
			if (msgresult == "OK") {
				srv.totalsend++;
				io.sockets.in(socket.room).emit('chat', {
					name : data.name || srv.unnamed,
					text : data.text
				});
			} else {
				socket.emit('info', {
					msg : msgresult
				});
			}
		});

	});
};

