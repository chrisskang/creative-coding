
int cols = 200;
int rows = 200;
float[][] current = new float[cols][rows];
float[][] previous = new float[cols][rows];

float dampening = 0.9;


void setup(){
  size(200,200);
  previous[100][100] = 255;
}

void mousePressed(){
  
  
  
}
void draw(){
  background(0);
 loadPixels();
  for (int i = 1; i < cols-1; i++){
    for (int j = 1; j < rows-1; j++){
      current[i][j] =  
      (previous[i-1][j]+
       previous[i+1][j]+
       previous[i][j-1]+
       previous[i][j+1])/2 - current[i][j];
       
       current[i][j] = current[i][j] * dampening;
       
      
      int index = i + j * cols;
      pixels[index] = color(current[i][j]);
      
    }
  }
  updatePixels();
  
  float[][]temp = previous;
  previous = current;
  current = temp;
  
  
  
}
