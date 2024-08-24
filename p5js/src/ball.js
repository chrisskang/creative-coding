var initpos = 5;
var balls = [];
var initSpeed = 4;
var toggle = true;
var vt = new videoTool(5, 60);
vt.toggle = true;
function setup() {
    createCanvas(1000, 1000);
    for (let i = 0; i < 30; i++) {
        let x = random(width);
        let y = random(height);

        let velocity = createVector(initSpeed, initSpeed);
        velocity.rotate(random(0, 360));
        let color = [0, 255, 0];
        balls[i] = new Ball(x, y, velocity, color, 10);
    }

    OnButton = createButton("record");
    OnButton.mousePressed(() => (vt.toggle = true));
}

function draw() {
    background(255);

    for (ball of balls) {
        ball.update();

        ball.draw();
    }

    vt.capture();
}
