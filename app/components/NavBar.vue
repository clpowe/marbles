<script setup lang="ts">
	import IconLogo2 from '@/assets/icons/icon-logo2.svg'

	import AddChild from '@children/components/AddChild.vue'
	const { loggedIn, user, session, fetch, clear } = useUserSession()
	const modal = useModal()

	function openModal() {
		modal.open(AddChild, { title: 'Welcome' })
	}

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
					label: 'logout',
					icon: 'i-lucide-log-out',

					onSelect: (e) => clear()
				}
			]
		}
	})

	watch(data, () => {
		items.value = data.value
	})
</script>

<template>
	<header class="pointer-events-none flex gap-4 items-center">
		<NuxtLink to="/" class="pointer-events-auto">
			<icon-logo2 class="h-6" :fontControlled="false" filled />
		</NuxtLink>
		<UNavigationMenu
			color="neutral"
			:items="data"
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
