function screenToWorld(x, y, targetZ = 0) {
	var vec = new THREE.Vector3();
	var pos = new THREE.Vector3();

	vec.set(
		(x / window.innerWidth) * 2 - 1,
		- (y / window.innerHeight) * 2 + 1,
		0.5);

	vec.unproject(game.camera);

	vec.sub(game.camera.position).normalize();

	var distance = (targetZ - game.camera.position.z) / vec.z;

	pos.copy(game.camera.position).add(vec.multiplyScalar(distance));

	return pos;
}

function createBinder(instance) {
	return (function(a,...p){
		return this[a].bind(this,...p);
	}).bind(instance)
}

function blobFromBytes(bytes) {
	return new Blob([bytes.buffer],{type:"image/png"});
}