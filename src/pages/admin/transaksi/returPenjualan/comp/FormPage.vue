<template>
  <div class="q-pa-sm">
    <div class="row items-center justify-between q-mb-sm">
      <div class="row items-center q-gutter-x-sm">
        <q-icon name="assignment_return" color="orange" size="md" />
        <span class="f-24 text-weight-bold" :class="app?.dark ? 'text-amber-4' : 'text-primary'">
          Form Retur Penjualan
        </span>
      </div>
      <div>
        <app-btn-back @click="emits('back')" />
      </div>
    </div>

    <q-separator />

    <div v-if="store.item?.detail?.length" class="q-mt-sm">
      <!-- Info Header Nota Asal & Status Retur -->
      <div
        class="q-pa-sm rounded-borders q-mb-md"
        :class="app?.dark ? 'bg-grey-9 text-grey-2' : 'bg-grey-2 text-grey-9'"
      >
        <div class="row q-col-gutter-sm text-caption">
          <div class="col-12 col-md-3">
            <span class="text-grey-5">Nomor Nota Asal:</span>
            <div class="text-weight-bold text-body2 text-primary">{{ store.item?.no_penjualan }}</div>
          </div>
          <div class="col-12 col-md-3">
            <span class="text-grey-5">Nomor Retur:</span>
            <div class="text-weight-bold text-body2" :class="store.noRetur ? 'text-amber-4' : 'text-grey-5'">
              {{ store.noRetur || '(Draft Retur Baru)' }}
            </div>
          </div>
          <div class="col-12 col-md-3">
            <span class="text-grey-5">Tanggal Nota:</span>
            <div class="text-weight-bold">{{ humanDate(store.item?.tgl) }} {{ jamTnpDetik(store.item?.tgl) }}</div>
          </div>
          <div class="col-12 col-md-3">
            <span class="text-grey-5">Status Nota Asal:</span>
            <div>
              <q-badge color="positive" class="q-px-sm q-py-xs">
                {{ statusFlag(store.item?.flag) }}
              </q-badge>
            </div>
          </div>
          <div class="col-12 col-md-6">
            <span class="text-grey-5">Pelanggan:</span>
            <div class="text-weight-bold">
              {{ store.item?.pelanggan?.nama || store.item?.keterangan?.nama || '-' }}
              <span v-if="store.item?.pelanggan?.telepon || store.item?.keterangan?.tlp" class="text-grey-5">
                ({{ store.item?.pelanggan?.telepon || store.item?.keterangan?.tlp }})
              </span>
            </div>
          </div>
          <div class="col-12 col-md-6">
            <span class="text-grey-5">Sales:</span>
            <div class="text-weight-bold">{{ store.item?.sales?.nama || '-' }}</div>
          </div>
        </div>
      </div>

      <!-- Tabel Detail Barang Penjualan & Input Retur -->
      <div
        class="row items-center q-pa-sm text-weight-bold text-caption rounded-borders"
        :class="app?.dark ? 'bg-grey-10 text-grey-3' : 'bg-grey-3 text-black'"
      >
        <div class="col-3">Barang & Motif</div>
        <div class="col-1 text-center">Satuan</div>
        <div class="col-1 text-right">Terjual</div>
        <div class="col-1 text-right">Pernah Retur</div>
        <div class="col-1 text-right">Sisa Boleh</div>
        <div class="col-1 text-right">Harga Jual</div>
        <div class="col-2 text-center">Jumlah Retur</div>
        <div class="col-1 text-right">Subtotal</div>
        <div class="col-1 text-center">Aksi</div>
      </div>
      <q-separator />

      <div v-for="(item, index) in store.item?.detail" :key="index">
        <div
          class="row items-center q-pa-sm text-caption"
          :class="app?.dark ? (index % 2 === 0 ? 'bg-grey-9' : 'bg-grey-10') : (index % 2 === 0 ? 'bg-white' : 'bg-grey-1')"
        >
          <div class="col-3">
            <div class="text-weight-bold">{{ item?.master_barang?.namabarang }}</div>
            <div class="text-grey-5 text-italic">
              Motif: {{ item?.motif || '-' }}
              <template v-if="Number(item?.diskon) > 0">
                | Disc Item: Rp {{ formatDouble(item?.diskon) }}
              </template>
            </div>
          </div>
          <div class="col-1 text-center">{{ item?.master_barang?.satuan_k || 'PCS' }}</div>
          <div class="col-1 text-right">{{ formatDouble(item?.jumlah) }}</div>
          <div class="col-1 text-right text-orange-4">{{ formatDouble(getSudahRetur(item)) }}</div>
          <div class="col-1 text-right text-weight-bold text-primary">{{ formatDouble(getMaxBolehRetur(item)) }}</div>
          <div class="col-1 text-right">{{ formatDouble(item?.harga_jual) }}</div>
          <div class="col-2 q-px-xs">
            <app-input
              v-model="item.retur"
              label="Jumlah Retur"
              dense
              @clear="() => { item.retur = 0 }"
              @update:model-value="(val) => onUpdateRetur(item, val)"
              :disable="item?.loading || getMaxBolehRetur(item) <= 0"
              :loading="item?.loading"
            />
          </div>
          <div class="col-1 text-right text-weight-bold" :class="Number(item?.retur) > 0 ? (app?.dark ? 'text-amber-4' : 'text-deep-orange-9') : 'text-grey-5'">
            Rp {{ formatDouble(getSubtotalReturBaris(item)) }}
            <div v-if="getDiskonItemProporsional(item) > 0" class="text-caption text-amber-3 f-10">
              -disc: {{ formatDouble(getDiskonItemProporsional(item)) }}
            </div>
          </div>
          <div class="col-1 text-center">
            <app-btn
              icon="send"
              color="grey-10"
              dense
              @click="() => { submit(item) }"
              :disable="item?.loading || Number(item?.retur) <= 0"
              :loading="item?.loading"
              tooltip="Simpan baris ini"
            />
          </div>
        </div>
        <q-separator />
      </div>

      <!-- Preview Perhitungan Reaktif Sebelum Disimpan (Requirement 2 & 3) -->
      <div class="row justify-end q-mt-md">
        <div class="col-12 col-sm-10 col-md-7 col-lg-6">
          <div
            class="q-pa-md rounded-borders text-body2 shadow-1"
            :class="app?.dark ? 'bg-grey-9 text-grey-2' : 'bg-white text-grey-9'"
          >
            <div class="row justify-between items-center q-pb-xs">
              <span class="text-subtitle2 text-weight-bold" :class="app?.dark ? 'text-amber-4' : 'text-primary'">
                Preview Perhitungan Retur (Reaktif)
              </span>
              <q-badge
                :color="statusReturForm.color"
                :text-color="statusReturForm.textColor"
                class="q-px-sm q-py-xs text-weight-bold"
              >
                {{ statusReturForm.label }}
              </q-badge>
            </div>
            <q-separator :dark="app?.dark" class="q-my-xs" />

            <div class="row justify-between q-py-xs">
              <span>Total Barang Diretur Sekarang:</span>
              <span class="text-weight-bold">{{ formatDouble(previewKuantitasRetur) }} PCS</span>
            </div>

            <div class="row justify-between q-py-xs">
              <span>Harga Jual × Jumlah (Bruto):</span>
              <span class="text-weight-bold">Rp {{ formatDouble(previewBruto) }}</span>
            </div>

            <div
              class="row justify-between q-py-xs"
              :class="previewDiskonItem > 0 ? (app?.dark ? 'text-amber-3' : 'text-orange-9') : ''"
            >
              <span>Diskon Item Proporsional:</span>
              <span class="text-weight-bold">
                {{ previewDiskonItem > 0 ? '- Rp ' + formatDouble(previewDiskonItem) : 'Rp 0' }}
              </span>
            </div>

            <div class="row justify-between q-py-xs">
              <span>Subtotal Retur:</span>
              <span class="text-weight-bold">Rp {{ formatDouble(previewSubtotalRetur) }}</span>
            </div>

            <div class="row justify-between q-py-xs text-grey-5">
              <span>Diskon Nota Retur:</span>
              <span class="text-caption text-italic">Rincian historis tidak tersedia</span>
            </div>

            <div class="row justify-between q-py-xs text-grey-5">
              <span>DPP (Dasar Pengenaan Pajak):</span>
              <span class="text-caption text-italic">Rincian historis tidak tersedia</span>
            </div>

            <div class="row justify-between q-py-xs text-grey-5">
              <span>PPN Retur:</span>
              <span class="text-caption text-italic">Rincian historis tidak tersedia</span>
            </div>

            <q-separator :dark="app?.dark" class="q-my-xs" />

            <div
              class="row justify-between q-py-xs text-subtitle1 text-weight-bolder"
              :class="app?.dark ? 'text-white' : 'text-black'"
            >
              <span>Total Nilai Retur (Preview):</span>
              <span :class="app?.dark ? 'text-amber-4' : 'text-primary'">
                Rp {{ formatDouble(previewTotalNilaiRetur) }}
              </span>
            </div>

            <div class="text-caption text-grey-5 q-mt-xs text-italic">
              * Nilai retur tersimpan dihitung dari akumulasi harga jual dikurangi diskon item proporsional.
            </div>

            <div v-if="store.noRetur" class="row justify-end q-mt-md">
              <app-btn
                label="Selesai dan tambah stok"
                color="primary"
                @click="() => { selesai() }"
                :disable="store.loading"
                :loading="store.loading"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { notifError } from 'src/modules/notifs'
