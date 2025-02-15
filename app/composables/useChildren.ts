type Child = {
	id: string
	firstName: string
	lastName: string
	transactionSum: number
}

export const useChildren = async () => {
	const children = useState<Child[]>('children', () => [])

	const { status, data, error, close } = useEventSource('/sse', [], {
		autoReconnect: true,
		immediate: true
	})

	watch(data, () => {
		if (data.value === '') return
		children.value = JSON.parse(data.value as string)
	})

	async function getChildren() {
		const res = $fetch('/api/getAll')
		children.value = await res
	}

	return { children, close, getChildren }
}
