class DrawSpace extends PIXI.Container {
	constructor(w,h) {
		super();
		this.stage = new createjs.Stage(document.createElement("canvas"));
		this.stage.canvas.width = w;
		this.stage.canvas.height = h;
		this.background = PIXI.Sprite.from(PIXI.Texture.WHITE)
		this.background.width = w;
		this.background.height = h;
		this.addChild(this.background);
		this.sprite = new PIXI.Sprite(PIXI.Texture.from(this.stage.canvas))
		this.addChild(this.sprite);

		this.drawing = new createjs.Shape
		this.stage.addChild(this.drawing);

		this.pen = {
			color: "#ff00ff",
			size: 2
		}
		this.stopDrawing();
		this.stage.update();
		this.width = 500
		this.height = 500;
	}
	setSize(h,w) {
		this.stage.canvas.width = w;
		this.stage.canvas.height = h;
	}

	startDrawing(x,y) {
		this.pen.active = true;
		this.draw(x,y);
	}

	stopDrawing(x,y) {
		if(!this.pen.moved&&x&&y) this.draw(x,y);
		this.pen.active = false;
		this.pen.moved = false;
		this.pen.x = this.pen.y = null;
	}

	draw(x,y) {
		x/=5;
		y/=5;
		if(this.pen.active) {
			if (this.pen.x) {
				this.moved = true;
				this.drawing.graphics.beginStroke(this.pen.color)
					.setStrokeStyle(this.pen.size, "round")
					.moveTo(this.pen.x||x, this.pen.y||y)
					.lineTo(x,y);
				this.stage.update();
				this.sprite.texture.update();
			}
			this.pen.x = x;
			this.pen.y = y;
		}
	}

	async createBlob() {
		return new Promise((resolve,reject)=>{
			this.stage.canvas.toBlob(resolve,'image/png',1);
		})
	}

	destroy() {
		this.stage.removeAllChildren()
		this.stage.removeAllEventListeners()
		this.stage._eventListeners = null
	}

}