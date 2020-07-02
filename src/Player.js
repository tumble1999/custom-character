class Player extends PIXI.Container {
	constructor(info) {
		super()
		this.info = info;
		this.id = info.id;
		this.name = info.name;
		this.destination = {x:this.x,y:this.y};

		this.nicknameSprite = new BorderText(this.name);
		this.addChild(this.nicknameSprite)

		this.updateInfo(info);
	}

	get worldPos() {
		return {
			x:this.sector.x*game.info.SECTOR_SIZE+this.x,
			y:this.sector.y*game.info.SECTOR_SIZE+this.y
		}
	}

	updateInfo(info) {
		for(var i in info) {
			this.info[i] = info[i];
		}
		if(!this.character) {
			this.character = new PIXI.Sprite(PIXI.Texture.from(URL.createObjectURL(info.textureBlob)));
			this.addChild(this.character);
		} else {
			this.character.texture = PIXI.Texture.from(URL.createObjectURL(info.textureBlob))
		}
		var dif = subVec({x:this.x,y:this.y},this.destination)
		this.map = info.map
		this.x = info.x+dif[0]
		this.y = info.y+dif[1];
		this.sector = info.sector;
		this.speed = info.speed;
		this.destination = {x:info.x,y:info.y};
	}

	update() {
		if(!game.player) return;
		var pos = moveTowards({x:this.x,y:this.y},this.destination,this.speed);
		this.x = pos.x;
		this.y = pos.y;

		centerTo(this.nicknameSprite,this);
		this.nicknameSprite.y = 0
	}

	moveTo(pos) {
		this.info.x = pos.x;
		this.info.y = pos.y;
		var p = 4;
		this.destination = {
			x:pos.x-this.width/2,
			y:pos.y-(p-1)/(p)*this.height
		};
	}

	destroy(o) {
		super.destroy(o);
		console.log(this.name,"destroyed");
	}
}