class Player extends THREE.Group {
	constructor(id,name, textureBlob) {
		super();
		//setup Texture
		this.playerId = id;
		this.name = name;
		var image = new Image();
		this.image = image;
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
			new THREE.BoxGeometry(1,1,1),
			new THREE.MeshBasicMaterial({
				map:texture
			})
		);
		this.mesh = mesh;
		this.add(mesh);
	}
}