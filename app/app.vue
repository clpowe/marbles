<script lang="ts" setup>
	const { getChildren } = await useChildren()

	await getChildren()
</script>

<template>
	<UApp>
		<NuxtLoadingIndicator />

		<NuxtLayout>
			<NuxtPage />
		</NuxtLayout>
	</UApp>
</template>
