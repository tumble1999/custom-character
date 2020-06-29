class Player {
	constructor(playerInfo) {
		this.id = playerInfo.id;
		this.name = playerInfo.name;
		this.textureBlob = playerInfo.textureBlob;
		this.x = 0;
		this.y = 0;
	}
}

module.exports = Player;