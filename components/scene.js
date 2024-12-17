class Scene {
	static currentScene = null;
	static loadedScenes = {};
	static scenePathPrefix = "scenes/";

	constructor(gl) {
		this.gl = gl;
		this.camera = new Camera();
		this.lighting = new Lighting();
		this.objects = [];

		this.screenEffect = new UIRect(gl, 0, 0, 1, 1, [0, 0, 0, 0], LOADED_SHADERS.uiSolidColor);
		this.screenEffect.setZIndex(0.99);

		this.actions = [];
		this.currentAction = null;
	}

	renderUI() {
		this.screenEffect.render();
	}

	render() {
		if (this.currentAction) {
			this.currentAction.update();
		}

		for (let object of this.objects) {
			object.render(this.camera, this.lighting);
		}

		this.renderUI();
	}

	processKeyboardEvent(event) {
		console.log("Unhandled keyboard event", event);
	}

	addObjectToScene(object) {
		this.objects.push(object);
	}

	executeNextAction() {
		if (this.currentAction) {
			this.currentAction.finish();
			return;
		}

		if (!this.actions.length) {
			return;
		}

		let action = this.actions.shift();
		this.currentAction = action;
		this.currentAction.init();
	}

	screenFadeAction(duration, rgb=[0, 0, 0], inverse=false) {
		let actionStartTime;

		let init = () => {
			actionStartTime = Date.now();
		};
		let finish = () => {
			let color = [...rgb, inverse ? 0 : 1];
			this.screenEffect.setColor(...color);
			this.currentAction = null;
			this.executeNextAction();
		};
		let update = () => {
			let progress = (Date.now() - actionStartTime) / (1000 * duration);
			let color = [...rgb, inverse ? 1 - progress : progress];
			this.screenEffect.setColor(...color);
			if (progress >= 1) {
				finish();
			}
		};

		return {
			init,
			finish,
			update
		};
	}

	lookAtAction(duration, object) {
		let actionStartTime, rotateBy, startYaw;

		let init = () => {
			actionStartTime = Date.now();

			let [objectX, objectY, objectZ] = object.getPosition();
			let [cameraX, cameraY, cameraZ] = this.camera.getPosition();
			let cameraDirection = this.camera.getHorizontalDirectionVector();
			let x = objectX - cameraX;
			let z = objectZ - cameraZ;
			rotateBy = calculateAngleBetween([x, z], cameraDirection);
			startYaw = this.camera.getYaw();
		};
		let finish = () => {
			this.camera.setYaw(startYaw + rotateBy);
			this.currentAction = null;
			this.executeNextAction();
		};
		let update = () => {
			let progress = (Date.now() - actionStartTime) / (1000 * duration);

			this.camera.setYaw(startYaw + progress * rotateBy);

			if (progress >= 1) {
				finish();
			}
		};

		return {
			init,
			finish,
			update
		};
	}

	changeSceneAction(sceneName) {
		let init = () => {
			Scene.changeScene(this.gl, sceneName);
		};

		return {
			init,
		};
	}

	playAudioAction(audio, timeToFullVolume) {
		let init = () => {
			AudioManager.play(audio, timeToFullVolume);
			this.currentAction = null;
			this.executeNextAction();
		};

		return {
			init,
		};
	}

	stopAudioAction(timeToFullStop) {
		let init = () => {
			AudioManager.stop(timeToFullStop);
			this.currentAction = null;
			this.executeNextAction();
		};

		return {
			init,
		};
	}

	static registerScene() {
		let src = document.currentScript.src;
		let scriptNameIndex = src.lastIndexOf("/") + 1;
		let sceneName = src.slice(scriptNameIndex);
		sceneName = sceneName.split(".")[0];
		this.loadedScenes[sceneName] = this;
	}

	static changeScene(gl, sceneName) {
		if (!this.loadedScenes.hasOwnProperty(sceneName)) {
			console.log(`Can't find ${sceneName} scene`);
			return;
		}
		this.currentScene = new this.loadedScenes[sceneName](gl);
	}

	static renderCurrentScene() {
		this.currentScene.render();
	}

	static processKeyboardEvent(event) {
		this.currentScene.processKeyboardEvent(event);
	}

	static loadScene(name) {
		let src = this.scenePathPrefix + name + ".js";
		return new Promise((resolve, reject) => {
			var script = document.createElement("script");
			script.onload = () => {
				console.log(`LOADED SCENE: ${src}`);
				resolve();
			};
			script.src = src;
			document.body.appendChild(script);
		});
	}

	static async loadScenes(scenes) {
		let promises = scenes.map((scene) => this.loadScene(scene));
		await Promise.all(promises);
	}
}