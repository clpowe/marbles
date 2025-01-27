<script setup>
const { loggedIn, user, session, fetch, clear } = useUserSession();
const { data: children } = await useFetch("/api/children/getAll");

let message = ref(undefined);

const { status, data, error, close } = useEventSource("/sse");

watch(data, () => {
  console.log(data);
  message.value = JSON.parse(data.value);
});

onMounted(async () => {
  onUnmounted(() => {
    close();
  });
});
</script>

<template>
  <div v-if="loggedIn">
    <h1>Welcome {{ user.login }}!</h1>
    <p>Logged in since {{ session.loggedInAt }}</p>
    <button @click="clear">Logout</button>
  </div>
  <div v-else>
    <h1>Not logged in</h1>
    <a href="/login">Login</a>
  </div>

  <section>
    <h2>Children</h2>
    <ChildCard v-for="child in message" :key="child.id" :child="child" />
  </section>

  <div>
    <AddChild />
  </div>
</template>
