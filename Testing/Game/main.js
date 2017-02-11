/*
* @author sergix / http://sergix.net/
*/

/*
* Global Variables:
* - scene
* - camera
* - renderer
* - light
* - controls
* - plane (ground)
* - bullets[]
* - bulletspeed
* - projector (bullet physics)
* - gun   (gun model)
* - clock (bullet/FPS physics)
* - delta (bullet/FPS physics)
* - speed (bullet/FPS physics)
* - time  (bullet/FPS physics)
* - mouse
* - walls[], covers[], oob[]
* - oldx  (collision)
* - oldy  (collision)
* - oldz  (collision)
* - b     (collision)
* - h (height for jump())
* - m (maximum height for jump())
* - canJump
* - cameraSetHeight
* - sphereMaterial (bullet physics)
* - sphereGeo      (bullet physics)
* - map
*/
var scene           = new THREE.Scene();
var camera          = new THREE.PerspectiveCamera(95, window.innerWidth / window.innerHeight, 0.1, 1000);
var renderer        = window.WebGLRenderingContext ? new THREE.WebGLRenderer({antialiasing: true, alpha: true}) : new THREE.CanvasRenderer();
var light           = new THREE.HemisphereLight(0x111111);
var controls        = new THREE.FirstPersonControls(camera);
var pointer         = new THREE.PointerLockControls(camera);
var plane           = new THREE.Mesh( new THREE.PlaneBufferGeometry( 1100, 1100 ), new THREE.MeshLambertMaterial( { color: 0x0000FF } ) );
var bullets         = [];
var bulletspeed     = 1000;
var movespeed       = 100;
var projector       = new THREE.Projector();
var gun             = new THREE.Mesh(new THREE.BoxGeometry(1,1,3), new THREE.MeshLambertMaterial( {color: 0xff0000} ));
var clock           = new THREE.Clock();
var delta           = clock.getDelta()
var speed           = delta * bulletspeed
var time            = performance.now() / 1000;
var mouse           = { x: 0, y: 0 };
var walls           = []
var covers          = []
var oob             = [];
var oldx            = 0;
var oldy            = 0;
var oldz            = 0;
var b               = false;
var h               = 10;
var m               = 20;
var canJump         = true;
var cameraSetHeight = 0;
var sphereMaterial  = new THREE.MeshBasicMaterial({color: 0x333333})
var sphereGeo       = new THREE.SphereGeometry(1, 25, 25);
var loader 			  = new THREE.ColladaLoader();
var map = [
[4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4],  // 0
[4,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,4],  // 1
[4,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,4],  // 2
[4,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3,0,0,0,0,0,4],  // 3
[4,0,2,2,0,1,1,1,1,0,0,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,1,1,1,1,0,0,0,0,0,0,0,0,0,0,4],  // 4
[4,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,0,0,0,0,1,0,0,1,1,1,1,1,1,1,1,1,0,0,4],  // 5
[4,0,0,2,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,1,0,0,4],  // 6
[4,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,4],  // 7
[4,1,1,1,0,1,1,1,1,1,1,1,1,1,0,0,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,4],  // 8
[4,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,0,0,4],  // 9
[4,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,2,0,1,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,4],  // 10
[4,1,1,1,1,1,0,0,1,1,1,1,0,1,0,0,0,0,0,0,1,0,0,2,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,4],  // 11
[4,0,0,0,1,0,0,0,1,0,0,0,0,0,0,0,1,1,1,1,1,0,0,0,0,0,0,0,0,0,1,0,0,0,0,2,0,0,0,0,0,4],  // 12
[4,0,0,0,1,0,0,0,1,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,2,0,0,2,0,0,0,0,0,4],  // 13
[4,2,2,0,1,0,0,0,1,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,2,2,0,0,1,0,0,0,0,0,1,1,1,0,0,4],  // 14
[4,0,0,0,1,0,0,0,1,1,0,0,0,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,1,0,0,0,0,4],  // 15
[4,0,2,2,1,0,0,0,0,1,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,1,0,0,0,0,4],  // 16
[4,0,0,0,0,0,2,0,0,1,0,0,0,0,0,0,1,0,0,0,2,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,1,0,0,0,0,4],  // 17
[4,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,1,1,1,1,0,0,0,0,0,1,0,0,0,0,4],  // 18
[4,1,0,1,1,0,0,0,2,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,2,2,0,1,1,1,1,0,0,4],  // 19
[4,1,0,1,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,2,2,0,0,0,0,1,0,0,0,0,0,0,0,1,0,0,0,0,0,4],  // 20
[4,1,0,1,1,1,1,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,1,0,0,0,0,1,0,0,0,0,0,4],  // 21
[4,1,0,0,0,0,0,0,0,0,0,0,1,0,0,1,1,1,0,0,0,0,0,0,0,0,0,1,0,0,1,0,0,0,0,1,0,0,0,0,0,4],  // 22
[4,1,1,1,0,1,1,0,0,2,2,0,0,0,0,0,0,1,0,0,0,0,0,0,2,0,0,1,0,0,1,0,0,0,0,1,0,0,0,0,0,4],  // 23
[4,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,2,0,0,0,0,0,0,1,0,0,1,1,1,1,1,1,1,1,1,1,1,4],  // 24
[4,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,1,0,0,0,1,1,0,0,0,0,0,0,0,0,4],  // 25
[4,0,0,2,1,1,1,1,1,1,0,0,0,1,1,1,1,1,0,0,0,0,0,0,0,0,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,4],  // 26
[4,0,0,0,0,0,0,0,0,1,0,0,0,1,0,0,0,0,0,0,1,0,0,0,2,2,1,0,1,0,0,0,0,0,0,1,1,0,0,0,0,4],  // 27
[4,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,1,0,1,1,1,1,1,0,0,1,0,0,0,0,0,4],  // 28
[4,0,0,0,0,1,0,0,0,1,0,0,0,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,4],  // 29
[4,0,0,1,1,1,1,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,4],  // 30
[4,0,0,1,0,0,0,0,0,0,0,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,1,1,1,0,0,0,0,1,0,0,0,0,0,4],  // 31
[4,0,0,0,0,0,0,0,0,0,0,2,0,1,0,0,1,0,0,0,0,2,2,0,0,0,1,0,0,0,1,0,0,0,0,1,0,0,0,0,0,4],  // 32
[4,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,1,0,0,0,0,2,0,0,0,0,1,0,0,0,1,0,0,0,0,1,0,0,0,0,0,4],  // 33
[4,1,1,0,0,1,1,1,1,0,0,0,0,1,0,0,1,0,0,0,0,0,0,0,0,0,1,0,0,0,1,1,1,1,1,1,1,1,0,0,0,4],  // 34
[4,0,0,0,0,0,0,0,1,0,0,0,0,1,0,0,1,0,1,1,1,1,0,0,0,0,1,0,0,0,1,0,0,0,0,0,0,1,0,0,0,4],  // 35
[4,0,0,0,0,0,0,0,1,0,0,0,0,1,0,0,0,0,0,0,0,1,0,0,0,0,1,0,0,0,1,0,0,0,0,0,0,1,0,0,0,4],  // 36
[4,0,0,0,0,0,0,0,1,0,0,0,0,1,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,4],  // 37
[4,0,0,3,0,0,0,0,1,1,1,0,0,1,1,1,1,1,1,1,1,1,0,0,0,0,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,4],  // 38
[4,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,4],  // 39
[4,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,4],  // 40
[4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4]   // 41
];


