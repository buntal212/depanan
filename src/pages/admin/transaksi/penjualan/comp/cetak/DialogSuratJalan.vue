<template>
  <q-dialog
    :model-value="modelValue"
    maximized
    @update:model-value="emits('update:modelValue', $event)"
  >
    <q-card class="surat-jalan-dialog column">
      <q-bar class="bg-teal-9 text-white">
        <q-icon name="local_shipping" class="q-mr-sm" />
        <div class="text-weight-medium">Cetak Surat Jalan</div>
        <q-space />
        <q-btn dense flat icon="close" aria-label="Tutup" @click="emits('update:modelValue', false)" />
      </q-bar>

      <q-card-section class="col scroll q-pa-md bg-grey-2">
        <section id="printSuratJalan" class="surat-jalan bg-white">
          <header class="surat-jalan__header row items-start no-wrap">
            <div v-if="profil.fotoProfil" class="q-pr-md">
              <q-img :src="profil.fotoProfil" fit="contain" class="surat-jalan__logo" />
            </div>
            <div class="col">
              <div class="text-h6 text-weight-bold">{{ profil.profilData?.namatoko || 'Nama Toko' }}</div>
              <div>{{ profil.profilData?.alamat || '-' }}</div>
              <div>Telp. {{ profil.profilData?.telepon || '-' }}</div>
            </div>
            <div class="text-right">
              <div class="text-h5 text-weight-bold">SURAT JALAN</div>
              <div class="text-caption">Ref. Penjualan: {{ item?.no_penjualan || '-' }}</div>
              <div v-if="item?.noorder" class="text-caption">No. Order: {{ item.noorder }}</div>
            </div>
          </header>

          <q-separator class="q-my-md" />

          <div class="row q-col-gutter-x-xl q-col-gutter-y-sm q-mb-md">
            <div class="col-12 col-sm-7">
              <div class="surat-jalan__label">Dikirim kepada</div>
              <div class="text-weight-bold">{{ item?.pelanggan?.nama || item?.keterangan?.nama || '-' }}</div>
              <div>{{ item?.pelanggan?.alamat || item?.keterangan?.alamat || '-' }}</div>
              <div>Telp. {{ item?.pelanggan?.telepon || item?.keterangan?.tlp || '-' }}</div>
            </div>
            <div class="col-12 col-sm-5">
              <div class="row q-mb-xs">
                <div class="col-5 surat-jalan__label">Tanggal kirim</div>
                <div class="col-7">: {{ dateFullFormat(item?.tgl_kirim || item?.tgl) }}</div>
              </div>
              <div class="row">
                <div class="col-5 surat-jalan__label">Sales</div>
                <div class="col-7">: {{ item?.sales?.nama || '-' }}</div>
              </div>
            </div>
          </div>

          <table class="surat-jalan__table">
            <thead>
              <tr>
                <th class="surat-jalan__no">No.</th>
                <th>Kode Barang</th>
                <th>Nama Barang</th>
                <th>Motif</th>
                <th class="text-right">Jumlah</th>
                <th>Satuan</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(detail, index) in item?.detail || []" :key="detail?.id || index">
                <td class="text-center">{{ index + 1 }}</td>
                <td>{{ detail?.kodebarang || detail?.master_barang?.kodebarang || '-' }}</td>
                <td>{{ detail?.master_barang?.namabarang || '-' }}</td>
                <td>{{ detail?.motif || '-' }}</td>
                <td class="text-right">{{ jumlahTampil(detail) }}</td>
                <td>{{ satuanTampil(detail) }}</td>
              </tr>
              <tr v-if="!item?.detail?.length">
                <td colspan="6" class="text-center text-grey-7">Tidak ada rincian barang.</td>
              </tr>
            </tbody>
          </table>

          <div class="row q-col-gutter-xl q-mt-xl surat-jalan__ttd">
            <div class="col-6 text-center">
              <div>Penerima,</div>
              <div class="surat-jalan__ruang-ttd" />
              <div class="surat-jalan__garis-ttd">Nama & tanda tangan</div>
            </div>
            <div class="col-6 text-center">
              <div>Pengirim,</div>
              <div class="surat-jalan__ruang-ttd" />
              <div class="surat-jalan__garis-ttd">{{ profil.profilData?.namatoko || 'Nama Toko' }}</div>
            </div>
          </div>
        </section>
      </q-card-section>

      <q-card-actions align="right" class="bg-white">
        <q-btn flat label="Tutup" color="grey-8" @click="emits('update:modelValue', false)" />
        <q-btn v-print="printSuratJalan" unelevated color="teal" icon="print" label="Cetak Surat Jalan" />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { dateFullFormat } from 'src/modules/utils'
import { formatDouble } from 'src/modules/formatter'
import { useProfilStore } from 'src/stores/admin/profil'
import { useListPenjualanStore } from 'src/stores/admin/transaksi/penjualan/list'
import { computed, onMounted } from 'vue'

defineProps({
  modelValue: Boolean,
})

const emits = defineEmits(['update:modelValue'])
const profil = useProfilStore()
const store = useListPenjualanStore()
const item = computed(() => store.itemSuratJalan)

onMounted(async () => {
  if (!profil.profilData) await profil.getProfil()
})

function jumlahTampil(detail) {
  const jumlah = Number(detail?.jumlah || 0)
  const isi = Number(detail?.isi || 1)

  if (isi > 0 && jumlah % isi === 0) return formatDouble(jumlah / isi)

  return formatDouble(jumlah)
}

function satuanTampil(detail) {
  const jumlah = Number(detail?.jumlah || 0)
  const isi = Number(detail?.isi || 1)

  if (isi > 0 && jumlah % isi === 0) return detail?.master_barang?.satuan_b || '-'

  return detail?.master_barang?.satuan_k || '-'
}

const printSuratJalan = computed(() => ({
  id: 'printSuratJalan',
  popTitle: `Surat Jalan ${item.value?.no_penjualan || ''}`,
}))
</script>

<style>
.surat-jalan-dialog {
  width: min(100%, 980px);
  height: min(100%, 760px);
}

.surat-jalan {
  width: min(100%, 210mm);
  min-height: 280mm;
  margin: 0 auto;
  padding: 15mm;
  color: #1f2937;
}

.surat-jalan__header {
  min-height: 70px;
}

.surat-jalan__logo {
  width: 64px;
  height: 64px;
}

.surat-jalan__label {
  color: #64748b;
  font-size: 0.78rem;
}

.surat-jalan__table {
  width: 100%;
  border-collapse: collapse;
}

.surat-jalan__table th,
.surat-jalan__table td {
  border: 1px solid #475569;
  padding: 8px;
  vertical-align: top;
}

.surat-jalan__table th {
  background: #e2e8f0;
  font-size: 0.78rem;
  text-align: left;
}

.surat-jalan__no {
  width: 42px;
}

.surat-jalan__ruang-ttd {
  height: 72px;
}

.surat-jalan__garis-ttd {
  display: inline-block;
  min-width: 150px;
  border-top: 1px solid #1f2937;
  padding-top: 4px;
}

@media print {
  #printSuratJalan {
    width: 100%;
    min-height: auto;
    margin: 0;
    padding: 10mm;
  }

  .surat-jalan__table tr {
    break-inside: avoid;
  }
}
</style>
