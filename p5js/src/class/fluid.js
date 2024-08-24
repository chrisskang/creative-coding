let N = 10;
let iter = 10;
let scl = 10;

class Fluid {
    constructor(dt, diffusion, viscosity) {
        this.dt = dt;
        this.diffusion = diffusion;
        this.viscosity = viscosity;

        this.s = new Array(N * N).fill(0);
        this.density = new Array(N * N).fill(0);

        this.Vx = new Array(N * N).fill(0);
        this.Vy = new Array(N * N).fill(0);

        this.VxPrev = new Array(N * N).fill(0);
        this.VyPrev = new Array(N * N).fill(0);
    }

    AddDensity(x, y, amount) {
        let index = IX(x, y);
        this.density[index] += amount;
    }
    AddVelocity(x, y, amountX, amountY) {
        let index = IX(x, y);
        this.Vx[index] += amountX;
        this.Vy[index] += amountY;
    }
    step() {
        let visc = this.viscosity;
        let diff = this.diffusion;
        let dt = this.dt;
        let Vx = this.Vx;
        let Vy = this.Vy;
        let VxPrev = this.VxPrev;
        let VyPrev = this.VyPrev;
        let s = this.s;
        let density = this.density;
        console.log(this);
        Diffuse(1, VxPrev, Vx, visc, dt);
        Diffuse(2, VyPrev, Vy, visc, dt);

        Project(VxPrev, VyPrev, Vx, Vy);

        Advect(1, Vx, VxPrev, VxPrev, VyPrev, dt);
        Advect(2, Vy, VyPrev, VxPrev, VyPrev, dt);

        Project(Vx, Vy, VxPrev, VyPrev);
        Diffuse(0, s, density, diff, dt);
        Advect(0, density, s, Vx, Vy, dt);
    }

    Render() {
        for (let i = 0; i < N; i++) {
            for (let j = 0; j < N; j++) {
                let x = i * scl;
                let y = j * scl;
                let d = this.density[IX(i, j)];
                fill(d);
                noStroke();
                square(x, y, scl);
            }
        }
    }
}

function IX(x, y) {
    return x + y * N;
}

function Diffuse(b, x, x0, diffusion, dt) {
    let a = dt * diffusion * (N - 2) * (N - 2);
    Lin_Solve(b, x, x0, a, 1 + 6 * a);
}

function Lin_Solve(b, x, x0, a, c) {
    let cReciprocal = 1 / c;
    for (let t = 0; t < iter; t++) {
        for (let j = 0; j < N - 1; j++) {
            for (let i = 0; i < N - 1; i++) {
                x[IX(i, j)] =
                    (x0[IX(i, j)] +
                        a *
                            (x[IX(i + 1, j)] +
                                x[IX(i - 1, j)] +
                                x[IX(i, j + 1)] +
                                x[IX(i, j - 1)])) *
                    cReciprocal;
            }
        }
        setBound(b, x);
    }
}

function Project(velocityX, velocityY, p, div) {
    for (let j = 1; j < N - 1; j++) {
        for (let i = 1; i < N - 1; i++) {
            div[IX(i, j)] =
                (-0.5 *
                    (velocityX[IX(i + 1, j)] -
                        velocityX[IX(i - 1, j)] +
                        velocityY[IX(i, j + 1)] -
                        velocityY[IX(i, j - 1)])) /
                N;
            p[IX(i, j)] = 0;
        }
    }

    setBound(0, div);
    setBound(0, p);
    Lin_Solve(0, p, div, 1, 6);

    for (let j = 1; j < N - 1; j++) {
        for (let i = 1; i < N - 1; i++) {
            velocityX[IX(i, j)] -=
                0.5 * (p[IX(i + 1, j)] - p[IX(i - 1, j)]) * N;
            velocityY[IX(i, j)] -=
                0.5 * (p[IX(i, j + 1)] - p[IX(i, j - 1)]) * N;
        }
    }

    setBound(1, velocityX);
    setBound(2, velocityY);
}

function Advect(b, d, d0, velocityX, velocityY, dt) {
    let dtx = dt * (N - 2);
    let dty = dt * (N - 2);

    for (let j = 1; j < N - 1; j++) {
        for (let i = 1; i < N - 1; i++) {
            tmp1 = dtx * velocityX[IX(i, j)];
            tmp2 = dty * velocityY[IX(i, j)];

            x = i - tmp1;
            y = j - tmp2;

            if (x < 0.5) x = 0.5;
            if (x > N + 0.5) x = N + 0.5;
            let i0 = Math.floor(x);
            let i1 = i0 + 1;
            if (y < 0.5) y = 0.5;
            if (y > N + 0.5) y = N + 0.5;
            let j0 = Math.floor(y);
            let j1 = j0 + 1;

            let s1 = x - i0;
            let s0 = 1 - s1;
            let t1 = y - j0;
            let t0 = 1 - t1;

            let i0i = parseInt(i0);
            let i1i = parseInt(i1);
            let j0i = parseInt(j0);
            let j1i = parseInt(j1);

            d[IX(i, j)] =
                s0 * (t0 * d0[IX(i0i, j0i)] + t1 * d0[IX(i0i, j1i)]) +
                s1 * (t0 * d0[IX(i1i, j0i)] + t1 * d0[IX(i1i, j1i)]);
        }
    }

    setBound(b, d);
}

function setBound(b, x) {
    for (let i = 1; i < N - 1; i++) {
        x[IX(i, 0)] = b == 2 ? -x[IX(i, 1)] : x[IX(i, 1)];
        x[IX(i, N - 1)] = b == 2 ? -x[IX(i, N - 2)] : x[IX(i, N - 2)];
    }

    for (let j = 1; j < N - 1; j++) {
        x[IX(0, j)] = b == 1 ? -x[IX(1, j)] : x[IX(1, j)];
        x[IX(N - 1, j)] = b == 1 ? -x[IX(N - 2, j)] : x[IX(N - 2, j)];
    }

    x[IX(0, 0)] = 0.5 * (x[IX(1, 0)] + x[IX(0, 1)]);
    x[IX(0, N - 1)] = 0.5 * (x[IX(1, N - 1)] + x[IX(0, N - 2)]);

    x[IX(N - 1, 0, 0)] = 0.5 * (x[IX(N - 2, 0)] + x[IX(N - 1, 1)]);

    x[IX(N - 1, N - 1, 0)] = 0.5 * (x[IX(N - 2, N - 1)] + x[IX(N - 1, N - 2)]);
}
