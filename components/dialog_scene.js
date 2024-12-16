class DialogScene extends Scene {
	constructor(gl) {
		super(gl);

		this.dialogText = null;
		this.dialogTextProgress = 0;

		this.dialogBox = new UIRect(gl, 0.02, 0.02, 0.96, 0.2, [0.1, 0.1, 0.1, 0.35], LOADED_SHADERS.uiSolidColor);
		this.dialogBox.setZIndex(-0.5);
	}

	setDialogText(text) {
		this.dialogText = new UIText(this.gl, text, 1, DEFAULT_FONT, LOADED_SHADERS.uiText, 0.8);
		this.dialogText.setPosition(0.08, 0.32);
	}

	renderUI() {
		if (this.dialogText) {
			this.dialogBox.render();
			this.dialogText.render(this.dialogTextProgress);
		}

		super.renderUI();
	}

	showDialogAction(text) {
		let actionStartTime;

		let init = () => {
			actionStartTime = Date.now();
			this.setDialogText(text);
			this.dialogTextProgress = 0;
		};
		let finish = () => {
			this.dialogTextProgress = text.length;
			this.currentAction = null;
		};
		let update = () => {
			this.dialogTextProgress = Math.floor((Date.now() - actionStartTime) / 30);
			if (this.dialogTextProgress >= text.length) {
				finish();
			}
		};

		return {
			init,
			finish,
			update
		};
	}

	processKeyboardEvent(event) {
		if (event.code == "Enter") {
			this.executeNextAction();
			console.log("ENTER");
		}
	}
}