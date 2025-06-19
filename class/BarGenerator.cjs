class BarGenerator {
	/** */
	constructor(props) {
		this.fullColor = props.fullColor ?? "\\c5"
		this.emptyColor = props.emptyColor ?? "\\c0"
		this.character = props.character ?? "="
		this.barLength = props.barLength ?? 4
	}

	generate(quantity, maxQuantity) {
		// Give us a percentage represented in integer number of bars
		quantity = Math.min(quantity, maxQuantity)
		const percentageFull = Math.max(Math.floor((quantity / maxQuantity) * this.barLength), 0)
		const remainingEmpty = this.barLength - percentageFull

		if (percentageFull) {
			return this.fullColor + this.character.repeat(percentageFull) + this.emptyColor + this.character.repeat(remainingEmpty)
		} else {
			return this.character.repeat(remainingEmpty)
		}
	}
}

module.exports = BarGenerator
