#version 300 es
precision mediump float;

in vec3 v_color;
in vec3 v_current_position;
in vec3 v_normal;
out vec4 outputColor;

uniform vec3 u_ambient_light;
uniform vec3 u_diffuse_light_position;
uniform vec3 u_diffuse_light_color;

void main() {
	float test = min(1.0, 10.0 / length(u_diffuse_light_position - v_current_position));
	vec3 diffuse_light_direction = normalize(u_diffuse_light_position - v_current_position);
	vec3 diffuse_light = u_diffuse_light_color * max(0.0, dot(v_normal, diffuse_light_direction)) * test;

	vec3 lighting = u_ambient_light + diffuse_light;
	outputColor = vec4(v_color * lighting , 1.0);
}
