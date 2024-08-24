class Antsystem {
    constructor(antCount, targetCount) {
        this.ants = [];
        this.antCount = antCount;
        this.allState = 0;
        this.targets = [];
        this.targetCount = targetCount;
        this.generation = 1;
    }

    Make() {
        for (let i = 0; i < this.antCount; i++) {
            this.ants.push(new Ant(this.generation));
        }
        for (let i = 0; i < this.targetCount; i++) {
            this.targets.push(new Target());
        }
    }

    NotEmpty() {
        return this.ants.length != 0;
    }

    Add(count) {
        this.generation += 1;
        for (let i = 0; i < count; i++) {
            this.ants.push(new Ant(this.generation));
        }
    }

    Draw() {
        background(0);
        for (let t of this.targets) {
            drawCircle(t.position, circleSize, [255, 0, 0]);
        }

        //this.DrawPath();

        if (this.NotEmpty()) {
            for (let ant of this.ants) {
                drawCircle(ant.position, circleSize, [255]);
                if (ant.target != null) {
                    drawCircle(
                        ant.target.position,
                        circleSize * 1.5,
                        [0, 120, 255]
                    );
                }
            }
        }
    }

    DrawPath() {
        for (let key in path) {
            let max = Object.values(path).sort((a, b) => a - b)[
                Object.values(path).length - 1
            ];
            let mappedOpacity = map(path[key], 0, max == 0 ? 1 : max, 200, 255);

            let mappedWidth = map(path[key], 0, max == 0 ? 1 : max, 0.1, 4);
            //console.log(path);

            stroke([255, 255, 255, mappedOpacity]);

            strokeWeight(mappedWidth);
            line(
                this.targets[key.split(",")[0]].position.x,
                this.targets[key.split(",")[0]].position.y,
                this.targets[key.split(",")[1]].position.x,
                this.targets[key.split(",")[1]].position.y
            );
            noStroke();
        }
    }

    Update() {
        if (this.NotEmpty()) {
            for (let ant of this.ants) {
                if (ant.checkState()) {
                    if (ant.isCloseToTarget(10)) {
                        ant.SelectNextTarget(this.targets);
                    }

                    ant.UpdatePosition();
                } else {
                    this.ants.splice(this.ants.indexOf(ant), 1);
                }
            }
        }
    }
}

class Ant extends Antsystem {
    constructor(gen) {
        super();

        this.position = createVector(random(width), random(height));
        this.velocity = createVector(random(0.0, 1), random(0.0, 1));
        this.minDist;
        this.maxDist;
        this.allDist;
        this.generation = gen;

        this.distToTarget;
        this.desirability = [];
        this.target;

        this.targetHistory = [];
        this.state = true;
    }
    checkState() {
        return this.state == true;
    }

    SelectNextTarget(t) {
        if (this.target != null) {
            //if target exists, add to target history if not visited
            this.targetHistory.includes(this.target)
                ? console.log("Been there")
                : this.targetHistory.push(this.target);
        }

        let prevTarget = this.target;

        let targetCopy = t.filter((item) => !this.targetHistory.includes(item)); //search in target - targetHistory

        if (this.generation == 1) {
            this.ComputeDesirability(targetCopy);
            this.PickWeightedProbability(targetCopy);
            this.UpdateVector();
        } else if (this.generation == 2) {
            this.ComputeDesirabilityV2(targetCopy, t);
            this.PickWeightedProbability(targetCopy, t);
            this.UpdateVector();
        }

        if (prevTarget != null) {
            this.appendPath(prevTarget, t);
        }

        this.checkEnd(targetCopy);
    }

    checkEnd(targetCopy) {
        if (targetCopy.length == 0) {
            this.state = false;
        }
    }

    appendPath(pTarget, ts) {
        let pair = [ts.indexOf(pTarget), ts.indexOf(this.target)];

        if (Object.keys(path).length == 0) {
            path[pair] = 1;
        } else {
            for (let key in path) {
                if (key == pair || key == [pair[1], pair[0]]) {
                    path[key] += 1;

                    return;
                }
            }
            path[pair] = 1;
        }
    }

    isCloseToTarget(threshold) {
        return this.target == null
            ? true
            : dist(
                  this.position.x,
                  this.position.y,
                  this.target.position.x,
                  this.target.position.y
              ) < threshold;
    }

    ComputeDesirability(ts) {
        this.desirability = [];
        for (let t of ts) {
            let desirability = Math.pow(
                1 /
                    dist(
                        this.position.x,
                        this.position.y,
                        t.position.x,
                        t.position.y
                    ),
                2
            );
            this.desirability.push(desirability);
        }
    }

    ComputeDesirabilityV2(ts, tt) {
        this.desirability = [];

        for (let t of ts) {
            let pheromoneStrength = this.CalcPheromone(t, tt);

            let desirability =
                Math.pow(
                    1 /
                        dist(
                            this.position.x,
                            this.position.y,
                            t.position.x,
                            t.position.y
                        ),
                    2
                ) * Math.pow(pheromoneStrength, 2);

            this.desirability.push(desirability);
        }
    }

    CalcPheromone(ttarget, fullTarget) {
        if (this.target != null) {
            //if target Exists

            let index1 = fullTarget.indexOf(this.target);
            let index2 = fullTarget.indexOf(ttarget);

            let mykey = [index1, index2];
            let mykey2 = [index2, index1];

            for (let key in path) {
                if (key == mykey || key == mykey2) {
                    return path[key];
                } else {
                    return 1;
                }
            }
        } else {
            return 1;
        }
    }

    PickWeightedProbability(ts) {
        let cumWeights = [];

        for (let i = 0; i < this.desirability.length; i++) {
            cumWeights[i] = this.desirability[i] + (cumWeights[i - 1] || 0);
        }

        let num = cumWeights[cumWeights.length - 1] * Math.random();

        for (let j = 0; j < ts.length; j++) {
            if (cumWeights[j] >= num) {
                this.target = ts[j];
                this.targetIndex = j;
                //console.log("found new target at", j);

                return;
            }
        }
    }

    ComputeMaxMin() {
        let listCopy = new Float64Array(this.desirability);

        listCopy.sort();
        this.minDist = listCopy[0];
        this.maxDist = listCopy[listCopy.length - 1];
    }

    drawPath() {
        let temp;
        for (let p of this.beenthere) {
            if (!(temp == null)) {
                stroke(255, 255, 255, 100);
                strokeWeight(5);
                line(temp.x, temp.y, p.x, p.y);
                noStroke();
            }

            temp = p;
        }
    }

    drawProbabilityLine(targets) {
        for (let target of targets) {
            let d = Math.pow(
                1 / dist(this.position.x, this.position.y, target.x, target.y),
                2
            );

            let mapped = map(d, this.minDist, this.maxDist, 0.01, 255);
            strokeWeight(3);
            stroke(255, 255, 255, mapped);
            line(this.position.x, this.position.y, target.x, target.y);
            noStroke();
        }
    }

    UpdateVector() {
        let v = createVector(
            this.target.position.x - this.position.x,
            this.target.position.y - this.position.y
        );

        // if (this.generation > 1) {
        //     v.div(2);
        // } else {
        //     v.div(2);
        // }
        v.normalize();
        v.mult(1);
        this.velocity = v;
    }

    UpdatePosition() {
        if (this.state == true) {
            this.position.add(this.velocity);
        }
    }
}

class Target {
    constructor() {
        this.position = createVector(random(width), random(height));
    }
}

function drawCircle(pos, rad, color) {
    fill(color);

    ellipse(pos.x, pos.y, rad, rad);
}
