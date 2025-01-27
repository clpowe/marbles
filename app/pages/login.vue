<script setup lang="ts">
const { loggedIn, user, fetch: refreshSession } = useUserSession();

const credentials = reactive({
  email: "",
  password: "",
});

async function login() {
  try {
    const res = await $fetch("/api/auth/login", {
      method: "POST",
      body: credentials,
    });

    console.log(res);

    if (res.statusCode === 200) {
      await refreshSession();
      const d = await navigateTo("/");
    }
  } catch (e) {
    console.log(e);
  }
}
</script>

<template>
  <form @submit.prevent="login">
    <input v-model="credentials.email" type="email" placeholder="Email" />
    <input
      v-model="credentials.password"
      type="password"
      placeholder="Password"
    />
    <button type="submit">Login</button>
  </form>
</template>
