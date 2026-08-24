<template>
  <q-page class="attendance-page q-pa-md">
    <div class="hero row items-center justify-between q-mb-lg">
      <div>
        <div class="eyebrow">PEOPLE ANALYTICS</div>
        <div class="text-h4 text-weight-bold q-mt-xs">Laporan Absensi</div>
        <div class="text-body2 text-grey-6 q-mt-xs">Pantau kehadiran tim dengan cepat dan akurat.</div>
      </div>
      <q-btn icon="print" label="Cetak laporan" no-caps unelevated color="primary" class="print-btn" @click="print" />
    </div>

    <q-card flat bordered class="filter-card q-mb-lg">
      <q-card-section class="row items-center q-pb-sm">
        <q-icon name="tune" color="primary" size="20px" class="q-mr-sm" /><span class="text-subtitle1 text-weight-bold">Filter laporan</span>
        <q-space /><span class="text-caption text-grey-6">Pilih periode untuk melihat data</span>
      </q-card-section>
      <q-separator />
      <q-card-section class="row q-col-gutter-md items-end">
        <div class="col-12 col-md-3"><div class="field-label">Tanggal mulai</div><q-input v-model="store.params.tglawal" outlined dense readonly><template #append><q-icon name="event" class="cursor-pointer"><q-popup-proxy cover transition-show="scale" transition-hide="scale"><q-date v-model="store.params.tglawal" mask="YYYY-MM-DD" color="primary" /></q-popup-proxy></q-icon></template></q-input></div>
        <div class="col-12 col-md-3"><div class="field-label">Tanggal selesai</div><q-input v-model="store.params.tglakhir" outlined dense readonly><template #append><q-icon name="event" class="cursor-pointer"><q-popup-proxy cover transition-show="scale" transition-hide="scale"><q-date v-model="store.params.tglakhir" mask="YYYY-MM-DD" color="primary" /></q-popup-proxy></q-icon></template></q-input></div>
        <q-select v-model="store.params.pegawai_id" :options="employeeOptions" label="Pegawai (opsional)" emit-value map-options clearable use-input outlined dense class="col-12 col-md-2" input-debounce="300" @filter="filterEmployees" />
        <q-select v-model="store.params.status" :options="statuses" emit-value map-options label="Status" outlined dense clearable class="col-12 col-md-2" />
        <q-btn label="Tampilkan" icon="search" no-caps unelevated color="primary" :loading="store.loading" class="col-12 col-md-auto action-btn q-ml-sm" @click="load" />
      </q-card-section>
    </q-card>

    <div class="row q-col-gutter-md q-mb-lg">
      <div v-for="card in cards" :key="card.label" class="col-6 col-sm summary-col">
        <q-card flat bordered class="summary-card full-height">
          <q-card-section><div class="row items-center no-wrap"><div class="stat-icon" :class="`bg-${card.color}`"><q-icon :name="card.icon" size="18px" /></div><div class="q-ml-sm"><div class="text-caption text-grey-6">{{ card.label }}</div><div class="text-h5 text-weight-bold" :class="`text-${card.color}`">{{ card.value }}</div></div></div></q-card-section>
        </q-card>
      </div>
    </div>

    <q-card flat bordered class="table-card">
      <q-card-section class="row items-center"><div><div class="text-subtitle1 text-weight-bold">Detail kehadiran</div><div class="text-caption text-grey-6">{{ store.items.length }} catatan ditemukan</div></div><q-space /><q-icon name="more_horiz" color="grey-6" /></q-card-section>
      <q-table :rows="store.items" :columns="columns" row-key="id" :loading="store.loading" :pagination="{ rowsPerPage: 0 }" hide-bottom flat wrap-cells no-data-label="Belum ada data pada periode ini" separator="horizontal">
        <template #body-cell-status="props"><q-td :props="props"><q-badge :color="statusColor(props.value)">{{ props.value || '-' }}</q-badge></q-td></template>
      </q-table>
    </q-card>

    <q-dialog v-model="printDialog" maximized transition-show="slide-up" transition-hide="slide-down">
      <q-card class="print-dialog-card">
        <q-bar class="print-dialog-bar">
          <q-icon name="print" /><div class="text-weight-bold">Preview Cetak Laporan Absensi</div><q-space />
          <q-btn dense flat round icon="close" aria-label="Tutup preview" @click="printDialog = false" />
        </q-bar>
        <iframe v-if="printUrl" :src="printUrl" class="print-frame" title="Preview cetak laporan absensi" />
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import { api } from 'src/boot/axios'
import { useRouter } from 'vue-router'
import { useLaporanAbsensiStore } from 'src/stores/admin/laporan/absensi/list'

