function dSin(degrees) {
	return Math.sin(degrees * Math.PI / 180);
}

function dCos(degrees) {
	return Math.cos(degrees * Math.PI / 180);
}

function dTan(degrees) {
	return Math.tan(degrees * Math.PI / 180);
}

function crossProduct(v1, v2) {
	let x = v1[1] * v2[2] - v1[2] * v2[1];
	let y = v1[2] * v2[0] - v1[0] * v2[2];
	let z = v1[0] * v2[1] - v1[1] * v2[0];
	return [x, y, z];
}

function normalizeVector(v) {
	let length = Math.sqrt(v[0] * v[0] + v[1] * v[1] + v[2] * v[2]);
	return [v[0] / length, v[1] / length, v[2] / length];
}
