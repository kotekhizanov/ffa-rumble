let socket = io();

changeColor.addEventListener("click", () => {
	socket.emit("changeColor");
});

enterGame.addEventListener("click", () => {
	socket.emit("enterGame", username.value);
});

socket.on("pingResponse", (time) => {
	ping.innerHTML = time - new Date().getTime() + 3;
});

socket.on("enterGameResponse", (color) => {
	playerScreen.classList.add("disabled");
});

socket.on("init", (data) => {
	document.querySelector(":root").style.setProperty("--color", data.color);
});

socket.on("changeColorResponse", (data) => {
	document.querySelector(":root").style.setProperty("--color", data.color);
});

socket.on("updateResponse", (data) => {
	//console.log("updateResponse", data);
	data.objects.forEach((e) => {
		renderObject(e.id, e.type, e.owner, e.x, e.y);
	});
});

setTimeout(updateDataFromServer, 16);
function updateDataFromServer() {
	socket.emit("update");
	setTimeout(updateDataFromServer, 16);
}

// setTimeout(ping, 0);
// function ping() {
//     socket.emit("ping");
//     setTimeout(ping, 1000);
// };

var GameData = {
	players: [],
	objects: [],
};

function renderObject(id, type, owner, x, y) {
	// if(GameData.objects.some(e => e.id === id)){

	// }
	let gameObject = document.getElementById(id);
	if (!gameObject) {
		rumbleArea.innerHTML += `<div class="gameObject player" id="${id}"></div>`;
		gameObject = document.getElementById(id);
	}

	gameObject.style.left = x+'px';
	gameObject.style.top = y+'px';
}

function getDefaultsFromTemplate(type) {
	let object = {
		width: 10,
		height: 10,
		color: "#ff7f50",
	};
}

class GameObject {
	constructor(type, owner, x, y) {
		this.type = type;
		this.owner = owner;

		this.id = Math.random();

		this.x = x;
		this.y = y;
	}
}

window.onload = init;

function init() {
	window.requestAnimationFrame(gameLoop);
}

function gameLoop(timeStamp) {
	draw();

	// Keep requesting new frames
	window.requestAnimationFrame(gameLoop);
}

function draw() {
}
