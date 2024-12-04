#version 300 es
precision mediump float;

in vec3 a_position;
in vec3 a_normal;
in vec2 a_uv;
uniform mat4 u_model;
uniform mat4 u_view;
uniform mat4 u_projection;

out vec3 v_current_position;
out vec3 v_normal;
out vec2 v_uv;

void main() {
	vec4 world_position = u_model * vec4(a_position, 1.0);
	v_current_position = world_position.xyz;
	gl_Position = u_projection * u_view * world_position;

	v_normal = mat3(u_model) * a_normal;
	v_uv = a_uv;
}
