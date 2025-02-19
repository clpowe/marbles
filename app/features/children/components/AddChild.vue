<script setup lang="ts">
import * as z from "zod";
import type { FormSubmitEvent } from "#ui/types";
import {
  CalendarDate,
  DateFormatter,
  getLocalTimeZone,
} from "@internationalized/date";

const df = new DateFormatter("en-US", {
  dateStyle: "medium",
});

const { loggedIn, user, fetch: refreshSession } = useUserSession();

const schema = z.object({
  firstName: z.string().min(3, "Must be at least 3 characters"),
  lastName: z.string().min(3, "Must be at least 3 characters"),
  birthDate: z.string(),
  motherId: z.string(),
  fatherId: z.string(),
});

type Schema = z.output<typeof schema>;

const state = reactive({
  firstName: "",
  lastName: "",
  birthDate: "",
  motherId: "",
  fatherId: "",
});

const modelValue = shallowRef(new CalendarDate(2022, 1, 10));

const { data: parents } = await useFetch("/api/users", {
  transform: (data) => {
    return data.map((user: any) => {
      return {
        name: `${user.firstName} ${user.lastName}`,
        value: user.id,
        sex: user.sex,
      };
    });
  },
});

const father = computed(() => {
  let list: any[] = [];
  parents.value?.map((user: any) => {
    if (user.sex === "male") {
      list.push({
        label: user.name,
        value: user.value,
      });
    }
  });
  return list;
});

const mother = computed(() => {
  let list: any[] = [];
  parents.value?.map((user: any) => {
    if (user.sex === "female") {
      list.push({
        label: user.name,
        value: user.value,
      });
    }
  });
  return list;
});
const form = useTemplateRef("form");

async function onSubmit(event: FormSubmitEvent<Schema>) {
  const newChild = {
    firstName: event.data.firstName,
    lastName: event.data.lastName,
    birthDate: modelValue.value,
    motherId: event.data.motherId,
    fatherId: event.data.fatherId,
  };

  try {
    const response = await $fetch("/api/create", {
      method: "POST",
      body: JSON.stringify(newChild),
    });

    if ("statusCode" in response && response.statusCode === 200 && form) {
    }
  } catch (error) {
    console.error(error);
  }
}
</script>

<template>
  <UModal
    :close="{
      color: 'primary',
      variant: 'outline',
      class: 'rounded-full',
    }"
  >
    <template #content>
      <UForm
        ref="form"
        :schema="schema"
        :state="state"
        @submit="onSubmit"
        class="space-y-4"
      >
        <UFormField label="First Name" name="firstName">
          <UInput v-model="state.firstName" />
        </UFormField>

        <UFormField label="Last Name" name="lastName">
          <UInput v-model="state.lastName" />
        </UFormField>

        <UPopover>
          <UButton color="neutral" variant="subtle" icon="i-lucide-calendar">
            {{ df.format(modelValue.toDate(getLocalTimeZone())) }}
          </UButton>

          <template #content>
            <UCalendar v-model="modelValue" class="p-2" />
          </template>
        </UPopover>

        <USelect
          placeholder="Select user"
          name="fatherId"
          v-if="father.length"
          v-model="state.fatherId"
          :items="father"
        />
        <USelect
          name="motherId"
          placeholder="Select user"
          v-if="mother.length"
          v-model="state.motherId"
          :items="mother"
        />
        <UButton type="submit"> Submit </UButton>
      </UForm>
    </template>
  </UModal>
</template>
