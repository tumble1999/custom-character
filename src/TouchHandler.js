class TouchHandler {
	constructor(){
		this.bind = createBinder(this);
		window.addEventListener("touchstart", this.bind("touchStart"));
		window.addEventListener("touchmove", this.bind("touchMove"));
		window.addEventListener("touchcancel", this.bind("touchEnd"));
		window.addEventListener("touchend", this.bind("touchEnd"));
		this.lastTouches = [];
	}

	touchStart(e) {
		var touches = Array(...e.touches);
		touches.forEach(e=>{
			if(window.onmousedown) window.onmousedown(e)
			window.dispatchEvent(new MouseEvent("mousedown",e))
		})
		this.lastTouches = Array(...e.touches);
	}

	touchMove(e) {
		var touches = Array(...e.touches);
		touches.forEach(e=>{
			if(window.onmousedown) window.onmousemove(e)
			window.dispatchEvent(new MouseEvent("mousemove",e))
		})
		this.lastTouches = Array(...e.touches);
	}

	touchEnd(e) {
		var touches = Array(...e.touches);
		if (e.touches.length == 0) {
			touches = this.lastTouches
		}
		touches.forEach(e=>{
			if(window.onmousedown) window.onmouseup(e)
			window.dispatchEvent(new MouseEvent("mouseup",e))
		})
		this.lastTouches = Array(...e.touches);
	}
}