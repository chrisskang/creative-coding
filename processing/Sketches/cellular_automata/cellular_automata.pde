

int size = 10;

float[][] grid;
float[][] next;
int wNum;
int hNum;

void setup() {
  size(500, 500);
  pixelDensity(displayDensity());
  generateGrid();
}


void draw() {
  background(0);
  println(frameRate);
  calc();
  displayWithPixel();
}


void generateGrid() {

  wNum = width/size;
  hNum = height/size;


  grid = new float[wNum][hNum];
  next = new float[wNum][hNum];

  for (int i = 0; i< wNum; i++) {
    for (int j = 0; j < hNum; j++) {
      grid[i][j] = int(random(2));
    }
  }
}


void calc() {

  for (int x = 1; x < wNum-1; x++) {
    for (int y = 1; y < hNum-1; y++) {

      // Add up all the states in a 3x3 surrounding grid
      int neighbors = 0;
      for (int i = -1; i <= 1; i++) {
        for (int j = -1; j <= 1; j++) {
          neighbors += grid[x+i][y+j];
        }
      }

      // A little trick to subtract the current cell's state since
      // we added it in the above loop
      neighbors -= grid[x][y];

      // Rules of Life
      if      ((grid[x][y] == 1) && (neighbors <  2)) next[x][y] = 0;           // Loneliness
      else if ((grid[x][y] == 1) && (neighbors >  3)) next[x][y] = 0;           // Overpopulation
      else if ((grid[x][y] == 0) && (neighbors == 3)) next[x][y] = 1;           // Reproduction
      else                                            next[x][y] = grid[x][y];  // Stasis
    }
  }
  grid = next;
}


void displayWithPixel() {
  loadPixels();

  for (int y = 0; y < height; y++) {
    for (int x = 0; x < width; x++) {

      int index = x + y * width;

      int whereitfallsX = floor(index / size) % wNum;
      int whereitfallsY = floor(index / size / width);

      if (grid[whereitfallsX][whereitfallsY] == 1 ) {
    
        pixels[index] = color(255);
      }
     
    }
  }
  updatePixels();
}
