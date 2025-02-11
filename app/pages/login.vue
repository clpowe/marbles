<script setup lang="ts">
import IconLogo from "@/assets/icons/icon-logo.svg";

definePageMeta({
  layout: "auth",
});

useSeoMeta({
  title: "Login",
});
</script>

<template>
  <div class="">
    <icon-logo class="max-w-60" :fontControlled="false" filled />
    <LoginForm />
  </div>
</template>
