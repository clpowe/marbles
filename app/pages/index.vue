<script setup>
let children = useState("message", () => []);

const { data: load } = useFetch("/api/getAll");
children.value = load;

const { status, data, error, close } = useEventSource("/sse");

watch(data, () => {
  if (data.value === "") return;
  children.value = JSON.parse(data.value);
});

const carousel = useTemplateRef("carousel");

function next() {
  carousel.value.emblaApi.scrollNext();
}

function prev() {
  carousel.value.emblaApi.scrollPrev();
}

onMounted(async () => {
  onUnmounted(() => {
    close();
  });
});
</script>

<template>
  <div class="actions pointer-events-none">
    <UButton @click="prev" class="pointer-events-auto">Prev</UButton>
    <UButton @click="next" class="pointer-events-auto">Next</UButton>
  </div>
  <section v-if="children" class="h-full page">
    <!-- <h2>Children</h2> -->
    <!-- <ChildCard :key="children[0].id" :child="children[0]" /> -->
    <ClientOnly>
      <UCarousel
        ref="carousel"
        v-slot="{ item }"
        :items="children"
        class="w-full h-full"
        :ui="{ container: 'h-full' }"
      >
        <ChildCard :child="item" />
      </UCarousel>
    </ClientOnly>
  </section>
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
