<script setup lang="ts">
const { clear } = useUserSession()

// Clear the session and redirect to login
onMounted(async () => {
	await clear()
	await navigateTo('/login')
})
</script>

<template>
	<div class="flex items-center justify-center min-h-screen">
		<p>Logging out...</p>
	</div>
</template>
