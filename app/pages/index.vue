<script setup lang="ts">
const { children, getChildren } = await useWebSocketChildren()
onMounted(getChildren) // client-side fetch so reactivity stays in one lifecycle
</script>

<template>
  <div class="index-page">
    <h1>Marble Tracker</h1>
    <p v-if="!children?.length" class="empty-state">No children found yet.</p>
    <ul v-else class="child-list">
      <li v-for="child in children" :key="child.id" class="child-list-item">
        <NuxtLink :to="`/${child.id}`" class="child-link">
          <span class="child-name">{{ child.firstName }} {{ child.lastName }}</span>
          <span class="child-count">{{ child.transactionSum }} marbles</span>
        </NuxtLink>
      </li>
    </ul>
  </div>
</template>

<style scoped>
.index-page {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

h1 {
  margin: 0;
  font-size: 2rem;
  font-weight: 700;
}

.empty-state {
  color: #64748b;
}

.child-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.child-list-item {
  background-color: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 0.75rem;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
}

.child-link {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem;
}

.child-link:hover {
  border-radius: 0.75rem;
  box-shadow: 0 4px 12px rgba(15, 23, 42, 0.08);
}

.child-name {
  font-weight: 600;
}

.child-count {
  color: #2563eb;
}
</style>
