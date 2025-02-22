<script setup lang="ts">
	const { status, data, send, open, close } = useWebSocket(
		`wss://${location.host}/api/websockettest`
	)

	const history = ref<string[]>([])
	watch(data, (newValue) => {
		history.value.push(`server: ${newValue}`)
	})

	const message = ref('')
	function sendData() {
		history.value.push(`client: ${message.value}`)
		send(message.value)
		message.value = ''
	}
</script>

<template>
	<div class="grid place-content-center h-screen">
		<div>
			<h1>WebSocket - let's go!</h1>
			<form @submit.prevent="sendData">
				<UInput v-model="message" />
				<UButton type="submit">Send</UButton>
			</form>
			<div>
				<p v-for="entry in history">{{ entry }}</p>
			</div>
		</div>
	</div>
</template>
