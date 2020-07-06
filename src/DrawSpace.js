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
		this.width = 500;
		this.height = this.width*h/w;
	}
	setSize(h,w) {
		this.stage.canvas.width = w;
		this.stage.canvas.height = h;
	}

	startDrawing(pos) {
		this.pen.active = true;
		this.draw(pos);
	}

	stopDrawing(pos) {
		if(!this.pen.moved&&pos&&pos.x&&pos.y) this.draw(pos);
		this.pen.active = false;
		this.pen.moved = false;
		this.pen.x = this.pen.y = null;
	}

	draw(pos) {
		if(!pos) return;
		pos.x/=5;
		pos.y/=5;
		if(this.pen.active) {
			if (this.pen.x) {
				this.moved = true;
				this.drawing.graphics.beginStroke(this.pen.color)
					.setStrokeStyle(this.pen.size, "round")
					.moveTo(this.pen.x||pos.x, this.pen.y||pos.y)
					.lineTo(pos.x,pos.y);
				this.stage.update();
				this.sprite.texture.update();
			}
			this.pen.x = pos.x;
			this.pen.y = pos.y;
		}
	}

	async createBlob() {
		return new Promise((resolve,reject)=>{
			this.stage.canvas.toBlob(resolve,'image/png',1);
		})
	}

	update(dt) {
		if(window.innerWidth<500) {
			this.width = window.innerWidth;
		} else {
			this.width = 500;
		}
		this.height = this.width*this.stage.canvas.height/this.stage.canvas.width;

	}

	destroy() {
		this.stage.removeAllChildren()
		this.stage.removeAllEventListeners()
		this.stage._eventListeners = null
	}

}