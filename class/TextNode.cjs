const { Bot, Vector3 } = require("node-hill-s")

class TextNode {
	/** */
	constructor(game, position = new Vector3(0, 0, 0), text) {
		this.game = game
		this.bot = null
		this.position = position
		this.setText(text)
	}

	enableBot() {
		if (this.bot) return false
		this.bot = new Bot("")
		this.bot.position = new Vector3().fromVector(this.position)
		this.bot.scale = new Vector3(0, 0, 0)
		this.game.newBot(this.bot)
	}

	disableBot() {
		if (!this.bot) return false
		this.bot.destroy()
		this.bot = null
	}

	setText(text) {
		if (text) {
			this.enableBot()
			this.bot.setSpeech(text)
		} else {
			this.disableBot()
		}
	}
}

module.exports = TextNode