const store = useLaporanAbsensiStore()
const router = useRouter()
const printDialog = ref(false)
const printUrl = ref('')
const employeeOptions = ref([])
const allEmployees = ref([])
const statuses = [{ label: 'Hadir', value: 'hadir' }, { label: 'Terlambat', value: 'terlambat' }, { label: 'Izin', value: 'izin' }, { label: 'Sakit', value: 'sakit' }, { label: 'Alpa', value: 'alpa' }]
const columns = [
  { name: 'tanggal', label: 'TANGGAL', field: 'tanggal', align: 'left' },
  { name: 'pegawai', label: 'NAMA KARYAWAN', field: row => row.pegawai?.nama || row.nama_pegawai || row.nama || '-', align: 'left' },
  { name: 'jam_masuk', label: 'JAM MASUK', field: 'jam_masuk', align: 'center' },
  { name: 'jam_pulang', label: 'JAM PULANG', field: 'jam_pulang', align: 'center' },
  { name: 'status', label: 'STATUS', field: 'status', align: 'center' },
  { name: 'keterangan', label: 'KETERANGAN', field: 'keterangan', align: 'left' },
]
const summary = computed(() => store.summary)
const cards = computed(() => [{ label: 'Hadir', value: summary.value.hadir, color: 'positive', icon: 'check_circle' }, { label: 'Terlambat', value: summary.value.terlambat, color: 'warning', icon: 'schedule' }, { label: 'Izin', value: summary.value.izin, color: 'info', icon: 'event_note' }, { label: 'Sakit', value: summary.value.sakit, color: 'orange', icon: 'healing' }, { label: 'Alpa', value: summary.value.alpa, color: 'negative', icon: 'person_off' }])
const load = () => store.getdata()
const print = () => {
  printUrl.value = router.resolve({ path: '/admin/laporan/absensi/cetak', query: { ...store.params } }).href
  printDialog.value = true
}
const statusColor = (status) => ({ hadir: 'positive', terlambat: 'warning', izin: 'info', sakit: 'orange', alpa: 'negative', alpha: 'negative' }[String(status).toLowerCase()] || 'grey')
const filterEmployees = (value, update) => update(() => {
  const needle = String(value || '').toLowerCase()
  employeeOptions.value = allEmployees.value.filter((item) => item.label.toLowerCase().includes(needle))
})
const loadEmployees = async () => {
  const { data } = await api.get('/v1/master/users/getdata', { params: { page: 1, per_page: 100, q: null } })
  allEmployees.value = (data?.data || []).map((item) => ({ label: item.nama || item.username || `Pegawai #${item.id}`, value: item.id }))
  employeeOptions.value = allEmployees.value
}
onMounted(async () => { await loadEmployees(); await load() })
</script>

<style scoped>
.attendance-page { max-width: 1600px; margin: auto; }
.hero { padding: 8px 4px; }
.eyebrow { color: var(--q-primary); font-size: 11px; font-weight: 800; letter-spacing: 1.6px; }
.filter-card, .table-card, .summary-card { border-radius: 14px; }
.summary-col { display: flex; }
.summary-card { min-height: 96px; overflow: hidden; transition: transform .2s ease, box-shadow .2s ease; width: 100%; }
.summary-card:hover { box-shadow: 0 8px 24px rgba(0, 0, 0, .12); transform: translateY(-2px); }
.summary-card :deep(.q-card__section) { padding: 18px 20px; }
.filter-card { background: linear-gradient(135deg, rgba(99, 74, 234, .08), transparent 60%); }
.field-label { color: #777; font-size: 12px; font-weight: 600; margin-bottom: 5px; }
.action-btn { border-radius: 8px; font-weight: 700; min-height: 40px; min-width: 132px; padding: 0 18px; }
.stat-icon { align-items: center; border-radius: 11px; color: white; display: flex; height: 42px; justify-content: center; width: 42px; }
.summary-card .text-caption { font-weight: 600; letter-spacing: .15px; }
.summary-card .text-h5 { line-height: 1.15; margin-top: 3px; }
.bg-positive { background: #21ba75; }.bg-warning { background: #f2a900; }.bg-info { background: #31a4dd; }.bg-orange { background: #e88900; }.bg-negative { background: #c10015; }
.table-card :deep(.q-table thead tr) { background: rgba(99, 74, 234, .08); }
.table-card :deep(.q-table th) { color: #777; font-size: 11px; font-weight: 800; letter-spacing: .5px; }
.print-dialog-card { background: #f2f3f5; height: 96vh; width: 96vw; }
.print-dialog-bar { background: #1d3557; color: #fff; height: 48px; }
.print-frame { border: 0; display: block; height: calc(96vh - 48px); width: 100%; }
@media print {
  @page { margin: 14mm 12mm; size: A4 landscape; }
  .attendance-page { background: #fff !important; color: #000 !important; max-width: none; padding: 0 !important; }
  .print-btn, .filter-card, .summary-card, .eyebrow, .hero .text-caption { display: none !important; }
  .hero { display: block; padding: 0 0 10px; }
  .hero .text-h4 { color: #000 !important; font-size: 20px; }
  .hero::after { color: #555; content: 'Rekap kehadiran karyawan'; display: block; font-size: 11px; margin-top: 3px; }
  .table-card { border: 0 !important; box-shadow: none !important; }
  .table-card > .q-card__section:first-child { border-bottom: 1px solid #000; padding: 0 0 8px; }
  .table-card > .q-card__section:first-child .text-subtitle1 { color: #000 !important; font-size: 14px; }
  .table-card > .q-card__section:first-child .text-caption, .table-card > .q-card__section:first-child .q-icon { display: none; }
  .table-card :deep(.q-table__middle) { overflow: visible; }
  .table-card :deep(.q-table) { color: #000 !important; font-size: 11px; }
  .table-card :deep(.q-table thead tr) { background: #f0f0f0 !important; }
  .table-card :deep(.q-table th), .table-card :deep(.q-table td) { border: 1px solid #555 !important; color: #000 !important; padding: 7px 8px; }
  .table-card :deep(.q-badge) { background: transparent !important; border: 0; color: #000 !important; font-weight: 700; }
  .table-card :deep(.q-table__bottom) { display: none; }
}
@media (max-width: 1023px) { .action-btn { margin-left: 0 !important; margin-top: 4px; width: 100%; } }
</style>
