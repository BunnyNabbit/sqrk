const EventEmitter = require("events").EventEmitter

/**
 * Timer class that extends EventEmitter to provide timing functionality.
 * 
 * @extends EventEmitter
 */
class Timer extends EventEmitter {
	/**
	 * Creates an instance of Timer.
	 */
	constructor() {
		super()
		this.timeStart = Date.now()
		this.timeEnd = Date.now()
		this.active = false
		this.timeout = null
	}

	/**
	 * Gets the remaining time in milliseconds.
	 * 
	 * @returns {number} The remaining time in milliseconds.
	 */
	get timeLeft() {
		if (!this.active) return 0
		return Math.max(this.timeEnd - Date.now(), 0)
	}

	/**
	 * Updates the timer, setting a new timeout and emitting the "update" event.
	 */
	update() {
		this.clear()
		this.active = true
		this.timeout = setTimeout(() => {
			this.active = false
			this.emit("timeout")
		}, this.timeLeft)
		this.emit("update")
	}

	/**
	 * Clears the current timeout and deactivates the timer.
	 */
	clear() {
		this.active = false
		clearTimeout(this.timeout)
	}

	/**
	 * Extends the timer by a specified number of milliseconds.
	 * 
	 * @param {number} ms - The number of milliseconds to extend the timer by.
	 */
	extend(ms) {
		this.timeEnd += ms
		this.update(ms)
		this.emit("extend", ms)
	}

	/**
	 * Sets the timer to end at a specified time.
	 * 
	 * @param {number} timeEnd - The time in milliseconds when the timer should end.
	 */
	set(timeEnd) {
		this.timeStart = Date.now()
		this.timeEnd = this.timeStart + timeEnd
		this.update()
	}
}

module.exports = Timer