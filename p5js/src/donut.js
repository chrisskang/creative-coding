let r0 = 500,
    r1 = 300;
let offset = 0;

let seconds = 10;

let framerate = 60;
let numFrames = seconds * framerate;

let toggle = false;
let target = 0;
let angle = 0;
let b;

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
    let canvas = createCanvas(1080, 1080);
    angleMode(DEGREES);

    stroke(0);
    strokeWeight(5);
    //noFill();
    button = createButton("start recording");
    button.mousePressed(toggleOn);
    colorMode(HSB, 360, 100, 100, 100);
    canvas.id("canvas");
    //blendMode(BLEND);
    //blendMode(MULTIPLY);
}

function toggleOn() {
    toggle = true;
}

function draw() {
    translate(width / 2, height / 2);
    background(255);
    //orbitControl(4, 4);
    noStroke();

    // shadow();

    const rotationX = new Matrix(2, 3, [
        [1, 0, 0],
        [0, cos(angle), -sin(angle)],
        [0, sin(angle), cos(angle)],
    ]);
    const rotationY = new Matrix(2, 3, [
        [cos(angle), 0, sin(angle)],
        [0, 1, 0],
        [-sin(angle), 0, cos(angle)],
    ]);

    const rotationZ = new Matrix(2, 3, [
        [cos(angle), -sin(angle), 0],
        [sin(angle), cos(angle), 0],
        [0, 0, 1],
    ]);

    for (let theta = 0; theta < 360; theta += 10) {
        for (let phi = 0; phi < 360; phi += 10) {
            let x = (r0 + r1 * cos(phi + offset)) * sin(theta);
            let y = r1 * sin(phi + offset);
            let z = (r0 + r1 * cos(phi + offset)) * cos(theta);

            vec = createVector(x, y, z);

            rotated = multiply(rotationX, vec);
            //rotated = multiply(rotationY, rotated);
            rotated = multiply(rotationZ, rotated);

            let distance = 2;

            let d = 1 / (distance - rotated.z);

            const projection = new Matrix(2, 3, [
                [d, 0, 0],
                [0, d, 0],
            ]);

            projected = multiply(projection, rotated);

            radialGradient(
                projected.x,
                projected.y,
                0, //Start pX, pY, start circle radius
                projected.x,
                projected.y,
                20, //End pX, pY, End circle radius
                color(180, 30, 100, 90), //Start color
                color(270, 95, 100, 90) //End color
            );

            ellipse(projected.x, projected.y, 20, 20);
        }
    }

    offset += 0.5;
    angle += 1;
    capture();
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

function radialGradient(sX, sY, sR, eX, eY, eR, colorS, colorE) {
    let gradient = drawingContext.createRadialGradient(sX, sY, sR, eX, eY, eR);
    gradient.addColorStop(0, colorS);
    gradient.addColorStop(1, colorE);

    drawingContext.fillStyle = gradient;
}

function shadow() {
    drawingContext.shadowOffsetX = 10;
    drawingContext.shadowOffsetY = 10;
    drawingContext.shadowBlur = 16;
    drawingContext.shadowColor = color(230, 30, 18, 100);
}
