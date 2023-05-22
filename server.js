const path = require("path");
const http = require("http");
const express = require("express");
const socketIO = require("socket.io");
const cors = require("cors");

const publicPath = path.join(__dirname, "/../public");
const port = process.env.PORT || 3000;
let app = express();
app.use(cors());
let server = http.createServer(app);
let io = socketIO(server);

app.use(express.static("public"));

app.get("/", (req, res, next) => {
	res.send("Rumble Page");
});

io.on("connection", (socket) => {
	socket.username = "";
	socket.color = "#" + Math.floor(Math.random() * 16777215).toString(16);
	socket.id = Math.random();

	socket.emit("init", { color: socket.color });

	socket.on("ping", (time) => {
		socket.emit("pingResponse", time);
	});

	socket.on("enterGame", (username) => {
		socket.username = username;
		GameData.objects.push(new GameObject('player', socket.id, Math.floor(Math.random()*500), Math.floor(Math.random()*500)));

		GameData.players.push({
			id: socket.id,
			username: socket.username,
			color: socket.color,
		});

		socket.emit("enterGameResponse", true);
	});

	socket.on("changeColor", () => {
		socket.color = "#" + Math.floor(Math.random() * 16777215).toString(16);
		socket.emit("changeColorResponse", { color: socket.color });
	});

	socket.on("update", () => {
		socket.emit("updateResponse", GameDataForClient);
	});
});

server.listen(port, () => {
	console.log(`Server is up on port ${port}.`);
});

class GameObject {
	constructor(type, owner, x, y) {
		this.type = type;
		this.owner = owner;

		this.id = Math.random();

		this.x = x;
		this.y = y;
	}
}

var start = new Date().getTime();
var tick = 0;
var f = function () {
	var now = new Date().getTime();
	if (now < start + tick * 16) {
		setTimeout(f, 0);
	} else {
		tick++;
		let start = new Date().getTime();
		run();
		let end = new Date().getTime();
		setTimeout(f, Math.max(0, 16 - (end - start)));
	}
};
setTimeout(f, 0);

var GameData = {
	players: [],
	objects: [],
};
var GameDataForClient = {};
var ticker = 0;
const run = () => {
	ticker++;
	if(GameData.objects[0]){
		GameData.objects[0].x += 6;
		if (GameData.objects[0].x > 2000)
		GameData.objects[0].x = 5;
	}
	GameDataForClient = GameData;
	console.log(GameData);
};


