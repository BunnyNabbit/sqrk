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
		this.pauseTime = null
	}

	/**
	 * Gets the remaining time in milliseconds.
	 * 
	 * @returns {number} The remaining time in milliseconds.
	 */
	get timeLeft() {
		if (this.pauseTime) return this.pauseTime
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
		this.pauseTime = null
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

	/**
	 * Pauses the timer, retaining timer state for resumption.
	 */
	pause() {
		this.pauseTime = this.timeLeft
		this.active = false
		clearTimeout(this.timeout)
	}

	/**
	 * Resumes the timer from a paused state.
	 */
	resume() {
		if (this.pauseTime) {
			this.timeStart = Date.now()
			this.timeEnd = Date.now() + this.pauseTime
			this.timeout = setTimeout(() => {
				this.active = false
				this.emit("timeout")
			}, this.pauseTime)
			this.pauseTime = null
			this.active = true
			this.emit("update")
		}
	}
}

module.exports = Timer