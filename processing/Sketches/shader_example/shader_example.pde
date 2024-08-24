String[] vertSrc = { """
uniform mat4 transformMatrix;
attribute vec4 position;
void main() {
  gl_Position = transformMatrix * position;
}
""" };

String[] fragSrc = { """
uniform vec2 resolution;
uniform float time;
#define TAU 6.2831853
void main() {
  vec2 uv = (2.*gl_FragCoord.xy-resolution)/resolution.y;
  uv = vec2( time*0.5 - log(length(uv)), atan( uv.y, uv.x ) / TAU + .5 );
  uv = fract( vec2( 1.*uv.x+3.*uv.y, -1.*uv.x+6.*uv.y ) );
  gl_FragColor = vec4( step(0.8, uv), 0., 1. );
}
""" };

PShader shdr;

void setup() {
  size( 800, 800, P2D );
  shdr = new PShader( g.parent, vertSrc, fragSrc );
}

void draw() {
  shdr.set( "time", frameCount/60. );
  shader( shdr );
  rect( 0, 0, width, height );
}
