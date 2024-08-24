function setup() {
    createCanvas(1080, 1080);
    noStroke();
}

function draw() {
    loadPixels();
    pixelDensity(1);

    let yoff = 0;
    for (var x = 0; x < width; x += 1) {
        let xoff = 0;
        for (var y = 0; y < height; y += 1) {
            var color = 255 * noise(xoff, yoff);
            let index = (x + y * width) * 4;
            pixels[index + 0] = color;
            pixels[index + 1] = color;
            pixels[index + 2] = color;
            pixels[index + 3] = 255;
            xoff += 0.01;
        }
        yoff += 0.01;
    }
    updatePixels();
}
