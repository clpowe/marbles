<script setup>
const { loggedIn, user, session, fetch, clear } = useUserSession();

let children = useState("message", () => []);

const { data: load } = useFetch("/api/children/getAll");

children.value = load;

const { status, data, error, close } = useEventSource("/sse");

watch(data, () => {
  if (data.value === "") return;
  children.value = JSON.parse(data.value);
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
    <ChildCard
      v-if="children"
      v-for="child in children"
      :key="child.id"
      :child="child"
    />
  </section>

  <div>
    <AddChild />
  </div>
</template>
