class Game {
	constructor() {
		this.bind = createBinder(this);
		this.touchHandler = new TouchHandler();
		this.app = new App(window.innerWidth, window.innerHeight,"#000000");
		document.body.appendChild(this.app.domElement())
		this.app.onUpdate(this.bind("update"));
		window.addEventListener("mousedown", this.bind("mouseDown"));
		window.addEventListener("mouseup", this.bind("mouseUp"));
		window.addEventListener("mousemove",this.bind("mouseMove"));
		window.addEventListener("resize",this.bind("windowResize"))
	}

	async startGame() {
		if(this.dialogue) {
			this.playerBlob = await this.dialogue.drawingSpace.createBlob();
			this.dialogue.destroy({children:true});
			delete this.dialogue;
		}
		this.world = new World();
		this.app.addChild(this.world)
		if(this.playerBlob) {
			this.player = this.world.addPlayer(0,"Player",this.playerBlob);
		}
	}

	getScreen() {
		return this.app.screen;
	}

	update(dt) {
		if(this.dialogue) this.dialogue.update(dt);
		if(this.world) this.world.update(dt)
	}

	createCharacter() {
		this.dialogue = new DrawCharacterScreen("Draw a character");
		this.app.addChild(this.dialogue);
	}

	mouseDown(e) {
		if(this.dialogue) this.dialogue.mouseDown(e);
		if(this.world) this.world.mouseDown(e);
	}

	mouseMove(e) {
		if(this.dialogue) this.dialogue.mouseMove(e);
	}

	mouseUp(e) {
		if(this.dialogue) this.dialogue.mouseUp(e);
	}

	windowResize(e) {
		this.app.resizeTo= document.body
		this.app.resize();
	}
}
