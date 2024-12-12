#version 300 es
precision mediump float;

in vec2 a_position;
uniform vec2 u_position;
uniform float u_zindex;

void main() {
	gl_Position = vec4(a_position.x + u_position.x, a_position.y + u_position.y, u_zindex, 1.0);
}
