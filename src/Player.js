class Player extends THREE.Group {
	constructor(id,name, textureBlob) {
		super();
		//setup Texture
		this.playerId = id;
		this.name = name;
		var image = new Image();
		this.image = image;
		this.speed = 4;
		image.src = URL.createObjectURL(textureBlob);
		//window.document.body.appendChild(image);
		var texture = new THREE.Texture;
		this.texture = texture;
		image.onload = function() {
			texture.image = image;
			texture.needsUpdate = true;
			mesh.scale.set(100*image.width/image.height,100,1);
		}
		var mesh = new THREE.Mesh(
			new THREE.PlaneGeometry(1,1,1),
			new THREE.MeshBasicMaterial({
				map:texture,
				transparent:true
			})
		);
		this.mesh = mesh;
		this.add(mesh);
		this.destination = new THREE.Vector3;
		this.destination.copy(this.position)
	}

	update() {
		var distance = new THREE.Vector3;
		distance.copy(this.destination).sub(this.position);
		if(distance.length()>this.speed) distance.normalize().multiplyScalar(this.speed)
		this.position.add(distance)
	}

	moveTo(x,y) {
		this.destination.set(x,y,0);
	}
}