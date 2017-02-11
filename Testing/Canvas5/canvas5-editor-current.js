/*
* @author sergix / http://sergix.visualstudio.net/
*/

/*
* Game Engine dev1.3.2 Editor Full Script
* (c) 2016 Sergix
*/

/*
    Editor object constructor
    desc: Used to edit a scene object by using mouse dragging.
*/

function Editor(scene) {

    this.scene = scene;
    this.dragging = false;
    this.mousePositionX = null;
    this.mousePositionY = null;
    
    this.update = function () {

        // If we are dragging an object
        if (this.dragging !== false) {

            // If the element is a polygon
            if (this.dragging.x === undefined && this.dragging.vectors !== undefined) {

                // Then update the first vector to the mouse position
                this.dragging.vectors[0].x = this.mousePositionX;
                this.dragging.vectors[0].y = this.mousePositionY;

            } // If false, stay silent

            // Then update the current selected element's position
            this.dragging.x = this.mousePositionX;
            this.dragging.y = this.mousePositionY;

        } // If false, stay silent

    };

    // Called if event listener is active
    this.onMouseMove = function (evt) {

        // Set the mouse position properties
        this.mousePositionX = evt.pageX;
        this.mousePositionY = evt.pageY;

        // If we are dragging the mouse
        if (this.dragging !== false) {

            // Then set the position of the object being dragged to the current mouse position
            this.dragging.x = this.mousePositionX;
            this.dragging.y = this.mousePositionY;

        } // If false, stay silent

    };

    // Called if event listener is active
    this.onMouseDown = function (evt) {

        // Switch for mouse button code
        switch (evt.button) {

            // If left mouse button is down
            case 0: /*left*/

                // Loop through the sprites array
                for (var i = 0; i < this.scene.sprites.length; i++) {

                    // If the element is a circle
                    if (this.scene.sprites[i].radius !== undefined) {

                        // Then check if the mouse is colliding with the object (distance collision)
                        if (distance(this.mousePositionX, this.mousePositionY, this.scene.sprites[i].x, this.scene.sprites[i].y) <= this.scene.sprites[i].radius) {

                            // If true, set the dragging property to the current element index
                            this.dragging = this.scene.sprites[i];

                            // Then break (we only want to drag one object at a time)
                            break;

                        } // If false, stay silent

                    } // If false, stay silent

                    // If the element is a polygon
                    if (this.scene.sprites[i].vectors !== undefined && this.scene.sprites[i].fill !== undefined) {

                        // Then check if the mouse is colliding with the first vector (distance collision)
                        if (distance(this.mousePositionX, this.mousePositionY, this.scene.sprites[i].vectors[0].x, this.scene.sprites[i].vectors[0].y) <= 10) {

                            // If true, set the dragging property to the current element index
                            this.dragging = this.scene.sprites[i];

                            // Then break (we only want to drag one object at a time)
                            break;

                        } // If false, stay silent

                    } // If false, stay silent

                    // If the element a text object
                    if (this.scene.sprites[i].font !== undefined) {

                        // Then check if the mouse is colliding with the object (AABB collision)
                        // NOTE: Since text object has no defined width or height, check by seeing if the mouse is within a 100x100 region around its (x,y)
                        if (this.mousePositionX >= this.scene.sprites[i].x && this.mousePositionX <= this.scene.sprites[i].x + 100 && this.mousePositionY >= this.scene.sprites[i].y && this.mousePositionY <= this.scene.sprites[i].y + 100) {

                            // If true, set the dragging property to the current element index
                            this.dragging = this.scene.sprites[i];

                            // Then break (we only want to drag one object at a time)
                            break;

                        } // If false, stay silent

                    }

                    // If the current object is not a text element, and the mouse is colliding with it (AABB collsion)
                    if (this.mousePositionX >= this.scene.sprites[i].x && this.mousePositionX <= this.scene.sprites[i].x + this.scene.sprites[i].width && this.mousePositionY >= this.scene.sprites[i].y && this.mousePositionY <= this.scene.sprites[i].y + this.scene.sprites[i].width) {

                        // Then set the dragging property to the current element index
                        this.dragging = this.scene.sprites[i];

                        // Then break (we only want to drag one object at a time)
                        break;

                    } // If false, stay silent

                } // end for

                // Do not continue in switch
                break;

        } // end switch

    };

    // Called if event listener is active
    this.onMouseUp = function (evt) {

        // Set the dragging property to false
        this.dragging = false;

    };
    
    // Called autmoatically to set up editing
    (function (obj) {

        // Add listeners to mouse for editing
        window.addEventListener('mousemove', bind(obj, obj.onMouseMove), false);
        window.addEventListener('mousedown', bind(obj, obj.onMouseDown), false);
        window.addEventListener('mouseup', bind(obj, obj.onMouseUp), false);

    })(this);

}