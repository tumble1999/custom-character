class Game {
	constructor() {
		this.bind = createBinder(this);
		this.touchHandler = new TouchHandler();
		this.app = new App(window.innerWidth, window.innerHeight,"#000000");
		this.playerInfo = {};
		document.body.appendChild(this.app.domElement())
		this.app.onUpdate(this.bind("update"));
		window.addEventListener("mousedown", this.bind("mouseDown"));
		window.addEventListener("mouseup", this.bind("mouseUp"));
		window.addEventListener("mousemove",this.bind("mouseMove"));
		window.addEventListener("resize",this.bind("windowResize"))
	}

	getScreen() {
		return this.app.screen;
	}

	update(dt) {
		if(this.dialogue) this.dialogue.update(dt);
		if(this.world) this.world.update(dt)
	}
	
	login() {
		this.dialogue = new EnterTextScreen("Enter Username",this.bind("createCharacter"));
		this.app.addChild(this.dialogue);
	}

	createCharacter() {
		if(this.dialogue) {
			this.playerInfo.name = this.dialogue.textInput.text;
			this.dialogue.destroy();
			delete this.dialogue;
		}
		this.dialogue = new DrawCharacterScreen("Draw a character",this.bind("startGame"));
		this.app.addChild(this.dialogue);
	}

	async startGame() {
		if(this.dialogue) {
			this.playerInfo.textureBlob = await this.dialogue.drawingSpace.createBlob();
			this.dialogue.destroy({children:true});
			delete this.dialogue;
		}
		this.world = new World();
		this.app.addChild(this.world)
		if(this.playerInfo) {
			this.player = this.world.addPlayer(this.playerInfo);
		}
	}

	mouseDown(e) {
		if(this.dialogue&&this.dialogue.mouseDown)this.dialogue.mouseDown(e);
		if(this.world&&this.world.mouseDown) this.world.mouseDown(e);
	}

	mouseMove(e) {
		if(this.dialogue&&this.dialogue.mouseMove) this.dialogue.mouseMove(e);
	}

	mouseUp(e) {
		if(this.dialogue&&this.dialogue.mouseUp) this.dialogue.mouseUp(e);
	}

	windowResize(e) {
		this.app.resizeTo= document.body
		this.app.resize();
	}
}
