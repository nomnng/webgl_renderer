#version 300 es
precision mediump float;

in vec2 a_position;
in vec2 a_uv;
uniform vec2 u_position;
uniform float u_zindex;

out vec2 v_uv;

void main() {
	gl_Position = vec4(a_position.x + u_position.x, a_position.y + u_position.y, u_zindex, 1.0);

	v_uv = a_uv;
}
