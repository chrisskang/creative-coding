let size = 1;
let points = [];
let angle = 0;

var seconds = 5;

var framerate = 60;
var numFrames = seconds * framerate;

var toggle = false;
let target = 0;

var capturer = new CCapture({
    format: "webm",
    framerate: framerate,
    verbose: true,
    display: true,
    quality: 99,
    workersPath: "./export",
    timeLimit: 60,
    autoSaveTime: 60,
});

function setup() {
    var canvas = createCanvas(1080, 1080, WEBGL);
    button = createButton("start recording");
    button.mousePressed(toggleOn);

    canvas.id("canvas");

    points[0] = new P4Vector(-size, -size, -size, size);
    points[1] = new P4Vector(size, -size, -size, size);
    points[2] = new P4Vector(size, size, -size, size);
    points[3] = new P4Vector(-size, size, -size, size);
    points[4] = new P4Vector(-size, -size, size, size);
    points[5] = new P4Vector(size, -size, size, size);
    points[6] = new P4Vector(size, size, size, size);
    points[7] = new P4Vector(-size, size, size, size);

    points[8] = new P4Vector(-size, -size, -size, -size);
    points[9] = new P4Vector(size, -size, -size, -size);
    points[10] = new P4Vector(size, size, -size, -size);
    points[11] = new P4Vector(-size, size, -size, -size);
    points[12] = new P4Vector(-size, -size, size, -size);
    points[13] = new P4Vector(size, -size, size, -size);
    points[14] = new P4Vector(size, size, size, -size);
    points[15] = new P4Vector(-size, size, size, -size);
}

function draw() {
    background(0);
    rotateX(-PI / 2);
    let projected3d = [];

    for (let i = 0; i < points.length; i++) {
        const v = points[i];

        let rotationXY = new Matrix(4, 4, [
            [cos(angle), -sin(angle), 0, 0],
            [sin(angle), cos(angle), 0, 0],
            [0, 0, 1, 0],
            [0, 0, 0, 1],
        ]);

        let rotationZW = new Matrix(4, 4, [
            [1, 0, 0, 0],
            [0, 1, 0, 0],
            [0, 0, cos(angle), -sin(angle)],
            [0, 0, sin(angle), cos(angle)],
        ]);

        let rotated = multiply(rotationXY, v);
        rotated = multiply(rotationZW, rotated);

        let distance = 2;
        let w = 1 / (distance - rotated.w);

        projection = new Matrix(3, 4, [
            [w, 0, 0, 0],
            [0, w, 0, 0],
            [0, 0, w, 0],
        ]);

        let projected = multiply(projection, rotated);
        projected.mult(width / 8);

        projected3d[i] = projected;

        //point(projected.x, projected.y, projected.z);
    }

    for (let i = 0; i < 4; i++) {
        connect(0, i, (i + 1) % 4, projected3d);
        connect(0, i + 4, ((i + 1) % 4) + 4, projected3d);
        connect(0, i, i + 4, projected3d);
    }
    for (let i = 0; i < 4; i++) {
        connect(8, i, (i + 1) % 4, projected3d);
        connect(8, i + 4, ((i + 1) % 4) + 4, projected3d);
        connect(8, i, i + 4, projected3d);
    }
    for (let i = 0; i < 8; i++) {
        connect(0, i, i + 8, projected3d);
    }

    for (pt of projected3d) {
        translate(pt.x, pt.y, pt.z);

        normalMaterial();

        sphere(10);
        translate(-pt.x, -pt.y, -pt.z);
    }
    angle += 0.03;

    capture();
}

function connect(offset, i, j, points) {
    strokeWeight(1);
    stroke(160);
    let a = points[i + offset];
    let b = points[j + offset];
    line(a.x, a.y, a.z, b.x, b.y, b.z);
    noStroke();
}

function toggleOn() {
    toggle = true;
}
function capture() {
    if (toggle == true) {
        capturer.start();
        var curFrame = frameCount;
        target = curFrame + numFrames;
        toggle = false;
    }

    if (frameCount == target) {
        console.log("done!");

        capturer.stop();
        capturer.save();
        noLoop();
    }

    capturer.capture(canvas);
}
