type Child = {
	id: string
	firstName: string
	lastName: string
	transactionSum: number
}

export const useChildren = async () => {
	const children = useState<Child[]>('children', () => [])

	const { status, data, error, close } = useEventSource('/sse', [], {
		immediate: true
	})

	watch(data, () => {
		if (status.value == 'OPEN') {
			children.value = JSON.parse(data.value as string)
			return
		}

		if (status.value == 'CONNECTING') {
			children.value = []
			return
		}

		if (status.value == 'CLOSED') {
			children.value = []
			return
		}
	})

	watch(status, () => {})

	async function getChildren() {
		const res = $fetch('/api/getAll')
		children.value = await res
	}

	return { children, close, getChildren }
}
