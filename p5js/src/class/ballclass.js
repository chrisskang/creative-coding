class Ball {
    constructor(x, y, velocity, color, size) {
        this.pos = createVector(x, y);
        this.velocity = velocity;
        this.color = color;
        this.size = size;
    }

    update() {
        this.computeEdge();
        this.pos.add(this.velocity);
    }

    draw() {
        stroke(this.color);
        strokeWeight(this.size);
        point(this.pos.x, this.pos.y);
    }

    computeEdge() {
        let revX = createVector(-1, 1);
        let revY = createVector(1, -1);
        if (width - this.pos.x < this.size / 2 || this.pos.x < this.size / 2) {
            this.velocity.mult(revX);
            this.color = [random(0, 255), random(0, 255), random(0, 255)];
        } else if (
            height - this.pos.y < this.size / 2 ||
            this.pos.y < this.size / 2
        ) {
            this.velocity.mult(revY);
            this.color = [random(0, 255), random(0, 255), random(0, 255)];
        }
    }
}
