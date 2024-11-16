const BarGenerator = require("./class/BarGenerator.js")
const Timer = require("./class/Timer.js")
const TextNode = require("./class/TextNode.js")
const getFontLength = require("./getFontLength.js")

module.exports = {
	BarGenerator,
	Timer,
	TextNode,
	math: require("./math/index.js"),
	getFontLength
}