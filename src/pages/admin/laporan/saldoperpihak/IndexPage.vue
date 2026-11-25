<template>
  <q-page class="q-pa-md">
    <div class="q-mb-lg">
      <div class="text-h5 text-weight-bold">{{ judul }}</div>
      <div class="text-caption text-grey-6">{{ subjudul }}</div>
    </div>

    <q-card flat bordered class="q-mb-md">
      <q-card-section class="row q-col-gutter-sm items-center">
        <div class="col-12 col-md-4">
          <q-select
            v-model="store.params.pihak_id"
            outlined
            dense
            clearable
            use-input
            fill-input
            hide-selected
            input-debounce="0"
            :label="`Filter ${labelPihak}`"
            :options="pihakOptions"
            :option-value="nilaiPihak"
            option-label="nama"
            emit-value
            map-options
            :loading="loadingPihak"
            @filter="filterPihak"
            @update:model-value="muatData"
          />
        </div>
        <div class="col-12 col-md-4">
          <q-input
            v-model="store.params.q"
            outlined
            dense
            clearable
            debounce="400"
            :label="`Cari nomor transaksi atau ${labelPihak.toLowerCase()}`"
            @update:model-value="muatData"
          >
            <template #prepend><q-icon name="search" /></template>
          </q-input>
        </div>
        <div class="col-12 col-md-auto">
          <q-btn
            color="primary"
            unelevated
            icon="refresh"
            label="Muat ulang"
            :loading="store.loading"
            @click="muatData"
          />
        </div>
      </q-card-section>
    </q-card>

    <q-banner v-if="store.error" rounded class="bg-red-1 text-negative q-mb-md">
      {{ store.error }}
    </q-banner>

    <section class="row q-col-gutter-md q-mb-md">
      <div class="col-12 col-sm-6">
        <q-card flat bordered>
          <q-card-section>
            <div class="text-caption text-grey-6">Total sisa {{ jenis }}</div>
            <div class="text-h5 text-weight-bold text-negative">
              Rp {{ rupiah(store.totalSisa) }}
            </div>
          </q-card-section>
        </q-card>
      </div>
      <div class="col-12 col-sm-6">
        <q-card flat bordered>
          <q-card-section>
            <div class="text-caption text-grey-6">Transaksi belum lunas</div>
            <div class="text-h5 text-weight-bold">{{ store.totalTransaksi }}</div>
          </q-card-section>
        </q-card>
      </div>
    </section>

    <q-card flat bordered class="q-mb-md">
      <q-card-section>
        <div class="text-subtitle1 text-weight-bold">
          Ringkasan per {{ labelPihak.toLowerCase() }}
        </div>
      </q-card-section>
      <q-separator />
      <q-table
        flat
        dense
        :rows="store.ringkasan"
        :columns="kolomRingkasan"
        row-key="pihak_id"
        :loading="store.loading"
        :pagination="{ rowsPerPage: 10 }"
        no-data-label="Tidak ada saldo terbuka"
      >
        <template #body-cell-total_tagihan="props">
          <q-td :props="props" class="text-right">Rp {{ rupiah(props.value) }}</q-td>
        </template>
        <template #body-cell-total_dibayar="props">
          <q-td :props="props" class="text-right">Rp {{ rupiah(props.value) }}</q-td>
        </template>
        <template #body-cell-total_retur="props">
          <q-td :props="props" class="text-right">Rp {{ rupiah(props.value) }}</q-td>
        </template>
        <template #body-cell-total_sisa="props">
          <q-td :props="props" class="text-right text-weight-bold text-negative">
            Rp {{ rupiah(props.value) }}
          </q-td>
        </template>
      </q-table>
    </q-card>

    <q-card flat bordered>
      <q-card-section>
        <div class="text-subtitle1 text-weight-bold">Rincian transaksi</div>
      </q-card-section>
      <q-separator />
      <q-table
        flat
        :rows="store.items"
        :columns="kolomRincian"
        row-key="nomor"
        :loading="store.loading"
        :pagination="{ rowsPerPage: 15 }"
        no-data-label="Tidak ada transaksi belum lunas"
      >
        <template #body-cell-tanggal="props">
          <q-td :props="props">{{ formatTanggal(props.value) }}</q-td>
        </template>
        <template #body-cell-jatuh_tempo="props">
          <q-td :props="props">{{ formatTanggal(props.value) }}</q-td>
        </template>
        <template #body-cell-total_tagihan="props">
          <q-td :props="props" class="text-right">Rp {{ rupiah(props.value) }}</q-td>
        </template>
        <template #body-cell-total_dibayar="props">
          <q-td :props="props" class="text-right">Rp {{ rupiah(props.value) }}</q-td>
        </template>
        <template #body-cell-total_retur="props">
          <q-td :props="props" class="text-right">Rp {{ rupiah(props.value) }}</q-td>
        </template>
        <template #body-cell-sisa="props">
          <q-td :props="props" class="text-right text-weight-bold text-negative">
            Rp {{ rupiah(props.value) }}
          </q-td>
        </template>
      </q-table>
    </q-card>
  </q-page>
