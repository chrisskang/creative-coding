const points = [];

let alignSlider, cohesionSlider, separationSlider;
let OnButton;
let toggle = false;
let stopButton;

function setup() {
    createCanvas(800, 800);
    alignSlider = createSlider(0, 5, 1, 0.1);
    cohesionSlider = createSlider(0, 5, 1, 0.1);
    separationSlider = createSlider(0, 5, 1, 0.1);
    for (let i = 0; i < 200; i++) {
        points.push(new Boid());
    }
    OnButton = createButton("On");
    OnButton.mousePressed(() => (toggle = true));
    OnButton = createButton("off");
    OnButton.mousePressed(() => (toggle = false));
}

function draw() {
    if (toggle) {
        background(51);
        for (let boid of points) {
            boid.edges();
            boid.flock(points);
            boid.update();
            boid.show();
        }
    }
}
