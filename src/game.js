class Game {
	constructor() {
		this.bind = createBinder(this);
		this.renderer = new THREE.WebGLRenderer();
		this.renderer.setSize(window.innerWidth, window.innerHeight);
		document.body.appendChild(this.renderer.domElement);
		
		this.scene = new THREE.Scene;
		
		this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
		this.camera.position.set(0, 0, 400);
		this.camera.lookAt(0, 0, 0);
		window.onresize = this.bind("windowResize");
		
		
		var spotLight = new THREE.SpotLight(0xffffff);
		spotLight.position.set(600, 600, 600);
		this.scene.add(spotLight);
	}

	startGame() {
		if(this.state) {
			//Destroy State
			this.state.destroy();
		}
		this.state = new WorldScreen();
		if(this.playerBlob) {
			this.state.addPlayer(0,"Player",this.playerBlob);
		}
	}

	createCharacter() {
		if(this.state) {
			//Destroy State
			this.state.destroy();
		}
		this.state = new DrawCharacterScreen(this.scene);
	}

	submitCharacter() {
		game.state.submitCharacter()
	}

	windowResize() {
		var w = window.innerWidth;
		var h = window.innerHeight;
		if (this.renderer) {
			this.renderer.setSize(w, h);
			this.camera.aspect = w / h;
			this.camera.updateProjectionMatrix();
		}
	}

	screenToWorld(x, y, targetZ = 0) {
		var vec = new THREE.Vector3();
		var pos = new THREE.Vector3();
	
		vec.set(
			(x / window.innerWidth) * 2 - 1,
			- (y / window.innerHeight) * 2 + 1,
			0.5);
	
		vec.unproject(this.camera);
	
		vec.sub(this.camera.position).normalize();
	
		var distance = (targetZ - this.camera.position.z) / vec.z;
	
		pos.copy(this.camera.position).add(vec.multiplyScalar(distance));
	
		return pos;
	}

	update() {
		requestAnimationFrame(this.bind("update"));
		this.renderer.render(this.scene, this.camera);
	}
}
