var fluid;
var t;
function setup() {
    createCanvas(100, 100);
    frameRate(22);
    fluid = new Fluid(0.2, 0, 0.001);

    OnButton = createButton("On");
    OnButton.mousePressed(() => (t = true));
    OnButton = createButton("off");
    OnButton.mousePressed(() => (t = false));
}

function draw() {
    background(0);
    if (t) {
        fluid.AddDensity(50, 50, 100);
        fluid.step();
        fluid.Render();
    } else {
        noLoop;
    }
}
