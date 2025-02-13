<script setup>
	let children = useState('message', () => [])

	const { status, data, error, close } = useEventSource('/sse', [], {
		autoReconnect: {
			retries: 3,
			delay: 1000,
			onFailed() {
				alert('Failed to connect EventSource after 3 retries')
			}
		}
	})

	children.value = JSON.parse(data.value)

	watch(status, () => {
		// if (data.value === '') return
		console.log(status.value)
		// children.value = JSON.parse(data.value)
	})

	const carousel = useTemplateRef('carousel')

	function next() {
		carousel.value.emblaApi.scrollNext()
	}

	function prev() {
		carousel.value.emblaApi.scrollPrev()
	}

	let events

	onMounted(async () => {
		events = new EventSource('/sse')

		onUnmounted(() => {
			console.log(status.value)
			close()
		})
	})
</script>

<template>
	<!-- <div class="actions pointer-events-none">
    <UButton @click="prev" class="pointer-events-auto">Prev</UButton>
    <UButton @click="next" class="pointer-events-auto">Next</UButton>
  </div> -->
	<section v-if="children" class="">
		<!-- <h2>Children</h2> -->
		<!-- <ChildCard :key="children[0].id" :child="children[0]" /> -->
		<UCarousel
			v-slot="{ item }"
			:items="children"
			class="w-full max-w-xs mx-auto"
		>
			<ChildCard :child="item" />
		</UCarousel>
	</section>
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
