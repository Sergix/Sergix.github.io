var canvas = document.getElementById("CanvasGame");

var game = new Scene(canvas);

var playerImage = new GameImage("img/player.png");
var background  = new GameImage("img/grass.png");

var gamertag = new MessageBox("Player");
gamertag.font = "14pt monospace";

var player = new Sprite();
player.spriteSheet = new SpriteSheet([playerImage]);
player.boundaries = {width: game.width, height: game.height};
player.setName(gamertag);
player.addKeybind(getKeyCode("space"), function () { player.jump(300, 600, true); } );
var pickedUpItem = false;

var block = new Sprite();
block.changeFrame = false;
block.spriteSheet = new SpriteSheet([new GameImage("img/term-1.png"), new GameImage("img/term-1.png"), new GameImage("img/term-1.png"), new GameImage("img/term-2.png"), new GameImage("img/term-2.png"), new GameImage("img/term-3.png"), new GameImage("img/term-4.png"), new GameImage("img/term-4.png"), new GameImage("img/term-4.png"), new GameImage("img/term-4.png"), new GameImage("img/term-5.png"), new GameImage("img/term-5.png"), new GameImage("img/term-6.png"), new GameImage("img/term-6.png"), new GameImage("img/term-6.png")]);
block.setPosition(300, 500);

var vectors = [new Vector(0, 0), new Vector(0, 100), new Vector(100, 100), new Vector(100, 0)];

var square1 = new Polygon(vectors);
square1.color = new RGBSet(255, 255, 255);

var titleText1 = new MessageBox("memory");
titleText1.font = "100pt Stopmotion";
titleText1.setPosition(494, 541);
titleText1.color = new RGBASet(255, 224, 50, 1);
titleText1.alwaysActive = true;

var buttonText1 = new MessageBox("Start");
buttonText1.font = "24pt Xolonium";
buttonText1.color = new RGBSet(0, 0, 0);

var buttonShape1 = new Rect(200, 60);
buttonShape1.color = new RGBASet(0, 40, 200, 0.7);

var button1 = new Button(buttonText1, buttonShape1);
button1.setPosition(730, 648);
button1.addMouseListener();

var startMenu = new GameMenu(game);
startMenu.background = new GameImage("img/start-menu-1.png");
startMenu.add(button1);
startMenu.add(titleText1);
startMenu.alwaysActive = true;
startMenu.width = game.width;
startMenu.height = game.height;


var termText1 = new MessageBox("SPACEBAR", 290, 310);
termText1.font = "20pt Xolonium";
termText1.color = new RGBSet(255, 255, 255);
termText1.alwaysActive = true;

var terminalMenu1 = new GameMenu();
terminalMenu1.background = new GameImage("img/terminal1.png");
//terminalMenu1.add(termText1);
terminalMenu1.x = 306;
terminalMenu1.y = 218;
terminalMenu1.width = 200;
terminalMenu1.height = 300;


var item1 = new Circle(20);
item1.color = "#FF0000";
item1.setPosition(1000, 300);


game.backgroundColor = "#000";
game.setPlayerSprite(player);
game.add(block);
game.add(square1);
game.add(item1);
game.addMenu(startMenu);
game.addMenu(terminalMenu1);

game.newAction(
    function () {
        if (button1.clicked)
            return 1;
    },
    function () {
        startMenu.alwaysActive = false;
        player.addBasicControls(400);
    }
);

game.newAction(
    function () {
        if (player.near(block, 150))
            return 1;
    },
    function () {
        terminalMenu1.active(game);
    }
);

game.newAction(
    function () {
        if (player.near(block, 100) && player.isKeyPressed(32) && pickedUpItem)
            return 1;
    },
    function () {
        block.frame = 13;
    }
);

game.newAction(
    function () {
        if (player.near(item1, 100))
            return 1;
    },
    function () {
        pickedUpItem = true;
        termText1.active(game);
    }
);

(function render() {

    game.updateAsPlatformer(600);
    requestAnimationFrame(render);

})();