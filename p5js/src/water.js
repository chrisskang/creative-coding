var current = [];
var previous = [];

let dampening = 0.94;
let rad = 1;

var vt = new videoTool(10, 30);

function setup() {
    pixelDensity(1);

    var canvas = createCanvas(500, 500);

    button = vt.makeButton();

    //button.mousePressed((vt.toggle = true));

    for (let i = 0; i < width; i++) {
        current[i] = [];
        previous[i] = [];
        for (let j = 0; j < height; j++) {
            current[i][j] = [0, 0, 0];
            previous[i][j] = [0, 0, 0];
        }
    }
}

function draw() {
    background(0);
    if (frameCount % 2 == 0) {
        let index1 = int(random(1, width - 1));
        let index2 = int(random(1, height - 1));

        let rad = int(random(1, 2));
        if (
            index1 > rad &&
            width - index1 > rad &&
            index2 > rad &&
            height - index2 > rad
        ) {
            for (let p = 0; p < rad; p++) {
                LightUp(index1 + p, index2 + p);
                LightUp(index1 - p, index2 - p);
            }
        }
    }

    loadPixels();

    for (let i = 0; i < width; i++) {
        for (let j = 0; j < height; j++) {
            if (i > 0 && i < width - 1 && j > 0 && j < height - 1) {
                Update(current, previous, i, j);
            }

            current[i][j][0] *= dampening;
            current[i][j][1] *= dampening * 0.99;
            current[i][j][2] *= dampening * 0.97;

            let index = (i + j * width) * 4;

            pixels[index + 0] = current[i][j][0] * 255;
            pixels[index + 1] = current[i][j][1] * 255;
            pixels[index + 2] = current[i][j][2] * 255;
            pixels[index + 3] = 255;
        }
    }

    updatePixels();

    let temp = previous;
    previous = current;
    current = temp;

    vt.capture();
}

function Update(current, previous, i, j) {
    for (let k = 0; k < 3; k++) {
        current[i][j][k] =
            (previous[i - 1][j][k] +
                previous[i + 1][j][k] +
                previous[i][j - 1][k] +
                previous[i][j + 1][k]) /
                2 -
            current[i][j][k];
    }
}

function UpdateVertex(current, previous, i, j) {}

function UpdateEdge(current, previous, i, j) {}

function LightUp(i, j) {
    current[i][j][0] = 250;
    current[i][j][1] = 250;
    current[i][j][2] = 250;
}
