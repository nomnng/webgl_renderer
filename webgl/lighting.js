const MAX_LIGHT_SOURCES = 16;

class Lighting {
	constructor() {
		this.lightSources = [];
		this.ambientLight = [0.2, 0.2, 0.2];
	}

	setAmbientLight(r, g, b) {
		this.ambientLight = [r, g, b];
	}

	addLightSource(position, color, radius) {
		if (this.lightSources.length === MAX_LIGHT_SOURCES) {
			console.warn("No more light sources can be added");
			return;
		}

		this.lightSources.push(new LightSource(position, color, radius));
	}

	removeAllLightSources() {
		this.lightSources = [];
	}

	getLightSource(index) {
		return this.lightSources[index];
	}

	setUniforms(shader) {
		shader.setUniformVec3("u_ambient_light", this.ambientLight);
		shader.setUniform1i("u_light_count", this.lightSources.length);
		if (!this.lightSources.length) {
			return;
		}

		let lightSourcePositions = this.lightSources.map((l) => l.getPosition()).flat();
		let lightSourceColors = this.lightSources.map((l) => l.getColor()).flat();
		let lightSourceRadiuses = this.lightSources.map((l) => l.getRadius()).flat();
		shader.setUniformVec3Array("u_light_positions", lightSourcePositions);
		shader.setUniformVec3Array("u_light_colors", lightSourceColors);
		shader.setUniformFloatArray("u_light_radiuses", lightSourceRadiuses);
	}
}