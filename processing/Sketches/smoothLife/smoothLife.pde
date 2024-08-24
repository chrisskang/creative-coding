float [][] grid;
float [][] buffer;
String [][] indexMap;

float[][] innerKernel;
float[][] outerKernel;

int innerR = 2;
int outerR = 3;
float frameSum;
import java.util.Arrays;
import java.util.stream.IntStream;

void setup() {
  size(500, 500);
  pixelDensity(displayDensity());
  generateGrid(1);
  //generateIndexMap();

  innerKernel = createCircularKernel(innerR);
  outerKernel = createCircularKernel(outerR);
  
}
            
void draw() {
  //countFrameRateAndAverage(15);
  //checkIfKernalExist();
  
  displayPixel();

  compute();

}

void compute(){

  float inneravg = 0;
  float outeravg = 0;

  for (int i = 0; i < width; i++){
    for (int j = 0; j < height; j++){
      //for each cell
      inneravg = applyKernel(i, j, 1);
      outeravg = applyKernel(i, j, 2);
      buffer[i][j] = putIntoFunction(inneravg, outeravg);

    }}

  swap();
}

float applyKernel(int targetX, int targetY, int kernelSelector){

  float sum = 0;
  float avg = 0;
  if (kernelSelector == 1){
    
    int kernelCount = IntStream.range(0, innerKernel.length)
    .map(i -> IntStream.range(0, innerKernel[0].length)
      .map(j -> innerKernel[i][j] == 1 ? 1 : 0)
      .sum())
    .sum();

    int offset = (innerKernel.length - 1)/2;

    int xOffsetMin = -offset;
    int xOffsetMax = offset;
 
    // 2, 1, 0, -1, -2
    int yOffsetMin = -offset;
    int yOffsetMax = offset;

  for (int i = xOffsetMin; i <= xOffsetMax; i++){
    for (int j = yOffsetMin; j <= yOffsetMax; j++){ 

      if (targetX+i < 0 || targetX+i >= width || targetY+j < 0 || targetY+j >= height){
        sum += 0;
      } else{
        sum += innerKernel[i+offset][j+offset] * grid[targetX+i][targetY+j];
      }
    }
  }

  avg = sum/kernelCount;
  
  }
  
  else if (kernelSelector == 2){
    
    int kernelCount = IntStream.range(0, outerKernel.length)
    .map(i -> IntStream.range(0, outerKernel[0].length)
      .map(j -> outerKernel[i][j] == 1 ? 1 : 0)
      .sum())
    .sum();

    int offset = (outerKernel.length - 1)/2;

    int xOffsetMin = -offset;
    int xOffsetMax = offset;
 
    // 2, 1, 0, -1, -2
    int yOffsetMin = -offset;
    int yOffsetMax = offset;

  for (int i = xOffsetMin; i <= xOffsetMax; i++){
    for (int j = yOffsetMin; j <= yOffsetMax; j++){ 

      if (targetX+i < 0 || targetX+i >= width || targetY+j < 0 || targetY+j >= height){
        sum += 0;
      } else{
        sum += outerKernel[i+offset][j+offset] * grid[targetX+i][targetY+j];
      }
    }
  }
  avg = sum/kernelCount;
  }
    
  return avg;

}

float putIntoFunction(float inneravg, float outeravg){
  if (inneravg >= 0.5 && outeravg >= 0.26 && outeravg <= 0.46){
    return 1.;
  }
  else if(inneravg < 0.5 && outeravg >= 0.27 && outeravg <= 0.36){
    return 1.;

  }else{
    return 0.;
  }

}

float[][] createCircularKernel(int radius){
  //make odd number 2*rad + 1 kernel
  float [][] kernel = new float[2*radius+1][2*radius+1];
    for (int i = 0; i < 2*radius+1; i++) {
      for (int j = 0; j < 2*radius+1; j++){
        int dx = i - radius;
        int dy = j - radius;
        int dSq = dx*dx + dy*dy;
        if (dSq < radius*radius){
          kernel[i][j] = 1;
        } else {
          kernel[i][j] = 0;
        }
      }
    }

  return kernel;
  
}

void displayPixel() {
  loadPixels();

  for (int i = 0; i < width; i++) {
    for (int j = 0; j < height; j++){
      int index = i + j * width;
      pixels[index] = color(int(grid[i][j] * 255));
    }
  }

  updatePixels();
}

void generateGrid(int rr){
  grid = new float[width][height];
  buffer = new float[width][height];

  for (int j = 0; j < height; j++) {
    for (int i = 0; i < width; i++){

      grid[i][j] = random(1);
    } 
  }
}

void generateGrid(){
  grid = new float[width][height];
  buffer = new float[width][height];

  for (int j = 0; j < height; j++) {
    for (int i = 0; i < width; i++){

      grid[i][j] = i * width + j ;
 
    } 
  }
}

void generateIndexMap(){

  indexMap = new String [width][height];

  for (int j = 0; j < height; j++) {
    for (int i = 0; i < width; i++){

      indexMap[i][j] = "[" + i + "," + j + "]";
 
    } 
  }
}

void printArray(float[][] array){

    println(Arrays.deepToString(array)
      .replace("[[", "")
      .replace("], [", "\n")
      .replace("]]", "")
      .replace(" ", "  "));
}

void printArray(int[][] array){

    println(Arrays.deepToString(array)
      .replace("[[", "")
      .replace("], [", "\n")
      .replace("]]", "")
      .replace(" ", "  "));
}

void printArray(String[][] array){

  for(int i = 0; i < array.length; i++)
{
    for(int j = 0; j < array[i].length; j++)
    {
        print(array[i][j]);
        if(j < array[i].length - 1) print(" ");
    }
    println();
}
}

void swap(){
  
  float[][] temp = grid;
  grid = buffer;
  buffer = temp;
  
}

void countFrameRateAndAverage(int max){

  if (frameCount < max){
    frameSum += frameRate;
  }else{
    println("The average frame rate is " + frameSum/frameCount + " fps");
    exit();
  }
}

void checkIfKernalExist(){

  if (innerKernel == null){
    exit();
  }else if (frameCount == 1){

  printArray(innerKernel);

  }
}