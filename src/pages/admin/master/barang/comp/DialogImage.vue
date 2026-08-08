<template>
  <q-dialog v-model="isDialogOpen" persistent>
    <q-card style="width: 300px; max-width: 80vw">
      <q-card-section class="row items-center q-pb-none">
        <div class="full-width full-height q-pb-sm text-center text-h6">Preview Image</div>
        <q-space />
        <q-btn class="absolute-top-right" icon="close" flat round dense @click="closeDialog" />
      </q-card-section>

      <q-card-section class="q-pt-none">
        <!-- Tambahkan class atau style untuk memastikan gambar tampil -->
        <q-img :src="imageUrl" style="max-width: 100%; max-height: 80vh" />
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { ref } from 'vue'

const isDialogOpen = ref(false)
const imageUrl = ref('')

// Fungsi untuk membuka dialog
const openDialog = (url) => {
  imageUrl.value = url
  isDialogOpen.value = true
}

// Fungsi untuk menutup dialog
const closeDialog = () => {
  isDialogOpen.value = false
  imageUrl.value = ''
}

// Ekspos fungsi openDialog agar bisa dipanggil dari luar
defineExpose({
  openDialog,
})
</script>
