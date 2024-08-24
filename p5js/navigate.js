sketchList = [
    "boid.js",
    "chaos.js",
    "collision.js",
    "donut.js",
    "flocking.js",
    "pixel.js",
    "quadtreetester.js",
    "ReactionDiffusion.js",
];

for (sketch of sketchList) {
    let btn = document.createElement("BUTTON");
    btn.innerHTML = sketch.split(".")[0];
    document.getElementById("buttonArray").appendChild(btn);
}

//document.getElementById("buttonArray").onclick = console.log("hi");
