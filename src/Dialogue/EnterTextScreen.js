class EnterTextScreen extends DialoguePrompt {
	constructor(prompt,submit) {
		super(prompt,submit);
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
		this.textInput.focus()
	}

	update(dt) {
		centerTo(this.textInput,game.getScreen());
		super.update(dt);
	}

}