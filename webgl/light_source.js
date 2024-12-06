class LightSource {
	constructor(position, color, radius) {
		this.position = position;
		this.color = color;
		this.radius = radius;
	}

	setPosition(x, y, z) {
		this.position = [x, y, z];
	}

	setColor(r, g, b) {
		this.color = [r, g, b];
	}

	setRadius(radius) {
		this.radius = radius;
	}

	getPosition() {
		return this.position;
	}

	getColor() {
		return this.color;
	}

	getRadius() {
		return this.radius;
	}
}