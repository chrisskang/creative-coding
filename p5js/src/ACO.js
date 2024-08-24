let OnButton;
let toggle = true;
let pause = false;
var pixels = [];

let antCount = 100;
let targetCount = 100;
let ants = [];
let targets = [];
let circleSize = 10;
let path = {};

var grid = [];
var next = [];
//var vt = new videoTool(10, 30);

function setup() {
    var canvas = createCanvas(1080, 1080);
    pixelDensity(1);
    // button = vt.makeButton();
    // button.mousePressed(() => (vt.toggle = true));
    //vt.toggle = true;
    noStroke();
    OnButton = createButton("On");
    OnButton.mousePressed(() => (toggle = true));
    OnButton = createButton("off");
    OnButton.mousePressed(() => (toggle = false));

    OnButton = createButton("pause");
    OnButton.mousePressed(() => (pause = true));

    // create ant
    antSystem = new Antsystem(antCount, targetCount);
    antSystem.Make();

    OnButton = createButton("make");
    OnButton.mousePressed(() => antSystem.Add(500));
}

function draw() {
    //background(0);
    if (toggle) {
        antSystem.Draw();
        antSystem.Update();

        //logFR(width / 50);
        //vt.capture();
    }
    if (pause) {
        noLoop();
    }
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
