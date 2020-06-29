class Player extends PIXI.Sprite {
	constructor(id,name, textureBlob) {
		super(PIXI.Texture.from(URL.createObjectURL(textureBlob)));
		this.x = game.app.screen.width/2
		this.y = game.app.screen.height/2
		this.playerId = id;
		this.name = name;
		this.speed = 3;
		this.destination = {x:this.x,y:this.y};

		this.nicknameSprite = new BorderText(name);
		this.addChild(this.nicknameSprite)
	}

	update() {
		var pos = moveTowards({x:this.x,y:this.y},this.destination,this.speed);
		this.x = pos.x;
		this.y = pos.y;

		centerTo(this.nicknameSprite,this);
		this.nicknameSprite.y = 0
	}

	moveTo(x,y) {
		var p = 4;
		this.destination = {x:x-this.width/2,y:y-(p-1)/(p)*this.height};
	}
}