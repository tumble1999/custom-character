var game = new Game;
game.update();
game.createCharacter()


function btnClick() {
	game.submitCharacter();
	setTimeout(game.bind("createCharacter"),250);
}