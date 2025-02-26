/**
 * Cloudflare WebSocket Adapter
 *
 * This adapter handles WebSocket connections specifically for Cloudflare Workers
 * and ensures proper reconnection handling and connection management.
 */

import { ref, type Ref } from 'vue'

export interface CloudflareWSOptions {
	maxRetries?: number
	retryDelay?: number
	pingInterval?: number // ms to send ping to keep connection alive
	debug?: boolean
}

export interface CloudflareWSConnection {
	socket: Ref<WebSocket | null>
	status: Ref<string>
	connect: () => void
	disconnect: () => void
	send: (data: any) => boolean
	onMessage: (callback: (data: any) => void) => void
	onStatusChange: (callback: (status: string) => void) => void
}

export function createCloudflareWS(
	url: string,
	options: CloudflareWSOptions = {}
): CloudflareWSConnection {
	const {
		maxRetries = 5,
		retryDelay = 3000,
		pingInterval = 30000,
		debug = false
	} = options

	const socket = ref<WebSocket | null>(null)
	const status = ref<string>('CLOSED')
	const retryCount = ref(0)
	const messageCallbacks: ((data: any) => void)[] = []
	const statusCallbacks: ((status: string) => void)[] = []
	let pingTimer: number | null = null

	const log = (...args: any[]) => {
		if (debug) {
			console.log('[CloudflareWS]', ...args)
		}
	}

	// Format the WebSocket URL with appropriate protocol
	const getProperUrl = (): string => {
		if (typeof window === 'undefined') return url

		// If the URL doesn't have a protocol, add one based on the current page protocol
		if (!url.startsWith('ws://') && !url.startsWith('wss://')) {
			const protocol =
				window.location.protocol === 'https:' ? 'wss://' : 'ws://'

			// If it's a relative URL, prepend the current host
			if (url.startsWith('/')) {
				return `${protocol}${window.location.host}${url}`
			}

			// Otherwise, just add the protocol
			return `${protocol}${url}`
		}

		return url
	}

	// Start sending regular pings to keep the connection alive
	const startPingInterval = () => {
		if (pingTimer) clearInterval(pingTimer)

		pingTimer = window.setInterval(() => {
			if (socket.value?.readyState === WebSocket.OPEN) {
				log('Sending ping to keep connection alive')
				// Send an empty ping packet to keep the connection active
				socket.value.send(
					JSON.stringify({ type: 'ping', timestamp: Date.now() })
				)
			}
		}, pingInterval)
	}

	// Stop the ping interval
	const stopPingInterval = () => {
		if (pingTimer) {
			clearInterval(pingTimer)
			pingTimer = null
		}
	}

	// Updates status and notifies listeners
	const updateStatus = (newStatus: string) => {
		if (status.value !== newStatus) {
			status.value = newStatus
			statusCallbacks.forEach((callback) => callback(newStatus))
		}
	}

	// Connect to the WebSocket server
	const connect = () => {
		if (
			socket.value?.readyState === WebSocket.OPEN ||
			socket.value?.readyState === WebSocket.CONNECTING
		) {
			return
		}

		try {
			const wsUrl = getProperUrl()
			log(`Connecting to ${wsUrl}`)

			updateStatus('CONNECTING')
			socket.value = new WebSocket(wsUrl)

			socket.value.onopen = () => {
				log('Connection established')
				retryCount.value = 0
				updateStatus('OPEN')
				startPingInterval()
			}

			socket.value.onmessage = (event) => {
				try {
					const data = JSON.parse(event.data)
					// Handle ping/pong responses if needed
					if (data.type === 'pong') {
						log('Received pong from server')
						return
					}

					// Notify all message listeners
					messageCallbacks.forEach((callback) => callback(data))
				} catch (error) {
					// If it's not JSON, pass the raw data
					messageCallbacks.forEach((callback) => callback(event.data))
				}
			}

			socket.value.onclose = (event) => {
				updateStatus('CLOSED')
				stopPingInterval()

				// Only attempt to reconnect if it wasn't a clean close
				if (!event.wasClean && retryCount.value < maxRetries) {
					retryCount.value++
					const delay = retryDelay * retryCount.value
					log(
						`Connection closed. Retrying in ${delay}ms (attempt ${retryCount.value}/${maxRetries})`
					)

					setTimeout(() => {
						connect()
					}, delay)
				} else if (retryCount.value >= maxRetries) {
					log('Maximum retry attempts reached.')
					updateStatus('FAILED')
				} else {
					log('Connection closed cleanly.')
				}
			}

			socket.value.onerror = (error) => {
				log('Connection error:', error)
				updateStatus('ERROR')
			}
		} catch (error) {
			log('Failed to create WebSocket:', error)
			updateStatus('ERROR')
		}
	}

	// Disconnect from the WebSocket server
	const disconnect = () => {
		stopPingInterval()

		if (socket.value) {
			// Only attempt to close if the socket is still open
			if (
				socket.value.readyState === WebSocket.OPEN ||
				socket.value.readyState === WebSocket.CONNECTING
			) {
				socket.value.close(1000, 'Client disconnected')
			}
			socket.value = null
		}

		updateStatus('CLOSED')
	}

	// Send data through the WebSocket
	const send = (data: any): boolean => {
		if (socket.value?.readyState === WebSocket.OPEN) {
			const payload = typeof data === 'string' ? data : JSON.stringify(data)
			socket.value.send(payload)
			return true
		} else {
			log('Socket not open, attempting to reconnect...')
			connect()
			return false
		}
	}

	// Register a callback for messages
	const onMessage = (callback: (data: any) => void) => {
		messageCallbacks.push(callback)
	}

	// Register a callback for status changes
	const onStatusChange = (callback: (status: string) => void) => {
		statusCallbacks.push(callback)
		callback(status.value) // Immediately notify with current status
	}

	// Auto-connect if on client side
	if (typeof window !== 'undefined') {
		connect()

		// Clean up on page unload
		window.addEventListener('beforeunload', disconnect)
	}

	return {
		socket,
		status,
		connect,
		disconnect,
		send,
		onMessage,
		onStatusChange
	}
}
