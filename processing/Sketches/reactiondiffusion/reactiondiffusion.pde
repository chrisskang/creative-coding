
int cols;
int rows;
float[][][] current;
float[][][] next;

float dA = 1;
float dB = 0.5;
float feed = 0.055;
float k = 0.062;


void setup(){
  size(500,500);
  cols = width;
  rows = height;
  current = new float[cols][rows][2];
  next = new float[cols][rows][2];
  
    for (int i = 0; i < cols; i++){
    for (int j = 0; j < rows; j++){

      current[i][j][0] = 1.0;
      current[i][j][1] = 0.0;
      next[i][j][0] = 1.0;
      next[i][j][1] = 0.0;
      
      }
    }

  for(int x = width/2 - 10; x < width/2 + 10; x++){
    for(int y = height/2 - 10; y < height/2 + 10; y++){
      current[x][y][0] = 1.0;
      current[x][y][1] = 1.0;
      next[x][y][0] = 1.0;
      next[x][y][1] = 1.0;
    }
  }
    
  }

void draw(){
 //<>//
  println(frameRate);
  calc();
  
  
  loadPixels();
    for (int i = 0; i < cols; i++){
    for (int j = 0; j < rows; j++){
      float a = current[i][j][0];
      float b = current[i][j][1];
      
      int index = i + j * cols;
      float c = floor((a - b)*255);
      c = constrain(c,0,255);
      pixels[index] = color(c);
    }
  }
   
  updatePixels();
  
  
  
}

float laplace(int x, int y, int i){

  float sum = 0.0;
  
  sum += current[x][y][i] * -1.0;
  sum += current[x - 1][y][i] * 0.2;
  sum += current[x + 1][y][i] * 0.2;
  sum += current[x][y + 1][i] * 0.2;
  sum += current[x][y - 1][i] * 0.2;
  sum += current[x - 1][y - 1][i] * 0.05;
  sum += current[x + 1][y - 1][i] * 0.05;
  sum += current[x + 1][y + 1][i] * 0.05;
  sum += current[x - 1][y + 1][i] * 0.05;

  return sum; //<>//
}

void calc(){

for (int i = 1; i < cols-1; i++){
    for (int j = 1; j < rows-1; j++){
      float a = current[i][j][0];
      float b = current[i][j][1];
      next[i][j][0] = 
      a + (dA * laplace(i,j,0)) -
      (a * b * b) +
      (feed * (1 - a));
      next[i][j][1] = 
      b + (dB * laplace(i,j,1)) +
      (a * b * b) -
      ((k + feed) * b);
      
      next[i][j][0] = constrain(next[i][j][0],0,1);
      next[i][j][1] = constrain(next[i][j][1],0,1);
      
    }
  }
  swap();
}

void swap(){
  
    float[][][] temp = current;
  current = next;
  next = temp;
  
}
