class PixelQueryer {
	constructor(image) {
		var canvas = document.createElement("canvas");
		canvas.width = image.width;
		canvas.height = image.height;
		this.context = canvas.getContext("2d");
		this.context.drawImage(image,0,0,image.width,image.height)
	}

	getPixel(pos) {
		var colors = Array.from(this.context.getImageData(pos.x,pos.y,1,1).data);
		return  (colors[0] << 16) | (colors[1] << 8) | colors[2];
	}
}