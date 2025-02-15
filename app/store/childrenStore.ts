// stores/childrenStore.ts
import { defineStore } from 'pinia'

export interface Child {
	id: string
	firstName: string
	lastName: string
	transactionSum: number
	// add other fields as needed
}

export const useChildrenStore = defineStore('children', () => {
	const children = ref<Child[]>([])

	let eventSource: EventSource | null = null

	function setChildren(newChildren: Child[]) {
		children.value = newChildren
	}

	// Subscribe to SSE endpoint
	function subscribeToSSE() {
		const { status, data, error, close } = useEventSource('/sse')
		setChildren(data.value ? JSON.parse(data.value) : [])
	}

	function disconnectSSE() {
		if (eventSource) {
			eventSource.close()
			eventSource = null
		}
	}

	return { children, subscribeToSSE, disconnectSSE }
})
