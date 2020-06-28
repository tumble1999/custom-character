class Button extends PIXI.Container {
	constructor(text,action,color="white") {
		super();

		this.action = action||function(){};


		var margin = 5;
		this.box = PIXI.Sprite.from(PIXI.Texture.WHITE);
		this.box.tint = GameColors[color];
		this.addChild(this.box);

		this.text = new PIXI.Text(text,{
			fill:GameColors.white
		})
		this.text.tint = GameColors.white
		this.addChild(this.text);
		this.text.x = margin;
		this.text.y = margin/2;
		this.box.width = this.text.width+margin*2
		this.box.height = this.text.height+margin*2
		this.buttonMode = true
		this.interactive = true
		this.on("tap",(event)=>{
			console.log("hi");
			this.action();
		})
		this.hitArea = new PIXI.Rectangle(0, 0, this.box.width, this.box.height);

	}
}