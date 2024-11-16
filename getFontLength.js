const fonts = require("./data/fontLengths.json")
function getFontLength(string, font = "bold") {
	font = fonts[font]
	let length = 0
	string.split("").forEach(character => {
		const characterLengzh = font[character]
		if (characterLengzh) length += characterLengzh
	})
	return length
}

module.exports = getFontLength