<template>
  <q-form class="full-height" @submit="onSubmit">
    <div class="row full-width justify-between q-px-md">
      <div class="col flex-start q-py-sm">
        <div class="" style="width: 70%">
          <div class="q-pl-sm">Nama Toko</div>
          <q-input dense filled v-model="store.form.namatoko" class="q-pa-sm" />
        </div>
        <div class="" style="width: 70%">
          <div class="q-pt-sm q-pl-sm">Nama Pemilik</div>
          <q-input dense filled v-model="store.form.pemilik" class="q-pa-sm" />
        </div>
        <div class="" style="width: 70%">
          <div class="q-pt-sm q-pl-sm">Nomor Telepon</div>
          <q-input dense filled v-model="store.form.telepon" class="q-pa-sm" style="height: 90px" />
        </div>
      </div>
      <div class="flex-end content-center">
        <div>
          <input
            type="file"
            accept="image/*"
            @change="handleFileUpload"
            style="display: none"
            ref="fileInput"
          />
          <div
            class="foto-container"
            :style="{ backgroundImage: `url(${fotoUrl})` }"
            @click="$refs.fileInput.click()"
          >
            <div class="foto-overlay">
              <span v-if="fotoUrl" class="foto-label">Upload Foto</span>
            </div>
            <q-icon v-if="!fotoUrl" name="photo_camera" size="xl" />
          </div>
        </div>
      </div>
    </div>
    <div class="row full-width justify-between q-px-md">
      <div class="" style="width: 70%">
        <div class="q-pl-sm">Email</div>
        <q-input dense filled v-model="store.form.email" class="q-pa-sm" />
      </div>
      <div class="" style="width: 70%">
        <div class="q-pl-sm">Alamat Toko</div>
        <q-input dense filled v-model="store.form.alamat" class="q-pa-sm" />
      </div>
      <div class="" style="width: 70%">
        <div class="q-pt-sm q-pl-sm">Tentang Toko</div>
        <q-input dense type="textarea" filled v-model="store.form.bio" class="q-pa-sm" />
      </div>
    </div>
    <div class="col-12 q-px-md">
      <q-separator class="q-my-md" />
      <app-btn
        :loading="store.loading"
        type="submit"
        :dense="false"
        label="Update Profil"
        color="green"
      />
    </div>
  </q-form>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useAdminSettingProfilTokoStore } from 'src/stores/admin/settings/profiltoko/form'
import { notifError } from 'src/modules/notifs'
import { pathImg } from 'src/boot/axios'
import { onBeforeUnmount } from 'vue'

const store = useAdminSettingProfilTokoStore()
const fileInput = ref(null)
const previewFoto = ref(null)
const fotoLama = ref(null)

onBeforeUnmount(() => {
  if (store.form.foto instanceof File) {
    URL.revokeObjectURL(store.form.foto)
  }
})
// Memuat data saat komponen di-mount
onMounted(async () => {
  await store.loadData()
  fotoLama.value = store.form.foto
})

// Handle file upload
const handleFileUpload = (event) => {
  const file = event.target.files[0]
  if (!file) return

  if (!file.type.startsWith('image/')) {
    notifError('File harus berupa gambar')
    return
  }
  if (store.form.foto instanceof File) {
    URL.revokeObjectURL(store.form.foto)
  }

  store.form.foto = file
  previewFoto.value = URL.createObjectURL(file)
}

// Handle submit
const onSubmit = async () => {
  try {
    // Pastikan foto tidak null sebelum dikirim
    if (!store.form.foto && fotoLama.value) {
      store.form.foto = fotoLama.value
    }

    await store.save()

    // Update referensi foto lama setelah penyimpanan berhasil
    fotoLama.value = store.form.foto
  } catch (error) {
    console.error('Error saat menyimpan:', error)
  }
}
const fotoUrl = computed(() => {
  if (store.form.foto instanceof File) {
    return URL.createObjectURL(store.form.foto)
  }
  if (typeof store.form.foto === 'string' && store.form.foto) {
    // Pastikan pathImg sudah termasuk /storage/
    // Contoh pathImg: 'http://localhost:8000/storage/'
    return `${pathImg}${store.form.foto}`
  }
  return null
})
</script>

<style scoped>
.q-avatar {
  border: 2px solid #ccc;
  border-radius: 50%;
  overflow: hidden;
}

.q-btn {
  margin: 5px;
}
.foto-container {
  width: 220px;
  height: 220px;
  border-radius: 50%;
  background-color: #9f9f9f;
  background-size: cover;
  background-position: center;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  position: relative;
}

.foto-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.foto-container:hover .foto-overlay {
  opacity: 1;
}

.foto-label {
  color: white;
  font-size: 16px;
  font-weight: bold;
}
</style>
