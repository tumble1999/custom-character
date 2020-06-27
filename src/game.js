
var drawingSpace = new DrawSpace(window.innerHeight,window.innerWidth);
document.body.appendChild(drawingSpace.getCanvas());
window.onmousedown = function(e) {
	drawingSpace.startDrawing(e.offsetX,e.offsetY);
}
window.onmouseup = function(e) {
	drawingSpace.stopDrawing(e.offsetX,e.offsetY);
}
window.onmousemove = function(e) {
	drawingSpace.draw(e.offsetX,e.offsetY);
}