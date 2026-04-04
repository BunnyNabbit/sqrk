import fonts from "./data/fontLengths.json" with { type: "json" }
/**@todo Yet to be documented.
 *
 * @param {string} string
 * @param {string} [font="bold"] Default is `"bold"`
 */
export function getFontLength(string, font = "bold") {
	font = fonts[font]
	let length = 0
	string.split("").forEach((character) => {
		const characterLengzh = font[character]
		if (characterLengzh) length += characterLengzh
	})
	return length
}

export default getFontLength
