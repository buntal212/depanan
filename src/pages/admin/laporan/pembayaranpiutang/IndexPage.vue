<template>
  <div class="q-pa-md laporan-piutang">
    <div class="q-mb-md filter-laporan no-print">
      <div class="q-mb-sm">
        <div class="text-h5 text-weight-bold">Laporan Histori Pembayaran Piutang</div>
        <div class="text-caption">Riwayat pembayaran piutang dari pelanggan</div>
      </div>
      <div class="row items-center q-col-gutter-sm">
      <div class="col-12 col-sm-6 col-md-auto">
        <q-select
          v-model="store.params.jenis_tanggal"
          outlined
          dense
          emit-value
          map-options
          label="Filter periode berdasarkan"
          :options="pilihanJenisTanggal"
          style="min-width: 220px"
        />
      </div>
      <div class="col-12 col-md-4 col-lg-3">
        <app-input
          v-model="store.params.q"
          label="Cari nomor pembayaran, penjualan, atau pelanggan"
          prepend-icon="search"
          :debounce="400"
          style="min-width: 280px"
          @update:model-value="cari"
        />
      </div>
      <div class="col-12 col-md-4 col-lg-3">
        <q-select
          v-model="store.params.pelanggan_id"
          outlined
          dense
          clearable
          use-input
          fill-input
          hide-selected
          input-debounce="0"
          label="Filter pelanggan"
          :options="pelanggan"
          option-value="id"
          option-label="nama"
          emit-value
          map-options
          :loading="storePelanggan.loading"
          style="min-width: 250px"
          @filter="filterPelanggan"
          @update:model-value="muatData"
        />
      </div>
      <div class="col-6 col-md-auto">
        <app-input-date
          :model="store.dateDisplay.from"
          :label="labelTanggalAwal"
          style="min-width: 150px"
          @set-model="(nilai) => (store.dateDisplay.from = nilai)"
          @db-model="(nilai) => (store.params.tglawal = nilai)"
        />
      </div>
      <div class="col-6 col-md-auto">
        <app-input-date
          :model="store.dateDisplay.to"
          :label="labelTanggalAkhir"
          style="min-width: 150px"
          @set-model="(nilai) => (store.dateDisplay.to = nilai)"
          @db-model="(nilai) => (store.params.tglakhir = nilai)"
        />
      </div>
      <div class="col-auto">
        <app-btn label="Tampilkan" icon="search" color="grey-10" class="text-yellow-9" :loading="store.loading" @click="muatData" />
      </div>
      <div class="col-auto">
        <q-btn
          v-if="notaItems.length > 0"
          unelevated
          no-caps
          icon="picture_as_pdf"
          label="Download PDF"
          color="primary"
          class="screen-only"
          :loading="store.loadingPdf"
          :disable="store.loadingPdf"
          @click="cetakPdf"
        />
      </div>
      </div>
    </div>

    <section class="print-only print-header">
      <div class="text-weight-bold">{{ profil.profilData?.namatoko || 'Nama Toko / Perusahaan' }}</div>
      <div class="text-weight-bold">LAPORAN HISTORI PEMBAYARAN PIUTANG</div>
      <div>Periode: {{ store.dateDisplay.from }} - {{ store.dateDisplay.to }}</div>
      <div>Tanggal cetak: {{ tanggalCetak }}</div>
    </section>

    <q-card flat bordered class="print-report">
      <q-card-section class="row items-center justify-between print-total-summary">
        <div>
          <div class="text-subtitle1 text-weight-bold">Total pembayaran</div>
          <div class="text-h6 text-weight-bold" :class="app.dark ? 'text-yellow-8' : 'text-primary'">
            Rp {{ formattanpaRp(store.meta.total_pembayaran) }}
          </div>
        </div>
        <div class="text-caption">{{ store.meta.total }} transaksi ditemukan</div>
      </q-card-section>
      <q-separator />
      <q-card-section v-if="store.loading" class="flex flex-center q-py-xl">
        <q-spinner-dots color="primary" size="40px" />
      </q-card-section>
      <q-card-section v-else-if="notaItems.length === 0" class="text-center text-grey q-py-xl">
        Belum ada histori pembayaran pada periode ini
      </q-card-section>
      <div v-else class="q-pa-md q-gutter-md transaction-list">
        <q-card
          v-for="nota in notaItems"
          :key="nota.no_penjualan"
          flat
          bordered
          class="transaction-print"
          :class="app.dark ? 'bg-grey-10 text-grey-2' : 'bg-white text-grey-10'"
        >
          <q-card-section
            class="q-py-sm transaction-summary"
            :class="app.dark ? 'bg-grey-9 text-grey-2' : 'bg-grey-2 text-grey-10'"
          >
            <div class="row q-col-gutter-md items-center">
              <div class="col-12 col-md-3">
                <div class="text-caption">No. Penjualan</div>
                <div class="text-weight-bold">{{ nota.no_penjualan }}</div>
                <div class="text-caption q-mt-xs">Tgl Hutang</div>
                <div>{{ nota.tgl_hutang ? humanDate(nota.tgl_hutang) : '-' }}</div>
              </div>
              <div class="col-12 col-md-3">
                <div class="text-caption">Pelanggan</div>
                <div class="text-weight-bold">{{ nota.nama_pelanggan || 'Non pelanggan' }}</div>
              </div>
              <div class="col-6 col-md-2 text-right">
                <div class="text-caption">Total Nota</div>
                <div>Rp {{ formattanpaRp(nota.total_nota) }}</div>
              </div>
              <div class="col-6 col-md-2 text-right">
                <div class="text-caption">Total Dibayar</div>
                <div class="text-weight-bold text-positive">Rp {{ formattanpaRp(nota.total_dibayar_nota) }}</div>
              </div>
              <div class="col-12 col-md-2 text-right">
                <div class="text-caption">Sisa Piutang</div>
                <div class="text-weight-bold text-negative">Rp {{ formattanpaRp(nota.sisa_piutang_nota) }}</div>
              </div>
            </div>
          </q-card-section>
          <q-separator />
          <q-markup-table flat dense wrap-cells class="payment-table">
            <thead>
              <tr>
                <th class="text-left">Tanggal Bayar</th>
                <th class="text-left">No. Pembayaran</th>
                <th class="text-left">Cara Bayar</th>
                <th class="text-left">Keterangan</th>
                <th class="text-right">Nominal Bayar</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="rincian in nota.rincian" :key="rincian.id">
                <td>{{ humanDate(rincian.tgl_bayar) }}</td>
                <td>{{ rincian.nopembayaran || '-' }}</td>
                <td>{{ rincian.cara_bayar || '-' }}</td>
                <td>{{ rincian.keterangan || '-' }}</td>
                <td class="text-right text-weight-bold">Rp {{ formattanpaRp(rincian.jumlah) }}</td>
              </tr>
            </tbody>
          </q-markup-table>
        </q-card>
      </div>
    </q-card>
  </div>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import { date } from 'quasar'
