<script lang="ts" setup>
const { getChildren } = await useWebSocketChildren()

await getChildren()

</script>

<template>
  <div>
    <NuxtLoadingIndicator />

    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>
