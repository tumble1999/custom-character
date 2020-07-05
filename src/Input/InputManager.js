class InputManager {
	constructor() {
		this.axis = {};
	}

	onAxis(name,getValue,onDown,onUp) {
		this.axis[name] = {
			down:onDown,
			value:getValue,
			up:onUp
		}
	}

	getAxis(name) {
		if(!this.axis[name]) return 0;
		var value = this.axis[name].value();
		if(!isNaN(value)) return value;
		return 0;
	}

	axisDown(name) {
		if(!this.axis[name]) return false;
		var down = this.axis[name].down();
		if(isBoolean(down)) return down;
		return false;
	}

	axisUp(name) {
		if(!this.axis[name]) return false;
		var up = this.axis[name].up();
		if(isBoolean(up)) return up;
		return false;
	}

	axisChanged(name) {
		return this.axisDown(name)||this.axisUp(name);
	}

	axisNotZero(name) {
		var value = this.getAxis(name);
		return value != 0;
	}
}