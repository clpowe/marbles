<script setup lang="ts">
import Matter from "matter-js";

type MarbleTransaction = {
  id: string;
  amount: number;
  reason: string;
};

type Child = {
  id: string;
  firstName: string;
  lastName: string;
  transactionSum: number;
};

const props = defineProps<{
  id: string;
}>();

async function add() {
  const res = await $fetch("/api/updateMarbles", {
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

async function subtract() {
  try {
    const res = await $fetch("/api/updateMarbles", {
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
    balls.value.pop();
  } catch (e) {
    console.log(e);
  }
}

const { children } = useChildren();

watch(children, () => {
  console.log(children.value);
});

const child = computed(() =>
  children.value.find((child) => child.id === props.id),
);
</script>

<template>
  <MarbleCanvas
    v-if="child"
    ref="slideRef"
    class="marble-canvas"
    :marbles="child.transactionSum"
    :id="child.id"
    :name="child.firstName + ' ' + child.lastName"
  />
</template>

<style></style>
