class Player extends PIXI.Sprite {
	constructor(info) {
		super(PIXI.Texture.from(URL.createObjectURL(info.textureBlob)));
		this.x = info.x||-10090;
		this.y = info.y||-1000;
		this.playerId = info.id;
		this.name = info.name;
		this.speed = 3;
		this.destination = {x:this.x,y:this.y};

		this.nicknameSprite = new BorderText(this.name);
		this.addChild(this.nicknameSprite)
	}

	updateInfo(info) {
		var dif = subVec({x:this.x,y:this.y},this.destination)
		this.x = info.x+dif[0];
		this.y = info.y+dif[1];
		this.destination = {x:info.x,y:info.y};
	}

	update() {
		var pos = moveTowards({x:this.x,y:this.y},this.destination,this.speed);
		this.x = pos.x;
		this.y = pos.y;

		centerTo(this.nicknameSprite,this);
		this.nicknameSprite.y = 0
	}

	moveTo(pos) {
		var p = 4;
		this.destination = {
			x:pos.x-this.width/2,
			y:pos.y-(p-1)/(p)*this.height
		};
	}
}