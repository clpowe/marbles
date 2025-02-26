import { onWatcherCleanup, watch, type Ref } from 'vue'
import { Composite, Body, Bodies, Engine } from 'matter-js'
import { useCloudflareWebSocket } from './useCloudflareWebSocket.client'

export interface Child {
	id: string
	transactionSum: number
	[key: string]: any
}

export const useWebChildren = async () => {
	const children = useState<Child[]>('children', () => [])

	// Use our Cloudflare-optimized WebSocket implementation
	const { status, data, send, connect } =
		useCloudflareWebSocket('/api/websocket')

	// Log connection status
	console.log('WebSocket initial status:', status.value)

	watch(status, (newStatus) => {
		console.log('WebSocket status changed:', newStatus)

		// Attempt to reconnect if needed
		if (newStatus === 'FAILED' || newStatus === 'ERROR') {
			console.log('Attempting to reconnect WebSocket...')
			setTimeout(() => {
				connect()
			}, 5000)
		}
	})

	watch(
		data,
		(newData) => {
			try {
				if (newData) {
					// If it's already an object, use it directly
					if (typeof newData === 'object') {
						children.value = newData || []
					} else {
						// Otherwise, try to parse it as JSON
						children.value = JSON.parse(newData) || []
					}
				}
			} catch (error) {
				console.error('Error parsing WebSocket data:', error)
			}
		},
		{ deep: true }
	)

	function handleUpdate(event: Event) {
		send('update')
	}

	async function add(
		id: string,
		previousChildren: Child[],
		balls: Ref<Body[]>,
		Composite: typeof import('matter-js').Composite,
		Bodies: typeof import('matter-js').Bodies,
		width: Ref<number>,
		size: (min: number, max: number) => number,
		child: Ref<Child>,
		engine: Engine
	) {
		// Save the original children state
		const originalChildren = [...children.value]

		try {
			// Update the UI first for better responsiveness
			previousChildren = originalChildren
			child.value.transactionSum += 1
			const idx = children.value.findIndex((c) => c.id === id)
			children.value[idx] = child.value

			// Add the physics ball
			const centerX = width.value / 2
			let circle: Body = Bodies.circle(centerX, 10, size(30, 80), {
				friction: 0.5,
				frictionAir: 0.001,
				restitution: 0.8
			})
			balls.value.push(circle)
			Composite.add(engine.world, balls.value[balls.value.length - 1])

			// Send the API request
			const res = await fetch('/api/updateMarbles', {
				method: 'POST',
				body: JSON.stringify({
					childId: id,
					amount: 1,
					reason: 'Marble transaction'
				}),
				headers: {
					'Content-Type': 'application/json'
				}
			})

			// Handle errors
			if (!res.ok) {
				throw new Error('API request failed')
			}

			// Request the updated state
			send('update')
		} catch (error) {
			console.error('Error adding marble:', error)

			// Restore original state on error
			children.value = originalChildren

			// Try to get updated state from server
			send('update')
		}
	}

	return { children, handleUpdate, add }
}

// Declare Nuxt composables for TypeScript
declare function useState<T>(key: string, init: () => T): Ref<T>
