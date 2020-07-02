const {createBinder,arraysEqual} = require('./Util');
const { SOCKET,RESET } = require('./ColorLog');


class Client {
	constructor(game,socket) {
		this.bind = createBinder(this);
		this.socket = socket;
		this.game = game;
		this.name = this.getID();

		this.emit("connect");
		this.bindSocket("disconnect")
		this.bindSocket("joinGame")
		this.bindSocket("movePlayer")
		console.log("Client Connected:", SOCKET+this.name+RESET);
	}
	getID() {
		return this.socket.id;
	}
	
	getSocketRooms() {
		return Object.keys(this.socket.rooms).filter(r=>r!==this.getID())
	}

	join(a) {
		this.socket.join(a);
		console.log(SOCKET+this.getID()+RESET,"has joined",a);
	}
	leave(a) {
		this.socket.leave(a);
		console.log(SOCKET+this.getID()+RESET,"has left",a);
	}

	leaveAll(filter=()=>true) {
		var rooms = this.getSocketRooms();;
		for(var room of rooms) {
			if(filter(room))this.leave(room);
		}
	}

	emit(...a) {
		this.socket.emit(...a);
	}

	bindSocket(name) {
		var t = this;
		this.socket.on(name,(...p)=>{
			console.log(SOCKET+t.getID()+RESET,name,...p)
			this.bind(name)(...p)
		});
	}

	disconnect() {
		this.game.leaveGame(this)
		console.log("Client Disconnected:",SOCKET+this.name+RESET);(this)
	}

	joinGame(info) {
		this.name = info.name;
		info.id = this.getID();
		info = this.game.joinGame(this,info);
		this.emit("joinGame",info);
	}

	movePlayer(info) {
		if(!this.player) return;
		info.id = this.player.id;
		info.sector = this.sector;
		this.game.movePlayer(this,info);
	}
}

module.exports = Client;