const lambdaGame = document.getElementById("gameArea");

lambdaGame.innerHTML = `
<div class="btnContainer">
    <button id="startBtn" class="btn">Start Game</button>
    <button id="spinBtn" class="btn" type="button">Spin</button>
    <button id="autoPlayBtn" class="btn">Auto Play</button>
    <button id="betsBtn" class="btn">Bets</button>
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

startButton.addEventListener("click", () => {
	console.log("Blank for now");
});

spinButton.addEventListener("click", () => {
	// console.log("🔼 Spin Message Sent to Game");
	iframe.contentWindow.postMessage({type: "Spin", data: "Bet"}, "http://localhost:7295");
});

let autoSpinCount = [];

window.addEventListener("message", ($e) => {
	if ($e.origin !== "http://localhost:7295") return;

	if ($e.data.type === "AutoSpin") {
		autoSpinCount = $e.data.data;
		console.log("Child sent AutoSpin:", autoSpinCount);

		// Clear existing content
		autoPlayContainer.innerHTML = "";

		// Create a button for each autoSpinCount value
		console.log(autoSpinCount.typeof);
		autoSpinCount.forEach((count) => {
			const button = document.createElement("button");
			button.textContent = count;
			button.classList.add("btn"); // Add any styling class you want
			button.addEventListener("click", () => {
				console.log(`Auto Spin selected: ${count}`);
				// You can postMessage again or trigger a handler here
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
	console.log(autoSpinCount);
});

betsButton.addEventListener("click", () => {
	console.log("🔼 Bets window open Message Sent to Game");
	console.log("waiting for bet values");
});

soundButton.addEventListener("click", () => {
	// console.log("🔼 Sound mute/unmute Message Sent to Game");
	iframe.contentWindow.postMessage({type: "Sound", data: {isEnabled: true}}, "http://localhost:7295");
});
