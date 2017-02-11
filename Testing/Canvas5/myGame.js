var game = new Scene(document);

var playerImage = new GameImage("img/(insert).png");
var backgroundImage = new GameImage("img/(insert).png");

var player = new Sprite(playerImage);
player.addBasicControls(400, document);

game.setPlayerSprite(player);
game.background = backgroundImage;

(function render() {

    game.render(60);
    requestAnimationFrame(render);

})();