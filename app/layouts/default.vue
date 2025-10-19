<template>
	<main>
		<NavBar />
		<section class="page-container">
			<slot />
		</section>
	</main>
</template>

<style scoped>
	.page-container {
		max-width: 960px;
		margin: 0 auto;
		padding: 2rem 1rem;
	}
</style>
