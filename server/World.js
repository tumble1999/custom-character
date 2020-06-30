const socketIo = require('socket.io');
const Client = require('./Client');
var Player = require('./Player');
const { arraysEqual } = require('./Util');

var ROOM_SIZE = 4096;

class World {
	constructor(httpServer) {
		this.name = require('os').hostname();
		this.io = socketIo.listen(httpServer);
		this.socket = this.io.sockets;
		this.players = {};
		this.ROOM_SIZE = ROOM_SIZE;

		this.io.on('connect',this.joinServer.bind(this));
		console.log("Created Server " + this.name);
	}

	emit(...a) {
		this.socket.emit(...a);
	}

	emitToRoom(client,...a) {
		client.socket.to(client.room).emit(...a);
	}

	joinServer(socket) {
		new Client(this,socket);
	}

	addPlayer(client,playerInfo) {
		var player = new Player(playerInfo);
		this.players[playerInfo.id] = player;
		var rooms = this.getClientRooms(client,player);
		this.emitToRoom(client,"addPlayer",playerInfo);
		return {player,rooms};
	}

	removePlayer(client,id) {
		delete this.players[id];
		console.log("removePlayer",id)
		this.emitToRoom(client,"removePlayer",id);
	}

	movePlayer(client,info) {
		var player = this.players[info.id];
		player.x = info.x;
		player.y = info.y;
		this.emitToRoom(client,"movePlayer",info);
	}

	getRoom(x,y) {
		var minX = x*ROOM_SIZE;
		var maxX = minX+ROOM_SIZE
		var minY = y*ROOM_SIZE;
		var maxY = minY+ROOM_SIZE;
		var players = Object.values(this.players).filter(p=>minX<=p.x&&p.x<maxX&&minY<=p.y&&p.y<maxY).map(p=>{
			p.x -= minX;
			p.y -= minY;
		});
		return {
			name:minX/ROOM_SIZE + "-" + minY/ROOM_SIZE,
			x:minX,
			y:minY,
			players
		}
	}

	getClientRooms(client,player=undefined) {
		player = player||client.player;
		var roomX = Math.floor(player.x/ROOM_SIZE);
		var roomY = Math.floor(player.y/ROOM_SIZE);

		var rooms = {
			current:this.getRoom(roomX,roomY),
			north:this.getRoom(roomX,roomY-1),
			south:this.getRoom(roomX,roomY+1),
			west:this.getRoom(roomX-1,roomY),
			east:this.getRoom(roomX+1,roomY),
		}
		return rooms;
	}
}

module.exports = World;