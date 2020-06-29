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

	addPlayer(info) {
		if(this.players[info.id||info.name]) return;
		var player = new Player(info);
		this.players[info.id||info.name] = player;
		this.addChild(player);
		return player;
	}
}