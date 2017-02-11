/*
*
* @author sergix / http://www.sergix.net/
*
*/


/*
* Global Variables:
* - canvas
* - ctx (context)
* - Player
* - entityList
* - fps
* - grass
*/
var canvas;
var ctx;
var Player;
var entityList = [];
var fps = 60;
var grass = image("grass-1.png");

function init() {

    canvas = document.getElementById("canvas");
    ctx    = canvas.getContext("2d");
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    var lawnmower = new Entity(100, 100, image("lawnmower.png"), true);
    entityList.push(lawnmower);

    textureLoader();
    draw();

}


/*
* Environment Settings:
* - Player
* - controls
* - textures
*/
Player = {

    x:  window.innerWidth / 2,
    y:  window.innerHeight / 2,
    vx: 0,
    vy: 0,
    ax: 0,
    ay: 0,

    canMove: true,

    texture: [image("lenny-gd-cube.png")],
    frame:   0,
    size:    [150, 150],
    move:    false,
    time:    0,

    draw: function () {
        this.update();
        ctx.drawImage(this.texture[0], this.x, this.y, this.size[0], this.size[1]);
    },

    update: function () {
        this.vx += this.ax / fps;
        this.vy += this.ay / fps;
        this.x  += this.vx / fps;
        this.y  += this.vy / fps;

        /*if (this.move == true)
            this.time += 1;

        if (this.time % 5 == 0)
            this.frame += 1;

        if (this.frame > 7 || this.move == false)
            this.frame = 0;*/
    }

};

window.onkeydown = function (e) {

    e = e || window.event;
    var key = e.keyCode;

    Player.move = true;

    switch (key) {
        case 87: /*W*/Player.vy =-250; break;
        case 65: /*A*/Player.vx =-250; break;
        case 83: /*S*/Player.vy = 250; break;
        case 68: /*D*/Player.vx = 250; break;
        case 70: /*F*/Player.vx /= 2; Player.vy /= 2; break;
        default:                       break;
    }

};

window.onkeyup = function (e) {

    e = e || window.event;
    var key = e.keyCode;
    Player.move = false;
    switch (key) {
        case 87: /*W*/Player.vy = 0;    break;
        case 65: /*A*/Player.vx = 0;    break;
        case 83: /*S*/Player.vy = 0;    break;
        case 68: /*D*/Player.vx = 0;    break;
        default:                        break;
    }
    
};

function textureLoader() {



}

/*
* Constructors:
* - Entity
*/
function Entity(x, y, img, collide) {

    this.x    = x;
    this.y    = y;
    this.img  = img;
    this.size = [this.img.width, this.img.height];
    this.checkCollision = collide;

    this.draw = function () {

        ctx.drawImage(this.img, this.x, this.y, this.size[0], this.size[1]);

    };

}

/*
* Utility Functions:
* - Update Scene
* - Collision
* - Image Creator
*/
function collisionBot() {

    if (Player.x <= 0)
        Player.x = 0;

    if (Player.x >= 1468)
        Player.x = 1468;

    for (i = 0; i < entityList.length; i++) {

        e = entityList[i];

        if (e.checkCollision) {

            if ( ( (e.x + e.size[0]) >= Player.x) && (e.x <= (Player.x + Player.size[0]) ) && ( (e.y + e.size[1]) >= Player.y) && (e.y <= (Player.y + Player.size[1]) ) ) {

                if (!Player.canMove) { 
                    Player.canMove = true;
                    oldX = Player.x;
                    oldY = Player.y;
                }

                Player.x = oldX;
                Player.y = oldY;

            } else {

                Player.canMove = false;

            } // if

        } // if

    } // for

} // collisionBot

function image(src) {

    var phImage = new Image();
    phImage.src = src;

    return phImage;
}

/*
* Render Functions:
* - Entity Loop
* - Background Drawer
* - Draw
*/
function entityDraw() {

    for (i = 0; i < entityList.length; i++) {

        entityList[i].draw();
    }
}

function backgDraw() {

    for (i = 0; i < window.innerHeight; i += 60) {

        for (j = 0; j < window.innerWidth; j += 60) {

            ctx.drawImage(grass, j, i);

        } // for

    } // for

} // backgDraw

function draw() {

    backgDraw();
    Player.draw();
    entityDraw();

    collisionBot();

    requestAnimationFrame(draw);
}

init();