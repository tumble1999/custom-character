class Player {
	constructor(info) {
		this.id = info.id;
		this.name = info.name;
		this.textureBlob = info.textureBlob;
		this.x = 0;
		this.y = 0;
	}
}

module.exports = Player;