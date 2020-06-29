class DrawCharacterScreen extends PIXI.Container {
	constructor(prompt) {
		super();
		this.bind = createBinder(this);
		this.drawingSpace = new DrawSpace(100, 100);
		centerTo(this.drawingSpace,game.getScreen());
		this.addChild(this.drawingSpace);

		this.margin = 50/1080*window.innerHeight;

		//Prompt
		this.title = new BorderText(prompt,{
			fill:GameColors.white,
			fontSize:50
		})
		this.addChild(this.title);
		centerTo(this.title,game.getScreen());
		this.title.y = this.margin;

		//Buttons
		this.submit = new Button({text:"Submit",action:game.bind("startGame"),color:"green",margin:20})
		centerTo(this.submit,game.getScreen());
		this.submit.y = game.getScreen().height-this.margin-this.submit.height;
		this.addChild(this.submit)
	}

	update(dt) {
		this.drawingSpace.update();

		this.margin = 50/1080*window.innerHeight;
		centerTo(this.title,game.getScreen());
		this.title.y = this.margin;	
		centerTo(this.drawingSpace,game.getScreen());
		centerTo(this.submit,game.getScreen());
		this.submit.y = game.getScreen().height-this.margin-this.submit.height;
	}

	destroy(o) {
		super.destroy(o);
		this.drawingSpace.destroy();
	}

	localisePos(x,y) {
		return [
			x-this.x-this.drawingSpace.x,
			y-this.y-this.drawingSpace.y
		]
	}

	mouseDown(e) {
		if(!this) return;
		// Disable scroll if in Draw Space
		//if(inside(mouseWorld.toArray(),this.drawingSpace.canvasMesh.geometry.vertices.map(v=>v.toArray()))) disableScroll();
		this.drawingSpace.startDrawing(...this.localisePos(e.pageX, e.pageY));

	}

	mouseMove(e) {
		if(!this) return;
		this.drawingSpace.draw(...this.localisePos(e.pageX, e.pageY));

	}

	mouseUp(e) {
		if(!this) return;
		enableScroll();
		this.drawingSpace.stopDrawing();
	}
}