import { formatDouble } from 'src/modules/formatter'
import { humanDate, jamTnpDetik } from 'src/modules/utils'
import { useFormReturPenjualanStore } from 'src/stores/admin/transaksi/returPenjualan/form'
import { useAppStore } from 'src/stores/app'

const emits = defineEmits(['back', 'selesai'])
const store = useFormReturPenjualanStore()
const app = useAppStore()

function statusFlag(flag) {
  switch (flag) {
    case null: return 'Draft'
    case '1': return 'Pesanan Sales'
    case '2': return 'Belum Ada Cicilan'
    case '3': return 'Proses Cicilan'
    case '4': return 'Dibawa Sales'
    case '5': return 'Lunas'
    case '6': return 'Batal'
    case '7': return 'Down Payment (DP)'
    default: return '-'
  }
}

function getSudahRetur(item) {
  return (store.item?.detail_retur || [])
    .filter(
      (f) =>
        f.kodebarang === item.kodebarang &&
        f.detail_penjualan_id === item.id &&
        f.status !== '',
    )
    .reduce((acc, cur) => acc + Number(cur.jumlah || 0), 0)
}

function getMaxBolehRetur(item) {
  const terjual = Number(item?.jumlah || 0)
  const sudah = getSudahRetur(item)
  return Math.max(0, terjual - sudah)
}

