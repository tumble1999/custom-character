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

	emitToRoom(client,...a) {
		client.socket.to(this.name).emit(...a);
	}

	joinServer(socket) {
		new Client(this,socket);
	}

	addPlayer(client,playerInfo) {
		var player = new Player(playerInfo);
		this.players[playerInfo.id] = player;
		this.emitToRoom(client,"addPlayer",playerInfo);
		client.join(this.name);
		return player;
	}

	removePlayer(id) {
		delete this.players[id];
		console.log("removePlayer",id)
	}

	movePlayer(client,info) {
		var player = this.players[info.id];
		player.x = info.x;
		player.y = info.y;
		this.emitToRoom(client,"movePlayer",info);
	}
}

module.exports = World;