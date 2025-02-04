<script lang="ts" setup>
	import { UPage } from '#components'
</script>

<template>
	<div class="h-screen flex items-center justify-center overlay">
		<div class="gradient" />

		<UButton
			icon="i-heroicons-home"
			label="Home"
			to="/"
			color="primary"
			class="absolute top-4"
		/>

		<slot />
	</div>
</template>
