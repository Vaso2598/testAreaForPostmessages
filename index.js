const lambdaGame = document.getElementById("gameArea");

lambdaGame.innerHTML = `
<div class="btnContainer">
    <button id="startBtn" class="btn">Start Game</button>
    <button id="spinBtn" class="btn" type="button">Spin</button>
	<div>
    	<button id="autoPlayBtn" class="btn">Auto Play</button>
		<div class="innerBtnContainer">
			<button class="btn smallBtn">+</button>
			<button class="btn smallBtn">-</button>
		</div>
	</div>
	<div>
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

const iframe = document.getElementById("gameFrame");

/* = Buttons = */

const startButton = document.getElementById("startBtn");
const spinButton = document.getElementById("spinBtn");
const autoPlayButton = document.getElementById("autoPlayBtn");
const betsButton = document.getElementById("betsBtn");
const soundButton = document.getElementById("soundBtn");

const autoPlayContainer = document.getElementById("autoPlay");

let isEnabled = true;
let autoSpinCount = [];

startButton.addEventListener("click", () => {
	console.log("Blank for now");
});

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

		autoPlayContainer.innerHTML = "";

		autoSpinCount.forEach((count) => {
			const button = document.createElement("button");
			button.textContent = count;
			button.classList.add("btn");
			button.addEventListener("click", () => {
				console.log(`Auto Spin selected: ${count}`);
				iframe.contentWindow.postMessage({type: "AutoSpinSelected", data: count}, "http://localhost:7295");
			});
			autoPlayContainer.appendChild(button);
		});
	}
});

autoPlayButton.addEventListener("click", () => {
	// console.log("🔼 Auto Play window open Message Sent to Game");
	// console.log("waiting for autoplay values");
	iframe.contentWindow.postMessage({type: "AutoSpin", data: {autoSpinCount}}, "http://localhost:7295");
	// console.log(autoSpinCount);
});

betsButton.addEventListener("click", () => {
	console.log("🔼 Bets window open Message Sent to Game");
	console.log("waiting for bet values");
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
