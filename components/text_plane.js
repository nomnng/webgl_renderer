class TextPlane {
	constructor(gl, text, fontSize, fontData, fontTexture, shader) {
		this.gl = gl;
		this.shader = shader;
		this.texture = fontTexture;
		this.modelMatrix = Matrix.createIdentityMatrix(4, 4);
		this.color = [1, 1, 1, 1];

		let vertices = new Float32Array(this.generateVertices(text, fontData, fontTexture, fontSize));
		this.vao = new VertexArray(gl, vertices, shader.getAttributeLayout());
	}

	setColor(r, g, b, a) {
		this.color = [r, g, b, a];
	}

	generateVertices(text, fontData, fontTexture, fontSize) {
		let vertices = [];
		let textureWidth = fontTexture.getWidth();
		let textureHeight = fontTexture.getHeight();
		let currentXOffset = 0;

		for (let i = 0; i < text.length; i++) {
			let charCode = text.charCodeAt(i);
			let charData = fontData[charCode];
			if (!charData) {
				charData = fontData["?".charCodeAt(0)];
			}

			let bottomLeftVertex = [
				currentXOffset,
				0,
				charData.x / textureWidth,
				(charData.y + charData.height) / textureHeight,
			];
			let bottomRightVertex = [
				currentXOffset + charData.width * fontSize,
				0,
				(charData.x + charData.width) / textureWidth,
				(charData.y + charData.height) / textureHeight,
			];
			let upperLeftVertex = [
				currentXOffset,
				charData.height * fontSize,
				charData.x / textureWidth,
				charData.y / textureHeight,
			];
			let upperRightVertex = [
				currentXOffset + charData.width * fontSize,
				charData.height * fontSize,
				(charData.x + charData.width) / textureWidth,
				charData.y / textureHeight,
			];

			// first triangle
			vertices.push(...bottomLeftVertex);
			vertices.push(...upperLeftVertex);
			vertices.push(...upperRightVertex);

			// second triangle
			vertices.push(...bottomLeftVertex);
			vertices.push(...bottomRightVertex);
			vertices.push(...upperRightVertex);

			currentXOffset += charData.xOffset * fontSize;
		}

		return vertices;
	}

	render(camera) {
		this.vao.bind();
		this.shader.useProgram();
		this.shader.setUniformMatrix4("u_model", this.modelMatrix);
		this.shader.setUniformMatrix4("u_view", camera.getViewMatrix());
		this.shader.setUniformMatrix4("u_projection", camera.getProjectionMatrix());
		this.shader.setUniformVec4("u_color", this.color);
		this.texture.bind();
		this.gl.drawArrays(gl.TRIANGLES, 0, this.vao.getVertexCount());
	}
}