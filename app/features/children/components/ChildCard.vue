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

const { children } = await useChildren();
console.log(children.value);

const child = computed(() =>
  children.value.find((child) => child.id === props.id),
);

async function add() {
  const res = await $fetch("/api/updateMarbles", {
    method: "POST",
    body: JSON.stringify({
      childId: props.child.id,
      amount: 1,
      reason: "Marble transaction",
    }),
    onRequest() {
      previousChildren = children.value;

      const idx = children.value.indexOf(props.id);

      console.log(idx);

      // Optimistically update the todos.
      //children.value = children.splice(idx, 0, child);
    },
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
