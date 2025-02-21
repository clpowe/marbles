import { onWatcherCleanup } from 'vue'

export const useWebChildren = async () => {
	const children = useState<Child[]>('children', () => [])

	const { status, data, send, open, close } = useWebSocket(
		`wss://${location.host}/api/websocket`,
		{
			autoReconnect: {
				retries: 3,
				delay: 1000,

				onFailed() {
					alert('Failed to connect WebSocket after 3 retries')
				}
			}
		}
	)

	watch(status, (newdata) => {
		console.log(status.value)
	})

	watch(
		data,
		(newdata, olddata) => {
			console.log('data', newdata)
			children.value = JSON.parse(data.value) ?? []
			console.log('children', olddata)
		},
		{ deep: true }
	)

	open()

	function handleClose() {
		close()
	}

	const handleOpen = () => {
		open()
	}
	function handleUpdate(event: Event) {
		send('update')
	}

	async function add(
		id,
		previousChildren,
		balls,
		Composite,
		Bodies,
		width,
		size,
		child,
		engine
	) {
		const res = await $fetch('/api/updateMarbles', {
			method: 'POST',
			body: JSON.stringify({
				childId: id,
				amount: 1,
				reason: 'Marble transaction'
			}),
			headers: {
				'Content-Type': 'application/json'
			},
			onRequest() {
				previousChildren = children.value
				child.value.transactionSum += 1
				const idx = children.value.findIndex((child) => child.id === id)
				children.value[idx] = child.value
				const centerX = width.value / 2
				let circle: Matter.Body = Bodies.circle(centerX, 10, size(30, 80), {
					friction: 0.5,
					frictionAir: 0.001,
					restitution: 0.8
				})
				balls.value.push(circle)
				Composite.add(engine.world, balls.value[balls.value.length - 1]!!)
			},
			onResponseError() {
				children.value = previousChildren
				send()
			}
		})
	}

	return { children, handleClose, handleUpdate, handleOpen, add }
}
