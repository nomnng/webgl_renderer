class UIText {
	constructor(gl, text, fontSize, font, shader, maxWidth=0.8, lineInterval=0.08) {
		this.gl = gl;
		this.shader = shader;
		this.texture = font.texture;

		this.color = [1, 1, 1, 1];
		this.x = 0;
		this.y = 0;
		this.zIndex = 0;
		this.maxWidth = maxWidth;
		this.lineInterval = lineInterval;

		fontSize *= 0.001;

		let vertices = new Float32Array(this.generateVertices(text, font.characterData, font.texture, fontSize));
		this.vao = new VertexArray(gl, vertices, shader.getAttributeLayout());
	}

	setMaxWidth(width) {
		this.maxWidth = width;
	}

	setPosition(x, y) {
		this.x = x;
		this.y = y;
	}

	setColor(r, g, b, a) {
		this.color = [r, g, b, a];
	}

	setZIndex(zIndex) {
		this.zIndex = -zIndex;		
	}	

	generateVertices(text, characterData, fontTexture, fontSize) {
		let vertices = [];
		let textureWidth = fontTexture.getWidth();
		let textureHeight = fontTexture.getHeight();
		let currentXOffset = 0;
		let currentYOffset = 0;

		for (let i = 0; i < text.length; i++) {
			let charCode = text.charCodeAt(i);
			let charData = characterData[charCode];
			if (!charData) {
				charData = characterData["?".charCodeAt(0)];
			}

			let bottomLeftVertex = [
				-1 + currentXOffset,
				-1 - currentYOffset,
				charData.x / textureWidth,
				(charData.y + charData.height) / textureHeight,
			];
			let bottomRightVertex = [
				-1 + currentXOffset + charData.width * fontSize,
				-1 - currentYOffset,
				(charData.x + charData.width) / textureWidth,
				(charData.y + charData.height) / textureHeight,
			];
			let upperLeftVertex = [
				-1 + currentXOffset,
				charData.height * fontSize - 1 - currentYOffset,
				charData.x / textureWidth,
				charData.y / textureHeight,
			];
			let upperRightVertex = [
				-1 + currentXOffset + charData.width * fontSize,
				charData.height * fontSize - 1 - currentYOffset,
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
			if ((currentXOffset / 2) > this.maxWidth && text[i] == ' ') {
				currentXOffset = 0;
				currentYOffset += this.lineInterval;
			}
		}

		return vertices;
	}

	render() {
		this.vao.bind();
		this.shader.useProgram();
		this.shader.setUniformVec2("u_position", [this.x, this.y]);
		this.shader.setUniformVec4("u_color", this.color);
		this.shader.setUniform1f("u_zindex", this.zIndex);		
		this.texture.bind();
		this.gl.drawArrays(gl.TRIANGLES, 0, this.vao.getVertexCount());
	}
}