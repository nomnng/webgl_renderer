var gl, canvas, shader, vao, ibo, objectsForRendering = [];

var camera = new Camera();
var lighting = new Lighting();

window.addEventListener("load", async () => {
	canvas = document.getElementById("main_canvas");
	canvas.width = canvas.clientWidth;
	canvas.height = canvas.clientHeight;
	gl = canvas.getContext("webgl2");
	gl.enable(gl.DEPTH_TEST);
	gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);

	shader = await Shader.load(gl, "shaders/vertex.shader", "shaders/fragment.shader");
	shader.useProgram();
	shader.setUniformNames([
		"u_model",
		"u_view",
		"u_projection",
		"u_ambient_light",
		"u_light_count",
		"u_light_positions",
		"u_light_colors",
		"u_light_radiuses",		
	]);
	shader.addAttribute("a_position", 3, gl.FLOAT);
	shader.addAttribute("a_normal", 3, gl.FLOAT);

	for (let i = 0; i < 30; i++) {
		let model = await Model.load(gl, shader, "models/monkey.obj");
		model.setPosition(-15 + i * 3, -2, 5);
		objectsForRendering.push(model);
	}

	lighting.addLightSource([0, 5, 0], [1, 1, 1], 10);
	lighting.addLightSource([0, 5, 0], [1, 1, 1], 10);

	textureShader = await Shader.load(gl, "shaders/texture_vertex.shader", "shaders/texture_fragment.shader");
	textureShader.useProgram();
	textureShader.setUniformNames([
		"u_model",
		"u_view",
		"u_projection",
		"u_ambient_light",
		"u_light_count",
		"u_light_positions",
		"u_light_colors",
		"u_light_radiuses",
	]);
	textureShader.addAttribute("a_position", 3, gl.FLOAT);
	textureShader.addAttribute("a_normal", 3, gl.FLOAT);
	textureShader.addAttribute("a_uv", 2, gl.FLOAT);

	let cubeTextured = await Model.loadWithTexture(gl, textureShader, "models/cube_textured.obj", "models/cube_number_texture.jpg");
	cubeTextured.setPosition(4, -2, -2);
	objectsForRendering.push(cubeTextured);

	camera.rotateHorizontally(90);

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
