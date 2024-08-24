
PShader shdr;

void setup(){
    size(400, 400, P2D);
    shdr = loadShader("frag.glsl");
    noStroke();
}

void draw(){

  clear();
  rect(0,0,width,height);
}