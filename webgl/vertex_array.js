class VertexArray {
	constructor(gl, vertices, attributeLayout) {
		this.gl = gl;
		this.attributeLayout = attributeLayout;
		this.vertexCount = vertices.length / attributeLayout.getVertexElementCount();

		this.vao = gl.createVertexArray();
		gl.bindVertexArray(this.vao);

		this.vertexBuffer = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
		gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW); // vertices should have an ArrayBuffer type
		this.updateAttributes();
	}

	bind() {
		this.gl.bindVertexArray(this.vao);
	}

	// NOTE: vertex array needs to binded before calling this method
	updateAttributes() {
		let stride = this.attributeLayout.getStride();
		let offset = 0;
		this.attributeLayout.forEachAttribute((location, elementCount, type, sizeInBytes) => {
			this.gl.vertexAttribPointer(
				location,
				elementCount,
				type,
				false,
				stride,
				offset
			);
			this.gl.enableVertexAttribArray(location);

			offset += sizeInBytes;		
		});
	}

	getVertexCount() {
		return this.vertexCount;
	}
}