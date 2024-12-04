class Shader {
	constructor(gl, vertexShaderCode, fragmentShaderCode) {
		this.gl = gl;
		this.uniforms = {};
		this.attributeLayout = new AttributeLayout();

		let vertexShader = this.createShader(gl, vertexShaderCode, gl.VERTEX_SHADER);
		let fragmentShader = this.createShader(gl, fragmentShaderCode, gl.FRAGMENT_SHADER);

		this.shaderProgram = this.createShaderProgram(gl, vertexShader, fragmentShader);
	}

	static async load(gl, vertexShaderUrl, fragmentShaderUrl) {
		let vertexShaderCode = await getTextFromUrl(vertexShaderUrl);
		let fragmentShaderCode = await getTextFromUrl(fragmentShaderUrl);
		return new Shader(gl, vertexShaderCode, fragmentShaderCode);
	}

	createShader(gl, shaderCode, type) {
		const shader = gl.createShader(type);
		gl.shaderSource(shader, shaderCode);
		gl.compileShader(shader);
		if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
			console.error(`Shader(${type}) compilation error: ${gl.getShaderInfoLog(shader)}`);
			alert(`Shader(${type}) compilation error: ${gl.getShaderInfoLog(shader)}`);
			gl.deleteShader(shader);
			return;
		}

		return shader;
	}

	createShaderProgram(gl, vertexShader, fragmentShader) {
		const shaderProgram = gl.createProgram();
		gl.attachShader(shaderProgram, vertexShader);
		gl.attachShader(shaderProgram, fragmentShader);
		gl.linkProgram(shaderProgram);
		if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
			console.error(gl.getProgramInfoLog(shaderProgram));
			alert("Shader linking failed");
			gl.deleteProgram(shaderProgram);
			return;
		}

		return shaderProgram;
	}

	useProgram() {
		this.gl.useProgram(this.shaderProgram);
	}

	getAttributeLocation(name) {
		const index = this.gl.getAttribLocation(this.shaderProgram, name);
		if (index < 0) {
			console.error(`Can't find "${name}" attribute location`);
		}
		return index;
	}

	addAttribute(name, elementCount, type) {
		let location = this.getAttributeLocation(name);
		this.attributeLayout.addAttribute(location, elementCount, type);
	}

	getAttributeLayout() {
		return this.attributeLayout;
	}

	getUniformLocation(name) {
		return this.gl.getUniformLocation(this.shaderProgram, name);
	}

	setUniformNames(names) {
		for (let name of names) {
			this.uniforms[name] = this.getUniformLocation(name);
		}
	}

	setUniformMatrix4(name, matrix, transpose=true) {
		this.gl.uniformMatrix4fv(this.uniforms[name], transpose, matrix.getArray());
	}

	setUniformVec3(name, value) {
		let location = this.uniforms[name];
		if (!location) {
			console.warn(`Can't find uniform with name "${name}"`);
			return;
		}
		this.gl.uniform3fv(this.uniforms[name], value);
	}	
}