/*
* Environment Settings:
* - controls
* - renderer
* - camera
* - objects
*/
controls.movementSpeed = 5;
controls.lookSpeed = 0.15;
controls.lookVertical = false;
controls.noFly = true;

renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

document.addEventListener( 'mousemove', onDocumentMouseMove, false );

camera.position.y = 10;
cameraVy = 0;
cameraAy = 0;

gun.position.set(camera.position.x - 1, gun.position.y - 1, gun.position.z - 1);
light.position.set(100, 100, 100);
plane.rotation.x = -90 * Math.PI / 180;

var loader = new THREE.ColladaLoader();
loader.load('https://raw.githubusercontent.com/Sergix7440/Three.js-Custom-Models-Repo/master/scene1.dae', function (result) {
  result.scene.rotation.x = Math.PI / -2;
  result.scene.position.y = 9.5;
  scene.add(result.scene);
});

pointer.enabled = true;

/*
* Event Handlers:
* - onDocumentMouseMove
*/
function onDocumentMouseMove(e) {
    e.preventDefault();
    mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
    mouse.y = - (e.clientY / window.innerHeight) * 2 + 1;
}


/*
* Camera/Player Event Functions:
* - Jump
* - Crouch
* - Uncrouch
* - Sprint
* - Unsprint
* - Create Bullet
*/
function jump() {
    if(canJump === false) return 0;
    h = camera.position.y;
    m = h + 20;
    cameraAy = -170;
    cameraVy = 70;
    canJump = false;
}

function crouch() {
    if (camera.position.y > cameraSetHeight) return 0;
    cameraSetHeight = 6;
    camera.position.y = 6;
    controls.movementSpeed = 30;
}

function unCrouch() {
    cameraSetHeight = 10;
    camera.position.y = 10;
    controls.movementSpeed = 75;
}

function sprint() {
    controls.movementSpeed = 125;
}

function unSprint() {
    controls.movementSpeed = 75;
}

function createBullet(obj) {
    if (obj === undefined) {
        obj = camera;
    }
    var sphere = new THREE.Mesh(sphereGeo, sphereMaterial);
    sphere.position.set(camera.position.x, camera.position.y * 0.8, camera.position.z);

    if (obj instanceof THREE.Camera) {
        var vector = new THREE.Vector3(window.width / 2, window.height / 2 + 50, 1);
        projector.unprojectVector(vector, obj);
        sphere.ray = new THREE.Ray(
            obj.position,
            vector.sub(obj.position).normalize()
        );
    }
    else {
        var vector = cam.position.clone();
        sphere.ray = new THREE.Ray(
            obj.position,
            vector.sub(obj.position).normalize()
        );
    }
    sphere.owner = obj;

    bullets.push(sphere);
    scene.add(sphere);

    return sphere;
}


