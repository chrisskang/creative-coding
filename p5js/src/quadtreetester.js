var tree;

function setup() {
    createCanvas(400, 400);

    let boundary = new Rectangle(200, 200, 200, 200);
    tree = new QuadTree(boundary, 4);

    for (let i = 0; i < 200; i++) {
        let p = new Point(random(width), random(height));
        tree.insert(p);
    }
}

function draw() {
    // if (mouseIsPressed) {
    //     let m = new Point(mouseX + random(-5, 5), mouseY + random(-5, 5));
    //     tree.insert(m);
    // }

    background(0);
    tree.show();

    stroke(0, 255, 0);
    rectMode(CENTER);
    let range = new Rectangle(mouseX, mouseY, 30, 30);

    if (mouseX < width && mouseY < height) {
        rect(range.x, range.y, range.w * 2, range.h * 2);

        let points = tree.query(range);
        for (let p of points) {
            strokeWeight(4);
            point(p.x, p.y);
        }
    }
}
