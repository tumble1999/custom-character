class Input {
        constructor() {
            this.NUM_KEYCODES = 256;
            this.NUM_MOUSEBUTTONS = 5;
            this.currentKeys = [];
            this.downKeys = [];
            this.upKeys = [];
            this.currentMouse = [];
            this.downMouse = [];
            this.upMouse = [];
        }
        update() {
            this.upKeys = [];
            for (let i = 0; i < this.NUM_KEYCODES; i++) {
                if (!this.getKey(i) && this.currentKeys.includes(i)) {
                    this.upKeys.push(i);
                }
            }
            this.downKeys = [];
            for (let i = 0; i < this.NUM_KEYCODES; i++) {
                if (this.getKey(i) && !this.currentKeys.includes(i)) {
                    this.downKeys.push(i);
                }
            }
            this.currentKeys = [];
            for (let i = 0; i < this.NUM_KEYCODES; i++) {
                if (this.getKey(i)) {
                    this.currentKeys.push(i);
                }
            }
            this.upMouse = [];
            for (let i = 0; i < this.NUM_MOUSEBUTTONS; i++) {
                if (!this.getMouse(i) && this.currentMouse.includes(i)) {
                    this.upMouse.push(i);
                }
            }
            this.downMouse = [];
            for (let i = 0; i < this.NUM_MOUSEBUTTONS; i++) {
                if (this.getMouse(i) && !this.currentMouse.includes(i)) {
                    this.downMouse.push(i);
                }
            }
            this.currentMouse = [];
            for (let i = 0; i < this.NUM_MOUSEBUTTONS; i++) {
                if (this.getMouse(i)) {
                    this.currentMouse.push(i);
                }
            }
        }
        getKey(keyCode) {
            return Keyboard.IsKeyDown(keyCode);
        }
        getKeyDown(keyCode) {
            return this.downKeys.includes(keyCode);
        }
        getKeyUp(keyCode) {
            return this.upKeys.includes(keyCode);
        }
        getMouse(mouseButton) {
            return Mouse.IsButtonDown(mouseButton);
        }
        getMouseDown(mouseButton) {
            return this.downMouse.includes(mouseButton);
        }
        getMouseUp(mouseButton) {
            return this.upMouse.includes(mouseButton);
        }
        getMousePos() {
            return {x:Mouse.GetX(), y:Mouse.GetY()};
		}
        getMouseMovement() {
            return {x:Mouse.GetMovementX(), y:Mouse.GetMovementY()};
        }
        getMouseScroll() {
            return {x:Mouse.GetScrollX(), y:Mouse.GetScrollY()};
        }
    }