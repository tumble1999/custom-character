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
	}).bind(instance);
}

function blobFromBytes(bytes) {
	return new Blob([bytes.buffer],{type:"image/png"});
}

function inside(point, vs) {
    // ray-casting algorithm based on
    // http://www.ecse.rpi.edu/Homepages/wrf/Research/Short_Notes/pnpoly.html

    var x = point[0], y = point[1];

    var inside = false;
    for (var i = 0, j = vs.length - 1; i < vs.length; j = i++) {
        var xi = vs[i][0], yi = vs[i][1];
        var xj = vs[j][0], yj = vs[j][1];

        var intersect = ((yi > y) != (yj > y))
            && (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
        if (intersect) inside = !inside;
    }

    return inside;
};