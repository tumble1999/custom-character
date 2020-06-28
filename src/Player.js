class Player extends PIXI.Sprite {
	constructor(id,name, textureBlob) {
		super(PIXI.Texture.from(URL.createObjectURL(textureBlob)));
		this.playerId = id;
		this.name = name;
		this.speed = 3;
		this.destination = {x:this.x,y:this.y};
		/*var image = new Image();
		this.image = image;
		image.src = URL.createObjectURL(textureBlob);
		//window.document.body.appendChild(image);
		var texture = new THREE.Texture;
		this.texture = texture;
		image.onload = function() {
			texture.image = image;
			texture.needsUpdate = true;
			mesh.scale.set(100*image.width/image.height,100,1);
		}*/
	}

	update() {
		var pos = moveTowards({x:this.x,y:this.y},this.destination,this.speed);
		this.x = pos.x;
		this.y = pos.y;
	}

	moveTo(x,y) {
		var p = 4;
		this.destination = {x:x-this.width/2,y:y-(p-1)/(p)*this.height};
	}
}