<script lang="ts" setup>
	import * as z from 'zod'
	import type { FormSubmitEvent } from '#ui/types'

	const title = 'Register'
	const description =
		'Use one of the following providers to register for an account.'

	useSeoMeta({
		title,
		description
	})

	const { loggedIn, user, fetch: refreshSession } = useUserSession()

	const schema = z.object({
		firstName: z.string().min(3, 'Must be at least 3 characters'),
		lastName: z.string().min(3, 'Must be at least 3 characters'),
		email: z.string().email('Invalid email'),
		sex: z.string(),
		password: z
			.string()
			.min(10, 'Must be at least 10 characters')
			.regex(/[A-Z]/, 'Must contain at least one uppercase letter')
			.regex(/[a-z]/, 'Must contain at least one lowercase letter')
			.regex(/[0-9]/, 'Must contain at least one number')
			.regex(/[@$!%*?&]/, 'Must contain at least one special character (@$!%*?&)'),
		passwordConfirmation: z.string()
	})
	.refine(data => data.password === data.passwordConfirmation, {
		message: "Passwords do not match",
		path: ["passwordConfirmation"]
	})

	type Schema = z.output<typeof schema>

	const state = reactive<Partial<Schema>>({
		firstName: undefined,
		lastName: undefined,
		email: undefined,
		sex: undefined,
		password: undefined,
		passwordConfirmation: undefined
	})

	const toast = useToast()
	async function onSubmit(e: FormSubmitEvent<Schema>) {
		try {
			const res = await $fetch('/api/register', {
				method: 'POST',
				body: e.data
			})

			if (res?.statusCode === 200) {
				toast.add({
					title: 'Success',
					description: 'Your account has been created successfully.',
					color: 'success'
				})
				await refreshSession()
				navigateTo('/')
			}
		} catch (error: any) {
			// Generic user-friendly error without exposing details
			let errorMessage = 'Registration failed. Please try again.'
		
			// If it's a validation error, we can safely show it
			if (error?.response?.status === 422) {
				errorMessage = 'Please check your information and try again.'
			} else if (error?.response?.status === 409) {
				errorMessage = 'An account with this email already exists.'
			}
		
			toast.add({
				title: 'Registration Error',
				description: errorMessage,
				color: 'error'
			})
		
			// Server-side logging for monitoring
			console.error('Registration error:', {
				statusCode: error?.response?.status,
				message: error?.message,
				timestamp: new Date().toISOString()
			})
		}
	}
</script>

<template>
	<UCard class="bg-white/75 dark:bg-white/5 backdrop-blur">
		<template #header>
			<h1 class="text-2xl font-bold">Sign Up</h1>
			<p>Enter your information to create an account.</p>
		</template>

		<UForm
			:schema="schema"
			:state="state"
			@submit="onSubmit"
			class="flex flex-col gap-4"
		>
			<UFormField label="First Name" name="firstName">
				<UInput v-model="state.firstName" />
			</UFormField>
			<UFormField label="Last Name" name="lastName">
				<UInput v-model="state.lastName" />
			</UFormField>
			<UFormField label="Email" name="email">
				<UInput v-model="state.email" />
			</UFormField>
			<USelect
				v-model="state.sex"
				name="sex"
				:items="[
					{ value: 'male', label: 'Male' },
					{ value: 'female', label: 'Female' }
				]"
			/>
			<UFormField label="Password" name="password">
				<UInput v-model="state.password" type="password" />
				<template #hint>
					<div class="text-xs">
						Password must contain at least:
						<ul class="list-disc list-inside">
							<li>10 characters</li>
							<li>One uppercase letter</li>
							<li>One lowercase letter</li>
							<li>One number</li>
							<li>One special character (@$!%*?&)</li>
						</ul>
					</div>
				</template>
			</UFormField>
			<UFormField label="Confirm Password" name="passwordConfirmation">
				<UInput v-model="state.passwordConfirmation" type="password" />
			</UFormField>
			<UButton type="submit"> Create an Account </UButton>
		</UForm>

		<template #footer>
			<p>Already have an account? <NuxtLink to="/login">Login</NuxtLink></p>
		</template>
	</UCard>
</template>
