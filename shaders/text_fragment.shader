#version 300 es
precision mediump float;

in vec2 v_uv;
out vec4 outputColor;

uniform sampler2D u_texture;

void main() {
	outputColor = texture(u_texture, v_uv);
}
