class Player extends PIXI.Sprite {
	constructor(info) {
		super(PIXI.Texture.from(URL.createObjectURL(info.textureBlob)));
		this.x = info.x||game.app.screen.width/2
		this.y = info.y||game.app.screen.height/2
		this.playerId = info.id;
		this.name = info.name;
		this.speed = 3;
		this.destination = {x:this.x,y:this.y};

		this.nicknameSprite = new BorderText(this.name);
		this.addChild(this.nicknameSprite)
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