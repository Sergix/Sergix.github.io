function XMLMenu(src) {
    this.src = src;
    this.menu = new GameMenu();
    console.log(this.menu);
    var obj = this;
    this.process = function (data, txtStatus) {
        var temp, temp, temp3;
        $(data).find("background").each(function () {
           obj.menu.backgroundColor = $(this).find("color").text();
           obj.menu.background = new GameImage($(this).find("image").text());
        });
        $(data).find("Button").each(function () {
            var msgbox = $(this).find("MessageBox");
            msgbox.each(function () {
                temp = new MessageBox($(this).find("text").text());
                temp.font = $(this).find("font").text();
                temp.x = parseInt($(this).find("x").text());
                temp.y = parseInt($(this).find("y").text());
                console.log(obj);
                obj.menu.add(temp);
            });
            msgbox.find("Rectangle").each(function () {
                temp3 = new Rectangle(parseInt($(this).find("width").text()), parseInt($(this).find("height").text()));
            });
            console.log(obj.menu)
            temp2 = new Button(temp, temp3);
            obj.add(temp2);
        });
        $(data).find("MessageBox").each(function () {
            temp = new MessageBox($(this).find("text").text());
            temp.font = $(this).find("font").text();
            temp.x = parseInt($(this).find("x").text());
            temp.y = parseInt($(this).find("y").text());
            obj.add(temp);
        });
    };
    (function (obj) {
        $.get(obj.src, obj.process);
    })(this);
}