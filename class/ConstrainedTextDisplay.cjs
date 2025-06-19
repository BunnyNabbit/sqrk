const getFontLength = require("../getFontLength.cjs")

class ConstrainedTextDisplay {
	/** */
	constructor(sections, maxFontLength = 350) {
		this.sections = sections
		this.maxFontLength = maxFontLength
	}

	get sideLengthTarget() {
		return this.maxFontLength / 2
	}

	render(value = 0) {
		const filteredPreviousSections = this.sections.filter((section) => section[2] <= value)
		const filteredNextSections = this.sections.filter((section) => section[2] > value)
		const startingSection = filteredNextSections[0]
		const previousSections = filteredPreviousSections.filter((section) => section !== startingSection).reverse()
		const nextSections = filteredNextSections.filter((section) => section !== startingSection)

		const sectionLength = getFontLength(startingSection[0])
		const valueOffset = previousSections[0] ? previousSections[0][2] : 0
		const sectionMiddlePointLength = ((value - valueOffset) / (startingSection[2] - valueOffset)) * sectionLength

		let middlePointStartIndex = 0
		for (let i = 0; i < startingSection[0].length; i++) {
			// iterate via index for cleaner slice later
			if (getFontLength(startingSection[0].slice(0, i + 1)) > sectionMiddlePointLength) {
				middlePointStartIndex = i
				break
			}
		}

		const leftString = ConstrainedTextDisplay.buildString([...[startingSection[0].slice(0, middlePointStartIndex)].map((text) => [text, startingSection[1]]), ...previousSections], true, this.sideLengthTarget).replace(/\\c\d+\\c\d+/g, (match) => match.slice(0, 3)) //regex replace to avoid multiple color codes
		const rightString = ConstrainedTextDisplay.buildString([[startingSection[0].slice(middlePointStartIndex), startingSection[1]], ...nextSections], false, this.sideLengthTarget).replace(/\\c\d+\\c\d+/g, (match) => match.slice(0, 3)) //regex replace to avoid multiple color codes

		const middle = "\\c6|"
		// Ensure no consecutive color codes around the middle:
		const colorCodeRegex = /\\c\d$/ // Regex to match a color code at the end of a string
		const finalLeft = colorCodeRegex.test(leftString) ? leftString.slice(0, -3) : leftString
		return `${finalLeft}${middle}${rightString}`
	}

	static buildString(sections, reverse = false, lengthTarget) {
		let str = ""
		let currentLength = 0
		let lastAddedWasColorCode = false // Flag to track color code additions

		for (const section of sections) {
			const text = reverse ? section[0].split("").reverse().join("") : section[0]
			if (!reverse) str = `${str}${section[1]}`
			for (const char of text) {
				currentLength += getFontLength(char)
				if (currentLength > lengthTarget) {
					if (lastAddedWasColorCode) return str // Avoid adding color code at the very end
					if (reverse) return `${section[1]}${str}`
					return str
				}

				if (char !== "") {
					// Only add if not an empty string
					str = reverse ? `${char}${str}` : `${str}${char}`
					lastAddedWasColorCode = false
				}
			}
			if (reverse) {
				str = `${section[1]}${str}`
				lastAddedWasColorCode = true
			}
		}
		return str
	}
}

module.exports = ConstrainedTextDisplay
