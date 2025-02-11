<script setup lang="ts">
import IconLogo2 from "@/assets/icons/icon-logo2.svg";

import AddChild from "@children/components/AddChild.vue";
const { loggedIn, user, session, fetch, clear } = useUserSession();
const modal = useModal();

function openModal() {
  modal.open(AddChild, { title: "Welcome" });
}
</script>

<template>
  <header class="pointer-events-none">
    <NuxtLink to="login" class="pointer-events-auto">
      <icon-logo2 class="h-6" :fontControlled="false" filled />
    </NuxtLink>
    <UButton v-if="loggedIn" @click="clear" class="pointer-events-auto"
      >Log Out</UButton
    >
  </header>
</template>

<style scoped>
header {
  grid-row: 1 / -1;
  grid-column: 1 / -1;
  z-index: 10;
  margin-top: 1rem;
  justify-self: center;
}
</style>
