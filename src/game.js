class Game {
	constructor() {
		this.bind = createBinder(this);
		this.touchHandler = new TouchHandler();
		this.loader = new PIXI.Loader();
		this.data = {
			maps:{},
			characters:{}
		};
		this.app = new App(window.innerWidth, window.innerHeight,"#000000");
		this.info = {};
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

	async loadFile(path) {
		var g = this;
		return new Promise((resolve,reject)=>{
			g.loader.add(path);
			g.loader.load((loader,resources)=> {
				resolve(resources[path].data);
				console.log("File Loaded",path)
			});		

		})
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
			delete this.sector;
			this.info = {};
			delete this.world;
		}
		if(this.dialogue) {
			this.dialogue.destroy();
			delete this.dialogue;
		}
		console.log("Connected To Server");

		//UserName
		this.dialogue = new EnterTextScreen("Enter Username",
		//this.bind("createCharacter")
		this.bind("login")
		);
		this.app.addChild(this.dialogue);
	}

	async createCharacter() {
		if(this.dialogue) await this.cleanDialogue()
		this.dialogue = new DrawCharacterScreen("Draw a character",this.bind("login"));
		this.app.addChild(this.dialogue);
	}

	async cleanDialogue() {
		var children = true;
		if(this.dialogue.textInput){
			this.info.name = this.dialogue.textInput.text;
			children = false;
		}
		if(this.dialogue.drawingSpace){
			this.info.textureBlob = await this.dialogue.drawingSpace.createBlob();
		}
		this.dialogue.destroy({children});
		delete this.dialogue;
	}

	async login() {
		if(this.dialogue) this.cleanDialogue()
		this.data.characters.default = await this.loadFile("media/default.png")
		this.world = new World();
		this.app.addChild(this.world)
		if(this.info) {
			this.emit("joinGame",this.info);
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
