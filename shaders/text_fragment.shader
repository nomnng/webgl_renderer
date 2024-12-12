#version 300 es
precision mediump float;

in vec2 v_uv;
out vec4 outputColor;

uniform vec4 u_color;
uniform sampler2D u_texture;

void main() {
	vec4 texture_color = texture(u_texture, v_uv);
	outputColor = vec4(u_color.xyz, texture_color.a * u_color.a);
}
