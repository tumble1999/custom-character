class DrawCharacterScreen {
	constructor(scene) {
		this.bind = createBinder(this);
		this.drawingSpace = new DrawSpace(640, 480);
		window.ontouchstart = this.bind("touchStart");
		window.ontouchmove = this.bind("touchMove");
		window.ontouchcancel = window.ontouchend = this.bind("touchEnd")
		window.onmousedown = this.bind("mouseDown");
		window.onmouseup = this.bind("mouseUp");
		window.onmousemove = this.bind("mouseMove");
		scene.add(this.drawingSpace.createMesh())
	}

	destroy() {
		this.drawingSpace.destroy();
		
		window.ontouchstart = window.ontouchmove = 
		window.ontouchcancel = window.onmousedown =
		window.onmouseup = window.onmousemove =
		undefined;
	}

	touchStart(e) {
		Array(...e.touches).forEach(this.mouseDown)
	}

	touchMove(e) {
		Array(...e.touches).forEach(this.mouseMove)
	}

	touchEnd(e) {
		if (e.touches.length == 0) this.drawingSpace.stopDrawing();
		Array(...e.touches).forEach(this.mouseUp)
	}

	mouseDown(e) {
		var mouseWorld = screenToWorld(e.pageX, e.pageY);
		this.drawingSpace.startDrawing(mouseWorld.x, mouseWorld.y);

	}

	mouseMove(e) {
		var mouseWorld = screenToWorld(e.pageX, e.pageY);
		this.drawingSpace.draw(mouseWorld.x, mouseWorld.y);

	}

	mouseUp(e) {
		var mouseWorld = screenToWorld(e.pageX, e.pageY);
		this.drawingSpace.stopDrawing(mouseWorld.x, mouseWorld.y);
	}

	async submitCharacter() {
		game.playerBlob = await this.drawingSpace.createBlob();
		game.startGame();
	}
}