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
  child: Child;
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

const isVisible = ref(false);

const slideRef = ref(null);

useIntersectionObserver(
  slideRef,
  ([{ isIntersecting }]) => {
    if (isIntersecting) isVisible.value = true;
  },
  { threshold: 0.2 },
);
</script>

<template>
  <!-- <div>
    <h2>{{ props.child.firstName + " " + props.child.lastName }}</h2>
    <p>{{ props.child.transactionSum }}</p>
    <UButtonGroup size="sm" orientation="horizontal">
      <UButton
        icon="i-heroicons-chevron-up-20-solid "
        size="sm"
        @click="add"
        variant="outline"
        class="pointer-events-auto rounded-full"
      />
      <UButton
        icon="i-heroicons-chevron-down-20-solid"
        size="sm"
        @click="subtract"
        variant="outline"
        class="pointer-events-auto rounded-full"
      />
    </UButtonGroup>
  </div> -->
  <MarbleCanvas
    ref="slideRef"
    class="marble-canvas"
    :marbles="child.transactionSum"
    :id="child.id"
    :ui="{ item: 'relative' }"
    :name="child.firstName + ' ' + child.lastName"
  />
</template>

<style>
.embla__slide {
  transition: opacity 0.2s ease-in-out;
}
.embla__slide:not(.is-snapped) {
  opacity: 0.16;
}
</style>
