<template>
  <div class="app-counter" :class="{ warning: isWarning }">
    <q-icon name="timer" class="q-mr-xs" />
    <span>{{ formattedCount }}</span>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, computed } from 'vue'
import { useAppStore } from 'src/stores/app'
import { notifError } from 'src/modules/notifs'

const count = ref(0)
let counterInterval = null
const app = useAppStore()

// Batas waktu untuk logout (dalam detik)
const logoutThreshold = 600

// Format angka dengan pemisah ribuan
const formattedCount = ref('0')

// Apakah sudah mendekati waktu logout (5 detik sebelum logout)
const isWarning = computed(() => {
  return count.value >= logoutThreshold - 5 && count.value < logoutThreshold
})

// Update counter
const updateCounter = () => {
  count.value++
  formattedCount.value = count.value.toLocaleString()

  // Jika mencapai batas waktu, lakukan logout
  if (count.value >= logoutThreshold) {
    // Hentikan counter
    if (counterInterval) {
      clearInterval(counterInterval)
      counterInterval = null
    }

    // Hapus event listeners
    removeActivityListeners()

    // Tampilkan notifikasi
    notifError('Anda telah logout otomatis karena tidak aktif selama 30 detik')

    // Lakukan logout
    app.logout()
  }
}

// Reset counter ke 0
const resetCounter = () => {
  count.value = 0
  formattedCount.value = '0'
}

// Daftar event yang akan di-monitor untuk reset counter
const setupActivityListeners = () => {
  const events = ['mousemove', 'mousedown', 'keypress', 'touchstart', 'scroll', 'click']

  // Tambahkan event listener untuk setiap event
  events.forEach((event) => {
    document.addEventListener(event, resetCounter)
  })
}

// Hapus event listeners
const removeActivityListeners = () => {
  const events = ['mousemove', 'mousedown', 'keypress', 'touchstart', 'scroll', 'click']

  events.forEach((event) => {
    document.removeEventListener(event, resetCounter)
  })
}

onMounted(() => {
  // Set interval untuk update setiap detik
  counterInterval = setInterval(updateCounter, 1000)

  // Setup event listeners untuk aktivitas
  setupActivityListeners()
})

onBeforeUnmount(() => {
  // Bersihkan interval saat komponen dihapus
  if (counterInterval) {
    clearInterval(counterInterval)
  }

  // Hapus event listeners
  removeActivityListeners()
})
</script>

<style scoped>
.app-counter {
  display: flex;
  align-items: center;
  font-size: 1rem;
  background-color: rgba(0, 0, 0, 0.1);
  padding: 4px 8px;
  border-radius: 4px;
  transition: background-color 0.3s ease;
}

.app-counter.warning {
  background-color: rgba(255, 0, 0, 0.2);
  animation: pulse 1s infinite;
}

@keyframes pulse {
  0% {
    opacity: 1;
  }
  50% {
    opacity: 0.7;
  }
  100% {
    opacity: 1;
  }
}
</style>
