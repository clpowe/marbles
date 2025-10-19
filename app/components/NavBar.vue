<script setup lang="ts">
	const { children, getChildren } = await useChildren()
	await getChildren()
</script>

<template>
	<header class="app-header">
		<NuxtLink to="/" class="brand">Marbles</NuxtLink>
		<nav v-if="children?.length" class="nav-links">
			<NuxtLink
				v-for="child in children"
				:key="child.id"
				:to="`/${child.id}`"
				class="nav-link"
			>
				{{ child.firstName }}
			</NuxtLink>
		</nav>
	</header>
</template>

<style scoped>
	.app-header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 1rem;
		max-width: 960px;
		margin: 0 auto;
	}

	.brand {
		font-weight: 600;
		font-size: 1.25rem;
	}

	.nav-links {
		display: flex;
		flex-wrap: wrap;
		gap: 0.5rem;
	}

	.nav-link {
		display: inline-block;
		padding: 0.25rem 0.75rem;
		border-radius: 999px;
		background-color: #e2e8f0;
		transition: background-color 0.2s ease;
	}

	.nav-link:hover,
	.nav-link.router-link-active {
		background-color: #1d4ed8;
		color: #ffffff;
	}
</style>
