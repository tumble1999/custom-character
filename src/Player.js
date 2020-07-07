class Player extends PIXI.Container {
	constructor(info) {
		super()
		this.id = info.id;
		this.name = info.name;
		this.destination = {x:this.x,y:this.y};
		this.moving = false;
		this.dx = 0;
		this.dy = 0;
		this.abilities = [];
		this.abilities.length = 4;
		this.animation = {
			yMax:6,
			speed:0.013
		}

		this.character = new PIXI.Sprite(PIXI.Texture.from(game.data.characters.default));
		this.addChild(this.character);
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

	getSector() {
		return game.world.sectors[this.sectorName];
	}

	getWorldBounds() {
		return new PIXI.Rectangle(
			this.worldPos.x,
			this.worldPos.y,
			this.width,
			this.height
		)
	}

	getSectorBounds() {
		return new PIXI.Rectangle(
			this.x,
			this.y,
			100,
			100
		)
	}

	async updateInfo(info) {
		this.info = info;
		if(info.textureBlob) this.character.texture = PIXI.Texture.from(URL.createObjectURL(info.textureBlob))
		var dif = subVec({x:this.x,y:this.y},this.destination)
		this.map = info.map
		this.x = info.x+dif[0]
		this.y = info.y+dif[1];
		this.sector = info.sector;
		this.sectorName = game.getSectorName(info.sector)
		this.speed = info.speed;
		this.dx = info.dx;
		this.dy = info.dy
	}

	colliding() {
		var c = !game.world.withinWorld(this.getWorldBounds())||
		this.getSector().colliding(this.getSectorBounds())
		return c
	}

	updateCharacter(info)  {
		this.info.textureBlob = info.textureBlob;
		this.character.texture = PIXI.Texture.from(URL.createObjectURL(info.textureBlob))
	}

	updateFloatAnimation() {
		var speed = this.animation.speed;
		if(this.moving) {
			speed *= this.speed;
		}
		var time = performance.now()*speed/this.animation.yMax;
		this.character.y = (Math.sin(time)-1)*this.animation.yMax;
	}

	update() {
		// var pos = moveTowards({x:this.x,y:this.y},this.destination,this.speed);
		// this.x = pos.x;
		// this.y = pos.y;
		// this.moving = !(this.x==this.destination.x&&this.y==this.destination.y);
		this.moving = this.dx !=0||this.dy!=0;
		if(this.moving){
			var oldX = this.x;
			var oldY = this.y;
			this.x += this.dx * this.speed;
			this.y += this.dy * this.speed;

			if(this.colliding()){
				this.x = oldX;
				this.y = oldY
			}
		}
		
		centerTo(this.nicknameSprite,this);
		this.nicknameSprite.y = 0;

		this.updateFloatAnimation();
	}
	
	moveBy(info) {
		if(info.x) this.info.x = this.x = info.x;
		if(info.y) this.info.y = this.y = info.y;
		if(!isNaN(info.dx)) this.info.dx = this.dx = info.dx;
		if(!isNaN(info.dy)) this.info.dy = this.dy = info.dy;
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