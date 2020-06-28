class DrawCharacterScreen extends THREE.Group {
	constructor(prompt) {
		super();
		this.bind = createBinder(this);
		this.drawingSpace = new DrawSpace(640, 480);
		window.addEventListener("mousedown", this.bind("mouseDown"));
		window.addEventListener("mouseup", this.bind("mouseUp"));
		window.addEventListener("mousemove",this.bind("mouseMove"));
		this.add(this.drawingSpace.getMesh())
	}

	dispose() {
		this.parent.remove(this);
		this.remove(this.drawingSpace.getMesh())
		this.drawingSpace.dispose();
		window.removeEventListener("mousedown", this.bind("mouseDown"));
		window.removeEventListener("mouseup", this.bind("mouseUp"));
		window.removeEventListener("mousemove",this.bind("mouseMove"));
	}

	mouseDown(e) {
		var mouseWorld = screenToWorld(e.pageX, e.pageY);
		if(inside(mouseWorld.toArray(),this.drawingSpace.canvasMesh.geometry.vertices.map(v=>v.toArray()))) disableScroll();
		this.drawingSpace.startDrawing(mouseWorld.x, mouseWorld.y);

	}

	mouseMove(e) {
		var mouseWorld = screenToWorld(e.pageX, e.pageY);
		this.drawingSpace.draw(mouseWorld.x, mouseWorld.y);

	}

	mouseUp(e) {
		enableScroll();
		var mouseWorld = screenToWorld(e.pageX, e.pageY);
		this.drawingSpace.stopDrawing(mouseWorld.x, mouseWorld.y);
	}

	async submitCharacter() {
		game.playerBlob = await this.drawingSpace.createBlob();
		game.startGame();
	}
}