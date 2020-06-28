class WorldScreen extends THREE.Group {
	constructor() {
		super();
		this.bind = createBinder(this);
		this.players = {};
		
		window.addEventListener("mousedown", this.bind("mouseDown"));
	}

	update() {
		Object.values(this.players).forEach(p=>p.update());
	}

	mouseDown(e) {
		var mouseWorld = screenToWorld(e.pageX, e.pageY);
		game.player.moveTo(mouseWorld.x, mouseWorld.y,0)

	}

	addPlayer(id,name,textureBlob) {
		if(this.players[id]) return;
		this.players[id] = new Player(id,name,textureBlob);
		this.add(this.players[id]);
		return this.players[id];
	}
}