type Child = {
  id: string
  firstName: string
  lastName: string
  transactionSum: number
}

export const useWebSocketChildren = async () => {
  const children = useState<Child[]>('children', () => [])

  const { status, data, send, open, close } = useWebSocket('/ws/marbles', {
    immediate: true,
    autoReconnect: true,
    heartbeat: true,
    onDisconnected() {
      console.log('disconnected')
    },
    onMessage(ws, event) {
      children.value = JSON.parse(event.data)
    }
  })

  async function getChildren() {
    const res = await $fetch('/api/getAll')
    // Normalize data to ensure proper prototype chain
    if (Array.isArray(res)) {
      children.value = res.map((child: any) => ({ ...child }))
    } else {
      children.value = []
    }
  }

  return { children, close, getChildren, send }
}
