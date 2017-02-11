//----------------------------
//Author: Peyton McGinnis
//Desc: Main script for Econommunity, written 2015
//----------------------------

var canvas = document.getElementById("canvas");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
var ctx = canvas.getContext('2d');
var fps = 60;
var mouseX, mouseY, mouseDown = false;

var house1 = new sprite("img/house-1.png", 300, 0);
var house2 = new sprite("img/house-1.png", 800, 0);
var house3 = new sprite("img/house-1.png", 1300, 0);
var couch1 = new sprite("img/couch-1.png", 200, 100);
var grass1 = new Image(), ground1 = new Image();
var arrow1 = [], arrowt = 0, arrowti = 0;
var sceneN = 0;
var x, y;

var player = {
    x: 0,
    y: 0,
    vx: 0,
    vy: 0,
    ax: 0,
    ay: 0,
    tex: [],
    time: 0,
    frame: 0,
    move: false,
    size: [32, 64],
    draw: function () {
        this.update();
        ctx.drawImage(this.tex[this.frame], this.x, this.y, this.size[0], this.size[1]);
    },
    update: function () {
        this.vx += this.ax / fps;
        this.vy += this.ay / fps;
        this.x += this.vx / fps;
        this.y += this.vy / fps;

        if (this.move == true) { this.time += 1; }

        if (this.time % 5 == 0) { this.frame += 1; }

        if (this.frame > 7 || this.move == false) { this.frame = 0; }
    }
};

var collisionBot = function () {
    if (player.x <= 0)
        player.x = 0;

    if (player.x >= 1468)
        player.x = 1468;

    switch (sceneN) {
        case 0:
            /*if (190 >= distance(player.x, player.y, 670, 128.5)) {
                if (!b) { b = true; oldx = player.x;
                oldy = player.y;}
                player.x = oldx;
            player.y = oldy;+
            } else {
                b = false;
            }*/
            if (((house1.x + house1.img.width) >= player.x) && (house1.x <= (player.x + player.size[0])) && ((house1.y + 293) >= player.y) && (house1.y <= (player.y + player.size[1]))) {
                if (!b) { b = true; oldx = player.x; oldy = player.y;}
                player.x = oldx;
                player.y = oldy;
            } else {
                b = false;
            }
            if (25 >= distance(player.x, player.y, 462, 316)) {
                sceneN = 1;
            }
            break;
        case 1:
            
            break;
        default: break;
    }
    
    // x: 0 y: 292
    // w: 170 h: 208.5
};

var loadTex = function () {
    var j = 5;

    for (var i = 0; i < 8; i++) {
        player.tex[i]     = new Image();
        player.tex[i].src = "img/player-"+i+".png";
    }
    for (i = 0; i < 5; i++) {
        arrow1[i]     = new Image();
        arrow1[i].src = "img/arrow-"+i+".png";
    }
    for (i = 3; i > 0; i--) {
        arrow1[j]     = new Image();
        arrow1[j].src = "img/arrow-"+i+".png";
        j += 1;
    }

    grass1.src  = "img/grass-0.png";
    ground1.src = "img/ground-0.png";
};

var sprites = function () {
    switch (sceneN) {
        case 0:
            if (arrowt > 7) { arrowt = 0; }
            ctx.drawImage(arrow1[arrowt], 458, 385, 36, 68);
            if (arrowti % 5 === 0) { arrowt += 1; }
            arrowti += 1;
            break;
        case 1:
            break;
        default:
            break;
    }

    text();
};

var text = function () {
    ctx.fillStyle = "black";
    ctx.font = "15pt monospace";
    ctx.fillText(player.x + " " + player.y + ";" + fps, 10, 20);
};

window.onkeydown = function (e) {
    e = e || window.event;
    var key = e.keyCode;
    player.move = true;
    switch (key) {
        case 87: /*W*/player.vy =-250; break;
        case 65: /*A*/player.vx =-250; break;
        case 83: /*S*/player.vy = 250; break;
        case 68: /*D*/player.vx = 250; break;
        case 70: /*F*/player.vx /= 2; player.vy /= 2; break;
        default:                       break;
    }
};

window.onkeyup = function (e) {
    e = e || window.event;
    var key = e.keyCode;
    player.move = false;
    switch (key) {
        case 87: /*W*/player.vy = 0;    break;
        case 65: /*A*/player.vx = 0;    break;
        case 83: /*S*/player.vy = 0;    break;
        case 68: /*D*/player.vx = 0;    break;
        default:                        break;
    }
};

window.onmousemove = function (e) {
    e = e || window.event;
    mouseX = e.pageX;
    mouseY = e.pageY;
};

window.onmousedown = function (e) {
    e = e || window.event;
    mouseDown = true;
};

window.onmouseup = function (e) {
    e = e || window.event;
    mouseDown = false;
}

var scene = function (n) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    switch (n) {
        case 0:
            for (j = 0; j < canvas.height; j += 32) {
                for (i = 0; i < canvas.width; i += 32) {
                    ctx.drawImage(grass1, i, j);
                }
            }
            x = 0, y = 0;
            house1.draw();
            house2.draw();
            house3.draw();
            break;
        case 1:
            for (j = 0; j < canvas.height; j += 32) {
                for (i = 0; i < canvas.width; i += 32) {
                    ctx.drawImage(ground1, i, j);
                }
            }
            couch1.draw();
            break;
        default:
            break;
    }
};

var render = function () {
    collisionBot();
    scene(sceneN);
    sprites();
    player.draw();
    requestAnimationFrame(render);
};

loadTex();
render();