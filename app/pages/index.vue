<script setup>
	import { UButton } from '#components'
	import AddChild from '~/components/AddChild.vue'

	const { loggedIn, user, session, fetch, clear } = useUserSession()

	let children = useState('message', () => [])

	const { data: load } = useFetch('/api/children/getAll')
	children.value = load

	const { status, data, error, close } = useEventSource('/sse')

	watch(data, () => {
		if (data.value === '') return
		children.value = JSON.parse(data.value)
	})

	onMounted(async () => {
		onUnmounted(() => {
			close()
		})
	})
</script>

<template>
	<UPage>
		<UHeader>
			<template #title>
				<h1>Welcome {{ user.login }}!</h1>
				<p>Logged in since {{ session.loggedInAt }}</p>
			</template>

			<template #right>
				<div v-if="loggedIn">
					<UButton @click="clear">Logout</UButton>
				</div>
				<div v-else>
					<h1>Not logged in</h1>
					<a href="/login">Login</a>
				</div>
				<UColorModeButton />

				<UTooltip text="Open on GitHub" :kbds="['meta', 'G']">
					<UButton
						color="neutral"
						variant="ghost"
						to="https://github.com/nuxt/ui"
						target="_blank"
						icon="i-simple-icons-github"
						aria-label="GitHub"
					/>
				</UTooltip>
			</template>
		</UHeader>
		<UPageBody>
			<section v-if="children">
				<h2>Children</h2>
				<UCarousel
					v-slot="{ item }"
					:items="children"
					class="w-full"
					:ui="{ item: 'basis sm:basis-1/2 md:basis-1/3 lg:basis-1/4' }"
				>
					<ChildCard :child="item" />
				</UCarousel>
			</section>
		</UPageBody>
	</UPage>
</template>
