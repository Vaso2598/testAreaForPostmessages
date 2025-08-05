const iframe = document.getElementById("gameFrame");
const input = document.getElementById("iframeSrc");
const button = document.getElementById("setSrcBtn");

const STORAGE_KEY = "iframeSrc";

// Load from localStorage on page load
window.addEventListener("DOMContentLoaded", () => {
	const savedSrc = localStorage.getItem(STORAGE_KEY);
	if (savedSrc) {
		iframe.src = savedSrc;
		input.value = savedSrc;
	}
});

// Update iframe src and save on button click
button.addEventListener("click", () => {
	const newSrc = input.value.trim();
	if (newSrc) {
		iframe.src = newSrc;
		localStorage.setItem(STORAGE_KEY, newSrc);
	}
});
