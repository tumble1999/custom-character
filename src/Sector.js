class Sector extends PIXI.Container {
	constructor(info) {
		super();
		this.info = info;
		this.id = info.id||info.name;
		this.name = info.name;
		this.x = info.x;
		this.y = info.y;
		this.players = {};
		if(game.data.maps[game.info.map][this.id]) {
			this.data = game.data.maps[game.info.map][this.id]
			this.loadData();
		}

		if(this.data&&this.data.background) {
			this.background = PIXI.Sprite.from(PIXI.Texture.from(this.data.background));
		} else {
			this.background = PIXI.Sprite.from(PIXI.Texture.WHITE);
			this.background.tint = info.x*0x10000+info.y*0x100+0xff;
		}
		this.background.width = this.background.height = game.info.SECTOR_SIZE;
		this.addChild(this.background);


		this.updatePlayers()
	}

	async loadData() {

		//this.collision = await game.loadFile(this.data.collisionMap)

	}

	update(dt) {
		if(!game.player) return;
		var pos = game.world.worldToScreen(this.info);
		this.x = pos.x;
		this.y = pos.y;
		Object.values(this.players).forEach(p=>p.update(dt));
	}

	worldToSector(pos={x:0,y:0}) {
		return {
			x:pos.x-this.info.x,
			y:pos.y-this.info.y,
		}
	}

	sectorToWorld(pos={x:0,y:0}) {
		return {
			x:pos.x+this.info.x,
			y:pos.y+this.info.y,
		}
	}

	updatePlayers() {
		var s = this;
		var players = game.info.players.filter(p=>(s.name==p.sector.x+"-"+p.sector.y));
		for(var player in this.players) {
			if(!players.map(p=>p.id).includes(player)) {
				this.removePlayer(player);
			}
		}
		for(var p of players) {
			var player = this.addPlayer(p)
			if(game.info.id==p.id) {
				game.player = player;
				this.removeChild(player);
				this.addChild(player);
			}
		}

	}

	addPlayer(info) {
		info.textureBlob = blobFromBytes(info.textureBlob);
		if(this.players[info.id]) {
			this.players[info.id].updateInfo(info);
			return this.players[info.id];
		};
		var player = new Player(info);
		this.players[info.id] = player;
		this.addChild(player);
		return player;
	}
	
	removePlayer(id) {
		this.removeChild(this.players[id])
		this.players[id].destroy({children:true});
		delete this.players[id];
	}

	movePlayer(info) {
		this.players[info.id].moveBy(info);
	}

	destroy(o) {
		super.destroy(o);
		console.log(this.name,"destroyed");
	}
}