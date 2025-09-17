const lambdaGame = document.getElementById("gameArea");
const iframe = document.getElementById("gameFrame");

// const targetOrigin = new URL(localStorage.getItem("iframeSrc")).origin;
const targetOrigin = "*";
console.log(targetOrigin);

// let isEnabled = true;
let isMusicMuted = true;
let isSFXMuted = true;
let autoPlayValues = [];
let autoPlayValuesIndex = 0;
let betValues = [];
let betValuesIndex = 0;
let autoPlayValue = 0;
let bet = 0;
let speed = 1;
let speedValues = [1, 2, 3];
let speedValuesIndex = 0;
let isVIP = false;

lambdaGame.innerHTML = `
<div class="btnContainer">
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
    <button id="VIPBtn" class="btn">VIP</button>
</div>
<div id="autoPlay" class="btnContainer"></div>
`;

/* = Buttons = */

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

const vipBtn = document.getElementById("VIPBtn");

/* = PostMessages = */

window.addEventListener("message", ($e) => {
	// console.log($e);
	// if ($e.origin !== targetOrigin) return;

	const { type, data } = $e.data;

	switch (type) {
		case "Outgoing_MachineInitialized":
			console.log("Machine Initialized", data);
			break;

		case "Outgoing_IntroComplete":
			console.log("Intro Play Button Clicked", data);
			break;

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
			// bet = betValues[betValuesIndex];
			// betsButton.innerText = bet;
			break;

		case "Outgoing_BetValueIndex":
			betValuesIndex = data;
			bet = betValues[betValuesIndex];
			// console.log(bet);
			betsButton.innerText = bet;
			break;

		case "Outgoing_Music":
			isMusicMuted = !data; // data is true when music is enabled, so muted is the opposite
			console.log("Received from game - Music enabled:", data); //, "Music muted:", isMusicMuted);
			// Update button text to show current state
			musicButton.innerText = isMusicMuted ? "Music: OFF" : "Music: ON";
			break;

		case "Outgoing_SFX":
			isSFXMuted = !data; // data is true when SFX is enabled, so muted is the opposite
			console.log("Received from game - SFX enabled:", data); //, "SFX muted:", isSFXMuted);
			// Update button text to show current state
			sfxButton.innerText = isSFXMuted ? "SFX: OFF" : "SFX: ON";
			break;

		case "Outgoing_Speed":
			speed = data;
			speedBtn.innerText = `Speed ${speed}`;
			break;

		case "Outgoing_InfoPanelOpened":
			console.log("Menu is open:", data);
			break;

		default:
			console.log("Unhandled message type:", type, data);
			break;
	}
});

/* = Button Event Listeners = */
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
		iframe.contentWindow.postMessage({ type: "Incoming_BetValueIndex", data: betValuesIndex }, targetOrigin);
	}
});

betsMinusBtn.addEventListener("click", () => {
	if (betValuesIndex > 0) {
		betValuesIndex--;
		bet = betValues[betValuesIndex];
		console.log("Selected bet value:", bet);
		betsButton.innerText = bet;
		iframe.contentWindow.postMessage({ type: "Incoming_BetValueIndex", data: betValuesIndex }, targetOrigin);
	}
});

/* = Sound = */

musicButton.addEventListener("click", () => {
	isMusicMuted = !isMusicMuted;
	// console.log("Sending music muted state:", isMusicMuted);
	console.log("Music button clicked. New state - Music muted:", isMusicMuted, "SFX muted:", isSFXMuted);
	// Send the muted state (true = muted, false = not muted)
	// iframe.contentWindow.postMessage({ type: "Incoming_Music", data: isMusicMuted }, targetOrigin);
	syncAudioStates();
	musicButton.innerText = isMusicMuted ? "Music: OFF" : "Music: ON";
});

sfxButton.addEventListener("click", () => {
	isSFXMuted = !isSFXMuted;
	// console.log("Sending SFX muted state:", isSFXMuted);
	console.log("SFX button clicked. New state - Music muted:", isMusicMuted, "SFX muted:", isSFXMuted);
	// Send the muted state (true = muted, false = not muted)
	// iframe.contentWindow.postMessage({ type: "Incoming_SFX", data: isSFXMuted }, targetOrigin);
	syncAudioStates();
	sfxButton.innerText = isSFXMuted ? "SFX: OFF" : "SFX: ON";
});

function syncAudioStates() {
	iframe.contentWindow.postMessage({ type: "Incoming_Music", data: !isMusicMuted }, targetOrigin);
	iframe.contentWindow.postMessage({ type: "Incoming_SFX", data: !isSFXMuted }, targetOrigin);
}

/* = Speed = */

speedBtn.addEventListener("click", () => {
	speedValuesIndex = (speedValuesIndex + 1) % speedValues.length;
	speed = speedValues[speedValuesIndex];
	console.log(speed);
	speedBtn.innerText = `Speed ${speed}`;
	iframe.contentWindow.postMessage({ type: "Incoming_Speed", data: speed }, targetOrigin);
});

/* = VIP = */

vipBtn.addEventListener("click", () => {
	isVIP = !isVIP;
	vipBtn.innerText = `VIP ${isVIP}`;
	iframe.contentWindow.postMessage({ type: "Incoming_VIPEnabled", data: isVIP }, targetOrigin);
});
