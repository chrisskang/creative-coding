let OnButton;
let toggle = false;
let pause = false;
var pixels = [];

let antCount = 3000;
let targetCount = 3;
let ants = [];
let targets = [];
let circleSize = 10;
let path = {};

var grid = [];
var next = [];
var n = 0;
var vt = new videoTool(15, 30);
let size = 800;

function setup() {
    var canvas = createCanvas(size, size);
    pixelDensity(1);

    button = vt.makeButton();
    button.mousePressed(() => (vt.toggle = true));
    vt.toggle = false;

    noStroke();
    OnButton = createButton("On");
    OnButton.mousePressed(() => (toggle = true));
    OnButton = createButton("off");
    OnButton.mousePressed(() => (toggle = false));

    OnButton = createButton("pause");
    OnButton.mousePressed(() => (pause = true));

    // create ant
    slime = new SlimeSystem(antCount, targetCount);
    slime.Make();

    OnButton = createButton("make");
    OnButton.mousePressed(() => slime.Add(500));
    angleMode(RADIANS);
    // initialize grid
    init();
}

function draw() {
    background(0);

    if (toggle) {
        slime.DrawOnGrid(next);
        slime.Update();

        for (var i = 0; i < width; i++) {
            for (var j = 0; j < height; j++) {
                decay(i, j);
                diffuse(i, j);
            }
        }
        n += 0.2;
        // let sizee = 10;
        // for (let i = width / 2 - sizee; i < width / 2 + sizee; i++) {
        //     for (let j = width / 2 - sizee; j < width / 2 + sizee; j++) {
        //         next[i][j].white = 1;
        //     }
        // }

        drawGrid();

        swap();
        vt.capture();
        //logFR(width / 50);
    }
    if (pause) {
        noLoop();
    }
}

function init() {
    for (var x = 0; x < width; x++) {
        grid[x] = [];
        next[x] = [];
        for (var y = 0; y < height; y++) {
            grid[x][y] = { white: 0 };

            next[x][y] = grid[x][y];
        }
    }
}

function drawGrid() {
    loadPixels();

    for (var i = 0; i < width; i++) {
        for (var j = 0; j < height; j++) {
            var pix = (i + j * width) * 4;
            var white = next[i][j].white;
            white = constrain(white, 0, 1);
            var c = floor(white * 255);

            //c = constrain(c, 0, 255);

            pixels[pix + 0] = c;
            pixels[pix + 1] = c;
            pixels[pix + 2] = c;
            pixels[pix + 3] = 255;
        }
    }

    updatePixels();
}

function logFR(ts) {
    textSize(ts);
    fill(255);
    text(
        "Framerate : " + int(getFrameRate()),
        width - ts * 10,
        height - ts * 3
    );
    noFill();
}

function swap() {
    let temp = grid;
    grid = next;
    delete grid;
    next = temp;
}

function decay(i, j) {
    next[i][j].white *= 0.95;
}

