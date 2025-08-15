const lambdaGame = document.getElementById("gameArea");
const iframe = document.getElementById("gameFrame");

const targetOrigin = new URL(localStorage.getItem("iframeSrc")).origin;

// let isEnabled = true;
let isMusicMuted = false;
let isSFXMuted = false;
let autoPlayValues = [];
let autoPlayValuesIndex = 0;
let betValues = [];
let betValuesIndex = 0;
let autoPlayValue = 0;
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
		case "Outgoing_IsBonusRound":
			console.log("Is Bonus Round", data);
			break;

		case "Outgoing_UpdateBalance":
			console.log("New Balance", data);
			break;

		case "Outgoing_UpdateWin":
			console.log("Total Win", data);
			break;

		case "Outgoing_Spin":
			console.log("FreeSpins:", data);
			if (data) {
				betsPlusBtn.style.pointerEvents = "none";
				betsMinusBtn.style.pointerEvents = "none";
				betsPlusBtn.setAttribute("disabled", "true");
				betsMinusBtn.setAttribute("disabled", "true");
			}
			break;

		case "Outgoing_AutoPlayValues":
			autoPlayValues = data;
			autoPlayValues.unshift(0);
			autoPlayValue = autoPlayValues[autoPlayValuesIndex];
			autoPlayButton.innerText = autoPlayValue;
			break;

		case "Outgoing_AutoPlayValue":
			console.log("AutoPlayValue:", data);
			autoPlayValue = data;
			autoPlayButton.innerText = autoPlayValue;
			break;

		case "Outgoing_BetValues":
			betValues = data;
			bet = betValues[betValuesIndex];
			betsButton.innerText = bet;
			// iframe.contentWindow.postMessage({type: "BetValue", data: bet}, targetOrigin);
			break;

		case "Outgoing_BetValue":
			bet = data;
			betsButton.innerText = bet;
			console.log(bet);
			break;

		case "Outgoing_Music":
			isMusicMuted = data;
			break;

		case "Outgoing_SFX":
			isSFXMuted = data;
			break;

		case "Outgoing_Speed":
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
	if (autoPlayValue > 0) {
		iframe.contentWindow.postMessage({ type: "Incoming_AutoPlayValue", data: autoPlayValue }, targetOrigin);
		console.log("sent spin count", autoPlayValue);
	} else {
		iframe.contentWindow.postMessage({ type: "Incoming_Spin", data: bet }, targetOrigin);
	}
});

/* = AutoPlay = */

autoPlayButton.addEventListener("click", () => {
	autoPlayValuesIndex = 0;
	autoPlayValue = autoPlayValues[autoPlayValuesIndex];
	autoPlayButton.innerText = autoPlayValue;
	iframe.contentWindow.postMessage({ type: "Incoming_AutoPlayValue", data: autoPlayValue }, targetOrigin);
});

autoPlayPlusBtn.addEventListener("click", () => {
	if (autoPlayValuesIndex < autoPlayValues.length - 1) {
		autoPlayValuesIndex++;
		autoPlayValue = autoPlayValues[autoPlayValuesIndex];
		console.log("Selected autoPlayValue value:", autoPlayValue);
		autoPlayButton.innerText = autoPlayValue;
	}
});

autoPlayMinusBtn.addEventListener("click", () => {
	if (autoPlayValuesIndex > 0) {
		autoPlayValuesIndex--;
		autoPlayValue = autoPlayValues[autoPlayValuesIndex];
		console.log("Selected autoPlayValue value:", autoPlayValue);
		autoPlayButton.innerText = autoPlayValue;
	}
});

/* = Bets = */

betsPlusBtn.addEventListener("click", () => {
	if (betValuesIndex < betValues.length - 1) {
		betValuesIndex++;
		bet = betValues[betValuesIndex];
		console.log("Selected bet value:", bet);
		betsButton.innerText = bet;
		iframe.contentWindow.postMessage({ type: "Incoming_BetValue", data: betValuesIndex }, targetOrigin);
	}
});

betsMinusBtn.addEventListener("click", () => {
	if (betValuesIndex > 0) {
		betValuesIndex--;
		bet = betValues[betValuesIndex];
		console.log("Selected bet value:", bet);
		betsButton.innerText = bet;
		iframe.contentWindow.postMessage({ type: "Incoming_BetValue", data: betValuesIndex }, targetOrigin);
	}
});

/* = Sound = */

musicButton.addEventListener("click", () => {
	isMusicMuted = !isMusicMuted;
	iframe.contentWindow.postMessage({ type: "Incoming_Music", data: isMusicMuted }, targetOrigin);
});

sfxButton.addEventListener("click", () => {
	isSFXMuted = !isSFXMuted;
	iframe.contentWindow.postMessage({ type: "Incoming_SFX", data: isSFXMuted }, targetOrigin);
});

/* = Speed = */

speedBtn.addEventListener("click", () => {
	speedValuesIndex = (speedValuesIndex + 1) % speedValues.length;
	speed = speedValues[speedValuesIndex];
	console.log(speed);
	speedBtn.innerText = `Speed ${speed}`;
	iframe.contentWindow.postMessage({ type: "Incoming_Speed", data: speed }, targetOrigin);
});
