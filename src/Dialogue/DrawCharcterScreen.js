class DrawCharacterScreen extends DialoguePrompt {
	constructor(prompt,submit) {
		super(prompt,submit);
		this.drawingSpace = new DrawSpace(100, 100);
		centerTo(this.drawingSpace,game.getScreen());
		this.addChild(this.drawingSpace);

		//Pallet
		var pallet = new PIXI.Container;
		this.addChild(pallet);
		var pen=this.drawingSpace.pen;
		var i=0;
		for(var color in GameColors) {
			var btn = new Button({
				text:" ",
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

		
		window.addEventListener("mousedown", this.bind("mouseDown"),true);
		window.addEventListener("mouseup", this.bind("mouseUp"),true);
		window.addEventListener("mousemove",this.bind("mouseMove"),true);
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

		centerTo(this.drawingSpace,game.getScreen());
		super.update(dt);
	}

	destroy(o) {
		
		window.removeEventListener("mousedown", this.bind("mouseDown"),true);
		window.removeEventListener("mouseup", this.bind("mouseUp"),true);
		window.removeEventListener("mousemove",this.bind("mouseMove"),true);

		super.destroy(o);
		this.drawingSpace.destroy();
	}

	localisePos(pos) {
		return {
			x:pos.x-this.x-this.drawingSpace.x,
			y:pos.y-this.y-this.drawingSpace.y
		}
	}

	mouseDown(e) {
		if(!this) return;
		var pos = {x:e.pageX, y:e.pageY}
		// Disable scroll if in Draw Space
		//if(inside(mouseWorld.toArray(),this.drawingSpace.canvasMesh.geometry.vertices.map(v=>v.toArray()))) disableScroll();
		this.drawingSpace.startDrawing(this.localisePos(pos));

	}

	mouseMove(e) {
		if(!this) return;
		var pos = {x:e.pageX, y:e.pageY}
		this.drawingSpace.draw(this.localisePos(pos));

	}

	mouseUp(e) {
		if(!this) return;
		enableScroll();
		this.drawingSpace.stopDrawing();
	}
}