class Hands {
    constructor(counts) {
        this.counts = counts;
        this.hands = [];

        for (let i = 0; i < this.counts; i++) {
            let randomPos = createVector(
                random(size / 2, width - size / 2),
                random(size / 2, height - size / 2)
            );
            let randomVec = createVector(
                random(-width, width),
                random(-height, height)
            );
            randomVec.normalize();
            randomVec.mult(3);
            let randomState = random(states);
            this.hands.push(new Hand(randomPos, randomVec, randomState));
        }
    }

    show() {
        for (let hand of this.hands) {
            hand.show();
        }
    }

    update() {
        for (let hand of this.hands) {
            hand.update();
        }
    }

    collision() {
        for (let hand of this.hands) {
            hand.computeCollision(this.hands);
        }
    }
}

class Hand {
    constructor(pos, vec, state) {
        this.pos = pos;
        this.vec = vec;
        this.state = state;
        this.prevMovedWith = null;
    }
    show() {
        push();
        noStroke();
        textSize(size);
        if (this.state == 1) {
            text("🪨", this.pos.x - size / 1.5, this.pos.y + size / 3);
        } else if (this.state == 2) {
            text("✂️", this.pos.x - size / 1.5, this.pos.y + size / 3);
        } else if (this.state == 3) {
            text("🧻", this.pos.x - size / 1.5, this.pos.y + size / 3);
        }

        //✋✌️✊
        //ellipse(this.pos.x, this.pos.y, 10, 10);

        pop();
        // strokeWeight(1);
        // if (this.prevMovedWith != null) {
        //     line(
        //         this.pos.x,
        //         this.pos.y,
        //         this.prevMovedWith.pos.x,
        //         this.prevMovedWith.pos.y
        //     );
        // }
    }
    update() {
        this.computeEdge();
        this.pos.add(this.vec);
    }
    computeEdge() {
        if (this.pos.x > width - size / 2) {
            this.vec.mult(-1, 1);
        } else if (this.pos.x < size / 2) {
            this.vec.mult(-1, 1);
        }
        if (this.pos.y > height - size / 2) {
            this.vec.mult(1, -1);
        } else if (this.pos.y < size / 2) {
            this.vec.mult(1, -1);
        }
    }
    reverseVec(vector) {
        return abs(vector.x) > abs(vector.y)
            ? createVector(1, 0)
            : createVector(0, 1);
    }
    computeCollision(handss) {
        for (let hand of handss) {
            if (hand == this) {
                continue;
            } else {
                if (
                    dist(this.pos.x, this.pos.y, hand.pos.x, hand.pos.y) <
                    size / 1
                ) {
                    if (
                        this.prevMovedWith == null ||
                        this.prevMovedWith != hand
                    ) {
                        this.vec.reflect(this.reverseVec(this.vec));
                        this.prevMovedWith = hand;
                    } else if (this.prevMovedWith == hand) {
                        continue;
                    }
                    if (this.state == 1) {
                        //rock
                        if (hand.state == 1) {
                            break;
                        } else if (hand.state == 2) {
                            hand.state = 1;
                        } else if (hand.state == 3) {
                            this.state = 3;
                        }
                    } else if (this.state == 2) {
                        //scissors
                        if (hand.state == 1) {
                            this.state = 1;
                        } else if (hand.state == 2) {
                            break;
                        } else if (hand.state == 3) {
                            hand.state = 2;
                        }
                    } else if (this.state == 3) {
                        //paper
                        if (hand.state == 1) {
                            hand.state = 3;
                        } else if (hand.state == 2) {
                            this.state = 2;
                        } else if (hand.state == 3) {
                            break;
                        }
                    }
                }
            }
        }
    }
}

var count = 160;
var states = [1, 2, 3];
var size = 50;
var vt = new videoTool(30, 60);
var sumA = 0;
var sumB = 0;
var sumC = 0;

function setup() {
    var canvas = createCanvas(2000, 2000);

    button = vt.makeButton();
    vt.toggle = true;
    button.mousePressed(() => (vt.toggle = true));

    hands = new Hands(count);

    for (let hand of hands.hands) {
        if (hand.state == 1) {
            sumA += 1;
        } else if (hand.state == 2) {
            sumB += 1;
        } else if (hand.state == 3) {
            sumC += 1;
        }
    }
    console.log(sumA, sumB, sumC);
}

function draw() {
    background(255);
    //drawPixel();
    hands.collision();
    hands.update();

    hands.show();

    vt.capture();
}

function drawPixel() {
    loadPixels();
    //------------
    for (let x = 0; x < width; x++) {
        for (let y = 0; y < height; y++) {
            let index = (x + y * width) * 4;
            let sumR = 0;
            let sumG = 0;
            let sumB = 0;

            for (hand of hands.hands) {
                let d = dist(x, y, hand.pos.x, hand.pos.y);
                if (hand.state == 1) {
                    sumR += (100 * 10) / d;
                    sumG += (100 * 10) / d;
                    sumB += (100 * 10) / d;
                } else if (hand.state == 2) {
                    sumR += (220 * 10) / d;
                    sumG += (20 * 10) / d;
                    sumB += (60 * 10) / d;
                } else if (hand.state == 3) {
                    sumR += (255 * 10) / d;
                    sumG += (255 * 10) / d;
                    sumB += (255 * 10) / d;
                }
            }
            sumR = constrain(sumR, 0, 255);
            sumG = constrain(sumG, 0, 255);
            sumB = constrain(sumB, 0, 255);

            pixels[index] = sumR;
            pixels[index + 1] = sumG;
            pixels[index + 2] = sumB;
            pixels[index + 3] = 255;
        }
    }
    //------------
    updatePixels();
}