import { humanDate, formattanpaRp } from 'src/modules/utils'
import { useLaporanPembayaranPiutangStore } from 'src/stores/admin/laporan/pembayaranpiutang/list'
import { useAdminMasterPelangganStore } from 'src/stores/admin/master/pelanggan/list'
import { useAppStore } from 'src/stores/app'
import { useProfilStore } from 'src/stores/admin/profil'
import { notifError } from 'src/modules/notifs'
import { useRoute } from 'vue-router'

const store = useLaporanPembayaranPiutangStore()
const storePelanggan = useAdminMasterPelangganStore()
const app = useAppStore()
const profil = useProfilStore()
const route = useRoute()
const pelanggan = ref([])
const tanggalCetak = date.formatDate(Date.now(), 'DD MMMM YYYY HH:mm')
const pilihanJenisTanggal = [
  { label: 'Tanggal pembayaran', value: 'pembayaran' },
  { label: 'Tanggal hutang', value: 'hutang' },
]
const labelTanggalAwal = computed(() =>
  store.params.jenis_tanggal === 'hutang' ? 'Dari tanggal hutang' : 'Dari tanggal bayar',
)
const labelTanggalAkhir = computed(() =>
  store.params.jenis_tanggal === 'hutang' ? 'Sampai tanggal hutang' : 'Sampai tanggal bayar',
)

const notaItems = computed(() => {
  const kelompokNota = new Map()

  store.items.forEach((item) => {
    if (!kelompokNota.has(item.no_penjualan)) {
      kelompokNota.set(item.no_penjualan, { ...item, rincian: [] })
    }
    kelompokNota.get(item.no_penjualan).rincian.push(item)
  })

  return [...kelompokNota.values()]
})

function muatData() {
  store.getData()
}

function cari() {
  store.getData()
}

function filterPelanggan(nilai, update) {
  const kataKunci = nilai.toLowerCase()
  update(() => {
    pelanggan.value = storePelanggan.itemsall.filter((item) =>
      item.nama.toLowerCase().includes(kataKunci),
    )
  })
}

