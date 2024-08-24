class videoTool {
    constructor(seconds, framerate) {
        this.seconds = seconds;
        this.framerate = framerate;
        this.target = 0;
        this.toggle = false;
        this.button;
        this.capturer = new CCapture({
            format: "webm",
            framerate: this.framerate,
            verbose: true,
            display: true,
            quality: 100,
            workersPath: "./export",
            timeLimit: 60,
            autoSaveTime: 60,
        });
    }

    capture() {
        if (this.toggle == true) {
            this.capturer.start();
            var curFrame = frameCount;
            this.target = curFrame + this.seconds * this.framerate;
            this.toggle = false;
        }

        if (frameCount == this.target) {
            console.log("done!");

            this.capturer.stop();
            this.capturer.save();
            noLoop();
        }

        this.capturer.capture(canvas);
    }

    makeButton() {
        this.button = createButton("start recording");

        return this.button;
    }

    ToggleOn() {
        this.toggle = true;
    }
}
