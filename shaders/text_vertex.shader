#version 300 es
precision mediump float;

in vec2 a_position;
in vec2 a_uv;
uniform mat4 u_model;
uniform mat4 u_view;
uniform mat4 u_projection;

out vec2 v_uv;

void main() {
	gl_Position = u_projection * u_view * u_model * vec4(a_position.x, a_position.y, 0.0, 1.0);

	v_uv = a_uv;
}
