<script setup>
import { useRoute } from "vue-router";

const route = useRoute();
</script>

<template>
  <ChildCard :id="route.params.id" />
</template>

<style scoped>
.page {
  grid-column: 1 / -1;
  grid-row: 1 / -1;
}
</style>
