const {createBinder,arraysEqual} = require('./Util')

class Client {
	constructor(world,socket) {
		this.bind = createBinder(this);
		this.socket = socket;
		this.world = world;
		this.name = this.getID();

		this.emit("connect");
		this.bindSocket("disconnect")
		this.bindSocket("joinGame")
		this.bindSocket("movePlayer")
		console.log("Client Connected:", this.name);
	}
	getID() {
		return this.socket.id;
	}

	join(a) {
		this.socket.join(a);
		console.log(this.name,"has joined",a);
	}

	leave(a) {
		this.socket.leave(a);
		console.log(this.name,"has left",a);
	}

	leaveAll() {
		var rooms = this.getSocketRooms();;
		for(var room in rooms) {
			this.socket.leave(room);
		}
	}

	emit(...a) {
		this.socket.emit(...a);
	}

	getSocketRooms() {
		return Object.keys(this.socket.rooms).filter(r=>r!==this.getID())
	}

	bindSocket(name) {
		var t = this;
		this.socket.on(name,(...p)=>{
			console.log(t.name,name,...p)
			this.bind(name)(...p)
		});
	}
	disconnect() {
		this.world.removePlayer(this,this.getID())
		console.log("Client Disconnected:", this.name);
	}

	joinGame(info) {
		this.name = info.name;
		info.id = this.getID();
		var {player,rooms} = this.world.addPlayer(this,info);
		this.player = player;
		this.updateRooms(false);
		this.emit("joinGame",{
			id:info.id,
			server:this.world.name,
			room:this.room,
			rooms,
			players:Object.values(this.world.players)
		});
	}

	movePlayer(info) {
		if(!this.player) return;
		info.id = this.player.id;
		this.world.movePlayer(this,info);
		this.updateRooms(true);
	}

	updateRooms(emit=true) {
		var rooms = this.world.getClientRooms(this);
		
		var roomNames = Object.values(rooms).map(r=>r.name);
		var socketRooms = this.getSocketRooms();

		if(!arraysEqual(roomNames,socketRooms)){
			this.room = rooms.current.name;
			this.leaveAll();
			for(var room of roomNames) {
				this.join(room);
			}
			if(emit) this.emit("updateRooms",rooms)
		}
	}
}

module.exports = Client;