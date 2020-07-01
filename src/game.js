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
		window.addEventListener("mousewheel",e=>{
			if(e.altKey) {
				game.world.x -= e.deltaY;
			} else {
				game.world.y -= e.deltaY;
			}
		})
	}

	getScreen() {
		return this.app.screen;
	}

	update(dt) {
		if(this.dialogue&&this.dialogue.update) this.dialogue.update(dt);
		if(this.world&&this.world.update) this.world.update(dt)
	}
	
	startGame(ip) {
		if(this.dialogue) {
			this.dialogue.destroy();
			delete this.dialogue;
		}
		var socket = io(ip);
		this.socket = socket;
		this.dialogue = new BorderText("Connecting To Server...",{fontSize:60})
		centerTo(this.dialogue,this.getScreen());
		this.app.addChild(this.dialogue);

		socket.on("connect",this.bind("connectedToServer"));
	}

	connectedToServer() {
		if(this.world) {
			this.world.destroy({children:true});
			delete this.player;
			delete this.room;
			this.playerInfo = {};
			delete this.world;
		}
		if(this.dialogue) {
			this.dialogue.destroy();
			delete this.dialogue;
		}
		console.log("Connected To Server");

		//UserName
		this.dialogue = new EnterTextScreen("Enter Username",this.bind("createCharacter"));
		this.app.addChild(this.dialogue);
	}

	createCharacter() {
		if(this.dialogue) {
			this.playerInfo.name = this.dialogue.textInput.text;
			this.dialogue.destroy();
			delete this.dialogue;
		}
		this.dialogue = new DrawCharacterScreen("Draw a character",this.bind("login"));
		this.app.addChild(this.dialogue);
	}

	async login() {
		if(this.dialogue) {
			this.playerInfo.textureBlob = await this.dialogue.drawingSpace.createBlob();
			this.dialogue.destroy({children:true});
			delete this.dialogue;
		}
		this.world = new World();
		this.app.addChild(this.world)
		if(this.playerInfo) {
			//this.player = this.world.addPlayer(this.playerInfo);
			this.emit("joinGame",this.playerInfo);
		}
	}

	//Socket Utils
	emit(...a) {
		this.socket&&(this.socket.emit(...a));
	}

	on(...a) {
		this.socket&&(this.socket.on(...a))
	}

	mouseDown(e) {
		if(e.which == 2) {
			game.world.x =0;
			game.world.y =0;
			return
		}
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
