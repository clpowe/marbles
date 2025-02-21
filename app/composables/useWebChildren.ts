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
			children.value = JSON.parse(data.value) ?? []

			onWatcherCleanup(() => {
				close()
			})
		},
		{ deep: true }
	)

	open()

	function handleClose() {
		close()
	}

	const handleOpen = (event: Event) => {
		open()
	}
	function handleUpdate(event: Event) {
		send('update')
	}
	return { children, handleClose, handleUpdate, handleOpen }
}