function getDiskonItemProporsional(item) {
  const retur = Number(item?.retur || 0)
  const jumlah = Number(item?.jumlah || 0)
  const diskon = Number(item?.diskon || 0)
  if (retur <= 0 || jumlah <= 0 || diskon <= 0) return 0
  return Math.round((diskon * (retur / jumlah)) * 100) / 100
}

function getBruto(item) {
  const retur = Number(item?.retur || 0)
  const harga = Number(item?.harga_jual || 0)
  return Math.round(retur * harga * 100) / 100
}

function getSubtotalReturBaris(item) {
  const bruto = getBruto(item)
  const diskon = getDiskonItemProporsional(item)
  return Math.max(0, Math.round((bruto - diskon) * 100) / 100)
}

function onUpdateRetur(item, val) {
  const parsed = isNaN(parseInt(val)) ? 0 : parseInt(val)
  const maxRetur = getMaxBolehRetur(item)

  if (parsed <= maxRetur) {
    item.retur = Math.max(0, parsed)
    item.sisa = maxRetur - item.retur
  } else {
    item.retur = maxRetur
    item.sisa = 0
    notifError('Jumlah retur tidak boleh lebih dari Sisa Boleh Diretur (' + maxRetur + ')')
  }
}

const previewKuantitasRetur = computed(() => {
  return (store.item?.detail || []).reduce((sum, d) => sum + (Number(d?.retur) || 0), 0)
})

const previewBruto = computed(() => {
  return (store.item?.detail || []).reduce((sum, d) => sum + getBruto(d), 0)
})

const previewDiskonItem = computed(() => {
  return (store.item?.detail || []).reduce((sum, d) => sum + getDiskonItemProporsional(d), 0)
})

const previewSubtotalRetur = computed(() => {
  return (store.item?.detail || []).reduce((sum, d) => sum + getSubtotalReturBaris(d), 0)
})

const previewTotalNilaiRetur = computed(() => {
  return previewSubtotalRetur.value
})

const statusReturForm = computed(() => {
  const totalTerjual = (store.item?.detail || []).reduce((sum, d) => sum + (Number(d?.jumlah) || 0), 0)
  const totalSudahRetur = (store.item?.detail || []).reduce((sum, d) => sum + getSudahRetur(d), 0)
  const totalReturSekarang = previewKuantitasRetur.value
  const kumulatif = totalSudahRetur + totalReturSekarang

  if (totalReturSekarang <= 0 && totalSudahRetur <= 0) {
    return { label: 'Belum Ada Retur', color: 'grey-7', textColor: 'white' }
  }
  if (kumulatif >= totalTerjual && totalTerjual > 0) {
    return { label: 'Retur Seluruhnya', color: 'negative', textColor: 'white' }
  }
  return { label: 'Retur Sebagian', color: 'deep-orange', textColor: 'white' }
})

function submit(item) {
  if (parseInt(item.retur) <= 0) return notifError('Jumlah retur harus lebih dari nol')
  store.initForm('no_penjualan', item?.no_penjualan)
  store.initForm('kodebarang', item?.kodebarang)
  store.initForm('retur', item?.retur)
  store.initForm('harga_jual', item?.harga_jual)
  store.initForm('id', item?.id)
  store.initForm('diskon', item?.diskon)
  store.submit(item)
}

function selesai() {
  store.loading = true
  store
    .selesai({ no_retur: store.noRetur })
    .then((data) => {
      store.loading = false
      emits('selesai', data)
    })
    .catch(() => {
      store.loading = false
    })
    .finally(() => {
      store.loading = false
    })
}
</script>
