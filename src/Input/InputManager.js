class InputManager {
	constructor() {
		this.axis = {};
		this.button = {};
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

	buttonNotZero(name) {
		var value = this.getButton(name);
		return value != 0;
	}

	onButton(name,getValue,onDown,onUp) {
		this.button[name] = {
			down:onDown,
			value:getValue,
			up:onUp
		}
	}

	getButton(name) {
		if(!this.button[name]) return 0;
		var value = this.button[name].value();
		if(isBoolean(value)) return value;
		return false;
	}

	buttonDown(name) {
		if(!this.button[name]) return false;
		var down = this.button[name].down();
		if(isBoolean(down)) return down;
		return false;
	}

	buttonUp(name) {
		if(!this.button[name]) return false;
		var up = this.button[name].up();
		if(isBoolean(up)) return up;
		return false;
	}

	buttonChanged(name) {
		return this.buttonDown(name)||this.buttonUp(name);
	}
}