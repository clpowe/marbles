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
</script>

<template>
  <MarbleCanvas
    class="marble-canvas h-full w-full"
    :marbles="props.child.transactionSum"
    :id="props.child.id"
    :ui="{ item: 'relative' }"
    :name="props.child.firstName + ' ' + props.child.lastName"
  />
</template>

<style scoped>
/* .actions {
  grid-column: 1 / -1;
  grid-row: 1 / -1;
  }*/
.card-title {
  grid-column: 1 / -1;
  grid-row: 1 / -1;
  place-self: center;
}
.marble-canvas {
  grid-column: 1 / -1;
  grid-row: 1 / -1;
  z-index: 1;
}
</style>
