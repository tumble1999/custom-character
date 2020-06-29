const {createBinder} = require('./Util')

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
	emit(...a) {
		this.socket.emit(...a);
	}

	bindSocket(name) {
		var t = this;
		this.socket.on(name,(...p)=>{
			console.log(t.name,name,...p)
			this.bind(name)(...p)
		});
	}
	disconnect() {
		this.world.removePlayer(this.getID())
		console.log("Client Disconnected:", this.name);
	}

	joinGame(info) {
		this.name = info.name;
		info.id = this.getID();
		this.player = this.world.addPlayer(this,info);
		this.emit("joinGame",{
			id:info.id,
			server:this.world.name,
			players:Object.values(this.world.players)
		});
	}

	movePlayer(info) {
		if(!this.player) return;
		info.id = this.player.id;
		this.world.movePlayer(this,info);
	}
}

module.exports = Client;