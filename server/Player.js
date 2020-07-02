const { PLAYER,RESET } = require("./ColorLog");

var defaultPlayer = {
	speed:3,
	map:"overworld",
	sectorX:0,
	sectorY:0,
	x:0,
	y:0
}

class Player {
	constructor(info) {
		info = Object.assign(defaultPlayer,info);
		this.id = info.id;
		this.name = info.name;
		this.speed = info.speed;
		this.textureBlob = info.textureBlob;
		this.map = info.map;
		this.sector = {
			x:info.sectorX,
			y:info.sectorY
		},
		this.x = info.x;
		this.y = info.y;
		console.log("Created Player",PLAYER+this.name+RESET);
	}
}

module.exports = Player;