<script setup lang="ts">
const { data } = useFetch("/api/children/getAll");
</script>

<template>
  {{ data }}
</template>
