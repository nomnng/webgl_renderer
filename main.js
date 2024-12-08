var gl, canvas, objectsForRendering = [];

var camera = new Camera();
var lighting = new Lighting();

var textObj;

window.addEventListener("load", async () => {
	canvas = document.getElementById("main_canvas");
	canvas.width = canvas.clientWidth;
	canvas.height = canvas.clientHeight;
	gl = canvas.getContext("webgl2");
	gl.enable(gl.DEPTH_TEST);

	gl.enable(gl.BLEND)
	gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);

	let shader = await Shader.load(gl, "shaders/vertex.shader", "shaders/fragment.shader");
	shader.useProgram();
	shader.addAttribute("a_position", 3, gl.FLOAT);
	shader.addAttribute("a_normal", 3, gl.FLOAT);

	for (let i = 0; i < 30; i++) {
		let model = await Model.load(gl, shader, "models/monkey.obj");
		model.setPosition(-15 + i * 3, -2, 10);
		objectsForRendering.push(model);
	}

	lighting.addLightSource([0, 5, 0], [1, 1, 1], 10);
	lighting.addLightSource([0, 5, 0], [1, 1, 1], 10);

	textureShader = await Shader.load(gl, "shaders/texture_vertex.shader", "shaders/texture_fragment.shader");
	textureShader.useProgram();
	textureShader.addAttribute("a_position", 3, gl.FLOAT);
	textureShader.addAttribute("a_normal", 3, gl.FLOAT);
	textureShader.addAttribute("a_uv", 2, gl.FLOAT);

	let cubeTextured = await Model.loadWithTexture(gl, textureShader, "models/cube_textured.obj", "models/cube_number_texture.jpg");
	cubeTextured.setPosition(4, -2, -2);
	objectsForRendering.push(cubeTextured);

	let textShader = await Shader.load(gl, "shaders/text_vertex.shader", "shaders/text_fragment.shader");
	textShader.useProgram();
	textShader.addAttribute("a_position", 2, gl.FLOAT);
	textShader.addAttribute("a_uv", 2, gl.FLOAT);

	let fontTexture = await Texture.load(gl, "fonts/tfont.png");
	let fontData = await XmlFontLoader.loadFromUrl("fonts/tfont.xml");
	textObj = new TextLine(gl, "Text for testing...", fontData, fontTexture, textShader);

	camera.rotateHorizontally(90);
	camera.setPosition(0, 0, -4);

	requestAnimationFrame(render);
});

var lightPosition = 0;

function render() {
	gl.clearColor(0.3, 0.3, 0.3, 1);
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

	let lightX = 20 + dSin(lightPosition++) * 20;
	lighting.getLightSource(0).setPosition(lightX, 5, 0);
	lighting.getLightSource(1).setPosition(40 - lightX, 5, 0);

	for (let object of objectsForRendering) {
		object.render(camera.getViewMatrix(), camera.getProjectionMatrix(), lighting);
	}

	textObj.render(camera.getViewMatrix(), camera.getProjectionMatrix());

	requestAnimationFrame(render);
}

window.onkeypress = (ev) => {
	console.log(ev);
	if (ev.code == "KeyW") {
		camera.rotateVertically(-10);
	} else if (ev.code == "KeyA") {
		camera.rotateHorizontally(-10);
	} else if (ev.code == "KeyS") {
		camera.rotateVertically(10);
	} else if (ev.code == "KeyD") {
		camera.rotateHorizontally(10);
	} else if (ev.code == "KeyE") {
		camera.moveForward(1);
	}
}
