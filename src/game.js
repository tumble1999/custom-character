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

		

		var margin = 5;
		var buttons = new PIXI.Container();
		this.app.addChild(buttons);
		var button1 = new Button("New",this.bind("createCharacter"),"azure")
		button1.x = -(button1.width+margin/2);
		var button2 = new Button("Submit?",this.bind("startGame"),"azure")
		button2.x = margin/2;
		buttons.addChild(button1);
		buttons.addChild(button2);
		buttons.x = this.app.screen.width/2;
		buttons.y = this.app.screen.height-5-buttons.height;

		/*this.renderer = new THREE.WebGLRenderer();
		this.renderer.setSize(window.innerWidth, window.innerHeight);
		document.body.appendChild(this.renderer.domElement);
		
		this.scene = new THREE.Scene;
		
		this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
		this.camera.position.set(0, 0, 400);
		this.camera.lookAt(0, 0, 0);		
		
		var spotLight = new THREE.SpotLight(0xffffff);
		spotLight.position.set(600, 600, 600);
		this.scene.add(spotLight);*/
		
		//window.addEventListener("onresize",this.bind("windowResize"));
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

	update(dt) {
		if(this.world) this.world.update(dt)
	}

	createCharacter() {
		this.dialogue = new DrawCharacterScreen;
		this.dialogue.x = this.app.screen.width/2-this.dialogue.width/2;
		this.dialogue.y = this.app.screen.height/2-this.dialogue.height/2;
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
}
