<template>
  <q-dialog
    :model-value="modelValue"
    persistent
    backdrop-filter="blur(4px)"
    @update:model-value="emits('update:modelValue', $event)"
  >
    <q-card style="min-width: 80vw; max-width: 180vw; height: 600px">
      <q-layout view="lHh Lpr lFf" container class="rounded-borders">
        <q-header>
          <q-bar class="bg-black text-white q-py-sm">
            <div>CETAK DATA SURAT JALAN</div>
            <q-space />

            <q-btn dense flat icon="close" v-close-popup>
              <q-tooltip>Close</q-tooltip>
            </q-btn>
          </q-bar>
        </q-header>

        <q-page-container>
          <!-- PREVIEW & CETAK MATRIX (SATU-SATUNYA FORMAT SURAT JALAN) -->
          <div
            id="printRegulerSuratJalan"
            class="print-container q-pa-md row justify-center"
          >
            <div
              style="width: 24cm; background-color: white; color: black; padding: 10px; box-shadow: 0 1px 3px rgba(0,0,0,0.2);"
            >
              <div class="print-header">
                <div class="row full-width justify-between">
                  <div class="flex-start content-center" style="width: 60%">
                    <div class="row q-px-md q-py-xs">
                      <div class="q-pr-md" v-if="profil.fotoProfil">
                        <q-img
                          :src="profil.fotoProfil"
                          style="width: 100px; height: 100px; border-radius: 50%; object-fit: cover"
                          spinner-color="primary"
                        />
                      </div>
                      <div class="col content-center">
                        <div class="text-bold" style="font-size: large">
                          {{ profil.profilData?.namatoko || 'Nama Toko' }}
                        </div>
                        <div>
                          {{ profil.profilData?.alamat || '-' }}
                        </div>
                        <div>
                          <span class="q-pr-sm">Telp : {{ profil.profilData?.telepon || '-' }}</span>
                        </div>
                        <div>
                          <span>Email : {{ profil.profilData?.email || '-' }} </span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="col flex-end q-pl-xl q-py-xs content-center text-center">
                    <span class="text-bold" style="font-size: large">SURAT JALAN</span>
                  </div>
                </div>
              </div>

              <div class="justify-center">
                <div style="border-bottom-style: solid; border-width: 1px" />
                <div class="row justify-between q-px-md q-py-xs">
                  <div class="col flex-start content-center">
                    <div class="row full-width">
                      <span class="col-3">Kepada</span>
                      <span class="col-9">: {{ namaPenerima(item) }}</span>
                    </div>
                    <div class="row full-width">
                      <span class="col-3">Telepon</span>
                      <span class="col-9">: {{ teleponPenerima(item) }}</span>
                    </div>
                    <div class="row full-width">
                      <span class="col-3">Alamat Kirim</span>
                      <span class="col-9">: {{ alamatPenerima(item) }}</span>
                    </div>
                  </div>
                  <div class="col flex-end q-pl-xl q-py-xs">
                    <div class="row full-width">
                      <span class="col-4">Nomor SJ</span>
                      <span class="col-8">: SJ-{{ item?.no_penjualan || '-' }}</span>
                    </div>
                    <div class="row full-width">
                      <span class="col-4">Ref. Penjualan</span>
                      <span class="col-8">: {{ item?.no_penjualan || '-' }}</span>
                    </div>
                    <div v-if="item?.noorder" class="row full-width">
                      <span class="col-4">No. Order</span>
                      <span class="col-8">: {{ item.noorder }}</span>
                    </div>
                    <div class="row full-width">
                      <span class="col-4">Sales</span>
                      <span class="col-8">: {{ item?.sales?.nama || '-' }}</span>
                    </div>
                    <div class="row full-width">
                      <span class="col-4">Tanggal Kirim</span>
                      <span class="col-8">: {{ dateFullFormat(item?.tgl_kirim || item?.tgl) }}</span>
                    </div>
                  </div>
                </div>

                <!-- TABEL RINCIAN BARANG MATRIX -->
                <div class="q-px-md q-pt-xs">
                  <table class="full-width surat-jalan-table">
                    <thead>
                      <tr class="text-center" style="height: min-content">
                        <th style="width: 5%">NO</th>
                        <th style="width: 18%">KODE BARANG</th>
                        <th style="width: 35%">NAMA BARANG</th>
                        <th style="width: 14%">MOTIF</th>
                        <th style="width: 10%">JUMLAH</th>
                        <th style="width: 10%">SATUAN</th>
                        <th style="width: 8%">CEK</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="(detail, n) in item?.detail" :key="n">
                        <td class="text-center">{{ n + 1 }}</td>
                        <td>{{ detail?.kodebarang || detail?.master_barang?.kodebarang || '-' }}</td>
                        <td>
                          {{ detail?.master_barang?.namabarang || detail?.namabarang || '-' }}
                        </td>
                        <td class="text-center">{{ detail?.motif || '-' }}</td>
                        <td class="text-right">{{ jumlahTampil(detail) }}</td>
                        <td class="text-center">{{ satuanTampil(detail) }}</td>
                        <td class="text-center">[ &nbsp; ]</td>
                      </tr>
                      <tr v-if="!item?.detail?.length">
                        <td colspan="7" class="text-center text-grey-7">Tidak ada rincian barang.</td>
                      </tr>
                    </tbody>
                    <tfoot>
                      <tr>
                        <td colspan="4" class="text-bold text-right q-pr-sm">TOTAL BARANG</td>
                        <td class="text-bold text-right">{{ totalQtySemua(item) }}</td>
                        <td colspan="2" class="text-bold text-left q-pl-sm">
                          {{ item?.detail?.length || 0 }} Macam Item
                        </td>
                      </tr>
                    </tfoot>
                  </table>
                </div>

                <!-- KOLOM TANDA TANGAN MATRIX -->
                <div class="row justify-between full-width q-pt-md q-pb-sm">
                  <div class="col flex-start content-center text-center">
                    <div>Penerima/Pembeli</div>
                    <div style="height: 40px"></div>
                    <div>( {{ namaPenerima(item) }} )</div>
                  </div>
                  <div class="col content-center text-center">
                    <div>Pengemudi / Pengirim</div>
                    <div style="height: 40px"></div>
                    <div>( .................................... )</div>
                  </div>
                  <div class="col flex-end content-center text-center">
                    <div>Probolinggo, {{ dateFullFormat(item?.tgl_kirim || item?.tgl) }}</div>
                    <div>{{ profil.profilData?.namatoko || 'Nama Toko' }}</div>
                    <div style="height: 40px"></div>
                    <div>{{ profil.profilData?.pemilik || 'Bagian Pengiriman' }}</div>
                  </div>
                </div>

                <div style="border-bottom-style: solid; border-width: 1px" />
                <div
                  class="row full-width justify-between items-center q-pt-xs q-px-sm"
                  style="font-size: x-small"
                >
                  <span>* Catatan: Barang telah diterima dalam kondisi baik dan lengkap. Komplain barang diterima maksimal 1x24 jam.</span>
                  <span>created by CV UdumbaraInformatika</span>
                </div>
              </div>
            </div>
          </div>
        </q-page-container>

        <q-footer>
          <q-card-section class="q-pa-none bg-black text-white">
            <div class="q-pa-md row justify-end items-end">
              <div class="items-end">
                <q-btn
                  v-print="printReg"
                  unelevated
                  color="dark"
                  round
                  size="sm"
                  icon="print"
                >
                  <q-tooltip :offset="[10, 10]"> Print Surat Jalan </q-tooltip>
                </q-btn>
              </div>
            </div>
          </q-card-section>
        </q-footer>
      </q-layout>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { dateFullFormat, formatDouble } from 'src/modules/formatter'
