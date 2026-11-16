<template>
  <div class="q-pa-md full-width">
    <div class="row q-col-gutter-md items-end no-print">
      <div class="col-12 col-sm-3">
        <q-input v-model="store.params.tglawal" type="date" label="Dari" outlined dense />
      </div>
      <div class="col-12 col-sm-3">
        <q-input v-model="store.params.tglakhir" type="date" label="Sampai" outlined dense />
      </div>
      <div class="col-12 col-sm-2">
        <q-input
          v-model="store.params.q"
          label="Cari nota, kode, barang, atau pelanggan"
          outlined
          dense
          clearable
          @keyup.enter="store.getData()"
        />
      </div>
      <div class="col-12 col-sm-2">
        <q-select
          v-model="store.params.merk"
          :options="store.merks"
          label="Filter Merk"
          outlined
          dense
          clearable
          @update:model-value="store.getData()"
        />
      </div>
      <div class="col-12 col-sm-2 row q-gutter-sm">
        <q-btn label="Ambil Data" color="primary" :loading="store.loading" @click="store.getData()" />
        <q-btn v-if="store.items.length" icon="print" flat round @click="cetak" />
      </div>
    </div>

    <div id="laporan-barang-keluar" class="q-mt-lg">
      <div class="text-h6 text-weight-bold">Laporan Barang Keluar</div>
      <div class="text-caption text-grey-7 q-mb-md">
        Periode {{ formatTanggal(store.params.tglawal) }} s.d. {{ formatTanggal(store.params.tglakhir) }}
      </div>
      <div class="row q-col-gutter-md q-mb-md">
        <div class="col-12 col-sm-6">
          <q-card flat bordered class="q-pa-sm">
            <div class="text-caption text-grey-7">Total Barang Keluar</div>
            <div class="text-h6 text-weight-bold">{{ formatTotalSemua }}</div>
          </q-card>
        </div>
        <div class="col-12 col-sm-6">
          <q-card flat bordered class="q-pa-sm">
            <div class="text-caption text-grey-7">Jumlah Nota Penjualan</div>
            <div class="text-h6 text-weight-bold">{{ totalNota }} Nota</div>
          </q-card>
        </div>
      </div>

      <q-markup-table flat bordered wrap-cells>
        <thead>
          <tr>
            <th>Tanggal Keluar</th>
            <th>No. Penjualan</th>
            <th>Barang</th>
            <th>Pelanggan</th>
            <th>Sales</th>
            <th class="text-right">Jumlah Keluar</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in store.items" :key="`${item.no_penjualan}-${item.kodebarang}-${item.motif}`">
            <td>{{ formatTanggal(item.tanggal) }}</td>
            <td>{{ item.no_penjualan }}</td>
            <td>
              <div class="text-weight-medium">{{ item.namabarang || item.kodebarang }}</div>
              <div class="text-caption text-grey-7">
                {{ item.kodebarang }}<span v-if="item.motif !== '-'"> · {{ item.motif }}</span>
              </div>
            </td>
            <td>{{ item.pelanggan }}</td>
            <td>{{ item.sales }}</td>
            <td class="text-right">{{ formatJumlah(item) }}</td>
          </tr>
          <tr v-if="!store.loading && store.items.length === 0">
            <td colspan="6" class="text-center text-grey-7">Tidak ada barang keluar pada periode ini.</td>
          </tr>
          <tr v-if="store.items.length" class="text-weight-bold bg-grey-2">
            <td colspan="5">Total Barang Keluar</td>
            <td class="text-right">{{ formatTotalSemua }}</td>
          </tr>
        </tbody>
      </q-markup-table>
    </div>
  </div>
</template>

<script setup>
import { useLaporanBarangKeluarStore } from 'src/stores/admin/laporan/barang_keluar/list'
import { date } from 'quasar'
import { computed, onMounted } from 'vue'

const store = useLaporanBarangKeluarStore()

const formatTotalSemua = computed(() => {
  const total = store.items.reduce(
    (hasil, item) => {
      const jumlah = Number(item.jumlah_keluar || 0)
      const isi = Number(item.isi || 1)
      hasil.dus += Math.floor(jumlah / isi)
      hasil.pcs += jumlah % isi
      return hasil
    },
    { dus: 0, pcs: 0 }
  )

  return `${formatAngka(total.dus)} DUS${total.pcs ? ` ${formatAngka(total.pcs)} PCS` : ''}`
})
const totalNota = computed(
  () => new Set(store.items.map(item => item.no_penjualan)).size
)

onMounted(async () => {
  await Promise.all([store.getMerks(), store.getData()])
})

function formatTanggal(value) {
  return value ? date.formatDate(value, 'DD MMMM YYYY') : '-'
}

function formatAngka(value) {
  return new Intl.NumberFormat('id-ID', { maximumFractionDigits: 2 }).format(
    Number(value || 0)
  )
}

function formatJumlah(item) {
  const jumlah = Number(item.jumlah_keluar || 0)
  const isi = Number(item.isi || 1)
  if (isi <= 1) return `${formatAngka(jumlah)} ${item.satuan_k}`

  const kemasan = Math.floor(jumlah / isi)
  const sisa = jumlah % isi
  return `${formatAngka(kemasan)} ${item.satuan_b}${sisa ? ` ${formatAngka(sisa)} ${item.satuan_k}` : ''}`
}

function cetak() {
  window.print()
}
</script>

<style scoped>
@media print {
  .no-print {
    display: none !important;
  }

  .q-markup-table table,
  .q-markup-table th,
  .q-markup-table td {
    border-color: #000 !important;
    color: #000 !important;
  }
}
</style>
