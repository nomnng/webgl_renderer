class Matrix {
	constructor(values, rowCount, columnCount) {
		this.rowCount = rowCount;
		this.columnCount = columnCount;
		this.array = new Float32Array(values);
	}

	getArray() {
		return this.array;
	}

	getElement(row, column) {
		return this.array[row * this.columnCount + column];
	}

	setElement(value, row, column) {
		this.array[row * this.columnCount + column] = value;
	}

	multiply(matrix) {
		if (this.columnCount != matrix.rowCount) {
			throw new Error("Matrix multiplication error, wrong matrix dimensions");
		}

		let result = [];
		for (let currentRow = 0; currentRow < this.rowCount; currentRow++) {
			for (let currentColumn = 0; currentColumn < matrix.columnCount; currentColumn++) {
				let sum = 0;

				for (let i = 0; i < matrix.rowCount; i++) {
					sum += this.getElement(currentRow, i) * matrix.getElement(i, currentColumn);
				}

				result.push(sum);
			}
		}

		return new Matrix(result, this.rowCount , matrix.columnCount);
	}

	static createIdentityMatrix(rowCount, columnCount) {
		let values = [];
		for (let i = 0; i < rowCount; i++) {
			for (let j = 0; j < columnCount; j++) {
				values.push(i == j ? 1 : 0);
			}
		}

		return new Matrix(values, rowCount, columnCount);
	}

	static createTranslationMatrix(x, y, z) {
		let matrix = Matrix.createIdentityMatrix(4, 4);
		matrix.setElement(x, 0, 3);
		matrix.setElement(y, 1, 3);
		matrix.setElement(z, 2, 3);
		return matrix;
	}

	static createScalingMatrix(x, y, z) {
		let matrix = Matrix.createIdentityMatrix(4, 4);
		matrix.setElement(x, 0, 0);
		matrix.setElement(y, 1, 1);
		matrix.setElement(z, 2, 2);
		return matrix;
	}

	static createXRotationMatrix(angle) {
		let matrix = Matrix.createIdentityMatrix(4, 4);
		matrix.setElement(dCos(angle), 1, 1);
		matrix.setElement(-dSin(angle), 1, 2);
		matrix.setElement(dSin(angle), 2, 1);
		matrix.setElement(dCos(angle), 2, 2);
		return matrix;
	}

	static createYRotationMatrix(angle) {
		let matrix = Matrix.createIdentityMatrix(4, 4);
		matrix.setElement(dCos(angle), 0, 0);
		matrix.setElement(dSin(angle), 0, 2);
		matrix.setElement(-dSin(angle), 2, 0);
		matrix.setElement(dCos(angle), 2, 2);
		return matrix;
	}

	static createZRotationMatrix(angle) {
		let matrix = Matrix.createIdentityMatrix(4, 4);
		matrix.setElement(dCos(angle), 0, 0);
		matrix.setElement(-dSin(angle), 0, 1);
		matrix.setElement(dSin(angle), 1, 0);
		matrix.setElement(dCos(angle), 1, 1);
		return matrix;
	}

	static createPerspectiveProjectionMatrix(aspectRatio, far, near, fov) {
		// 	fovMultiplier * (1 / aspectRatio), 0, 0, 0,
		// 	0, fovMultiplier, 0, 0,
		// 	0, 0, (far / (far - near)), -((far * near) / (far - near)),
		// 	0, 0, 1, 0

		let matrix = Matrix.createIdentityMatrix(4, 4);

		let fovMultiplier = 1 / (dTan(fov / 2));
		matrix.setElement(fovMultiplier * (1 / aspectRatio), 0, 0);
		matrix.setElement(fovMultiplier, 1, 1);

		let zMultiplier = far / (far - near);
		matrix.setElement(zMultiplier, 2, 2);

		let zOffset = -(near * zMultiplier);
		matrix.setElement(zOffset, 2, 3);

		matrix.setElement(1, 3, 2);
		matrix.setElement(0, 3, 3);		

		return matrix;
	}
}
