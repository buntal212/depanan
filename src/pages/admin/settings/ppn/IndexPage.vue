<template>
  <q-page class="q-pa-md">
    <div class="page-wrap">
      <div class="q-mb-lg">
        <div class="text-h5 text-weight-bold">Pengaturan PPN</div>
        <div class="text-grey-7">Tarif hanya diterapkan pada nota penjualan baru dan disimpan tetap pada setiap nota.</div>
      </div>

      <q-card flat bordered class="settings-card">
        <q-card-section>
          <q-form @submit="simpan">
            <q-toggle
              v-model="form.aktif"
              label="Aktifkan PPN pada penjualan baru"
              color="primary"
              :disable="loading"
            />

            <q-input
              v-model.number="form.persen"
              class="q-mt-md"
              outlined
              type="number"
              suffix="%"
              label="Tarif PPN"
              :disable="loading || !form.aktif"
              :rules="[(nilai) => !form.aktif || Number(nilai) > 0 || 'Tarif PPN harus lebih dari 0%']"
              min="0"
              max="100"
              step="0.01"
            />
          </q-form>
        </q-card-section>
        <q-separator />
        <q-card-actions align="right" class="q-pa-md">
          <q-btn flat label="Muat Ulang" :disable="loading" @click="muat" />
          <q-btn color="primary" label="Simpan Pengaturan" :loading="loading" @click="simpan" />
        </q-card-actions>
      </q-card>
    </div>
  </q-page>
</template>

<script setup>
import { api } from 'src/boot/axios'
import { notifError, notifSuccess } from 'src/modules/notifs'
import { onMounted, reactive, ref } from 'vue'

const loading = ref(false)
const form = reactive({ aktif: false, persen: 0 })

async function muat() {
  loading.value = true
  try {
    const { data } = await api.get('/v1/settings/ppn')
    form.aktif = Boolean(data?.result?.aktif)
    form.persen = Number(data?.result?.persen || 0)
  } catch (error) {
    notifError(error?.response?.data?.message || 'Pengaturan PPN gagal dimuat.')
  } finally {
    loading.value = false
  }
}

async function simpan() {
  loading.value = true
  try {
    const { data } = await api.post('/v1/settings/ppn', {
      aktif: form.aktif,
      persen: Number(form.persen || 0),
    })
    form.aktif = Boolean(data?.result?.aktif)
    form.persen = Number(data?.result?.persen || 0)
    notifSuccess(data?.message || 'Pengaturan PPN berhasil disimpan.')
  } catch (error) {
    notifError(error?.response?.data?.message || 'Pengaturan PPN gagal disimpan.')
  } finally {
    loading.value = false
  }
}

onMounted(muat)
</script>

<style scoped>
.page-wrap { max-width: 720px; }
.settings-card { border-radius: 12px; }
</style>
