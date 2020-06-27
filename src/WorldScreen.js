class WorldScreen {
	constructor() {
		this.players = {};
	}

	addPlayer(id,name,textureBlob) {
		if(this.players[id]) return;
		this.players[id] = new Player(id,name,textureBlob);
		return this.players[id];
	}

	destroy() {

	}
}