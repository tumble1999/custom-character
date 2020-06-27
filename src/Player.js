class Player {
	constructor(id,name, textureBlob) {
		//setup Texture
		this.id = id;
		this.name = name;
		var image = new Image();
		image.src = URL.createObjectURL(textureBlob);
		window.document.body.appendChild(image);
		var texture = new THREE.Texture;
		this.texture = texture;
		image.onload = function() {
			texture.image = image;
			texture.needsUpdate = true;
		}
		this.mesh = new THREE.Mesh(
			new THREE.BoxGeometry(100*image.width/image.height,100,.1),
			new THREE.MeshBasicMaterial({
				map:this.texture,
				transparent: true
			})
		);
	}
}