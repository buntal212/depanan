<template>
  <q-page class="location-page q-pa-md">
    <div class="page-wrap">
      <div class="row items-center justify-between q-mb-lg">
        <div>
          <div class="text-overline text-primary text-weight-bold">PENGATURAN</div>
          <div class="text-h5 text-weight-bold">Lokasi Absensi</div>
          <div class="text-body2 text-grey-7 q-mt-xs">Tentukan area yang diperbolehkan untuk melakukan absensi.</div>
        </div>
        <q-icon name="location_on" color="primary" size="38px" />
      </div>

      <q-card flat bordered class="settings-card">
        <q-card-section>
          <div class="text-h6 text-weight-bold">Lokasi utama</div>
          <div class="text-caption text-grey-7 q-mt-xs">Pegawai harus berada dalam radius ini saat melakukan absensi.</div>
        </q-card-section>
        <q-card-section class="q-pt-none">
          <q-input v-model="form.nama" outlined label="Nama lokasi" hint="Contoh: Toko Jangur Keramik" />
          <div class="row q-col-gutter-md q-mt-sm">
            <div class="col-12 col-sm-6"><q-input v-model.number="form.latitude" outlined type="number" label="Latitude" /></div>
            <div class="col-12 col-sm-6"><q-input v-model.number="form.longitude" outlined type="number" label="Longitude" /></div>
          </div>
          <q-input v-model.number="form.radius_meter" outlined type="number" label="Radius absensi (meter)" class="q-mt-md" hint="Contoh: 100 meter" />
          <q-toggle v-model="form.aktif" label="Aktifkan pembatasan lokasi absensi" color="primary" class="q-mt-md" />
        </q-card-section>
        <q-card-actions class="q-pa-md q-pt-none" align="right">
          <q-btn outline color="primary" no-caps icon="my_location" label="Ambil lokasi saya" @click="getLocation" />
          <q-btn color="primary" unelevated no-caps icon="save" label="Simpan pengaturan" @click="save" />
        </q-card-actions>
      </q-card>

      <q-card flat class="preview-card q-mt-lg">
        <q-card-section class="row items-center no-wrap">
          <q-avatar color="blue-1" text-color="primary" icon="map" size="52px" />
          <div class="q-ml-md"><div class="text-subtitle1 text-weight-bold">Preview area absensi</div><div class="text-caption text-grey-7">{{ previewText }}</div></div>
        </q-card-section>
      </q-card>
    </div>
  </q-page>
</template>

<script setup>
import { computed, ref } from 'vue'
import { useQuasar } from 'quasar'
import { api } from 'boot/axios'

const $q = useQuasar()
const form = ref({ nama: 'Toko Jangur Keramik', latitude: null, longitude: null, radius_meter: 100, aktif: true })
async function load() { try { const { data } = await api.get('/v1/settings/lokasiabsen/get'); if (data.result) form.value = { ...data.result } } catch (error) { $q.notify({ type: 'negative', message: error.response?.data?.message || 'Lokasi gagal dimuat.' }) } }
const previewText = computed(() => form.value.latitude && form.value.longitude ? `${form.value.latitude}, ${form.value.longitude} · radius ${form.value.radius_meter || 0} meter` : 'Koordinat lokasi belum ditentukan.')
function getLocation() {
  if (!navigator.geolocation) return $q.notify({ type: 'negative', message: 'Perangkat tidak mendukung GPS.' })
  navigator.geolocation.getCurrentPosition((position) => { form.value.latitude = Number(position.coords.latitude.toFixed(7)); form.value.longitude = Number(position.coords.longitude.toFixed(7)); $q.notify({ type: 'positive', message: 'Lokasi berhasil diambil.' }) }, () => $q.notify({ type: 'negative', message: 'Lokasi tidak dapat diakses.' }))
}
async function save() { try { await api.post('/v1/settings/lokasiabsen/save', form.value); $q.notify({ type: 'positive', message: 'Pengaturan lokasi berhasil disimpan.' }) } catch (error) { $q.notify({ type: 'negative', message: error.response?.data?.message || 'Pengaturan gagal disimpan.' }) } }
load()
</script>

<style scoped>
.location-page { min-height: 100%; color: #fff; background: #121212; }.page-wrap { width: min(100%, 900px); margin: 0 auto; }.page-heading .text-h5 { color: #fff !important; }.settings-card .text-h6, .preview-card .text-subtitle1 { color: #1d1d1d !important; }.settings-card, .preview-card { border-radius: 18px; color: #1d1d1d; background: #fff; }.settings-card { box-shadow: 0 10px 28px rgba(0,0,0,.28); }.preview-card { border: 1px solid rgba(255,255,255,.12); }.settings-card :deep(.q-field__control) { min-height: 56px; border-radius: 10px; background: #fff; }.settings-card :deep(.q-field__control::before) { border: 1px solid #c7cfdd; }.settings-card :deep(.q-field__control:hover::before) { border-color: #513fdd; }.settings-card :deep(.q-field__native), .settings-card :deep(.q-field__label), .settings-card :deep(.q-field__marginal) { color: #1d1d1d !important; }.settings-card :deep(.q-field__label) { background: #fff !important; padding: 0 5px; }.settings-card :deep(.q-field--focused .q-field__control::after) { border-color: #513fdd; }.settings-card :deep(.q-field--outlined.q-field--labeled.q-field--float .q-field__label) { background: #fff !important; }
</style>
