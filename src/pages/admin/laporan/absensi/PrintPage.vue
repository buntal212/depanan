<template>
  <main class="print-page">
    <header class="letterhead">
      <div v-if="profileLogo && !logoFailed" class="logo-wrap"><img :src="profileLogo" class="letter-logo" alt="Logo" @error="logoFailed = true" /></div><div v-else class="logo-fallback">JK</div>
      <div class="letter-content"><div class="company-name">{{ profile.namatoko || 'Nama Usaha' }}</div><div class="company-detail">{{ profile.alamat || 'Alamat usaha belum diatur' }}<span v-if="profile.telepon"> · {{ profile.telepon }}</span><span v-if="profile.email"> · {{ profile.email }}</span></div></div>
    </header>
    <header class="print-header">
      <div class="period-title">Periode {{ formatDate(route.query.tglawal) }} s/d {{ formatDate(route.query.tglakhir) }}</div>
      <button class="print-action" @click="windowPrint">Cetak</button>
    </header>
    <section class="report-info"><span>Dicetak: {{ now }}</span><span>{{ rows.length }} catatan</span></section>
    <table>
      <thead><tr><th>Tanggal</th><th>Nama Karyawan</th><th>Jam Masuk</th><th>Jam Pulang</th><th>Status</th><th>Keterangan</th></tr></thead>
      <tbody><tr v-for="row in rows" :key="row.id"><td>{{ row.tanggal }}</td><td class="employee">{{ row.nama_pegawai || '-' }}</td><td>{{ row.jam_masuk || '-' }}</td><td>{{ row.jam_pulang || '-' }}</td><td class="status">{{ row.status || '-' }}</td><td>{{ row.keterangan || '-' }}</td></tr><tr v-if="!loading && !rows.length"><td colspan="6" class="empty">Belum ada data pada periode ini</td></tr></tbody>
    </table>
    <div v-if="loading" class="loading">Memuat data...</div>
  </main>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { api } from 'src/boot/axios'
import { pathImg } from 'src/boot/axios'

const route = useRoute()
const rows = ref([])
const profile = ref({})
const logoFailed = ref(false)
const loading = ref(true)
const now = new Date().toLocaleString('id-ID', { dateStyle: 'long', timeStyle: 'short' })
const formatDate = (value) => value ? new Date(`${value}T00:00:00`).toLocaleDateString('id-ID', { day: '2-digit', month: 'long', year: 'numeric' }) : '-'
const windowPrint = () => window.print()
const profileLogo = computed(() => {
  if (!profile.value.foto) return null
  if (profile.value.foto.startsWith('http')) return profile.value.foto
  return `${pathImg}${profile.value.foto.replace(/^\/?storage\//, '')}`
})
onMounted(async () => {
  try {
    const [report, profileResponse] = await Promise.all([
      api.get('/v1/laporan/absensi/getdata', { params: route.query }),
      api.get('/v1/settings/profiltoko/getprofil'),
    ])
    rows.value = report.data?.data || []
    profile.value = profileResponse.data?.result || profileResponse.data?.data || {}
  } finally { loading.value = false }
})
</script>

<style>
@page { size: A4 portrait; margin: 12mm; }
* { box-sizing: border-box; }
body { background: #fff; color: #111; margin: 0; }
.print-page { -webkit-print-color-adjust: exact; background: #fff; color: #111; font-family: Arial, sans-serif; margin: 0 auto; max-width: 820px; min-height: 100vh; padding: 20px 24px; print-color-adjust: exact; }
.letterhead { align-items: center; border-bottom: 3px solid #1d3557; display: flex; gap: 16px; padding: 0 0 15px; }
.logo-wrap, .logo-fallback { align-items: center; display: flex; flex: 0 0 68px; height: 68px; justify-content: center; width: 68px; }
.letter-logo { border-radius: 50%; height: 68px; object-fit: contain; width: 68px; }
.logo-fallback { background: #102a50 !important; border: 3px solid #102a50; border-radius: 50%; color: #fff !important; font-size: 18px; font-weight: 900; }
.letter-content { flex: 1; text-align: center; }
.company-name { color: #102a50 !important; font-size: 23px; font-weight: 900; letter-spacing: .5px; text-transform: uppercase; }
.company-detail { color: #26384e; font-size: 11px; margin-top: 5px; }
.print-header { align-items: center; border-bottom: 2px solid #171717; display: flex; justify-content: center; padding: 20px 0 16px; position: relative; }
.period-title { color: #172b4d; font-size: 15px; font-weight: 700; text-align: center; }
.print-header .print-action { position: absolute; right: 0; }
.brand { color: #1d3557; font-size: 11px; font-weight: 700; letter-spacing: 2px; }
h1 { color: #172b4d; font-size: 24px; margin: 8px 0 7px; }
.print-header p, .report-info { color: #666; font-size: 12px; margin: 0; }
.print-action { background: #4f39d8; border: 0; border-radius: 6px; color: #fff; cursor: pointer; font-weight: 700; padding: 10px 18px; }
.report-info { display: flex; justify-content: space-between; padding: 14px 0; }
table { border-collapse: collapse; font-size: 11px; table-layout: fixed; width: 100%; }
th { background: #1d3557; color: #fff; font-size: 10px; letter-spacing: .5px; text-align: left; text-transform: uppercase; }
th, td { border: 1px solid #aeb1b8; padding: 10px 8px; }
th:nth-child(1), td:nth-child(1) { width: 14%; } th:nth-child(2), td:nth-child(2) { width: 23%; } th:nth-child(3), td:nth-child(3), th:nth-child(4), td:nth-child(4) { width: 14%; } th:nth-child(5), td:nth-child(5) { width: 15%; } th:nth-child(6), td:nth-child(6) { width: 20%; }
td:nth-child(1), td:nth-child(3), td:nth-child(4), td:nth-child(5) { text-align: center; }
.employee { font-weight: 700; }.status { font-weight: 700; text-transform: capitalize; }.empty, .loading { padding: 24px; text-align: center; }
@media print { .print-page { max-width: none; min-height: auto; padding: 0; } .print-action { display: none; } }
</style>
