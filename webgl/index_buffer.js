class IndexBuffer {
	constructor(gl, indices) {
		this.gl = gl;
		this.size = indices.length;

		this.indexBuffer = gl.createBuffer();
		gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
		gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indices, gl.STATIC_DRAW);
	}

	getSize() {
		return this.size;
	}

	bind() {
		this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
	}
}