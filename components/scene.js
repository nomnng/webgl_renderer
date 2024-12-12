class Scene {
	static currentScene = null;

	constructor(gl) {
		this.gl = gl;
		this.camera = new Camera();
		this.lighting = new Lighting();
		this.objects = [];
	}

	render() {
		for (let object of this.objects) {
			object.render(this.camera, this.lighting);
		}
	}

	processKeyboardEvent(event) {
		console.log("Unhandled keyboard event", event);
	}

	addObjectToScene(object) {
		this.objects.push(object);
	}

	static setCurrentScene(scene) {
		this.currentScene = scene;
	}

	static renderCurrentScene() {
		this.currentScene.render();
	}

	static processKeyboardEvent(event) {
		this.currentScene.processKeyboardEvent(event);
	}
}