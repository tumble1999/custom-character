function createBinder(instance) {
	return (function(a,...p){
		return this[a].bind(this,...p);
	}).bind(instance);
}

function blobFromBytes(buffer) {
	return new Blob([buffer],{type:"image/png"});
}

function centerTo(a,b) {
	if(!b) {
		b={width:0,height:0}
	}
	a.x = b.width/2-a.width/2
	a.y = b.height/2-a.height/2
}

function numberToColor(n){
	var colorStr = n.toString(16)
	return ("#000000").substr(0,7-colorStr.length)+colorStr;
}


function lerpXY(a, b, t) {
	return {
		x: a.x + t * (b.x - a.x),
		y: a.y + t * (b.y - a.y)
	}
}



function vec(...p) {
	return 1 == p.length ? "object" == typeof p[0] ? Object.values(p[0]) : p[0] : p
}

function mag2(...p) {
    return (p = vec(...p)).reduce((e,i)=>e + i * i, 0)
}

function mag(...p) {
	return Math.sqrt(mag2(...p));
}

function norm(...p) {
	p = vec(...p);
	var length = mag(...p);
	return p.map(i=>i/length);
}

function subVec(a,b) {
	return vec(a).map((a,i)=>a-vec(b)[i]);
}
function addVec(a,b) {
	return vec(a).map((a,i)=>a+vec(b)[i]);
}
function multVec(a,b) {
	return vec(a).map((a,i)=>a*vec(b)[i]);
}
function divVec(a,b) {
	return vec(a).map((a,i)=>a/vec(b)[i]);
}

function moveTowards(current,target,speed) {
	
	/*var dx = target.x-current.x;;
	var dy = target.y - current.y
	if(distance.length()>this.speed) distance.normalize().multiplyScalar(this.speed)
	this.position.add(distance)*/


	var dx = target.x-current.x;;
	var dy = target.y - current.y
	if(mag([dx,dy])>speed){
		var angle = Math.atan2(dy,dx);
		var n = norm([dx,dy]);
		dx = n[0]*speed;
		dy=n[1]*speed;
		/*dx=speed*Math.cos(angle)
		dy=speed*Math.sin(angle)*/
	}

	return {
		x:current.x+dx,
		y:current.y+dy
	}

}