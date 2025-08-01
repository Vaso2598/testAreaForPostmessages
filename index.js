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

startButton.addEventListener("click", () => {
	console.log("Blank for now");
});

/* = Spin = */

window.addEventListener("message", ($e) => {
	if ($e.origin !== "http://localhost:7295") return;

	if ($e.data.type === "Spin") {
		console.log("FreeSpins:", $e.data.data);
	}
});

spinButton.addEventListener("click", () => {
	// console.log("🔼 Spin Message Sent to Game");
	iframe.contentWindow.postMessage({type: "Spin", data: "Bet"}, "http://localhost:7295");
	if (autoSpinCount > 0) {
		iframe.contentWindow.postMessage({type: "AutoSpinCount", data: autoSpinCount}, "http://localhost:7295");
		console.log("sent spin count");
	}
});

/* = AutoPlay = */

window.addEventListener("message", ($e) => {
	if ($e.origin !== "http://localhost:7295") return;

	if ($e.data.type === "AutoSpinValues") {
		autoSpinValues = $e.data.data;
		// console.log("Child sent autoSpinCount:", autoSpinValues);
		autoSpinValues.unshift(0);
		autoSpinCount = autoSpinValues[autoSpinValuesIndex];
		autoPlayButton.innerText = autoSpinCount;
	}
});

/* autoPlayButton.addEventListener("click", () => {
	// console.log("🔼 Auto Play window open Message Sent to Game");
	// console.log("waiting for autoplay values");
	iframe.contentWindow.postMessage({type: "AutoSpinValues", data: {autoSpinValues}}, "http://localhost:7295");
}); */

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

window.addEventListener("message", ($e) => {
	if ($e.data.type === "BetValues") {
		betValues = $e.data.data;
		console.log("Child sent BetValues:", betValues);
		bet = betValues[betValuesIndex];
		betsButton.innerText = bet;
	}
});

/* betsButton.addEventListener("click", () => {
	// console.log("🔼 Bets window open Message Sent to Game");
	// console.log("waiting for bet values");
	iframe.contentWindow.postMessage({type: "BetValues", data: {betValues}}, "http://localhost:7295");
}); */

betsPlusBtn.addEventListener("click", () => {
	if (betValuesIndex < betValues.length - 1) {
		betValuesIndex++;
		bet = betValues[betValuesIndex];
		console.log("Selected bet value:", bet);
		betsButton.innerText = bet;
	}
});

betsMinusBtn.addEventListener("click", () => {
	if (betValuesIndex > 0) {
		betValuesIndex--;
		bet = betValues[betValuesIndex];
		console.log("Selected bet value:", bet);
		betsButton.innerText = bet;
	}
});

/* = Sound = */

/* soundButton.addEventListener("click", () => {
	// console.log("🔼 Sound mute/unmute Message Sent to Game");
	if (isEnabled) {
		iframe.contentWindow.postMessage({type: "Sound", data: {isEnabled}}, "http://localhost:7295");
		isEnabled = false;
	} else {
		iframe.contentWindow.postMessage({type: "Sound", data: {isEnabled}}, "http://localhost:7295");
		isEnabled = true;
	}
}); */

musicButton.addEventListener("click", () => {
	isMusicMuted = !isMusicMuted;
	iframe.contentWindow.postMessage({type: "Music", data: {isMusicMuted}}, "http://localhost:7295");
});

sfxButton.addEventListener("click", () => {
	isSFXMuted = !isSFXMuted;
	iframe.contentWindow.postMessage({type: "SFX", data: {isSFXMuted}}, "http://localhost:7295");
});
