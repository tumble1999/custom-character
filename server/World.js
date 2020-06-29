const socketIo = require('socket.io');
const Client = require('./Client');
var Player = require('./Player');

class World {
	constructor(httpServer) {
		this.name = require('os').hostname();
		this.io = socketIo.listen(httpServer);
		this.socket = this.io.sockets;
		this.players = {};

		this.io.on('connect',this.joinServer.bind(this));
		console.log("Created Server " + this.name);
	}

	emit(...a) {
		this.socket.emit(...a);
	}

	joinServer(socket) {
		new Client(socket);
	}

	addPlayer(id,name,textureBlob) {
		var player = new Player(id,name,textureBlob);
		this.players[id] = player;
		return player;
	}

	removePlayer(id) {
		delete player[id];
	}
}

module.exports = World;