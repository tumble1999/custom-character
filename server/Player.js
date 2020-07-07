const { PLAYER,RESET } = require("./ColorLog");

var defaultPlayer = {
	speed:3,
	map:"overworld",
	sectorX:5,
	sectorY:9,
	x:1024,
	y:1024,
	dx:0,
	dy:0
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
		this.dx = info.dx;
		this.dy = info.dy
		console.log("Created Player",PLAYER+this.name+RESET);
	}
}

module.exports = Player;