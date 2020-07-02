const socketIo = require('socket.io');
const Client = require('./Client');
var Player = require('./Player');
const { SOCKET,RESET,PLAYER,MAP,SECTOR } = require('./ColorLog');
const { platform } = require('os');

var SECTOR_SIZE = 2048;

class Game {
	constructor(httpServer) {
		this.name = require('os').hostname();
		this.io = socketIo.listen(httpServer);
		this.server = this.io.sockets;
		this.players = {};

		this.io.on('connect',this.joinServer.bind(this));
		console.log("Created Server",this.name);
	}

	getSectorName({x,y}) {
		return x+"-"+y;
	}

	getSectors(player) {
		var {x,y} = player.sector;
		var getSector = (x,y) =>({
			name:this.getSectorName({x,y}),
			x:x*SECTOR_SIZE,
			y:y*SECTOR_SIZE
		});

		return [
			getSector(x+1,y-1),//North-West
			getSector(x-1,y+1),//South-East
			getSector(x+1,y+1),//South-West
			getSector(x-1,y-1),//North-East
			getSector(x,y-1),//North
			getSector(x,y+1),//South
			getSector(x-1,y),//West
			getSector(x+1,y),//East
			getSector(x,y)//Current
		]
	}

	getPlayers(player) {
		var sector = player.sector;
		//   A B C
		// D x # x
		// E # # #
		// F x # x
		var
		a = p=>p.sector.x==sector.x-1,
		b = p=>p.sector.x==sector.x,
		c = p=>p.sector.x==sector.x+1,
		d = p=>p.sector.y==sector.y-1,
		e = p=>p.sector.y==sector.y,
		f = p=>p.sector.y==sector.y+1,
		filter = p=>
		(a(p)||b(p)||c(p))&&
		(d(p)||e(p)||f(p));
		return Object.values(this.players).filter(filter);
	}

	emitToGame(...a) {
		this.server.emit(...a);
	}

	emitToMap(client,...a) {
		client.socket.to("map-" + client.map).emit(...a);
	}
	
	emitToSector(client,...a) {
		client.socket.to("sector-" + client.sector).emit(...a);
	}

	joinServer(socket) {
		var client = new Client(this,socket);
		console.log(SOCKET+client.getID()+RESET,"has joined the server")
	}

	joinGame(client,info) {
		// TODO: Load Player info from database of some sort
		//Object.assign(info,playerDB)
		var player = new Player(info);
		client.player = player;
		this.players[info.id] = player;
		console.log(PLAYER+client.player.name+RESET,"has joined the game")
		return Object.assign({
			id:info.id,
			server:this.name,
			SECTOR_SIZE,
		},
		this.joinMap(client)
		)
	}

	leaveGame(client) {
		if(client.map) this.leaveMap(client);
		delete this.players[client.getID()];
		console.log(SOCKET+client.getID()+RESET,"has left the game")
	}

	joinMap(client,map=client.player.map) {
		client.player.map = map;
		if(client.map) this.leaveMap(client);
		client.join("map-"+map);
		client.map = map;
		console.log(PLAYER+client.player.name+RESET,"has joined the",MAP+map+RESET,"map")
		return Object.assign({map},
		this.joinSector(client)
		);
	}

	leaveMap(client) {
		if(client.sector) this.leaveSector(client);
		client.leave("map-"+client.map);
		console.log(PLAYER+client.player.name+RESET,"has left the",MAP+client.map+RESET,"map")
		client.map = null;
	}

	joinSector(client,sector=client.player.sector) {
		client.player.sector = sector;
		if(client.sector) this.leaveSector(client)
		var sectors = this.getSectors(client.player);
		var players = this.getPlayers(client.player);
		for(var s of sectors) {
			client.join("sector-"+s.name);
		}
		client.sector = this.getSectorName(sector);
		console.log(PLAYER+client.player.name+RESET,"has joined the",SECTOR+client.sector+RESET,"sector");
		this.emitToSector(client,"addPlayer",client.player);
		return {
			sector: this.getSectorName(sector),
			players,
			sectors
		}
	}

	leaveSector(client) {
		//tell everyone to remove this player from the sector
		this.emitToSector(client,"removePlayer",{
			id:client.getID(),
			sector:client.sector
		})
		//leave all sectors
		client.leaveAll((room)=>/^sector-/.test(room))
		console.log(PLAYER+client.player.name+RESET,"has left the",SECTOR+client.sector+RESET,"sector")
		client.sector = null;
	}

	movePlayer(client,info) {
		var player = client.player;
		player.x = (info.x+SECTOR_SIZE)%SECTOR_SIZE;
		player.y = (info.y+SECTOR_SIZE)%SECTOR_SIZE;
		player.sector.x += Math.floor(info.x/SECTOR_SIZE);
		player.sector.y += Math.floor(info.y/SECTOR_SIZE);
		console.log(player)
		if(client.sector!=this.getSectorName(player.sector)) {
			info = this.joinSector(client);
			client.emit("joinSector",info);
		} else {
			this.emitToMap(client,"movePlayer",info);
		}
	}
}

module.exports = Game;