function diffuse(i, j) {
    let center = 1;
    let side = 1;
    let diagonal = 1;
    let defVal = 0;
    let sumB = 0;
    if (i == 0 && j != 0 && j != height - 1) {
        //[]|[][]
        //[]|[x][]
        //[]|[][]
        sumB += next[i][j].white * center;
        sumB += next[i + 1][j].white * side;
        sumB += defVal * side;
        sumB += next[i][j + 1].white * side;
        sumB += next[i][j - 1].white * side;
        sumB += next[i + 1][j + 1].white * diagonal;
        sumB += defVal * diagonal;
        sumB += defVal * diagonal;
        sumB += next[i + 1][j - 1].white * diagonal;
    } else if (i == width - 1 && j != 0 && j != height - 1) {
        //[]  []|[]
        //[] [x]|[]
        //[]  []|[]
        sumB += next[i][j].white * center;
        sumB += defVal * side;
        sumB += next[i - 1][j].white * side;
        sumB += next[i][j + 1].white * side;
        sumB += next[i][j - 1].white * side;
        sumB += defVal * diagonal;
        sumB += next[i - 1][j - 1].white * diagonal;
        sumB += next[i - 1][j + 1].white * diagonal;
        sumB += defVal * diagonal;
    } else if (i != 0 && i != width - 1 && j == 0) {
        //[][][]
        //[][x][]
        //--------
        //[][][]
        sumB += next[i][j].white * center;
        sumB += next[i + 1][j].white * side;
        sumB += next[i - 1][j].white * side;
        sumB += next[i][j + 1].white * side;
        sumB += defVal * side;
        sumB += next[i + 1][j + 1].white * diagonal;
        sumB += defVal * diagonal;
        sumB += next[i - 1][j + 1].white * diagonal;
        sumB += defVal * diagonal;
    } else if (i != 0 && i != width - 1 && j == height - 1) {
        //[][][]
        //--------
        //[][x][]
        //[][][]
        sumB += next[i][j].white * center;
        sumB += next[i + 1][j].white * side;
        sumB += next[i - 1][j].white * side;
        sumB += defVal * side;
        sumB += next[i][j - 1].white * side;
        sumB += defVal * diagonal;
        sumB += next[i - 1][j - 1].white * diagonal;
        sumB += defVal * diagonal;
        sumB += next[i + 1][j - 1].white * diagonal;
    } else if (i == 0 && j == 0) {
        //[]|[][]
        //[]|[x][]
        //--+------
        //[]|[][]
        sumB += next[i][j].white * center;
        sumB += next[i + 1][j].white * side;
        sumB += defVal * side;
        sumB += next[i][j + 1].white * side;
        sumB += defVal * side;
        sumB += next[i + 1][j + 1].white * diagonal;
        sumB += defVal * diagonal;
        sumB += defVal * diagonal;
        sumB += defVal * diagonal;
    } else if (i == 0 && j == height - 1) {
        //[]|[][]
        //--+------
        //[]|[x][]
        //[]|[][]

        sumB += next[i][j].white * center;
        sumB += next[i + 1][j].white * side;
        sumB += defVal * side;
        sumB += defVal * side;
        sumB += next[i][j - 1].white * side;
        sumB += defVal * diagonal;
        sumB += defVal * diagonal;
        sumB += defVal * diagonal;
        sumB += next[i + 1][j - 1].white * diagonal;
    } else if (i == width - 1 && j == 0) {
        //[]  []|[]
        //[] [x]|[]
        //------+--
        //[]  []|[]
        sumB += next[i][j].white * center;
        sumB += defVal * side;
        sumB += next[i - 1][j].white * side;
        sumB += next[i][j + 1].white * side;
        sumB += defVal * side;
        sumB += defVal * diagonal;
        sumB += defVal * diagonal;
        sumB += next[i - 1][j + 1].white * diagonal;
        sumB += defVal * diagonal;
    } else if (i == width - 1 && j == height - 1) {
        //[]  []|[]
        //------+--
        //[] [x]|[]
        //[]  []|[]
        sumB += next[i][j].white * center;
        sumB += defVal * side;
        sumB += next[i - 1][j].white * side;
        sumB += defVal * side;
        sumB += next[i][j - 1].white * side;
        sumB += defVal * diagonal;
        sumB += next[i - 1][j - 1].white * diagonal;
        sumB += defVal * diagonal;
        sumB += defVal * diagonal;
    } else {
        sumB += next[i][j].white * center;
        sumB += next[i + 1][j].white * side;
        sumB += next[i - 1][j].white * side;
        sumB += next[i][j + 1].white * side;
        sumB += next[i][j - 1].white * side;
        sumB += next[i + 1][j + 1].white * diagonal;
        sumB += next[i - 1][j - 1].white * diagonal;
        sumB += next[i - 1][j + 1].white * diagonal;
        sumB += next[i + 1][j - 1].white * diagonal;
    }

    next[i][j].white = sumB / 9;
}
