class Model {
	constructor(vao, texture=null) {
		this.gl = gl;
		this.vao = vao;
		this.texture = texture;
	}

	bind() {
		this.vao.bind();
		this.texture?.bind();
	}

	getVertexCount() {
		return this.vao.getVertexCount();
	}

	static async load(gl, attributeLayout, modelUrl) {
		let vertices = await ObjLoader.loadFromUrl(modelUrl);
		let vao = new VertexArray(gl, vertices, attributeLayout);

		return new Model(vao);
	}

	static async loadWithTexture(gl, attributeLayout, modelUrl, textureUrl) {
		let vertices = await ObjLoader.loadFromUrl(modelUrl, false);
		let vao = new VertexArray(gl, vertices, attributeLayout);
		let texture = await Texture.load(gl, textureUrl);

		return new Model(vao, texture);
	}
}