<script setup lang="ts">
	import * as z from 'zod'
	import type { FormSubmitEvent } from '#ui/types'

	const schema = z.object({
		email: z.string().email('Invalid email'),
		password: z.string().min(8, 'Must be at least 8 characters')
	})

	type Schema = z.output<typeof schema>

	const { loggedIn, user, fetch: refreshSession } = useUserSession()

	const credentials = reactive<Partial<Schema>>({
		email: undefined,
		password: undefined
	})

	const toast = useToast()
	async function login(event: FormSubmitEvent<Schema>) {
		try {
			const res = await $fetch('/api/login', {
				method: 'POST',
				body: event.data
			})

			if (res.statusCode === 200) {
				toast.add({
					title: 'Success',
					description: 'Welcome back!',
					color: 'success'
				})
				await refreshSession()
				const d = await navigateTo('/')
			}
		} catch (e) {
			console.log(e)
		}
	}
</script>

<template>
	<UCard class="bg-white/75 dark:bg-white/5 backdrop-blur">
		<UForm :schema="schema" :state="credentials" @submit="login">
			<UFormField label="Email" name="email">
				<UInput v-model="credentials.email" />
			</UFormField>

			<UFormField label="Password" name="password" class="w-full">
				<UInput v-model="credentials.password" type="password" />
			</UFormField>

			<UButton type="submit"> Submit </UButton>
		</UForm>
	</UCard>
</template>
