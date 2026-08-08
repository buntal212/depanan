<template>
  <div
    :class="badgeClass"
    class="q-px-md q-py-xs text-caption rounded-borders text-weight-medium inline-block"
    style="border-radius: 40px;"
  >
    {{ statusLabel }}
  </div>
</template>

<script setup>
import { computed } from 'vue'
// import { getCssVar } from 'quasar'

const props = defineProps({
  status: String
})

const statusMap = {
  '1': { label: 'Diproses', bg: 'bg-yellow-2', color: 'text-yellow-10' },
  '2': { label: 'Diproses', bg: 'bg-yellow-2', color: 'text-yellow-10' },
  '3': { label: 'Disetujui', bg: 'bg-deep-purple-2', color: 'text-deep-purple-10' },
  '4': { label: 'Tunggu Pengiriman', bg: 'bg-blue-2', color: 'text-blue-10' },
  '5': { label: 'Dikirim', bg: 'bg-teal-2', color: 'text-teal-10' },
  '6': { label: 'Selesai', bg: 'bg-cyan-2', color: 'text-cyan-10' },
  '9': { label: 'Dibatalkan', bg: 'bg-red-2', color: 'text-red-10' },
}

const statusLabel = computed(() => {
  return statusMap[props.status]?.label || 'Unknown'
})

// eslint-disable-next-line no-unused-vars
const badgeStyle = computed(() => {
  const map = statusMap[props.status] || { bg: '#E5E7EB', color: '#6B7280' }
  return {
    backgroundColor: map.bg,
    color: map.color
  }
})
const badgeClass = computed(() => {
  const map = statusMap[props.status] || { bg: 'bg-red', color: 'text-red' }
  return `${map.bg} ${map.color}`
})
</script>
