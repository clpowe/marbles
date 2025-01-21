<script lang="ts" setup>
	definePageMeta({
		layout: 'centered'
	})

	const title = 'Register'
	const description =
		'Use one of the following providers to register for an account.'

	useSeoMeta({
		title,
		description
	})

	const { loggedIn, user, fetch: refreshSession } = useUserSession()

	const credentials = reactive({
		firstName: '',
		lastName: '',
		email: '',
		password: '',
		passwordConfirmation: ''
	})

	if (loggedIn) {
		navigateTo('/')
	}

	async function login() {
		try {
			const res = await $fetch('/api/auth/register', {
				method: 'POST',
				body: credentials
			})

			if (res.statusCode === 200) {
				await refreshSession()
				navigateTo('/')
			}
		} catch (e) {
			console.log(e)
		}
	}
</script>

<template>
	<form @submit.prevent="login" class="flex flex-col gap-4">
		<input
			v-model="credentials.firstName"
			type="text"
			placeholder="First Name"
		/>
		<input v-model="credentials.lastName" type="text" placeholder="Last Name" />
		<input v-model="credentials.email" type="email" placeholder="Email" />
		<input
			v-model="credentials.password"
			type="password"
			placeholder="Password"
		/>
		<input
			v-model="credentials.passwordConfirmation"
			type="password"
			placeholder="Confirm Password"
		/>
		<button type="submit">Login</button>
	</form>
</template>
