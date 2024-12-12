class DialogScene extends Scene {
	constructor(gl) {
		super(gl);
		this.dialogText = null;
		this.dialogBox = new UIRect(gl, 0.02, 0.02, 0.96, 0.2, [0.1, 0.1, 0.1, 0.35], LOADED_SHADERS.uiSolidColor);
		this.dialogBox.setZIndex(-0.5);
	}

	setDialogText(text) {
		this.dialogText = new UIText(gl, text, 0.8, DEFAULT_FONT, LOADED_SHADERS.uiText, 0.8);
		this.dialogText.setPosition(0.08, 0.32);
	}

	render() {
		super.render();
		if (this.dialogText) {
			this.dialogText.render();
			this.dialogBox.render();
		}
	}
}