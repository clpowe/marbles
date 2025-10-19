<script setup lang="ts">
const route = useRoute()
const { children, getChildren } = await useWebSocketChildren()
await getChildren()

const isSaving = ref(false)
const errorMessage = ref('')

const childId = computed(() => {
  const id = route.params.id
  if (typeof id === 'string') {
    return id
  }
  if (Array.isArray(id) && id.length > 0) {
    return id[0] ?? ''
  }
  return ''
})

const child = computed(() =>
  children.value.find((entry) => entry.id === childId.value)
)

function setLocalSum(sum: number) {
  const index = children.value.findIndex(
    (entry) => entry.id === childId.value
  )
  if (index === -1) {
    return
  }

  const current = children.value[index]!
  children.value[index] = { ...current, transactionSum: sum }
}

async function adjust(amount: number) {
  const currentChild = child.value
  if (!currentChild) {
    return
  }


  const previousSum = currentChild.transactionSum
  const nextSum = previousSum + amount

  setLocalSum(nextSum)
  isSaving.value = true
  errorMessage.value = ''

  try {
    await $fetch('/api/updateMarbles', {
      method: 'POST',
      body: {
        childId: currentChild.id,
        amount,
        reason: 'Marble update'
      }
    })
  } catch (error) {
    setLocalSum(previousSum)
    errorMessage.value =
      'We could not save that change. Please try again in a moment.'
  } finally {
    isSaving.value = false
  }
}
</script>

<template>
  <div v-if="child" class="child-detail">
    <NuxtLink to="/" class="back-link">← Back to list</NuxtLink>
    <h1>{{ child.firstName }} {{ child.lastName }}</h1>

    <p class="marble-label">Current total</p>
    <p class="marble-count">{{ child.transactionSum }}</p>

    <div class="actions">
      <button type="button" class="action-button" :disabled="isSaving" @click="adjust(1)">
        Add Marble
      </button>
      <button type="button" class="action-button" :disabled="isSaving" @click="adjust(-1)">
        Remove Marble
      </button>
    </div>

    <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>
  </div>
  <div v-else class="missing">
    <p>Child not found.</p>
    <NuxtLink to="/">Go back</NuxtLink>
  </div>
</template>

<style scoped>
.child-detail {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  padding: 1.5rem;
  background-color: #ffffff;
  border-radius: 1rem;
  border: 1px solid #e2e8f0;
  box-shadow: 0 12px 24px rgba(15, 23, 42, 0.05);
}

.back-link {
  color: #2563eb;
  font-weight: 500;
}

h1 {
  margin: 0;
  font-size: 1.75rem;
  font-weight: 700;
}

.marble-label {
  margin: 0;
  font-size: 0.875rem;
  color: #64748b;
  text-transform: uppercase;
  letter-spacing: 0.08em;
}

.marble-count {
  margin: 0;
  font-size: 4rem;
  font-weight: 700;
  line-height: 1;
}

.actions {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
}

.action-button {
  padding: 0.75rem 1.5rem;
  border-radius: 999px;
  border: 1px solid #2563eb;
  background-color: #2563eb;
  color: #ffffff;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s ease, border-color 0.2s ease;
}

.action-button:hover:enabled {
  background-color: #1d4ed8;
  border-color: #1d4ed8;
}

.action-button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.error-message {
  margin: 0;
  color: #dc2626;
  font-weight: 500;
}

.missing {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}
</style>
