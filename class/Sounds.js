const { PacketBuilder, Vector3 } = require("node-hill-s")

class Sound extends require("events") {
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
		this.destroyed = false
	}
	destroy() {
		this.destroyed = true
		this.emit("destroy")
	}
	static playbackActions = {
		play: "play",
		stop: "stop",
		destroy: "destroy"
	}
	emitSoundPlayback(player, action = Sound.playbackActions.play) {
		new PacketBuilder(22)
			.write("uint32", this.netId)
			.write("string", action)
			.send(player.socket)
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
		isGlobal: ["F", "bool"]
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
					sound.emitSoundPlayback(player, Sound.playbackActions.destroy)
				})
			}
		})
	}
	sendSoundDefinitions(player, sounds = [...this.sounds]) {
		const soundDefiniton = new PacketBuilder(23)
		soundDefiniton.write("uint32", sounds.length)
		sounds.forEach(sound => {
			soundDefiniton.write("uint32", sound.netId)
			soundDefiniton.write("string", sound.uuid)
			soundDefiniton.write("float", sound.position.x)
			soundDefiniton.write("float", sound.position.y)
			soundDefiniton.write("float", sound.position.z)
			let attributeString = ""
			for (const [key, value] of Object.entries(sound)) {
				const mapping = SoundManager.attributePacketMapping[key]
				if (mapping) {
					attributeString += mapping[0]
				}
			}
			soundDefiniton.write("string", attributeString)
			for (const [key, value] of Object.entries(sound)) {
				const mapping = SoundManager.attributePacketMapping[key]
				if (mapping) {
					soundDefiniton.write(mapping[1], value)
				}
			}
			soundDefiniton.send(player.socket)
		})
	}
}

module.exports = {
	SoundManager,
	Sound
}