</template>

<script setup>
import { computed, onMounted, ref, watch } from 'vue'
import { humanDate, formattanpaRp } from 'src/modules/utils'
import { useLaporanSaldoPerPihakStore } from 'src/stores/admin/laporan/saldoperpihak'
import { useAdminMasterSupplierStore } from 'src/stores/admin/master/supplier/list'
import { useAdminMasterPelangganStore } from 'src/stores/admin/master/pelanggan/list'

const props = defineProps({
  jenis: {
    type: String,
    required: true,
    validator: value => ['hutang', 'piutang'].includes(value)
  }
})

const store = useLaporanSaldoPerPihakStore()
const storeSupplier = useAdminMasterSupplierStore()
const storePelanggan = useAdminMasterPelangganStore()
const semuaPihak = ref([])
const pihakOptions = ref([])

const isHutang = computed(() => props.jenis === 'hutang')
const labelPihak = computed(() => (isHutang.value ? 'Distributor' : 'Pelanggan'))
const judul = computed(() => `Laporan ${isHutang.value ? 'Hutang per Distributor' : 'Piutang per Pelanggan'}`)
const subjudul = computed(() =>
  isHutang.value
    ? 'Daftar hutang pembelian yang masih terbuka per distributor.'
    : 'Daftar piutang penjualan yang masih terbuka per pelanggan.'
)
const nilaiPihak = computed(() => (isHutang.value ? 'kodesupl' : 'id'))
const loadingPihak = computed(() =>
  isHutang.value ? storeSupplier.loading : storePelanggan.loading
)
const kolomRingkasan = computed(() => [
  { name: 'pihak', label: labelPihak.value, field: 'pihak', align: 'left', sortable: true },
  { name: 'jumlah_transaksi', label: 'Transaksi', field: 'jumlah_transaksi', align: 'right', sortable: true },
  { name: 'total_tagihan', label: 'Total Tagihan', field: 'total_tagihan', align: 'right', sortable: true },
  { name: 'total_dibayar', label: 'Terbayar', field: 'total_dibayar', align: 'right', sortable: true },
  ...(isHutang.value ? [] : [{ name: 'total_retur', label: 'Retur', field: 'total_retur', align: 'right', sortable: true }]),
  { name: 'total_sisa', label: `Sisa ${isHutang.value ? 'Hutang' : 'Piutang'}`, field: 'total_sisa', align: 'right', sortable: true }
])
const kolomRincian = computed(() => [
  { name: 'nomor', label: isHutang.value ? 'No. Penerimaan' : 'No. Penjualan', field: 'nomor', align: 'left', sortable: true },
  { name: 'pihak', label: labelPihak.value, field: 'pihak', align: 'left', sortable: true },
  { name: 'tanggal', label: 'Tanggal', field: 'tanggal', align: 'left', sortable: true },
  { name: 'jatuh_tempo', label: 'Jatuh Tempo', field: 'jatuh_tempo', align: 'left', sortable: true },
  { name: 'total_tagihan', label: 'Total Tagihan', field: 'total_tagihan', align: 'right', sortable: true },
  { name: 'total_dibayar', label: 'Terbayar', field: 'total_dibayar', align: 'right', sortable: true },
  ...(isHutang.value ? [] : [{ name: 'total_retur', label: 'Retur', field: 'total_retur', align: 'right', sortable: true }]),
  { name: 'sisa', label: 'Sisa', field: 'sisa', align: 'right', sortable: true }
])

function rupiah(nilai) {
  return formattanpaRp(Number(nilai || 0))
}

function formatTanggal(nilai) {
  return nilai ? humanDate(nilai) : '-'
}

function filterPihak(nilai, update) {
  const kataKunci = nilai.toLowerCase()
  update(() => {
    pihakOptions.value = semuaPihak.value.filter(item =>
      item.nama.toLowerCase().includes(kataKunci)
    )
  })
}

function muatData() {
  store.getData(props.jenis)
}

async function muatPihak() {
  if (isHutang.value) {
    await storeSupplier.getAllList()
    semuaPihak.value = storeSupplier.itemsall || []
  } else {
    await storePelanggan.getListall()
    semuaPihak.value = storePelanggan.itemsall || []
  }
  pihakOptions.value = [...semuaPihak.value]
}

watch(
  () => props.jenis,
  async () => {
    store.reset()
    await muatPihak()
    muatData()
  }
)

onMounted(async () => {
  store.reset()
  await muatPihak()
  muatData()
})
</script>
