<script lang="ts" setup>
import * as z from "zod";
import type { FormSubmitEvent } from "#ui/types";

const title = "Register";
const description =
  "Use one of the following providers to register for an account.";

useSeoMeta({
  title,
  description,
});

const { loggedIn, user, fetch: refreshSession } = useUserSession();

const schema = z.object({
  firstName: z.string().min(3, "Must be at least 3 characters"),
  lastName: z.string().min(3, "Must be at least 3 characters"),
  email: z.string().email("Invalid email"),
  sex: z.string(),
  password: z.string().min(8, "Must be at least 8 characters"),
  passwordConfirmation: z.string().min(8, "Must be at least 8 characters"),
});

type Schema = z.output<typeof schema>;

const state = reactive<Partial<Schema>>({
  firstName: undefined,
  lastName: undefined,
  email: undefined,
  sex: undefined,
  password: undefined,
  passwordConfirmation: undefined,
});

const toast = useToast();
async function onSubmit(e: FormSubmitEvent<Schema>) {
  try {
    const res = await $fetch("/api/register", {
      method: "POST",
      body: e.data,
    });

    console.log("Register Page", res);

    if (res?.statusCode === 200) {
      toast.add({
        title: "Success",
        description: "The form has been submitted.",
        color: "success",
      });
      await refreshSession();
      navigateTo("/");
    }
  } catch (e) {
    console.log(e);
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
          { value: 'female', label: 'Female' },
        ]"
      />
      <UFormField label="Password" name="password">
        <UInput v-model="state.password" />
      </UFormField>
      <UFormField label="Confirm Password" name="passwordconfirm">
        <UInput v-model="state.passwordConfirmation" />
      </UFormField>
      <UButton type="submit"> Create an Account </UButton>
    </UForm>

    <template #footer>
      <p>Already have an account? <NuxtLink to="/login">Login</NuxtLink></p>
    </template>
  </UCard>
</template>
