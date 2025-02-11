<script lang="ts" setup>
import IconLogo from "@/assets/icons/icon-logo.svg";

definePageMeta({
  layout: "auth",
});

useSeoMeta({
  title: "Register",
});
</script>

<template>
  <div class="">
    <icon-logo class="max-w-60" :fontControlled="false" filled />
    <RegistrationForm />
  </div>
</template>
