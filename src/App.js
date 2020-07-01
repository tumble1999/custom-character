class App extends PIXI.Application {
	constructor(w,h,bg) {
		super({
			width: w, height: h, backgroundColor: bg, resolution: window.devicePixelRatio || 1,
		});
		this.view.width = w;
		this.view.height = h
	}

	domElement() {
		return this.view;
	}

	addChild(thing) {
		this.stage.addChild(thing);
	}

	onUpdate(cb){
		this.ticker.add(cb);
	}
}