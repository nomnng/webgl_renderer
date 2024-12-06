#version 300 es
precision mediump float;

in vec3 v_current_position;
in vec3 v_normal;
in vec3 v_color;
out vec4 outputColor;

uniform vec3 u_ambient_light;
uniform int u_light_count;
uniform vec3 u_light_positions[16];
uniform vec3 u_light_colors[16];
uniform float u_light_radiuses[16];

void main() {
	vec3 lighting = u_ambient_light;

	for (int i = 0; i < u_light_count; i++) {
		vec3 light_position = u_light_positions[i];
		vec3 light_color = u_light_colors[i];
		float light_radius = u_light_radiuses[i];
		float light_intensity = min(1.0, light_radius / length(light_position - v_current_position));
		vec3 light_direction = normalize(light_position - v_current_position);
		lighting += light_color * max(0.0, dot(v_normal, light_direction)) * light_intensity;
	}

	outputColor = vec4(v_color * lighting, 1.0);
}
