
var renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

var scene = new THREE.Scene;

var camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 0, 400);
camera.lookAt(0, 0, 0);
window.onresize = function () {
	var w = window.innerWidth;
	var h = window.innerHeight;
	if (renderer) {
		renderer.setSize(w, h);
		camera.aspect = w / h;
		camera.updateProjectionMatrix();
	}
}

var controls = new THREE.OrbitControls(camera, renderer.domElement);


var spotLight = new THREE.SpotLight(0xffffff);
spotLight.position.set(600, 600, 600);
scene.add(spotLight);


var drawingSpace = new DrawSpace(640, 480);
window.onmousedown = function (e) {
	var mouseWorld = screenToWorld(e.offsetX, e.offsetY);
	drawingSpace.startDrawing(mouseWorld.x, mouseWorld.y);
}
window.onmouseup = function (e) {
	var mouseWorld = screenToWorld(e.offsetX, e.offsetY);
	drawingSpace.stopDrawing(mouseWorld.x, mouseWorld.y);
}
window.onmousemove = function (e) {
	var mouseWorld = screenToWorld(e.offsetX, e.offsetY);
	drawingSpace.draw(mouseWorld.x, mouseWorld.y);
}
scene.add(drawingSpace.createMesh())


//document.body.appendChild(drawingSpace.stage.canvas)

function screenToWorld(x, y, targetZ = 0) {
	var vec = new THREE.Vector3(); // create once and reuse
	var pos = new THREE.Vector3(); // create once and reuse

	vec.set(
		(x / window.innerWidth) * 2 - 1,
		- (y / window.innerHeight) * 2 + 1,
		0.5);

	vec.unproject(camera);

	vec.sub(camera.position).normalize();

	var distance = (targetZ - camera.position.z) / vec.z;

	pos.copy(camera.position).add(vec.multiplyScalar(distance));

	return pos;
}

function update() {
	requestAnimationFrame(update);
	controls.update();
	renderer.render(scene, camera);
}

update();