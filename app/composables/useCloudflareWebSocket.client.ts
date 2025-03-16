import { ref, watch, type Ref, onUnmounted } from 'vue'
import { createCloudflareWS } from '../utils/cloudflare-ws-adapter'

export interface CloudflareWebSocketReturn {
	status: Ref<string>
	data: Ref<any>
	send: (data?: any) => boolean
	connect: () => void
	disconnect: () => void
}

/**
 * Composable for using WebSockets with Cloudflare Workers
 *
 * This composable provides a reactive interface for WebSocket connections
 * optimized for Cloudflare Workers deployment.
 *
 * @param url The WebSocket URL to connect to
 * @returns WebSocket utilities including status, data, and methods to interact with the connection
 */
export function useCloudflareWebSocket(url: string): CloudflareWebSocketReturn {
	// Create a data ref to store the latest message
	const data = ref<any>(null)
	const connection = createCloudflareWS(url, {
		maxRetries: 5,
		retryDelay: 2000,
		pingInterval: 30000,
		debug: true
	})

	// Forward messages to the data ref
	connection.onMessage((message) => {
		data.value = message
	})

	// Cleanup on component unmount
	onUnmounted(() => {
		connection.disconnect()
	})

	return {
		status: connection.status,
		data,
		send: connection.send,
		connect: connection.connect,
		disconnect: connection.disconnect
	}
}
