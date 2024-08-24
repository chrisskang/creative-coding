let particles = [];

function setup() {
    createCanvas(600, 400);

    for (let i = 0; i < 400; i++) {
        particles[i] = new Particle(random(width), random(height));
    }
}

function draw() {
    background(0);

    let boundary = new Rectangle(width / 2, height / 2, width, height);
    let tree = new QuadTree(boundary, 4);

    for (let p of particles) {
        let point = new Point(p.x, p.y, p);
        tree.insert(point);

        p.move();
        p.render();
        p.setHighlight(false);
    }

    for (let p of particles) {
        let range = new Circle(p.x, p.y, p.r * 2);
        let points = tree.query(range);

        for (let point of points) {
            let other = point.userData;
            if (p !== other && p.intersects(other)) {
                p.setHighlight(true);
            }
        }
    }
}
