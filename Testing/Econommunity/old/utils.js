//----------------------------
//Author: Peyton McGinnis
//Desc: Utility functions for Econommunity, written 2015
//----------------------------

var distance = function (x0, y0, x1, y1) {
    var dx = x1 - x0, dy = y1 - y0;
    return Math.sqrt((dx * dx) + (dy * dy));
};

var clear = function () {
    ctx.clearRect(0,0,canvas.width,canvas.height);
};

var sprite = function (img, x, y) {
    this.x = x;
    this.y = y;
    this.img = new Image();
    this.loaded = false;
    this.draw = function () {
        if (!this.loaded) { this.img.src = img; this.loaded = true; }
        ctx.drawImage(this.img, this.x, this.y);
    };
};