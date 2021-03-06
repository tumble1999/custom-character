class Button extends PIXI.Container {
	constructor({text,action=function(){},color="white",margin=10}) {
		super();

		this.text = text,
		this.action = action;
		this.color = color;
		this.margin = margin;


		this.box = PIXI.Sprite.from(PIXI.Texture.WHITE);
		this.box.tint = color;
		this.addChild(this.box);

		if(text){
			this.text = new PIXI.Text(text,{
				fill:GameColors.white
			})
			this.addChild(this.text);
			this.text.x = margin;
			this.text.y = margin/2;
		}	
		this.box.width = this.text.width+margin*2
		this.box.height = this.text.height+margin
		this.buttonMode = true
		this.interactive = true
		this.on("tap",action)
		this.on("click",action)
		this.hitArea = new PIXI.Rectangle(0, 0, this.box.width, this.box.height);

	}
}