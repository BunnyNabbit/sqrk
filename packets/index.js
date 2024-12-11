const { PacketBuilder } = require("node-hill-s")

function killBrick(brick, time = 10000) { // Sends a brick kill packet to all connected clients
	new PacketBuilder("Brick")
		.write("uint32", brick.netId)
		.write("string", "kill")
		.write("uint32", time) // Time in MS til destruction (local to client, must handle deletion on the serverside yourself)
		.broadcast()
	world.bricks = world.bricks.filter(b => b.netId != brick.netId);
}

module.exports = {
	killBrick
}