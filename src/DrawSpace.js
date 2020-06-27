class DrawSpace {
	constructor(w,h) {
		this.stage = new createjs.Stage(document.createElement("canvas"));
		this.stage.canvas.width = w;
		this.stage.canvas.height = h;
		this.texture = new THREE.Texture(this.stage.canvas);

		this.drawing = new createjs.Shape
		this.stage.addChild(this.drawing);

		this.pen = {
			color: "#ff00ff",
			size: 10
		}
		this.stopDrawing();
		this.stage.update();
		this.texture.needsUpdate = true;
	}
	setSize(h,w) {
		this.stage.canvas.width = w;
		this.stage.canvas.height = h;
	}

	startDrawing(x,y) {
		this.pen.active = true;
		this.draw(x,y);
	}

	stopDrawing(x,y) {
		if(!this.pen.moved&&x&&y) this.draw(x,y);
		this.pen.active = false;
		this.pen.moved = false;
		this.pen.x = this.pen.y = null;
	}

	draw(x,y) {
		x=this.stage.canvas.width/2+x
		y=this.stage.canvas.height/2-y;
		if(this.pen.active) {
			if (this.pen.x) {
				this.moved = true;
				this.drawing.graphics.beginStroke(this.pen.color)
					.setStrokeStyle(this.pen.size, "round")
					.moveTo(this.pen.x||x, this.pen.y||y)
					.lineTo(x,y);
				this.stage.update();
				this.texture.needsUpdate = true;
			}
			this.pen.x = x;
			this.pen.y = y;
		}
	}

	createMesh() {
		if(this.canvasMesh) return this.canvasMesh;
		var canvasMesh = new THREE.Mesh(
			new THREE.BoxGeometry(this.stage.canvas.width,this.stage.canvas.height,1),
			new THREE.MeshBasicMaterial({color:"white"})
		);

		var drawingMesh = new THREE.Mesh(
			new THREE.BoxGeometry(this.stage.canvas.width,this.stage.canvas.height,.1),
			new THREE.MeshBasicMaterial({
				map:this.texture,
				transparent: true
			})
		);

		canvasMesh.add(drawingMesh);
		drawingMesh.position.set(0,0,canvasMesh.scale.z/2+drawingMesh.scale.z/2);

		this.drawingMesh = drawingMesh;
		this.canvasMesh = canvasMesh;

		return canvasMesh;
	}

}