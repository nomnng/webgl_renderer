var gl, canvas;

var LOADED_SHADERS = {};
var DEFAULT_FONT = null;
var LOADED_MODELS = {};

async function prepareShaders() {
	let defaultShader = await Shader.load(gl, "shaders/default_vertex.shader", "shaders/default_fragment.shader");
	defaultShader.useProgram();
	defaultShader.setUniformVec4("u_color", [0, 1, 0, 1]);
	defaultShader.addAttribute("a_position", 3, gl.FLOAT);
	defaultShader.addAttribute("a_normal", 3, gl.FLOAT);
	LOADED_SHADERS.default = defaultShader;

	let textureShader = await Shader.load(gl, "shaders/texture_vertex.shader", "shaders/texture_fragment.shader");
	textureShader.useProgram();
	textureShader.addAttribute("a_position", 3, gl.FLOAT);
	textureShader.addAttribute("a_normal", 3, gl.FLOAT);
	textureShader.addAttribute("a_uv", 2, gl.FLOAT);
	LOADED_SHADERS.texture = textureShader;

	let textShader = await Shader.load(gl, "shaders/text_vertex.shader", "shaders/text_fragment.shader");
	textShader.useProgram();
	textShader.addAttribute("a_position", 2, gl.FLOAT);
	textShader.addAttribute("a_uv", 2, gl.FLOAT);
	LOADED_SHADERS.text = textShader;

	let uiTextShader = await Shader.load(gl, "shaders/ui_texture_vertex.shader", "shaders/text_fragment.shader");
	uiTextShader.useProgram();
	uiTextShader.addAttribute("a_position", 2, gl.FLOAT);
	uiTextShader.addAttribute("a_uv", 2, gl.FLOAT);
	LOADED_SHADERS.uiText = uiTextShader;

	let uiSolidColorShader = await Shader.load(gl, "shaders/ui_rect_vertex.shader", "shaders/solid_color_fragment.shader");
	uiSolidColorShader.useProgram();
	uiSolidColorShader.addAttribute("a_position", 2, gl.FLOAT);
	LOADED_SHADERS.uiSolidColor = uiSolidColorShader;
}

window.addEventListener("load", async () => {
	canvas = document.getElementById("main_canvas");
	canvas.width = canvas.clientWidth;
	canvas.height = canvas.clientHeight;
	gl = canvas.getContext("webgl2");
	gl.enable(gl.DEPTH_TEST);
	gl.depthFunc(gl.LEQUAL);

	gl.enable(gl.BLEND);
	gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

	SET_LOADING_STATUS("Loading shaders...");
	await prepareShaders();

	DEFAULT_FONT = {
		texture: await Texture.load(gl, "fonts/font.png"),
		characterData: await XmlFontLoader.loadFromUrl("fonts/font.xml"),
	};

	SET_LOADING_STATUS("Loading models...");
	LOADED_MODELS.texturedCube = await Model.loadWithTexture(gl, LOADED_SHADERS.texture.getAttributeLayout(), "models/cube_textured.obj", "models/cube_number_texture.jpg");
	LOADED_MODELS.monkey = await Model.load(gl, LOADED_SHADERS.default.getAttributeLayout(), "models/monkey.obj");
	SET_LOADING_STATUS("Loading scenes...");

	await Scene.loadScenes([
		"test_scene",
		"test_scene2"
	]);
	SET_LOADING_STATUS("");

	Scene.changeScene(gl, "test_scene");

	requestAnimationFrame(render);
});

function render() {
	gl.clearColor(0.3, 0.3, 0.3, 1);
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

	Scene.renderCurrentScene();

	requestAnimationFrame(render);
}

window.onkeypress = (event) => Scene.processKeyboardEvent(event);
