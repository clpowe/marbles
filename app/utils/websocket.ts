import { ref, Ref } from 'vue'
import { onWatcherCleanup } from 'vue'

export interface WebSocketReturn {
  status: Ref<string>;
  data: Ref<string>;
  send: (data?: any) => void;
  open: () => void;
  close: () => void;
}

/**
 * WebSocket composable for real-time communication
 * @param url The WebSocket URL to connect to
 * @returns WebSocket utilities including status, data, and methods to interact with the connection
 */
export function useWebSocket(url: string): WebSocketReturn {
  const socket = ref<WebSocket | null>(null)
  const status = ref<string>('CLOSED')
  const data = ref<string>('')
  const reconnectAttempts = ref(0)
  const maxReconnectAttempts = 5
  const reconnectDelay = 3000 // ms

  function getWebSocketUrl() {
    // Parse the provided URL
    let wsUrl = url;
    
    // If we're on Cloudflare, we need to handle the URL differently
    if (typeof window !== 'undefined') {
      // Get the current protocol and host
      const protocol = window.location.protocol === 'https:' ? 'wss://' : 'ws://';
      const host = window.location.host;
      
      // If the URL is relative (starts with /), prepend the protocol and host
      if (url.startsWith('/')) {
        wsUrl = `${protocol}${host}${url}`;
      }
      // If it doesn't have a protocol yet, add it
      else if (!url.startsWith('ws://') && !url.startsWith('wss://')) {
        wsUrl = `${protocol}${url}`;
      }
    }
    
    return wsUrl;
  }

  function open() {
    if (socket.value?.readyState === WebSocket.OPEN) return

    try {
      // Get the properly formatted WebSocket URL
      const wsUrl = getWebSocketUrl();
      
      // Create and configure WebSocket
      socket.value = new WebSocket(wsUrl)
      status.value = 'CONNECTING'

      socket.value.onopen = () => {
        status.value = 'OPEN'
        reconnectAttempts.value = 0 // Reset reconnect attempts on successful connection
        console.log('WebSocket connection established')
      }

      socket.value.onmessage = (event) => {
        data.value = event.data
      }

      socket.value.onclose = (event) => {
        status.value = 'CLOSED'
        socket.value = null
        
        // Attempt to reconnect if not a clean close
        if (!event.wasClean && reconnectAttempts.value < maxReconnectAttempts) {
          console.log(`WebSocket connection closed. Attempting to reconnect (${reconnectAttempts.value + 1}/${maxReconnectAttempts})...`)
          reconnectAttempts.value++
          setTimeout(open, reconnectDelay)
        } else if (reconnectAttempts.value >= maxReconnectAttempts) {
          console.error('Maximum reconnection attempts reached. Please refresh the page.')
        }
      }

      socket.value.onerror = (error) => {
        console.error('WebSocket error:', error)
        status.value = 'ERROR'
      }
    } catch (error) {
      console.error('Error creating WebSocket:', error)
      status.value = 'ERROR'
    }
  }

  function close() {
    if (socket.value) {
      socket.value.close()
      socket.value = null
      status.value = 'CLOSED'
    }
  }

  function send(message?: any) {
    if (socket.value?.readyState === WebSocket.OPEN) {
      socket.value.send(typeof message === 'undefined' ? '' : 
                      typeof message === 'string' ? message : 
                      JSON.stringify(message))
      return true
    } else {
      console.warn('WebSocket is not connected. Trying to reconnect...')
      open()
      // Attempt to send after a short delay to allow connection to establish
      setTimeout(() => {
        if (socket.value?.readyState === WebSocket.OPEN) {
          send(message)
        } else {
          console.error('Failed to send message - WebSocket not connected')
        }
      }, 500)
      return false
    }
  }

  // Open the connection when created
  if (typeof window !== 'undefined') {
    open()
  }

  // Cleanup on component unmount
  if (typeof window !== 'undefined') {
    window.addEventListener('beforeunload', close)
    onWatcherCleanup(() => {
      close()
      window.removeEventListener('beforeunload', close)
    })
  }

  return {
    status,
    data,
    send,
    open,
    close
  }
}
