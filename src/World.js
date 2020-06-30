class World extends PIXI.Container {
	constructor() {
		super();
		this.bind = createBinder(this);
		this.players = {};

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

	update(dt) {
		Object.values(this.players).forEach(p=>p.update(dt));
	}

	mouseDown(e) {
		var pos = {
			x:e.pageX,
			y:e.pageY
		}
		game.player.moveTo(pos)
		game.emit("movePlayer",pos)
	}

	joinGame(info) {
		game.playerInfo.id = info.id;
		for(var p of info.players) {
			var player = this.addPlayer(p);
			if(info.id==p.id) {
				game.player = player;
			}
		}
	}

	addPlayer(info) {
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
	}

	movePlayer(info) {
		this.players[info.id].moveTo(info)
	}

	updateRooms(info) {
		
	}
}