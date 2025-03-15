import type { Peer, Message } from 'crossws'
import { getChildren } from '../db/children'

const room = 'room'

export default defineWebSocketHandler({
	async upgrade(request) {
		try {
			await requireUserSession(request)
		} catch (error) {
			console.error('WebSocket upgrade error:', error)
			// Return standardized response for WebSocket connection failure
			return { status: 401, statusText: 'Unauthorized' }
		}
	},
	async open(peer) {
		try {
			const { user } = await requireUserSession(peer)
			const children = await getChildren(user?.id)
			
			// Add a small delay to ensure connection is ready
			setTimeout(() => {
				peer.send(JSON.stringify(children))
				peer.publish(room, JSON.stringify(children))
				peer.subscribe(room)
			}, 100)
			
			console.log('WebSocket opened for user:', user?.id)
		} catch (error) {
			console.error('WebSocket open error:', error)
			peer.close()
		}
	},
	async message(peer, message) {
		try {
			const { user } = await requireUserSession(peer)
			const children = await getChildren(user?.id)
			
			console.log('WebSocket message received:', message.text())
			
			// Check if peer is still connected
			if (peer.websocket.readyState === 1) { // OPEN
				peer.send(JSON.stringify(children))
				peer.publish(room, JSON.stringify(children))
			}
		} catch (error) {
			console.error('WebSocket message error:', error)
		}
	},
	close(peer) {
		console.log('WebSocket connection closed for peer:', peer.id)
		peer.close()
	},
	error(peer, error) {
		console.error('WebSocket error:', error)
		peer.close()
	}
})
