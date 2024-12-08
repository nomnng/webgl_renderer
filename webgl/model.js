class Model {
	constructor(gl, shader, vao, texture=null) {
		this.gl = gl;
		this.x = 0;
		this.y = 0;
		this.z = 0;
		this.xScale = 1;
		this.yScale = 1;
		this.zScale = 1;
		this.xRotation = 0;
		this.yRotation = 0;
		this.zRotation = 0;

		this.shader = shader;
		this.vao = vao;
		this.texture = texture;

		this.modelMatrix = Matrix.createIdentityMatrix(4, 4);
	}

	static async load(gl, shader, modelUrl) {
		let vertices = await ObjLoader.loadFromUrl(modelUrl);
		let vao = new VertexArray(gl, vertices, shader.getAttributeLayout());

		return new Model(gl, shader, vao);
	}

	static async loadWithTexture(gl, shader, modelUrl, textureUrl) {
		let vertices = await ObjLoader.loadFromUrl(modelUrl, false);
		let vao = new VertexArray(gl, vertices, shader.getAttributeLayout());
		let texture = await Texture.load(gl, textureUrl);

		return new Model(gl, shader, vao, texture);
	}

	render(viewMatrix, projectionMatrix, lighting) {
		this.vao.bind();
		this.shader.useProgram();
		this.shader.setUniformMatrix4("u_model", this.modelMatrix);
		this.shader.setUniformMatrix4("u_view", viewMatrix);
		this.shader.setUniformMatrix4("u_projection", projectionMatrix);
		lighting.setUniforms(this.shader);
		if (this.texture) {
			this.texture.bind();
		}
		this.gl.drawArrays(gl.TRIANGLES, 0, this.vao.getVertexCount());
	}

	updateModelMatrix() {
		let translationMatrix = Matrix.createTranslationMatrix(this.x, this.y, this.z);
		let scalingMatrix = Matrix.createScalingMatrix(this.xScale, this.yScale, this.zScale);
		let xRotationMatrix = Matrix.createXRotationMatrix(this.xRotation);
		let yRotationMatrix = Matrix.createYRotationMatrix(this.yRotation);
		let zRotationMatrix = Matrix.createZRotationMatrix(this.zRotation);
		let rotationMatrix = xRotationMatrix.multiply(yRotationMatrix).multiply(zRotationMatrix);
		this.modelMatrix = translationMatrix.multiply(scalingMatrix.multiply(rotationMatrix));
	}

	setPosition(x, y, z) {
		this.x = x;
		this.y = y;
		this.z = z;

		this.updateModelMatrix();
	}

	setRotation(xRotation, yRotation, zRotation) {
		this.xRotation = xRotation;
		this.yRotation = yRotation;
		this.zRotation = zRotation;

		this.updateModelMatrix();
	}

	setScale(x, y, z) {
		this.xScale = x;
		this.yScale = y;
		this.zScale = z;

		this.updateModelMatrix();
	}
}