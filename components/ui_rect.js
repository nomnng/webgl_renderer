class UIRect {
	constructor(gl, x, y, width, height, color, shader) {
		this.gl = gl;
		this.shader = shader;
		this.color = color;
		this.x = x;
		this.y = y;
		this.width = width;
		this.height = height;
		this.zIndex = 0;

		let vertices = new Float32Array(this.generateVertices(x, y, width, height));
		this.vao = new VertexArray(gl, vertices, shader.getAttributeLayout());
	}

	setColor(r, g, b, a) {
		this.color = [r, g, b, a];
	}

	setPosition(x, y) {
		this.x = x;
		this.y = y;
	}

	setSize(width, height) {
		this.width = width;
		this.height = height;
	}

	setZIndex(zIndex) {
		this.zIndex = -zIndex;		
	}

	generateVertices(x, y, width, height) {
		let bottomLeftVertex = [-1, -1];
		let bottomRightVertex = [1, -1];
		let upperLeftVertex = [-1, 1];
		let upperRightVertex = [1, 1];

		return [
			...bottomLeftVertex,
			...bottomRightVertex,
			...upperLeftVertex,

			...upperLeftVertex,
			...upperRightVertex,
			...bottomRightVertex,
		];
	}

	render() {
		this.vao.bind();
		this.shader.useProgram();
		this.shader.setUniformVec2("u_position", [this.x, this.y]);
		this.shader.setUniformVec2("u_size", [this.width, this.height]);
		this.shader.setUniformVec4("u_color", this.color);
		this.shader.setUniform1f("u_zindex", this.zIndex);
		this.gl.drawArrays(gl.TRIANGLES, 0, this.vao.getVertexCount());
	}
}