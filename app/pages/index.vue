<script setup>
	const { children, close, getChildren } = await useChildren()

	await getChildren()

	function next() {}

	function prev() {}

	onMounted(async () => {
		onUnmounted(() => {
			close()
		})
	})
</script>

<template>
	<div class="grid h-screen w-full place-content-center">
		<section v-if="children" class="grid gap-2">
      <UPageGrid>
			<NuxtLink
				:to="`${child.id}`"
				v-for="child in children"
				:key="child.id"
				class="text-2xl"
				>
      <UCard>


{{ child.firstName }} - {{ child.transactionSum }}
    </UCard>

  </NuxtLink
			>
      </UPageGrid>
		</section>
	</div>
</template>

<style scoped>
	.actions {
		display: flex;
		justify-content: space-between;
		grid-column: 1 / -1;
		grid-row: 1 / -1;
		align-self: center;
		z-index: 10;
		padding-inline: 1rem;
	}

	.page {
		grid-column: 1 / -1;
		grid-row: 1 / -1;
	}
</style>
