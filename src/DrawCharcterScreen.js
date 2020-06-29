class DrawCharacterScreen extends PIXI.Container {
	constructor(prompt,submit) {
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
		this.submit = new Button({text:"Submit",action:submit,color:GameColors.azure,margin:20})
		centerTo(this.submit,game.getScreen());
		this.submit.y = game.getScreen().height-this.margin-this.submit.height;
		this.addChild(this.submit)

		//Pallet
		var pallet = new PIXI.Container;
		this.addChild(pallet);
		var pen=this.drawingSpace.pen;
		var i=0;
		for(var color in GameColors) {
			var btn = new Button({
				text:"hi",
				action:(function(){
					pen.color=numberToColor(this.color);
				}),
				color:GameColors[color]
			})
			btn.width = btn.height = 50;
			this.updatePalletColor(btn,i++);
			pallet.addChild(btn);
		}
		this.pallet = pallet;
		centerTo(this.pallet,game.getScreen())

	}

	updatePalletColor(btn,i) {
		var x=Math.round(i*btn.width);
		btn.x = x%this.drawingSpace.width;
		btn.y = Math.floor(x/this.drawingSpace.width)*btn.height;
	}

	update(dt) {
		this.drawingSpace.update();

		var i=0;
		for(var btn of this.pallet.children) {
			this.updatePalletColor(btn,i++);
		}
		centerTo(this.pallet,game.getScreen())
		this.pallet.y = game.getScreen().height/2+this.drawingSpace.height/2

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