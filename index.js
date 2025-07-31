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

window.addEventListener("message", ($e) => {
	if ($e.origin !== "http://localhost:7295") return;

	if ($e.data.type === "AutoSpin") {
		autoSpinCount = $e.data.data;
		// console.log("Child sent AutoSpin:", autoSpinCount);
	}
});

/* = AutoPlay = */

autoPlayButton.addEventListener("click", () => {
	// console.log("🔼 Auto Play window open Message Sent to Game");
	// console.log("waiting for autoplay values");
	iframe.contentWindow.postMessage({type: "AutoSpin", data: {autoSpinCount}}, "http://localhost:7295");
});

autoPlayPlusBtn.addEventListener("click", () => {
	if (autoSpinCount.length > 0 && autoSpinCountIndex < autoSpinCount.length - 1) {
		autoSpinCountIndex = (autoSpinCountIndex + 1) % autoSpinCount.length;
		const selectedCount = autoSpinCount[autoSpinCountIndex];
		console.log("Selected auto spin count:", selectedCount);
	}
});

autoPlayMinusBtn.addEventListener("click", () => {
	if (autoSpinCount.length > 0) {
		autoSpinCountIndex = Math.max(-1, autoSpinCountIndex - 1);
		const selectedCount = autoSpinCountIndex === -1 ? 0 : autoSpinCount[autoSpinCountIndex];
		console.log("Selected auto spin count:", selectedCount);
	}
});

/* = Bets = */

betsButton.addEventListener("click", () => {
	// console.log("🔼 Bets window open Message Sent to Game");
	// console.log("waiting for bet values");
	iframe.contentWindow.postMessage({type: "BetValues", data: {betValues}}, "http://localhost:7295");
});

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
