class Camera {
	constructor() {
		this.x = 0;
		this.y = 0;
		this.z = 0;
		this.yaw = 0;
		this.pitch = 0;
		this.translationMatrix = Matrix.createIdentityMatrix(4, 4);
		this.rotationMatrix = Matrix.createIdentityMatrix(4, 4);
		this.viewMatrix = Matrix.createIdentityMatrix(4, 4);
		this.projectionMatrix = Matrix.createPerspectiveProjectionMatrix(16 / 9, 1000, 0.1, 90);

		this.rightVector = [1, 0, 0];
		this.upVector = [0, 1, 0];
		this.forwardVector = [0, 0, 1];
	}

	getViewMatrix() {
		return this.viewMatrix;
	}

	getProjectionMatrix() {
		return this.projectionMatrix;
	}

	updateRotationMatrix() {
		this.rotationMatrix = new Matrix([
			this.rightVector[0], this.rightVector[1], this.rightVector[2], 0,
			this.upVector[0], this.upVector[1], this.upVector[2], 0,
			this.forwardVector[0], this.forwardVector[1], this.forwardVector[2], 0,
			0, 0, 0, 1,
		], 4, 4);
		this.updateViewMatrix();
	}

	updateCameraPosition() {
		this.translationMatrix = Matrix.createTranslationMatrix(-this.x, -this.y, -this.z);
		this.updateViewMatrix();
	}

	updateViewMatrix() {
		this.viewMatrix = this.rotationMatrix.multiply(this.translationMatrix);
	}

	updateCameraRotation() {
		let yawPitchMatrix = Matrix.createYRotationMatrix(this.yaw).multiply(Matrix.createXRotationMatrix(this.pitch));

		let rotationResult = yawPitchMatrix.multiply(new Matrix([0, 0, 1, 0], 4, 1));
		this.forwardVector = normalizeVector([
			rotationResult.getElement(0, 0),
			rotationResult.getElement(0, 1),
			rotationResult.getElement(0, 2)
		]);

		rotationResult = yawPitchMatrix.multiply(new Matrix([0, 1, 0, 0], 4, 1));
		this.upVector = normalizeVector([
			rotationResult.getElement(0, 0),
			rotationResult.getElement(0, 1),
			rotationResult.getElement(0, 2)
		]);

		this.rightVector = normalizeVector(crossProduct(this.upVector, this.forwardVector));
		this.updateRotationMatrix();
	}

	rotateHorizontally(angle) {
		this.yaw += angle;
		this.updateCameraRotation();
	}

	rotateVertically(angle) {
		this.pitch += angle;
		this.updateCameraRotation();
	}

	moveForward(distance) {
		this.x += this.forwardVector[0] * distance;
		this.y += this.forwardVector[1] * distance;
		this.z += this.forwardVector[2] * distance;
		this.updateCameraPosition();
	}

	setPosition(x, y, z) {
		this.x = x;
		this.y = y;
		this.z = z;
		this.updateCameraPosition();
	}

	getYaw() {
		return this.yaw;
	}

	setYaw(yaw) {
		this.yaw = yaw;
		this.updateCameraRotation();
	}

	getPosition() {
		return [this.x, this.y, this.z];
	}

	getHorizontalDirectionVector() {
		return [dSin(this.yaw), dCos(this.yaw)];
	}
}