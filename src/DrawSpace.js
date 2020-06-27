class DrawSpace {
	constructor(h,w) {
		this.stage = new createjs.Stage(document.createElement("canvas"));
		this.stage.canvas.width = w;
		this.stage.canvas.height = h;

		this.drawing = new createjs.Shape
		this.stage.addChild(this.drawing);

		this.pen = {
			color: "#000",
			size: 10
		}
		this.stopDrawing();
		this.stage.update();
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
		if(this.pen.active) {
			if (this.pen.x) {
				this.moved = true;
				this.drawing.graphics.beginStroke(this.pen.color)
					.setStrokeStyle(this.pen.size, "round")
					.moveTo(this.pen.x||x, this.pen.y||y)
					.lineTo(x,y);
				this.stage.update();
			}
			this.pen.x = x;
			this.pen.y = y;
		}
	}

	getCanvas() {
		return this.stage.canvas;
	}


}