import { useProfilStore } from 'src/stores/admin/profil'
import { useListPenjualanStore } from 'src/stores/admin/transaksi/penjualan/list'
import { computed, onMounted, ref } from 'vue'

defineProps({
  modelValue: {
    type: Boolean,
    default: false,
  },
})

const emits = defineEmits(['update:modelValue'])
const profil = useProfilStore()
const store = useListPenjualanStore()
const printed = ref(false)

const item = computed(() => store.itemSuratJalan || store.itemCetak || {})

onMounted(async () => {
  if (!profil.profilData) {
    await profil.getProfil()
  }
})

function namaPenerima(row) {
  return row?.pelanggan?.nama || row?.keterangan?.nama || '-'
}

function teleponPenerima(row) {
  return row?.pelanggan?.telepon || row?.keterangan?.tlp || '-'
}

function alamatPenerima(row) {
  return row?.pelanggan?.alamat || row?.keterangan?.alamat || '-'
}

function jumlahTampil(detail) {
  const jumlah = Number(detail?.jumlah || 0)
  const isi = Number(detail?.isi || detail?.master_barang?.isi || 1)
  if (isi > 0 && jumlah % isi === 0) {
    return formatDouble(jumlah / isi)
  }
  return formatDouble(jumlah)
}

function satuanTampil(detail) {
  const jumlah = Number(detail?.jumlah || 0)
  const isi = Number(detail?.isi || detail?.master_barang?.isi || 1)
  if (isi > 0 && jumlah % isi === 0) {
    return detail?.master_barang?.satuan_b || detail?.satuan_b || '-'
  }
  return detail?.master_barang?.satuan_k || detail?.satuan_k || '-'
}

function totalQtySemua(row) {
  if (!Array.isArray(row?.detail) || row.detail.length === 0) return '0 PCS'
  const total = row.detail.reduce((sum, d) => sum + (Number(d?.jumlah) || 0), 0)
  return `${formatDouble(total)} PCS`
}

const printReg = computed(() => ({
  id: 'printRegulerSuratJalan',
  popTitle: `Surat Jalan ${item.value?.no_penjualan || ''} - by Udumbara Informatika`,
  beforeOpenCallback() {
    printed.value = true
    console.log('wait...')
  },
  openCallback() {
    console.log('opened')
  },
  closeCallback() {
    printed.value = false
    console.log('closePrint')
  },
}))
</script>

<style>
/* Tabel Surat Jalan */
table.surat-jalan-table,
table.surat-jalan-table th,
table.surat-jalan-table td {
  border: 1px solid black;
  border-collapse: collapse;
  padding: 0px 5px 0px 5px;
  word-break: break-word;
}

@media print {
  #printRegulerSuratJalan {
    width: 24cm;
    min-height: 13.8cm;
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    display: block !important;
  }

  .print-header {
    position: relative;
    top: 0;
    width: 100%;
  }

  .surat-jalan-table tr {
    page-break-inside: avoid;
    break-inside: avoid;
  }

  .surat-jalan-table thead {
    display: table-header-group;
  }

  .surat-jalan-table tfoot {
    display: table-footer-group;
  }

  /* Sembunyikan elemen non-printable */
  .q-dialog,
  .q-card,
  .q-bar,
  .q-btn,
  .q-footer {
    display: none !important;
  }
}
</style>
