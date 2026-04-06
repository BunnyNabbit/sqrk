// @ts-check
import nh from "node-hill-s"
const { PacketBuilder } = nh

/** Sends a brick kill packet to all connected clients */
export function killBrick(brick, time = 10000) {
	new PacketBuilder("Brick")
		.write("uint32", brick.netId)
		.write("string", "kill")
		.write("uint32", time) // Time in MS til destruction (local to client, must handle deletion on the serverside yourself)
		.broadcast()
}
