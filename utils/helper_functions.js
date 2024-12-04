async function getTextFromUrl(url) {
	let response = await fetch(url);
	return response.text();
}