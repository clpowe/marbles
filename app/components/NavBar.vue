<script setup lang="ts">
	const { loggedIn, user, session, fetch, clear } = useUserSession()

	const { children } = await useChildren()
	type Child = {
		id: string
		firstName: string
		lastName: string
		transactionSum: number
	}

	const items = ref([])
	const { data, status } = await useFetch('/api/getAll', {
		transform: (data: Child[]) => {
			const Kids = data.map((child) => ({
				label: `${child.firstName}`,
				to: `/${child.id}`
			}))

			return [
				{
					label: 'Children',
					icon: 'i-lucide-baby',
					children: Kids
				},
				{
					label: 'Login',
					icon: 'i-lucide-log-in',
					to: '/login'
				},
				{
					label: 'Logout',
					icon: 'i-lucide-log-out',
					to: '/logout'
				}
			]
		}
	})

	watch(data, () => {
		items.value = data
	})
</script>

<template>
	<header class="pointer-events-none flex gap-4 items-center">
		<NuxtLink to="/" class="pointer-events-auto">
      Marbles
		</NuxtLink>
		<UNavigationMenu
			color="neutral"
			:items="items"
			variant="pill"
			class="w-full pointer-events-auto"
		/>
	</header>
</template>

<style scoped>
	header {
		position: absolute;
		top: 0;
		left: 50%;
		transform: translateX(-50%);
		z-index: 10;
	}
</style>
