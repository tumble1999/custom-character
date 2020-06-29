class BorderText extends PIXI.Text {
	constructor(text,options) {
		super(text,Object.assign({
			fill:GameColors.white,
			fontSize:16,
			stroke: GameColors.black,
			strokeThickness: 5
		},options))
	}
}