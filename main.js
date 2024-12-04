var gl, canvas, shader, vao, ibo, objectsForRendering = [];

var camera = new Camera();

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
		"u_diffuse_light_position",
		"u_diffuse_light_color",
	]);
	shader.addAttribute("a_position", 3, gl.FLOAT);
	shader.addAttribute("a_normal", 3, gl.FLOAT);

	shader.setUniformVec3("u_ambient_light", new Float32Array([0.1, 0.1, 0.1]));
	shader.setUniformVec3("u_diffuse_light_color", new Float32Array([1, 1, 1]));
	shader.setUniformVec3("u_diffuse_light_position", new Float32Array([0, 5, 0]));

	for (let i = 0; i < 20; i++) {
		let model = await Model.load(gl, shader, "models/monkey.obj");
		model.setPosition(-10 + i * 3, -2, 5);
		objectsForRendering.push(model);
	}

	requestAnimationFrame(render);
});

function render() {
	gl.clearColor(0.3, 0.3, 0.3, 1);
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

	for (let object of objectsForRendering) {
		object.render(camera.getViewMatrix(), camera.getProjectionMatrix());
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
