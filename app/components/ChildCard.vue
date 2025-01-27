<template>
  <UCard class="card">
    <div class="card-body">
      <h5 class="card-title">{{ child.firstName }} {{ child.lastName }}</h5>
      <!-- <p class="card-text">
        {{ child.birthDate }}
      </p> -->
      <p class="card-text">{{ child.transactionSum }} Marbles</p>
    </div>
    <template #footer>
      <form @submit.prevent="add" class="space-y-4">
        <UButton type="submit"> add </UButton>
      </form>

      <form @submit.prevent="subract" class="space-y-4">
        <UButton type="submit"> subtract </UButton>
      </form>
    </template>
  </UCard>
</template>

<script setup lang="ts">
type MarbleTransaction = {
  id: string;
  amount: number;
  reason: string;
};

type Child = {
  id: string;
  firstName: string;
  lastName: string;
  birthDate: string;
  motherId: string;
  marbleTransactions: MarbleTransaction[];
  fatherId: string;
  transactionSum: number;
};

const props = defineProps<{
  child: Child;
}>();

async function add() {
  const res = await $fetch("/api/marbleTransactions/add", {
    method: "POST",
    body: JSON.stringify({
      childId: props.child.id,
      amount: 1,
      reason: "Marble transaction",
    }),
    headers: {
      "Content-Type": "application/json",
    },
  });
}

async function subract() {
  const res = await $fetch("/api/marbleTransactions/add", {
    method: "POST",
    body: JSON.stringify({
      childId: props.child.id,
      amount: -1,
      reason: "Marble transaction",
    }),
    headers: {
      "Content-Type": "application/json",
    },
  });
}
</script>
