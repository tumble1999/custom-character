class Room extends PIXI.Container {
	constructor(info) {
		super();
		this.info = info;
		this.name = info.name;
		this.x = info.x;
		this.y = info.y;
		this.players = {};

		
		this.background = PIXI.Sprite.from(PIXI.Texture.WHITE);
		this.background.tint = info.x*0x10000+info.y*0x100+0xff;
		this.background.width = this.background.height = 4096;
		this.addChild(this.background);

		this.updatePlayers(info.players)
	}

	update(dt) {
		var pos = game.world.worldToScreen(this.info);
		this.x = pos.x;
		this.y = pos.y;
		Object.values(this.players).forEach(p=>p.update(dt));
	}

	worldToRoom(pos) {
		return {
			x:pos.x-this.info.x,
			y:pos.y-this.info.y,
		}
	}

	roomToWorld(pos) {
		return {
			x:pos.x+this.info.x,
			y:pos.y+this.info.y,
		}
	}

	updatePlayers(players) {
		for(var player in this.players) {
			if(!players.map(p=>p.id).includes(player)) {
				this.removePlayer(player);
			}
		}
		for(var p of players) {
			var player = this.addPlayer(p)
			if(game.playerInfo.id==p.id) {
				game.player = player;
			}
		}

	}

	addPlayer(info) {
		if(this.players[info.id||info.name]) {
			this.players[info.id||info.name].updateInfo(info);
			return this.players[info.id||info.name];
		};
		info.textureBlob = blobFromBytes(info.textureBlob);
		var pos = this.worldToRoom(info);
		info.x = pos.x;
		info.y = pos.y;
		var player = new Player(info);
		this.players[info.id||info.name] = player;
		this.addChild(player);
		return player;
	}
	
	removePlayer(id) {
		this.players[id].destroy({children:true});
		delete this.players[id];
	}

	movePlayer(info) {
		var pos = this.worldToRoom(info)
		this.players[info.id].moveTo(pos);
	}
}