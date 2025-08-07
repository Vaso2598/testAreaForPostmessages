const iframe = document.getElementById("gameFrame");
const input = document.getElementById("iframeSrc");
const button = document.getElementById("setSrcBtn");

const STORAGE_KEY = "iframeSrc";

window.addEventListener("DOMContentLoaded", () => {
	const savedSrc = localStorage.getItem(STORAGE_KEY);
	if (savedSrc) {
		iframe.src = savedSrc;
		input.value = savedSrc;
	}
});

button.addEventListener("click", () => {
	const newSrc = input.value.trim();
	if (newSrc) {
		iframe.src = newSrc;
		localStorage.setItem(STORAGE_KEY, newSrc);
	}
});
