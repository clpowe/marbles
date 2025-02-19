<script setup>
//const { children, handleClose, getChildren } = await useChildren();
// const children = ref([]);

const { children, handleClose, handleUpdate, handleOpen } =
  await useWebChildren();

// await getChildren();

onMounted(() => {
  handleOpen();
});

function next() {
  send();
}

function prev() {}

onMounted(async () => {
  onUnmounted(() => {
    handleClose();
    //handleClose();
  });
});
</script>

<template>
  <div>
    <div class="actions pointer-events-none">
      <UButton @click="prev" class="pointer-events-auto">Prev</UButton>
      <UButton @click="next" class="pointer-events-auto">Next</UButton>
    </div>
    <div class="grid h-screen w-full place-content-center">
      <section v-show="children" class="grid gap-2">
        <NuxtLink
          :to="`${child.id}`"
          v-for="child in children"
          :key="child.id"
          class="text-2xl"
          >{{ child.firstName }} - {{ child.transactionSum }}</NuxtLink
        >
      </section>
    </div>
  </div>
</template>

<style scoped>
.actions {
  display: flex;
  justify-content: space-between;
  grid-column: 1 / -1;
  grid-row: 1 / -1;
  align-self: center;
  z-index: 10;
  padding-inline: 1rem;
}

.page {
  grid-column: 1 / -1;
  grid-row: 1 / -1;
}
</style>
