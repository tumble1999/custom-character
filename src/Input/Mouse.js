class Mouse {
	static Create() {
		console.log("Initialising mouse input");
		for (let i = 0; i < Mouse.BUTTON_NUM; i++) {
			Mouse.buttons[i] = false;
		}
		document.addEventListener('mousedown', (e) => {
			Mouse.buttons[e.button] = true;
		});
		document.addEventListener('mouseup', (e) => {
			Mouse.buttons[e.button] = false;
		});
		document.addEventListener('wheel', (e) => {
			if (mousescrollend) {
				clearTimeout(mousescrollend);
			}
			Mouse.scrollX = Math.sign(e.deltaX);
			Mouse.scrollY = Math.sign(e.deltaY);
			var mousescrollend = setTimeout(Mouse.ResetScroll, 50);
		});
		document.addEventListener('mousemove', (e) => {
			/*if(mousestop) {
				clearTimeout(mousestop);
			}*/
			var pageX = e.pageX;
			var pageY = e.pageY;
			Mouse.movementX = e.movementX || 0;
			Mouse.movementY = e.movementY || 0;
			// IE 8
			if (pageX === undefined) {
				pageX = e.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
				pageY = e.clientY + document.body.scrollTop + document.documentElement.scrollTop;
			}
			Mouse.x = pageX;
			Mouse.y = pageY;
			//var mousestop = setTimeout(Mouse.ResetMovement,50);
		});
	}
	static ResetScroll() {
		Mouse.scrollX = 0;
		Mouse.scrollY = 0;
	}
	static ResetMovement() {
		Mouse.movementX = 0;
		Mouse.movementY = 0;
	}
	static IsButtonDown(button) {
		return Mouse.buttons[button];
	}
	static GetX() {
		return Mouse.x;
	}
	static GetY() {
		return Mouse.y;
	}
	static GetMovementX() {
		return Mouse.movementX;
	}
	static GetMovementY() {
		return Mouse.movementY;
	}
	static GetScrollX() {
		return Mouse.scrollX;
	}
	static GetScrollY() {
		return Mouse.scrollY;
	}
}
Mouse.LEFT_CLICK = 0;
Mouse.MIDDLE_CLICK = 1;
Mouse.RIGHT_CLICK = 2;
Mouse.BROWSER_BACK = 3;
Mouse.BROSWER_FORWARD = 4;
Mouse.buttons = [];
Mouse.BUTTON_NUM = 5;
Mouse.x = 0;
Mouse.y = 0;
Mouse.movementX = 0;
Mouse.movementY = 0;
Mouse.scrollX = 0;
Mouse.scrollY = 0;