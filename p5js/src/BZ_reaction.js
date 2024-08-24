var grid;
var next;
var t = true;
var aalpha = 1;
var bbeta = 1;
var ggamma = 1;

var initsize = 10;

var vt = new videoTool(15, 30);

function setup() {
    //createCanvas(2160, 2160);
    pixelDensity(1);

    var canvas = createCanvas(700, 700);

    button = vt.makeButton();

    button.mousePressed(() => (vt.toggle = true));

    grid = [];
    next = [];
    // initialize grid.
    OnButton = createButton("On");
    OnButton.mousePressed(() => (t = true));
    OnButton = createButton("off");
    OnButton.mousePressed(() => (t = false));
    sliderSetup(0, 20, 0.01);
    init();
}

function draw() {
    if (t) {
        update();

        show();
        swap();

        vt.capture();
    } else {
        noLoop;
    }
}

function init() {
    for (let x = 0; x < width; x++) {
        grid[x] = [];
        next[x] = [];
        for (let y = 0; y < height; y++) {
            grid[x][y] = {
                a: random(0.0, 1),
                b: random(0.0, 1),
                c: random(0.0, 1),
            };
            next[x][y] = grid[x][y];
        }
    }

    for (let x = 0; x < width; x++) {
        for (let y = 0; y < height; y++) {
            if (x == 0) {
                grid[x][y] = grid[x + 1][y];
                next[x][y] = grid[x][y];
            } else if (x == width - 1) {
                grid[x][y] = grid[x - 1][y];
                next[x][y] = grid[x][y];
            } else if (y == 0) {
                grid[x][y] = grid[x][y + 1];
                next[x][y] = grid[x][y];
            } else if (y == height - 1) {
                grid[x][y] = grid[x][y - 1];
                next[x][y] = grid[x][y];
            }
        }
    }
}

function update() {
    aalpha = sliderAlpha.value();
    bbeta = sliderBeta.value();
    ggamma = sliderGamma.value();
    for (let x = 1; x < width - 1; x++) {
        for (let y = 1; y < height - 1; y++) {
            let a = grid[x][y].a;
            let b = grid[x][y].b;
            let c = grid[x][y].c;

            next[x][y].a = a + a * (aalpha * b - ggamma * c);
            next[x][y].b = b + b * (bbeta * c - aalpha * a);
            next[x][y].c = c + c * (ggamma * a - bbeta * b);
            average(x, y);
            next[x][y].a = constrain(next[x][y].a, 0, 1);
            next[x][y].b = constrain(next[x][y].b, 0, 1);
            next[x][y].c = constrain(next[x][y].c, 0, 1);
        }
    }
}

function average(x, y) {
    let center = 1;
    let side = 1;
    let diagonal = 1;

    let sumA = 0;
    let sumB = 0;
    let sumC = 0;

    sumA += next[x][y].a * center;
    sumA += next[x + 1][y].a * side;
    sumA += next[x - 1][y].a * side;
    sumA += next[x][y + 1].a * side;
    sumA += next[x][y - 1].a * side;
    sumA += next[x + 1][y + 1].a * diagonal;
    sumA += next[x - 1][y - 1].a * diagonal;
    sumA += next[x - 1][y + 1].a * diagonal;
    sumA += next[x + 1][y - 1].a * diagonal;

    sumB += next[x][y].b * center;
    sumB += next[x + 1][y].b * side;
    sumB += next[x - 1][y].b * side;
    sumB += next[x][y + 1].b * side;
    sumB += next[x][y - 1].b * side;
    sumB += next[x + 1][y + 1].b * diagonal;
    sumB += next[x - 1][y - 1].b * diagonal;
    sumB += next[x - 1][y + 1].b * diagonal;
    sumB += next[x + 1][y - 1].b * diagonal;

    sumC += next[x][y].c * center;
    sumC += next[x + 1][y].c * side;
    sumC += next[x - 1][y].c * side;
    sumC += next[x][y + 1].c * side;
    sumC += next[x][y - 1].c * side;
    sumC += next[x + 1][y + 1].c * diagonal;
    sumC += next[x - 1][y - 1].c * diagonal;
    sumC += next[x - 1][y + 1].c * diagonal;
    sumC += next[x + 1][y - 1].c * diagonal;

    next[x][y].a = sumA / 9;
    next[x][y].b = sumB / 9;
    next[x][y].c = sumC / 9;
}

function show() {
    loadPixels();
    for (let x = 0; x < width; x++) {
        for (let y = 0; y < height; y++) {
            let pix = (x + y * width) * 4;
            let a = next[x][y].a;
            let b = next[x][y].b;
            let c = next[x][y].c;

            pixels[pix + 0] = a * 255;
            pixels[pix + 1] = b * 255;
            pixels[pix + 2] = c * 255;
            pixels[pix + 3] = 255;
        }
    }
    updatePixels();
}
function swap() {
    let temp = grid;
    grid = next;
    delete grid;
    next = temp;
}

function sliderSetup(min, max, step) {
    sliderAlpha = createSlider(min, max, aalpha, step);
    sliderAlpha.position(width + 20, 20);
    sliderBeta = createSlider(min, max, bbeta, step);
    sliderBeta.position(width + 20, 50);
    sliderGamma = createSlider(min, max, ggamma, step);
    sliderGamma.position(width + 20, 80);
}
