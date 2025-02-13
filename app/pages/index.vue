<script setup>
import { useChildrenStore } from "~/store/childrenStore";
const { children: c, subscribeToSSE } = useChildrenStore();

const { children } = useChildren();

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

subscribeToSSE();
</script>

<template>
  <!-- <div class="actions pointer-events-none">
    <UButton @click="prev" class="pointer-events-auto">Prev</UButton>
    <UButton @click="next" class="pointer-events-auto">Next</UButton>
  </div> -->
  <section v-if="children" class="">
    <NuxtLink
      :to="`child/${child.id}`"
      v-for="child in children"
      :key="child.id"
      >{{ child.firstName }}</NuxtLink
    >
    {{ c }}
    <!-- <h2>Children</h2> -->
    <!-- <ChildCard :key="children[0].id" :child="children[0]" /> -->
    <!-- <UCarousel
      v-slot="{ item }"
      :items="children"
      class="w-full max-w-xs mx-auto"
    >
      <ChildCard :child="item" />
    </UCarousel> -->
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
