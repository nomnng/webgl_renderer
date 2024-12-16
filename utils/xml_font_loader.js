class XmlFontLoader {
	static async loadFromUrl(url) {
		let text = await getTextFromUrl(url);
		let parser = new DOMParser();
		let xml = parser.parseFromString(text, "application/xml");
		let chars = xml.querySelectorAll("char");
		let result = {};
		for (let char of chars) {
			let id = parseInt(char.id);
			let x = parseInt(char.getAttribute("x"));
			let y = parseInt(char.getAttribute("y"));
			let width = parseInt(char.getAttribute("width"));
			let height = parseInt(char.getAttribute("height"));
			let xOffset = parseInt(char.getAttribute("xadvance"));
			let xAdjust = parseInt(char.getAttribute("xoffset"));
			let yAdjust = parseInt(char.getAttribute("yoffset"));
			result[id] = {
				x,
				y,
				width,
				height,
				xOffset,
				xAdjust,
				yAdjust,
			};
		}
		return result;
	}
}