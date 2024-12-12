class Object3D {
	constructor(gl, shader, model) {
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
		this.model = model;

		this.modelMatrix = Matrix.createIdentityMatrix(4, 4);
	}

	render(camera, lighting) {
		this.model.bind();
		this.shader.useProgram();
		this.shader.setUniformMatrix4("u_model", this.modelMatrix);
		this.shader.setUniformMatrix4("u_view", camera.getViewMatrix());
		this.shader.setUniformMatrix4("u_projection", camera.getProjectionMatrix());
		lighting.setUniforms(this.shader);
		this.gl.drawArrays(gl.TRIANGLES, 0, this.model.getVertexCount());
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

	moveBy(x, y, z) {
		this.x += x;
		this.y += y;
		this.z += z;

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