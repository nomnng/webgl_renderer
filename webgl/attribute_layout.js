class AttributeLayout {
	constructor() {
		this.attributes = [];
	}

	addAttribute(location, elementCount, type) {
		let attributeInfo = {
			location,
			elementCount,
			type,
		};

		this.attributes.push(attributeInfo);
	}

	getTypeSize(type) {
		let ctx = WebGL2RenderingContext;
		switch (type) {
			case ctx.BYTE:
				return 1;
			case ctx.UNSIGNED_BYTE:
				return 1;
			case ctx.SHORT:
				return 2;
			case ctx.UNSIGNED_SHORT:
				return 2;
			case ctx.FLOAT:
				return 4;
			case ctx.INT:
				return 4;
		}
	}

	getVertexElementCount() {
		return this.attributes.reduce((sum, {elementCount}) => sum + elementCount, 0);
	}

	getStride() {
		return this.attributes.reduce(
			(sum, {elementCount, type}) => {
				let elementSize = this.getTypeSize(type);
				return sum + elementSize * elementCount;
			}, 0
		);
	}

	forEachAttribute(callback) {
		this.attributes.forEach(({location, elementCount, type}) => {
			let sizeInBytes = this.getTypeSize(type) * elementCount;
			callback(location, elementCount, type, sizeInBytes);
		});
	}
}