class Matrix {
    constructor(rows, cols, vals) {
        this.rows = rows;
        this.cols = cols;
        this.matrix = [];
        this.name = "Matrix";

        if (vals != null) {
            for (var i = 0; i < this.rows; i++) {
                this.matrix[i] = [];
                for (var j = 0; j < this.cols; j++) {
                    this.matrix[i][j] = vals[i][j];
                }
            }
        } else {
            for (var i = 0; i < this.rows; i++) {
                this.matrix[i] = [];
                for (var j = 0; j < this.cols; j++) {
                    this.matrix[i][j] = 0;
                }
            }
        }
    }

    scale(n) {
        for (var i = 0; i < this.rows; i++) {
            for (var j = 0; j < this.cols; j++) {
                this.matrix[i][j] *= n;
            }
        }
    }

    add(n) {
        for (var i = 0; i < this.rows; i++) {
            for (var j = 0; j < this.cols; j++) {
                this.matrix[i][j] *= n;
            }
        }
    }
}

class P4Vector {
    constructor(x, y, z, w) {
        this.x = x || 0;
        this.y = y || 0;
        this.z = z || 0;
        this.w = w || 0;
    }

    mult(f) {
        this.x *= f;
        this.y *= f;
        this.z *= f;
        this.w *= f;
    }
}

function vecToMatrix(vector) {
    m = new Matrix(3, 1);
    m.matrix[0][0] = vector.x;
    m.matrix[1][0] = vector.y;
    m.matrix[2][0] = vector.z;
    return m;
}

function vec4ToMatrix(vector) {
    m = new Matrix(4, 1);
    m.matrix[0][0] = vector.x;
    m.matrix[1][0] = vector.y;
    m.matrix[2][0] = vector.z;
    m.matrix[3][0] = vector.w;
    return m;
}

function MatrixToVec(matrix) {
    v = createVector(matrix.matrix[0][0], matrix.matrix[1][0], 0);

    if (matrix.matrix.length > 2) {
        v.w = matrix.matrix[2][0];
    }
    return v;
}

function MatrixToVec4(matrix) {
    v = new P4Vector(
        matrix.matrix[0][0],
        matrix.matrix[1][0],
        matrix.matrix[2][0],
        0
    );

    if (matrix.matrix.length > 3) {
        v.w = matrix.matrix[3][0];
    }
    return v;
}

function multiplyVec(a, vec) {
    let m = vecToMatrix(vec);
    let r = multiply(a, m);
    return MatrixToVec(r);
}

function multiplyVec4(a, vec) {
    let m = vec4ToMatrix(vec);
    let r = multiply(a, m);
    return MatrixToVec4(r);
}

function multiply(A, B) {
    if (B instanceof p5.Vector) {
        return multiplyVec(A, B);
    }

    if (B instanceof P4Vector) {
        return multiplyVec4(A, B);
    }

    let colsA = A.matrix[0].length;
    let rowsA = A.matrix.length;
    let colsB = B.matrix[0].length;
    let rowsB = B.matrix.length;

    if (colsA != rowsB) {
        console.log("columns of A must match rows of B");
        return;
    }

    var result = new Matrix(rowsA, colsB);

    for (let i = 0; i < rowsA; i++) {
        for (let j = 0; j < colsB; j++) {
            let sum = 0;

            for (let k = 0; k < colsA; k++) {
                sum += A.matrix[i][k] * B.matrix[k][j];
            }

            result.matrix[i][j] = sum;
        }
    }

    return result;
}

function printMatrix(matrix) {
    console.log(matrix.name + " " + matrix.rows + " x " + matrix.cols);
    console.log("--------------");

    for (let i = 0; i < matrix.rows; i++) {
        let string;
        for (let j = 0; j < matrix.cols; j++) {
            if (j == 0) {
                string = matrix.matrix[i][j] + " ";
            } else {
                string += matrix.matrix[i][j] + " ";
            }
        }
        console.log(string);
    }
}
