const BarGenerator = require("./class/BarGenerator.js")
const Timer = require("./class/Timer.js")
const TextNode = require("./class/TextNode.js")
const getFontLength = require("./getFontLength.js")
const sounds = require("./class/Sounds.js")

module.exports = {
	BarGenerator,
	Timer,
	TextNode,
	math: require("./math/index.js"),
	getFontLength,
	Sound: sounds.Sound,
	SoundManager: sounds.SoundManager
}