class Room extends PIXI.Container {
	constructor(info) {
		super();
		this.name = info.name;
		this.x = x;
		this.y = y;
		for(var player of info.players) {
			this.addPlayer(player)
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
}