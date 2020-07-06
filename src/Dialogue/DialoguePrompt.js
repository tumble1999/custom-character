class DialoguePrompt extends PIXI.Container {
	constructor(prompt,submit) {
		super();
		this.bind = createBinder(this);

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
		this.submit = new Button({text:"Submit",action:submit,color:GameColors.azure,margin:20})
		centerTo(this.submit,game.getScreen());
		this.submit.y = game.getScreen().height-this.margin-this.submit.height;
		this.addChild(this.submit)

	}

	updateInput() {
		if(game.inputManager.getButton("Submit")) {
			this.submit.action();
		}
	}

	update(dt) {
		this.updateInput();
		this.margin = 50/1080*window.innerHeight;
		centerTo(this.title,game.getScreen());
		this.title.y = this.margin;	
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