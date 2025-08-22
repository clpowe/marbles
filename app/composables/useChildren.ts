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
			// Normalize the parsed data to ensure proper prototype chain
			const parsed = JSON.parse(data.value as string)
			if (Array.isArray(parsed)) {
				children.value = parsed.map((child: any) => ({ ...child }))
			} else {
				children.value = []
			}
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
		const res = await $fetch('/api/getAll')
		// Normalize data to ensure proper prototype chain
		if (Array.isArray(res)) {
			children.value = res.map((child: any) => ({ ...child }))
		} else {
			children.value = []
		}
	}

	return { children, close, getChildren }
}
