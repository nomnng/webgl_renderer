class TestScene2 extends DialogScene {
	static { this.registerScene() };

	constructor(gl) {
		super(gl);

		for (let i = 0; i < 30; i++) {
			let obj = new Object3D(gl, LOADED_SHADERS.default, LOADED_MODELS.monkey);
			obj.setPosition(5, -2, -10 + i * 3);
			this.addObjectToScene(obj);
		}

		this.lighting.addLightSource([0, 5, 0], [1, 1, 1], 10);
		this.lighting.addLightSource([0, 5, 0], [1, 1, 1], 10);

		this.camera.rotateHorizontally(90);
		this.camera.setPosition(0, 0, -4);

		this.lightPosition = 0;

		this.actions = [
			this.screenFadeAction(1, [0, 0, 0], true),
			this.showDialogAction("This is a second scene..."),
			this.changeSceneAction("test_scene"),
		];
		this.executeNextAction();
	}

	render() {
		let lightX = 20 + dSin(this.lightPosition++) * 20;
		this.lighting.getLightSource(0).setPosition(lightX, 5, 0);
		this.lighting.getLightSource(1).setPosition(40 - lightX, 5, 0);

		super.render();
	}

	processKeyboardEvent(event) {
		super.processKeyboardEvent(event);

		if (event.code == "KeyW") {
			this.camera.rotateVertically(-10);
		} else if (event.code == "KeyA") {
			this.camera.rotateHorizontally(-10);
		} else if (event.code == "KeyS") {
			this.camera.rotateVertically(10);
		} else if (event.code == "KeyD") {
			this.camera.rotateHorizontally(10);
		} else if (event.code == "KeyE") {
			this.camera.moveForward(1);
		}
	}
}