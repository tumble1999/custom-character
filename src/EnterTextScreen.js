class EnterTextScreen extends PIXI.Container {
	constructor(prompt,submit) {
		super();
		this.bind = createBinder(this);
		this.submit = submit;
		this.textInput = new PIXI.TextInput({
			input: {
				fontSize: '36px',
				padding: '12px',
				width: '500px',
				color: '#26272E'
			},
			box: {
				default: {fill: 0xE8E9F3, rounded: 12, stroke: {color: 0xCBCEE0, width: 3}},
				focused: {fill: 0xE1E3EE, rounded: 12, stroke: {color: 0xABAFC6, width: 3}},
				disabled: {fill: 0xDBDBDB, rounded: 12}
			}
		})
		this.textInput.placeholder = prompt
		centerTo(this.textInput,game.getScreen());
		this.addChild(this.textInput);

		this.margin = 50/1080*window.innerHeight;

		//Prompt
		this.title = new BorderText(prompt,{
			fill:GameColors.white,
			fontSize:50
		})
		this.addChild(this.title);
		centerTo(this.title,game.getScreen());
		this.title.y = this.margin;

		//Buttons
		this.submit = new Button({text:"Submit",action:this.bind("submit"),color:GameColors.azure,margin:20})
		centerTo(this.submit,game.getScreen());
		this.submit.y = game.getScreen().height-this.margin-this.submit.height;
		this.addChild(this.submit)

	}

	update(dt) {
		this.margin = 50/1080*window.innerHeight;
		centerTo(this.title,game.getScreen());
		this.title.y = this.margin;	
		centerTo(this.textInput,game.getScreen());
		centerTo(this.submit,game.getScreen());
		this.submit.y = game.getScreen().height-this.margin-this.submit.height;
	}
	mouseDown(e) {
	}

	mouseMove(e) {
	}

	mouseUp(e) {
	}

}