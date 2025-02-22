import { onWatcherCleanup } from 'vue'

export const useWebChildren = async () => {
	const children = useState<Child[]>('children', () => [])

	const { status, data, send, open, close } = useWebSocket(
		`wss://${location.host}/api/websocket`
	)

	console.log(location.origin)

	watch(status, (newdata) => {
		console.log(newdata)
	})

	watch(
		data,
		(newData, olddata) => {
			children.value = JSON.parse(newData) ?? []
		},
		{ deep: true }
	)

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

	return { children, handleUpdate, add }
}
