class World extends PIXI.Container {
	constructor() {
		super();
		this.bind = createBinder(this);
		this.sectors = {};
		this.players = {};

		if(game.data.maps[game.info.map]) {
			this.data = game.data.maps[game.info.map];
			this.loadData();
		}

		this.bindSocket("joinGame")
		this.bindSocket("joinMap")
		this.bindSocket("joinSector")
		this.bindSocket("addPlayer")
		this.bindSocket("removePlayer")
		this.bindSocket("movePlayer")
		this.bindSocket("updateCharacter")
	}

	async loadData() {
		if(this.data.sectorMap) this.sectorMap = await game.loadImage(this.data.sectorMap)
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

	withinWorld(pos) {
		var bounds = game.data.maps[game.info.map].bounds;
		return bounds.x*game.info.SECTOR_SIZE <=pos.x&&pos.x<(bounds.width+1)*game.info.SECTOR_SIZE&&
			bounds.y*game.info.SECTOR_SIZE <=pos.y&&pos.y<(bounds.height+1)*game.info.SECTOR_SIZE;
	}

	update(dt) {
		this.updateInput(dt);
		Object.values(this.sectors).forEach(p=>p.update(dt));
	}

	updateInput(dt) {
		if(!game.player) return;
		if(game.input.getMouseDown(Mouse.MIDDLE_CLICK)) {
			this.x = 0;
			this.y = 0;
		} else{
			var scroll = game.input.getMouseScroll();
			if(game.input.getKey(Keyboard.ALT)) {
				this.x -= scroll.y*dt;
			} else {
				this.x -= scroll.x*dt;
				this.y -= scroll.y*dt;
			}
		}
		if(game.inputManager.axisChanged("Down")||game.inputManager.axisChanged("Right")) {
			game.player.moveBy({
				dx:game.inputManager.getAxis("Right"),
				dy:game.inputManager.getAxis("Down")
			})
			game.emit("movePlayer",{
				x:game.player.x,
				y:game.player.y,
				dx:game.player.dx,
				dy:game.player.dy
			});
		}	
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
			if(!info.sectors.map(r=>r.name).includes(sector)&&this.withinWorld(sector)){
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
		var sector = this.sectors[info.sector]||game.sector;
		if(!game.info.players.map(i=>i.id).includes(info.id)) {
			game.info.players.push(info);
		}
		sector.addPlayer(info)
	}
	
	removePlayer(info) {
		var sector = this.sectors[info.sector]||game.sector;
		if(game.info.players.map(i=>i.id).includes(info.id)) {
			game.info.player = game.info.players.filter(p=>p!=info.id)
		}
		sector.removePlayer(info.id);
	}

	movePlayer(info) {
		var sector = this.sectors[info.sector]||game.sector;
		sector.movePlayer(info);
	}

	updateCharacter(info) {
		var sector = this.sectors[info.sector]||game.sector;
		sector.updateCharacter(info);
	}
}