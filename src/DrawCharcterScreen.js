class DrawCharacterScreen extends PIXI.Container {
	constructor(prompt) {
		super();
		this.bind = createBinder(this);
		this.drawingSpace = new DrawSpace(100, 100);
		this.addChild(this.drawingSpace);
	}

	destroy(o) {
		super.destroy(o);
		this.drawingSpace.destroy();
	}

	mouseDown(e) {
		if(!this) return;
		// Disable scroll if in Draw Space
		//if(inside(mouseWorld.toArray(),this.drawingSpace.canvasMesh.geometry.vertices.map(v=>v.toArray()))) disableScroll();
		this.drawingSpace.startDrawing(e.pageX-this.x, e.pageY-this.y);

	}

	mouseMove(e) {
		if(!this) return;
		this.drawingSpace.draw(e.pageX-this.x, e.pageY-this.y);

	}

	mouseUp(e) {
		if(!this) return;
		enableScroll();
		this.drawingSpace.stopDrawing();
	}
}