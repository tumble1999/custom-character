class World extends PIXI.Container {
	constructor() {
		super();
		this.bind = createBinder(this);
		this.sectors = {};
		this.players = {}

		this.bindSocket("joinGame")
		this.bindSocket("joinMap")
		this.bindSocket("joinSector")
		this.bindSocket("addPlayer")
		this.bindSocket("removePlayer")
		this.bindSocket("movePlayer")
	}

	bindSocket(name) {
		var t = this;
		game.on(name,(...p)=>{
			console.log(name,...p)
			this.bind(name)(...p)
		});
	}

	screenToWorld(pos) {
		var playerPos = game.sector?game.sector.sectorToWorld(game.player):game.player;
		return {
			x:pos.x-game.getScreen().width/2+playerPos.x,
			y:pos.y-game.getScreen().height/2+playerPos.y
		}
	}
	worldToScreen(pos) {
		var playerPos = game.sector?game.sector.sectorToWorld(game.player):game.player;
		return {
			x:pos.x-playerPos.x+game.getScreen().width/2,
			y:pos.y-playerPos.y+game.getScreen().height/2
		}
	}

	getSectorName({x,y}) {
		return x+"-"+y;
	}

	update(dt) {
		Object.values(this.sectors).forEach(p=>p.update(dt));
	}

	mouseDown(e) {
		/*var pos = this.screenToWorld({x:e.pageX,y:e.pageY})
		pos = game.sector.worldToSector(pos);*/
		var pos = {
			x:e.pageX-game.getScreen().width/2+game.player.x,
			y:e.pageY-game.getScreen().height/2+game.player.y
		}
		game.emit("movePlayer",pos)
		game.player.moveTo(pos)
	}

	async joinGame(info) {
		game.info.id = info.id;
		game.info.server = info.server;
		game.info.SECTOR_SIZE = info.SECTOR_SIZE;
		await this.joinMap(info);
	}

	async joinMap(info) {
		game.info.map = info.map;
		game.data.maps[info.map] = await game.loadFile("data/maps/" + info.map + ".json")
		await this.joinSector(info);
	}

	async joinSector(info) {
		game.info.sector = info.sector;
		game.info.players = info.players;
		game.info.sectors = info.sectors;

		for(var sector in this.sectors) {
			if(!info.sectors.map(r=>r.name).includes(sector)){
				this.removeSector(sector);
			}
		}
		for(var s of info.sectors) {
			var sector = this.addSector(s);
			if(game.info.sector==s.name) {
				game.sector = sector;
				this.removeChild(sector);
				this.addChild(sector);
			}
		}
	}

	addSector(info) {
		if(this.sectors[info.name]) {
			this.sectors[info.name].updatePlayers(info.players);
			return this.sectors[info.name];
		};
		var sector = new Sector(info);
		this.sectors[info.name] = sector;
		this.addChild(sector);
		return sector;
	}

	removeSector(id) {
		this.removeChild(this.sectors[id])
		this.sectors[id].destroy({children:true});
		delete this.sectors[id];

	}

	addPlayer(info) {
		if(!game.info.players.map(i=>i.id).includes(info.id)) {
			game.info.players.push(info);
		}
		this.sectors[this.getSectorName(info.sector)].addPlayer(info)
	}
	
	removePlayer(info) {
		if(game.info.players.map(i=>i.id).includes(info.id)) {
			game.info.player = game.info.players.filter(p=>p!=info.id)
		}
		this.sectors[info.sector].removePlayer(info.id);
	}

	movePlayer(info) {
		this.sectors[info.sector].movePlayer(info);
	}
}