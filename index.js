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
    <button id="soundBtn" class="btn">Sound</button>
</div>
<div id="autoPlay" class="btnContainer"></div>
`;

let isEnabled = true;
let autoSpinCount = [];
let autoSpinCountIndex = -1;
let betValues = [];
let betValuesIndex = 0;

const iframe = document.getElementById("gameFrame");

/* = Buttons = */

const startButton = document.getElementById("startBtn");
const spinButton = document.getElementById("spinBtn");
const autoPlayButton = document.getElementById("autoPlayBtn");
const betsButton = document.getElementById("betsBtn");
const soundButton = document.getElementById("soundBtn");

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
});

/* = AutoPlay = */

window.addEventListener("message", ($e) => {
	if ($e.origin !== "http://localhost:7295") return;

	if ($e.data.type === "AutoSpin") {
		autoSpinCount = $e.data.data;
		// console.log("Child sent AutoSpin:", autoSpinCount);
		autoSpinCount.unshift(0);
	}
});

autoPlayButton.addEventListener("click", () => {
	// console.log("🔼 Auto Play window open Message Sent to Game");
	// console.log("waiting for autoplay values");
	iframe.contentWindow.postMessage({type: "AutoSpin", data: {autoSpinCount}}, "http://localhost:7295");
});

autoPlayPlusBtn.addEventListener("click", () => {
	if (autoSpinCountIndex < autoSpinCount.length - 1) {
		autoSpinCountIndex++;
		const selectedCount = autoSpinCount[autoSpinCountIndex];
		console.log("Selected AutoSpin value:", selectedCount);
	}
});

autoPlayMinusBtn.addEventListener("click", () => {
	if (autoSpinCountIndex > 1) {
		autoSpinCountIndex--;
		const selectedCount = autoSpinCount[autoSpinCountIndex];
		console.log("Selected AutoSpin value:", selectedCount);
	}
});

/* = Bets = */

window.addEventListener("message", ($e) => {
	if ($e.data.type === "BetValues") {
		betValues = $e.data.data;
		console.log("Child sent BetValues:", betValues);
	}
});

betsButton.addEventListener("click", () => {
	// console.log("🔼 Bets window open Message Sent to Game");
	// console.log("waiting for bet values");
	iframe.contentWindow.postMessage({type: "BetValues", data: {betValues}}, "http://localhost:7295");
});

betsPlusBtn.addEventListener("click", () => {
	if (betValuesIndex < betValues.length - 1) {
		betValuesIndex++;
		const selectedCount = betValues[betValuesIndex];
		console.log("Selected bet value:", selectedCount);
	}
});

betsMinusBtn.addEventListener("click", () => {
	if (betValuesIndex > 0) {
		betValuesIndex--;
		const selectedCount = betValues[betValuesIndex];
		console.log("Selected bet value:", selectedCount);
	}
});

/* = Sound = */

soundButton.addEventListener("click", () => {
	// console.log("🔼 Sound mute/unmute Message Sent to Game");
	if (isEnabled) {
		iframe.contentWindow.postMessage({type: "Sound", data: {isEnabled}}, "http://localhost:7295");
		isEnabled = false;
	} else {
		iframe.contentWindow.postMessage({type: "Sound", data: {isEnabled}}, "http://localhost:7295");
		isEnabled = true;
	}
});