async function cetakPdf() {
  try {
    const blob = await store.downloadPdf()
    const namaFile = `laporan-pembayaran-piutang-${store.params.tglawal}-sampai-${store.params.tglakhir}.pdf`
    const url = URL.createObjectURL(new Blob([blob], { type: 'application/pdf' }))
    const tautan = document.createElement('a')
    tautan.href = url
    tautan.download = namaFile
    document.body.appendChild(tautan)
    tautan.click()
    tautan.remove()
    URL.revokeObjectURL(url)
  } catch (error) {
    let pesan = 'Gagal membuat PDF laporan. Silakan coba lagi.'
    if (error?.response?.data instanceof Blob) {
      const teksError = await error.response.data.text()
      try {
        const hasil = JSON.parse(teksError)
        pesan = hasil.message || pesan
      } catch {
        pesan = teksError || pesan
      }
    } else {
      pesan = error?.response?.data?.message || pesan
    }
    notifError(pesan)
  }
}

onMounted(async () => {
  await Promise.all([storePelanggan.getListall(), profil.getProfil()])
  pelanggan.value = storePelanggan.itemsall.filter((item) => item.id !== 0)
  const pelangganId = Number(route.query.pelanggan_id)
  if (Number.isInteger(pelangganId) && pelangganId > 0) {
    store.params.pelanggan_id = pelangganId
  }
  if (['pembayaran', 'hutang'].includes(route.query.jenis_tanggal)) {
    store.params.jenis_tanggal = route.query.jenis_tanggal
  }
  if (route.query.q) {
    store.params.q = String(route.query.q)
  }
  if (route.query.semua_tanggal === '1') {
    store.params.tglawal = null
    store.params.tglakhir = null
    store.dateDisplay.from = 'Semua tanggal'
    store.dateDisplay.to = 'Semua tanggal'
  }
  store.getData()
})
</script>

<style>
.print-only { display: none; }

@page { size: A4 portrait; margin: 10mm 12mm; }

@media print {
  html, body { background: #fff !important; color: #000 !important; }

  .no-print, .q-drawer, .q-header, .q-footer { display: none !important; }

  .q-layout, .q-page-container, .q-page, .laporan-piutang {
    width: 100% !important;
    min-width: 0 !important;
    max-width: none !important;
    margin: 0 !important;
    padding: 0 !important;
    background: #fff !important;
    color: #000 !important;
  }

  .q-page-container { padding: 0 !important; }
  .print-only { display: block !important; }

  .print-header {
    margin-bottom: 5mm;
    text-align: center;
    font-size: 9pt;
    line-height: 1.45;
  }

  .print-header > :nth-child(2) { font-size: 11pt; }

  .print-report { border: 0 !important; box-shadow: none !important; }

  .print-total-summary {
    margin-bottom: 4mm;
    padding: 0 0 3mm !important;
    border-bottom: 1px solid #555;
    background: #fff !important;
    color: #000 !important;
    font-size: 9pt;
  }

  .transaction-list { padding: 0 !important; }

  .transaction-print {
    width: 100%;
    margin: 0 0 5mm !important;
    border: 1px solid #999 !important;
    border-radius: 2px !important;
    box-shadow: none !important;
    background: #fff !important;
    color: #000 !important;
    break-inside: avoid;
    page-break-inside: avoid;
  }

  .transaction-summary {
    padding: 6px 8px !important;
    background: #eee !important;
    color: #000 !important;
    font-size: 8.5pt;
  }

  .transaction-summary .row {
    display: grid !important;
    grid-template-columns: 1.35fr 1.35fr 1fr 1fr 1fr;
    gap: 8px;
    margin: 0 !important;
  }

  .transaction-summary .row > div {
    width: auto !important;
    min-width: 0 !important;
    padding: 0 !important;
  }

  .transaction-summary .row > div:nth-child(n + 3) { text-align: right !important; }

  .payment-table table {
    width: 100% !important;
    border-collapse: collapse !important;
    font-size: 8.5pt;
    color: #000 !important;
  }

  .payment-table th, .payment-table td {
    padding: 4px 7px !important;
    border-top: 1px solid #aaa !important;
    color: #000 !important;
  }

  .payment-table th { background: #f5f5f5 !important; font-weight: 600; text-align: left; }

  .payment-table th:last-child, .payment-table td:last-child {
    text-align: right !important;
    white-space: nowrap;
  }

  .text-positive, .text-negative, .text-primary, .text-yellow-8 { color: #000 !important; }
}
</style>
