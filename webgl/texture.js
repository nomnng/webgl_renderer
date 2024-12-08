class Texture {
	constructor(gl, image) {
		this.gl = gl;
		this.image = image;
		this.texture = gl.createTexture();

		// NOTE: currently only one texture unit is supported
		gl.bindTexture(gl.TEXTURE_2D, this.texture);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
		gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
	}

	static async load(gl, url) {
		return new Promise((resolve, reject) => {
			let image = new Image();
			image.onload = () => {
				resolve(new Texture(gl, image));
			};
			image.onerror = reject;
			image.src = url;
		});
	}

	getWidth() {
		return this.image.width;
	}

	getHeight() {
		return this.image.height;
	}

	bind() {
		this.gl.bindTexture(gl.TEXTURE_2D, this.texture);
	}
}