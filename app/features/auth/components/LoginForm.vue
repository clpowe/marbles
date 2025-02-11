<script setup lang="ts">
import * as z from "zod";
import type { FormSubmitEvent } from "#ui/types";

const schema = z.object({
  email: z.string().email("Invalid email"),
  password: z.string().min(8, "Must be at least 8 characters"),
});

type Schema = z.output<typeof schema>;

const { loggedIn, user, fetch: refreshSession } = useUserSession();

const credentials = reactive<Partial<Schema>>({
  email: undefined,
  password: undefined,
});

const toast = useToast();
async function login(event: FormSubmitEvent<Schema>) {
  const [formError, res] = await catchError(
    $fetch("/api/login", {
      method: "POST",
      body: event.data,
    }),
  );

  if (formError) {
    toast.add({
      title: "Error",
      //@ts-ignore
      description: formError.statusText,
      color: "error",
    });
    return;
  }

  if (res?.statusCode === 200) {
    toast.add({
      title: "Success",
      description: "Welcome back!",
      color: "success",
    });
    await refreshSession();
    await navigateTo("/");
  }
}
</script>

<template>
  <UCard class="bg-white/75 dark:bg-white/5 backdrop-blur">
    <template #header>
      <h1 class="text-2xl font-bold">Login</h1>
      <p>Enter your email below to login to your account.</p>
    </template>
    <UForm :schema="schema" :state="credentials" @submit="login">
      <UFormField label="Email" name="email">
        <UInput v-model="credentials.email" />
      </UFormField>

      <UFormField label="Password" name="password" class="w-full">
        <UInput v-model="credentials.password" type="password" />
      </UFormField>

      <UButton type="submit"> Login </UButton>
    </UForm>
    <template #footer>
      <p>Don't have an account? <NuxtLink to="/register">Register</NuxtLink></p>
    </template>
  </UCard>
</template>
