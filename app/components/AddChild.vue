<script setup lang="ts">
import { z } from "zod";
import type { FormSubmitEvent } from "#ui/types";
import { format } from "date-fns";

const { loggedIn, user, fetch: refreshSession } = useUserSession();

const schema = z.object({
  firstName: z.string().min(3, "Must be at least 3 characters"),
  lastName: z.string().min(3, "Must be at least 3 characters"),
  birthDate: z.string().datetime(),
  motherId: z.string(),
  fatherId: z.string(),
});

type Schema = z.output<typeof schema>;

const state = reactive({
  firstName: "",
  lastName: "",
  birthDate: new Date(),
  motherId: "",
  fatherId: "",
});

const { data: parents } = await useFetch("/api/users", {
  transform: (data) => {
    return data.map((user: any) => {
      return {
        name: `${user.firstName} ${user.lastName}`,
        value: user.id,
      };
    });
  },
});

const form = ref();

async function onSubmit(event: FormSubmitEvent<Schema>) {
  try {
    const res = await $fetch("/api/children/create", {
      method: "POST",
      body: state,
    });

    console.log(res);

    if (res.statusCode === 200) {
      console.log("Child created successfully");
    }
  } catch (e) {
    console.log(e);
  }
}
</script>

<template>
  <div>
    <UForm
      ref="form"
      :schema="schema"
      :state="state"
      class="space-y-4"
      @submit="onSubmit"
    >
      <UFormGroup label="First Name" name="firstName">
        <UInput v-model="state.firstName" />
      </UFormGroup>

      <UFormGroup label="Last Name" name="lastName">
        <UInput v-model="state.lastName" />
      </UFormGroup>

      <UPopover :popper="{ placement: 'bottom-start' }">
        <UButton
          icon="i-heroicons-calendar-days-20-solid"
          :label="format(state.birthDate, 'd MMM, yyy')"
        />

        <template #panel="{ close }">
          <DatePicker v-model="state.birthDate" is-required @close="close" />
        </template>
      </UPopover>

      <USelect
        v-model="state.fatherId"
        :options="parents"
        option-attribute="name"
      />
      <USelect
        v-model="state.motherId"
        :options="parents"
        option-attribute="name"
      />

      <UButton type="submit" @click="onSubmit"> Submit </UButton>
      <UButton variant="outline" class="ml-2" @click="form.clear()">
        Clear
      </UButton>
    </UForm>
  </div>
</template>
