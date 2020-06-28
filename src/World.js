class World extends PIXI.Container {
	constructor() {
		super();
		this.bind = createBinder(this);
		this.players = {};
	}

	update(dt) {
		Object.values(this.players).forEach(p=>p.update(dt));
	}

	mouseDown(e) {
		game.player.moveTo(e.pageX, e.pageY,0)
	}

	addPlayer(id,name,textureBlob) {
		if(this.players[id]) return;
		this.players[id] = new Player(id,name,textureBlob);
		this.addChild(this.players[id]);
		return this.players[id];
	}
}