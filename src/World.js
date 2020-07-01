class World extends PIXI.Container {
	constructor() {
		super();
		this.bind = createBinder(this);
		this.rooms = {};
		//this.players = {};

		this.bindSocket("joinGame")
		this.bindSocket("addPlayer")
		this.bindSocket("removePlayer")
		this.bindSocket("movePlayer")
		this.bindSocket("updateRooms")
	}

	bindSocket(name) {
		var t = this;
		game.on(name,(...p)=>{
			console.log(name,...p)
			this.bind(name)(...p)
		});
	}

	screenToWorld(pos) {
		var playerPos = game.room?game.room.roomToWorld(game.player):game.player;
		return {
			x:pos.x-game.getScreen().width/2+playerPos.x,
			y:pos.y-game.getScreen().height/2+playerPos.y
		}
	}
	worldToScreen(pos) {
		var playerPos = game.room?game.room.roomToWorld(game.player):game.player;
		return {
			x:pos.x-playerPos.x+game.getScreen().width/2,
			y:pos.y-playerPos.y+game.getScreen().height/2
		}
	}

	update(dt) {
		//Object.values(this.players).forEach(p=>p.update(dt));
		Object.values(this.rooms).forEach(p=>p.update(dt));
	}

	mouseDown(e) {
		var pos = this.screenToWorld({x:e.pageX,y:e.pageY})
		game.emit("movePlayer",pos)
		pos = game.room.worldToRoom(pos);
		game.player.moveTo(pos)
	}

	joinGame(info) {
		game.playerInfo.id = info.id;
		game.playerInfo.room = info.room;
		this.updateRooms(info.rooms);
	}

	/*addPlayer(info) {
		if(this.players[info.id||info.name]) return;
		info.textureBlob = blobFromBytes(info.textureBlob);
		var player = new Player(info);
		this.players[info.id||info.name] = player;
		this.addChild(player);
		return player;
	}
	
	removePlayer(id) {
		this.players[id].destroy({children:true});
		delete this.players[id];
	}*/

	addRoom(info) {
		if(this.rooms[info.name]) {
			this.rooms[info.name].updatePlayers(info.players);
			return this.rooms[info.name];
		};
		var room = new Room(info);
		this.rooms[info.name] = room;
		this.addChild(room);
		return room;		
	}

	movePlayer(info) {
		//this.players[info.id].moveTo(info)
		this.rooms[info.room].movePlayer(info);
	}

	updateRooms(rooms) {
		game.playerInfo.room = rooms[0].name;
		for(var room in this.rooms) {
			if(!rooms.map(r=>r.name).includes(room)){
				this.rooms[room].destroy({children:true});
				delete this.rooms[room];
			}
		}
		for(var r of rooms) {
			var room = this.addRoom(r);
			if(game.playerInfo.room==r.name) {
				game.room = room;
			}
		}
		
	}
}