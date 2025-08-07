const lambdaGame = document.getElementById("gameArea");
const iframe = document.getElementById("gameFrame");

const targetOrigin = "http://localhost:7295";

// let isEnabled = true;
let isMusicMuted = false;
let isSFXMuted = false;
let autoSpinValues = [];
let autoSpinValuesIndex = 0;
let betValues = [];
let betValuesIndex = 0;
let autoSpinValue = 0;
let bet = 0;
let speed = 1;
let speedValues = [1, 2, 3];
let speedValuesIndex = 0;

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
    <button id="speedBtn" class="btn">Speed</button>
</div>
<div id="autoPlay" class="btnContainer"></div>
`;

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

const speedBtn = document.getElementById("speedBtn");

/* = PostMessages = */

window.addEventListener("message", ($e) => {
	if ($e.origin !== targetOrigin) return;

	const { type, data } = $e.data;

	switch (type) {
		case "IsBonusRound":
			console.log("Is Bonus Round", data);
			break;

		case "UpdateBalance":
			console.log("New Balance", data);
			break;

		case "UpdateWin":
			console.log("Total Win", data);
			break;

		case "Spin":
			console.log("FreeSpins:", data);
			if (data) {
				betsPlusBtn.style.pointerEvents = "none";
				betsMinusBtn.style.pointerEvents = "none";
				betsPlusBtn.setAttribute("disabled", "true");
				betsMinusBtn.setAttribute("disabled", "true");
			}
			break;

		case "AutoSpinValues":
			autoSpinValues = data;
			autoSpinValues.unshift(0);
			autoSpinValue = autoSpinValues[autoSpinValuesIndex];
			autoPlayButton.innerText = autoSpinValue;
			break;

		case "AutoSpinValue":
			console.log("AutoSpinValue:", data);
			autoSpinValue = data;
			autoPlayButton.innerText = autoSpinValue;
			break;

		case "BetValues":
			betValues = data;
			bet = betValues[betValuesIndex];
			betsButton.innerText = bet;
			// iframe.contentWindow.postMessage({type: "BetValue", data: bet}, targetOrigin);
			break;

		case "BetValue":
			bet = data;
			betsButton.innerText = bet;
			console.log(bet);
			break;

		case "Music":
			isMusicMuted = data;
			break;

		case "SFX":
			isSFXMuted = data;
			break;

		case "Speed":
			speed = data;
			speedBtn.innerText = `Speed ${speed}`;
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
	if (autoSpinValue > 0) {
		iframe.contentWindow.postMessage({ type: "AutoSpinValue", data: autoSpinValue }, targetOrigin);
		console.log("sent spin count", autoSpinValue);
	} else {
		iframe.contentWindow.postMessage({ type: "Spin", data: bet }, targetOrigin);
	}
});

/* = AutoPlay = */

autoPlayButton.addEventListener("click", () => {
	autoSpinValuesIndex = 0;
	autoSpinValue = autoSpinValues[autoSpinValuesIndex];
	autoPlayButton.innerText = autoSpinValue;
	iframe.contentWindow.postMessage({ type: "AutoSpinValue", data: autoSpinValue }, targetOrigin);
});

autoPlayPlusBtn.addEventListener("click", () => {
	if (autoSpinValuesIndex < autoSpinValues.length - 1) {
		autoSpinValuesIndex++;
		autoSpinValue = autoSpinValues[autoSpinValuesIndex];
		console.log("Selected autoSpinValue value:", autoSpinValue);
		autoPlayButton.innerText = autoSpinValue;
	}
});

autoPlayMinusBtn.addEventListener("click", () => {
	if (autoSpinValuesIndex > 0) {
		autoSpinValuesIndex--;
		autoSpinValue = autoSpinValues[autoSpinValuesIndex];
		console.log("Selected autoSpinValue value:", autoSpinValue);
		autoPlayButton.innerText = autoSpinValue;
	}
});

/* = Bets = */

betsPlusBtn.addEventListener("click", () => {
	if (betValuesIndex < betValues.length - 1) {
		betValuesIndex++;
		bet = betValues[betValuesIndex];
		console.log("Selected bet value:", bet);
		betsButton.innerText = bet;
		iframe.contentWindow.postMessage({ type: "BetValue", data: bet }, targetOrigin);
	}
});

betsMinusBtn.addEventListener("click", () => {
	if (betValuesIndex > 0) {
		betValuesIndex--;
		bet = betValues[betValuesIndex];
		console.log("Selected bet value:", bet);
		betsButton.innerText = bet;
		iframe.contentWindow.postMessage({ type: "BetValue", data: bet }, targetOrigin);
	}
});

/* = Sound = */

musicButton.addEventListener("click", () => {
	isMusicMuted = !isMusicMuted;
	iframe.contentWindow.postMessage({ type: "Music", data: isMusicMuted }, targetOrigin);
});

sfxButton.addEventListener("click", () => {
	isSFXMuted = !isSFXMuted;
	iframe.contentWindow.postMessage({ type: "SFX", data: isSFXMuted }, targetOrigin);
});

/* = Speed = */

speedBtn.addEventListener("click", () => {
	speedValuesIndex = (speedValuesIndex + 1) % speedValues.length;
	speed = speedValues[speedValuesIndex];
	console.log(speed);
	speedBtn.innerText = `Speed ${speed}`;
	iframe.contentWindow.postMessage({ type: "Speed", data: speed }, targetOrigin);
});