/*
* Scene Initializers/Renderers:
* - Scene Setup (add walls[], covers[], oob[], light, plane)
*/
function setupScene() {
    var UNITSIZE = 25, units = mapW = map.length, WALLHEIGHT = 45;
    var cube = new THREE.CubeGeometry(UNITSIZE, WALLHEIGHT, UNITSIZE);
    var cover = new THREE.CubeGeometry(UNITSIZE, 13, UNITSIZE);
    var materials = [
        new THREE.MeshLambertMaterial({ color: 0xFF0000 }),
        new THREE.MeshLambertMaterial({ color: 0x00FF00 }),
        new THREE.MeshLambertMaterial({ color: 0x00ff00 }),
        new THREE.MeshLambertMaterial({ color: 0xababab }),
    ];
    for (var i = 0; i < mapW; i++) {
        for (var j = 0, m = map[i].length; j < m; j++) {
            if (map[i][j] === 1) {
                var wall = new THREE.Mesh(cube, materials[map[i][j] - 1]);
                wall.position.x = (i - units / 2) * UNITSIZE;
                wall.position.y = 22;
                wall.position.z = (j - units / 2) * UNITSIZE;
                scene.add(wall);
            } else if (map[i][j] === 2) {
                var wall = new THREE.Mesh(cover, materials[map[i][j] - 1]);
                wall.position.x = (i - units / 2) * UNITSIZE;
                wall.position.y = 3;
                wall.position.z = (j - units / 2) * UNITSIZE;
                covers.push(wall);
                scene.add(wall);
            } else if (map[i][j] === 4) {
                var wall = new THREE.Mesh(cube, materials[map[i][j] - 1]);
                wall.position.x = (i - units / 2) * UNITSIZE;
                wall.position.y = 22;
                wall.position.z = (j - units / 2) * UNITSIZE;
                scene.add(wall);
            }
        }
    }
    scene.add(gun);
    scene.add(plane);
}


/*
* Updater Functions:
*  - Update Handler
*  - Bullets
*  - Camera
*  - Gun
*  - Collision
*  - Scene
*/
function updateHandler() {
    updateBullets();
    updateCamera();
    updateControls();
    updateGun();
    collisionBot();
    updateScene();
}

function updateBullets() {
    for (var i = bullets.length - 1; i >= 0; i--) {
        var b = bullets[i], p = b.position, d = b.ray.direction;
        b.translateX(speed * d.x);
        b.translateY(speed * d.y * 10);
        b.translateZ(speed * d.z);
    }
}

function updateCamera() {
    cameraVy += cameraAy / 60;
    camera.position.y += cameraVy / 60;

    if (camera.position.y >= m) {
        cameraAy = -150;
        cameraVy = 100;
        canJump = false;
    }
}

function updateControls() {
    time = performance.now() / 1000;
    delta = clock.getDelta(), speed = delta * bulletspeed;
    controls.update(delta);
}

function updateGun() {
    gun.rotation.set(camera.rotation.x, camera.rotation.y, camera.rotation.z);
}

function collisionBot() {

    for (i = 0; i < covers.length; i++) {
        if (15 >= distance(camera.position.x, camera.position.y, camera.position.z, covers[i].position.x, covers[i].position.y, covers[i].position.z)) {
            if (!b) {
                console.log("WOO");
                b = true;
                oldx = camera.position.x, oldy = camera.position.y, oldz = camera.position.z;
            }
            camera.position.x = oldx;
            camera.position.y = oldy;
            camera.position.z = oldz;
        } else {
            b = false;
        }
    }

    for (i = 0; i < bullets.length; i++) {
        var b = bullets[i];
        for (j = 0; j < covers.length; j++) {
            var w = covers[j];
            if (15 >= distance(b.position.x, b.position.y, b.position.z, w.position.x, w.position.y, w.position.z)) {
                scene.remove(b);
                bullets.pop(i);
                console.log("Pop!");
            }
        }
    }

    if (camera.position.y < cameraSetHeight) {
        cameraVy = 0;
        cameraAy = 0;
        camera.position.y = 10;
        h = 10;
        canJump = true;
    }

}

function updateScene() {
    renderer.render(scene, camera);
}

/*
* Tool Functions:
* - Distance
*/
var distance = function (x0, y0, z0, x1, y1, z1) {
    var dx = x1 - x0, dy = y1 - y0, dz = z1 - z0;
    return Math.sqrt((dx * dx) + (dy * dy) + (dz * dz));
};


/*
* Renderer Functions:
* - Render
*/
var render = function () {
    requestAnimationFrame(render);
    updateHandler();
};


/*
* Initialization Callers:
* - Setup Scene
* - Render
*/
//setupScene();
scene.add(light);
render();