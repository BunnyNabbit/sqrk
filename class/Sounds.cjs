const { PacketBuilder, Vector3 } = require("node-hill-s")
const EventEmitter = require("node:events")

class Sound extends EventEmitter {

	constructor(data) {
		super()
		this.volume = data.volume ?? 1
		this.pitch = data.pitch ?? 1
		this.loop = data.loop ?? false
		this.range = data.range ?? 30
		this.is3D = data.is3D ?? false
		this.isGlobal = data.isGlobal ?? false
		this.uuid = data.uuid
		this.position = data.position ?? new Vector3(1, 2, 3)
		if (data.playing) this.playbackPosition = 0
		this.destroyed = false
	}

	destroy() {
		this.destroyed = true
		this.emit("destroy")
	}

	static noopHandler = () => { }
	static playbackActions = {
		play: ["play", Sound.noopHandler],
		stop: ["stop", Sound.noopHandler],
		destroy: ["destroy", Sound.noopHandler],
		volume: ["volume", (packet, data) => {
			packet.write("float", data)
		}],
		pitch: ["pitch", (packet, data) => {
			packet.write("float", data)
		}],
		loop: ["loop", (packet, data) => {
			packet.write("bool", data)
		}],
		range: ["range", (packet, data) => {
			packet.write("float", data)
		}],
		global: ["global", (packet, data) => {
			packet.write("bool", data)
		}],
		position: ["position", (packet, data) => {
			packet.write("float", data.x)
			packet.write("float", data.y)
			packet.write("float", data.z)
		}],
		sound: ["sound", (packet, data) => {
			packet.write("string", data)
		}],
	}

	emitSoundAction(player, action = Sound.playbackActions.play, data) {
		const packet = new PacketBuilder(22)
		packet.write("uint32", this.netId)
		packet.write("string", action[0])
		action[1](packet, data) // call action handler
		packet.send(player.socket)
	}

	emitSoundActionAll(action = Sound.playbackActions.play, data) {
		this.emit("actionAll", action, data)
	}
}

class SoundManager {
	constructor(game) {
		this.sounds = new Set()
		this.nextNetId = 0
		this.game = game
		if (this.game) {
			this.game.on("playerJoin", async (player) => {
				this.sendSoundDefinitions(player)
			})
		}
	}

	static attributePacketMapping = {
		volume: ["A", "float"],
		pitch: ["B", "float"],
		loop: ["C", "bool"],
		range: ["D", "float"],
		is3D: ["E", "bool"],
		isGlobal: ["F", "bool"],
		playbackPosition: ["G", "float"]
	}

	newSound(sound) {
		sound.netId = this.nextNetId
		this.sounds.add(sound)
		this.nextNetId += 1
		if (this.game) {
			this.game.players.forEach(player => {
				this.sendSoundDefinitions(player, [sound])
			})
		}
		sound.on("destroy", () => {
			sound.removeAllListeners()
			this.sounds.delete(sound)
			if (this.game) {
				this.game.players.forEach(player => {
					sound.emitSoundAction(player, Sound.playbackActions.destroy)
				})
			}
		})
		sound.on("actionAll", (action) => {
			if (this.game) {
				this.game.players.forEach(player => {
					sound.emitSoundAction(player, action)
				})
			}
		})
	}

	sendSoundDefinitions(player, sounds = [...this.sounds]) {
		sounds.forEach(sound => {
			const soundDefiniton = new PacketBuilder(23)
			soundDefiniton.write("uint32", 1)
			soundDefiniton.write("uint32", sound.netId)
			soundDefiniton.write("string", sound.uuid)
			soundDefiniton.write("float", sound.position.x)
			soundDefiniton.write("float", sound.position.y)
			soundDefiniton.write("float", sound.position.z)
			let attributeString = ""
			for (const [key, value] of Object.entries(sound)) {
				const mapping = SoundManager.attributePacketMapping[key]
				if (mapping) attributeString += mapping[0]
			}
			soundDefiniton.write("string", attributeString)
			for (const [key, value] of Object.entries(sound)) {
				const mapping = SoundManager.attributePacketMapping[key]
				if (mapping) soundDefiniton.write(mapping[1], value)
			}
			soundDefiniton.send(player.socket)
		})
	}
}

module.exports = {
	SoundManager,
	Sound,
}
