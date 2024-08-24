let angle = 0;

function setup() {
    createCanvas(1000, 1000, WEBGL);
}

function draw() {
    background(175);

    //strokeWeight(1);
    noStroke();
    //rectMode(CENTER);
    //fill(0, 0, 255);

    //translate(0, 0, mouseX - width / 2);
    //normalMaterial();

    //ambientLight(255);
    // pointLight(0, 0, 255, -200, 0, 200);
    // pointLight(255, 0, 0, 200, 0, 200);
    let dx = mouseX - width / 2;
    let dy = mouseY - height / 2;
    let v = createVector(-dx, -dy, 0);
    v.normalize();

    directionalLight(255, 255, 0, v);

    ambientLight(0, 0, 255);
    rotateX(angle);
    rotateY(angle);
    rotateZ(angle);
    //rect(0, 0, 150, 100);
    ambientMaterial(100);
    //specularMaterial(255);
    //sphere(100);
    torus(100, 50);
    angle += 0.01;
}
