class ObjLoader {
	static cachedObjects = {};

	static async loadFromUrl(url, ignoreUV=true) {
		if (this.cachedObjects.hasOwnProperty(url)) {
			return this.cachedObjects[url];
		}

		let text = await getTextFromUrl(url);
		let lines = text.split("\n");

		let vertices = [];
		let normals = [];
		let uvCoords = [];
		let vertexArray = [];

		for (let line of lines) {
			let parts = line.split(" ");
			let type = parts.shift();
			if (!["v", "vn", "vt", "f"].includes(type)) {
				continue;
			}

			switch (type) {
				case "v":
					// process vertices
					vertices.push(parts.map((str) => parseFloat(str)));
					break;
				case "vn":
					// process normals
					normals.push(parts.map((str) => parseFloat(str)));
					break;
				case "vt":
					// process uv coordinates
					if (ignoreUV) {
						break;
					}
					uvCoords.push(parts.map((str) => parseFloat(str)));
					break;
				case "f":
					// process faces
					parts.forEach((part) => {
						let vertexData = part.split("/").map((str) => parseInt(str));
						let [vertexIndex, uvIndex, normalIndex] = vertexData.map((i) => i - 1); // indexes in obj file starts from 1
						vertexArray.push(...vertices[vertexIndex]);
						vertexArray.push(...normals[normalIndex]);
						if (!ignoreUV) {
							vertexArray.push(...uvCoords[uvIndex]);
						}
					});
					break;
			}
		}

		let result = new Float32Array(vertexArray);
		this.cachedObjects[url] = result;

		return result;
	}
}