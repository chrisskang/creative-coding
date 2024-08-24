class SlimeSystem {
    constructor(antCount, targetCount) {
        this.slimes = [];
        this.antCount = antCount;
        this.allState = 0;
        this.targets = [];
        this.targetCount = targetCount;
        this.generation = 1;
    }

    Make() {
        for (let i = 0; i < this.antCount; i++) {
            // let x = ((random() * width) / 2) * random(0, PI);
            // let y = height / 2;

            let x = 300 * cos(noise(i) * TWO_PI) + width / 2;
            let y = 300 * sin(noise(i) * TWO_PI) + height / 2;

            // x = random(width);
            // y = random(height);
            this.slimes.push(new Slime(x, y));
        }
        for (let i = 0; i < this.targetCount; i++) {
            this.targets.push(new Target());
        }
    }

    Add(count) {
        this.generation += 1;
        for (let i = 0; i < count; i++) {
            this.slimes.push(new Slime(this.generation));
        }
    }

    DrawOnGrid(grid) {
        for (let slime of this.slimes) {
            let xIndex = int(slime.position.x);
            let yIndex = int(slime.position.y);

            if (xIndex >= width || xIndex < 0) {
                xIndex = 0;
            }
            if (yIndex >= height || yIndex < 0) {
                yIndex = 0;
            }

            grid[xIndex][yIndex].white += 1;
        }
    }

    Update() {
        for (let slime of this.slimes) {
            slime.Update();
        }
    }
}

class Slime extends SlimeSystem {
    constructor(x, y) {
        super();
        this.position = createVector(x, y);
        this.velocity = createVector(
            (random(4, 8) * (width / 2 - x)) / 1000,
            (random(4, 8) * (height / 2 - y)) / 1000
        );
        //this.velocity = createVector(random(-3, 3), random(-3, 3));
        //this.velocity.normalize();

        this.state = true;
    }

    computeEdge() {
        if (this.position.x < 0) {
            this.position.x = width;
        } else if (this.position.y < 0) {
            this.position.y = height;
        } else if (this.position.x > width) {
            this.position.x = 0;
        } else if (this.position.y > height) {
            this.position.y = 0;
        }
    }

    sense(angle, d) {
        let rotAngle = this.velocity.copy();

        rotAngle.setMag(d);
        rotAngle.rotate(angle);
        let sum = 0;

        let posX = this.position.x + rotAngle.x;
        let posY = this.position.y + rotAngle.y;

        let senseSize = 5;

        for (let i = -senseSize; i < senseSize; i++) {
            for (let j = -senseSize; j < senseSize; j++) {
                if (
                    posX + i >= 0 &&
                    posX + i < width &&
                    posY + j >= 0 &&
                    posY + j < height
                ) {
                    sum += grid[floor(posX + i)][floor(posY + j)].white;
                }
            }
        }

        return sum;
    }

    steerWithSense() {
        let turnSpeed = 0.2;

        let angle = QUARTER_PI;
        let d = 5;

        let weightForward = this.sense(angle, 0);
        let weightRight = this.sense(angle, d);
        let weightLeft = this.sense(-angle, d);

        let strength = 2;

        if (weightForward > weightLeft && weightForward > weightRight) {
            this.velocity.rotate(0);
        } else if (weightLeft > weightRight) {
            this.velocity.rotate(-angle * turnSpeed * strength);
        } else if (weightRight > weightLeft) {
            this.velocity.rotate(angle * turnSpeed * strength);
        }
    }

    UpdatePosition() {
        this.position.add(this.velocity);
    }

    Update() {
        this.computeEdge();
        this.steerWithSense();
        this.UpdatePosition();
    }
}

class Target {
    constructor() {
        this.position = createVector(random(width), random(height));
    }
}

function drawArrow(base, vec, myColor) {
    let scale = 10;
    push();
    stroke(myColor);
    strokeWeight(1);
    fill(myColor);
    translate(base.x, base.y);
    line(0, 0, vec.x * scale, vec.y * scale);
    rotate(vec.heading());
    let arrowSize = 7;
    translate(vec.mag() * scale - arrowSize, 0);
    triangle(0, arrowSize / 2, 0, -arrowSize / 2, arrowSize, 0);
    pop();
}
