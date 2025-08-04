const lambdaGame = document.getElementById("gameArea");

lambdaGame.innerHTML = `
<div class="btnContainer">
    <button id="startBtn" class="btn">Start Game</button>
    <button id="spinBtn" class="btn" type="button">Spin</button>
	<div id="autoPlayContainer">
    	<button id="autoPlayBtn" class="btn">Auto Play</button>
		<div class="innerBtnContainer">
			<button class="btn smallBtn">+</button>
			<button class="btn smallBtn">-</button>
		</div>
	</div>
	<div id="betsContainer">
    	<button id="betsBtn" class="btn">Bets</button>
		<div class="innerBtnContainer">
			<button class="btn smallBtn">+</button>
			<button class="btn smallBtn">-</button>
		</div>
	</div>
    <button id="musicBtn" class="btn">Music</button>
    <button id="sfxBtn" class="btn">SFX</button>
</div>
<div id="autoPlay" class="btnContainer"></div>
`;

// let isEnabled = true;
let isMusicMuted = false;
let isSFXMuted = false;
let autoSpinValues = [];
let autoSpinValuesIndex = 0;
let betValues = [];
let betValuesIndex = 0;
let autoSpinCount = 0;
let bet = 0;

const iframe = document.getElementById("gameFrame");

/* = Buttons = */

const startButton = document.getElementById("startBtn");
const spinButton = document.getElementById("spinBtn");
const autoPlayButton = document.getElementById("autoPlayBtn");
const betsButton = document.getElementById("betsBtn");
// const soundButton = document.getElementById("soundBtn");
const musicButton = document.getElementById("musicBtn");
const sfxButton = document.getElementById("sfxBtn");

const autoPlayInnerBtns = document.querySelectorAll("#autoPlayContainer .innerBtnContainer .smallBtn");
const autoPlayPlusBtn = autoPlayInnerBtns[0];
const autoPlayMinusBtn = autoPlayInnerBtns[1];

const betsInnerBtns = document.querySelectorAll("#betsContainer .innerBtnContainer .smallBtn");
const betsPlusBtn = betsInnerBtns[0];
const betsMinusBtn = betsInnerBtns[1];

/* = PostMessages = */

window.addEventListener("message", ($e) => {
	if ($e.origin !== "http://localhost:7295") return;

	const {type, data} = $e.data;

	switch (type) {
		case "UpdateBalance":
			console.log("New Balance", data);
			break;

		case "UpdateWin":
			console.log("Total Win", data);
			break;

		case "Spin":
			console.log("FreeSpins:", data);
			break;

		case "AutoSpinValues":
			autoSpinValues = data;
			autoSpinValues.unshift(0);
			autoSpinCount = autoSpinValues[autoSpinValuesIndex];
			autoPlayButton.innerText = autoSpinCount;
			break;

		case "BetValues":
			betValues = data;
			bet = betValues[betValuesIndex];
			betsButton.innerText = bet;
			// iframe.contentWindow.postMessage({type: "BetValue", data: bet}, "http://localhost:7295");
			break;

		default:
			// Optional: log unhandled message types for debugging
			console.log("Unhandled message type:", type, data);
			break;
	}
});

/* = Button Event Listeners = */

startButton.addEventListener("click", () => {
	console.log("Blank for now");
});

/* = Spin = */

spinButton.addEventListener("click", () => {
	iframe.contentWindow.postMessage({type: "Spin", data: bet}, "http://localhost:7295");
	if (autoSpinCount > 0) {
		iframe.contentWindow.postMessage({type: "AutoSpinCount", data: autoSpinCount}, "http://localhost:7295");
		console.log("sent spin count", autoSpinCount);
	}
});

/* = AutoPlay = */

autoPlayPlusBtn.addEventListener("click", () => {
	if (autoSpinValuesIndex < autoSpinValues.length - 1) {
		autoSpinValuesIndex++;
		autoSpinCount = autoSpinValues[autoSpinValuesIndex];
		console.log("Selected autoSpinCount value:", autoSpinCount);
		autoPlayButton.innerText = autoSpinCount;
	}
});

autoPlayMinusBtn.addEventListener("click", () => {
	if (autoSpinValuesIndex > 0) {
		autoSpinValuesIndex--;
		autoSpinCount = autoSpinValues[autoSpinValuesIndex];
		console.log("Selected autoSpinCount value:", autoSpinCount);
		autoPlayButton.innerText = autoSpinCount;
	}
});

/* = Bets = */

betsPlusBtn.addEventListener("click", () => {
	if (betValuesIndex < betValues.length - 1) {
		betValuesIndex++;
		bet = betValues[betValuesIndex];
		console.log("Selected bet value:", bet);
		betsButton.innerText = bet;
		iframe.contentWindow.postMessage({type: "BetValue", data: bet}, "http://localhost:7295");
	}
});

betsMinusBtn.addEventListener("click", () => {
	if (betValuesIndex > 0) {
		betValuesIndex--;
		bet = betValues[betValuesIndex];
		console.log("Selected bet value:", bet);
		betsButton.innerText = bet;
		iframe.contentWindow.postMessage({type: "BetValue", data: bet}, "http://localhost:7295");
	}
});

/* = Sound = */

musicButton.addEventListener("click", () => {
	isMusicMuted = !isMusicMuted;
	iframe.contentWindow.postMessage({type: "Music", data: isMusicMuted}, "http://localhost:7295");
});

sfxButton.addEventListener("click", () => {
	isSFXMuted = !isSFXMuted;
	iframe.contentWindow.postMessage({type: "SFX", data: isSFXMuted}, "http://localhost:7295");
});
