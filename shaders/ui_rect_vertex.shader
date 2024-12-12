#version 300 es
precision mediump float;

in vec2 a_position;
uniform vec2 u_position;
uniform vec2 u_size;
uniform float u_zindex;

void main() {
	vec2 position = ((a_position + 1.0) * u_size) - 1.0;
	position += u_position * 2.0;
	gl_Position = vec4(position.x, position.y, u_zindex, 1.0);
}
