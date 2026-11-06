<template>
  <q-dialog persistent backdrop-filter="blur(4px)">
    <q-card
      flat
      class="fit column order-dialog"
      style="min-width: 92vw; max-width: 92vw; min-height: 95vh; max-height: 95vh"
    >
      <q-card-section class="col-auto dialog-heading q-px-lg q-py-md">
        <div class="row items-center no-wrap">
          <q-avatar color="primary" text-color="white" icon="receipt_long" size="42px" />
          <div class="q-ml-md col">
            <div class="text-overline text-primary">Detail order penjualan</div>
            <div class="text-subtitle1 text-weight-bold">#{{ order?.noorder || '-' }}</div>
          </div>
          <q-badge
            rounded
            class="q-px-sm q-py-xs text-weight-medium"
            :color="statusMeta.color"
            :label="statusMeta.label"
          />
          <q-btn v-close-popup icon="close" flat round class="q-ml-sm" aria-label="Tutup detail order" />
        </div>
      </q-card-section>
      <q-card-section
        class="col full-height q-pa-md order-dialog__body"
        :class="$q.dark.isActive ? 'bg-dark' : 'bg-grey-2'"
      >
        <div class="column full-height">
          <div class="col-auto">
            <div class="order-action-bar row items-center q-col-gutter-sm q-pa-md q-mb-md">
              <div class="col-12 col-sm">
                <div class="text-caption text-grey-7">Total setelah diskon</div>
                <div class="text-h6 text-weight-bold text-primary">
                  Rp {{ formatRp(order?.total_harga || 0) }}
                </div>
              </div>
              <div class="col-12 col-sm-auto row justify-end q-gutter-sm">
                <app-btn
                  v-if="parseInt(order?.status_order) < 3"
                  color="negative"
                  outline
                  icon="cancel"
                  label="Batalkan"
                  @click="batalkanOrder"
                />
                <app-btn
                  v-if="parseInt(order?.status_order) < 6"
                  :label="pelabelan"
                  :icon-right="parseInt(order?.status_order) === 3 ? 'check_circle' : 'arrow_forward'"
                  @click="lanjutkanStep"
                  :loading="loading || sedangMenyimpan"
                  :disable="loading || sedangMenyimpan || parseInt(order?.status_order) === 3"
                />
              </div>
              <div v-if="order?.status_order === '9'" class="col-12 text-negative text-weight-bold">
                Order ini dibatalkan
              </div>
            </div>
            <div v-if="order?.status_order !== '9'" class="row full-width overflow-hidden q-mb-md">
              <div class="col-12">
                <q-stepper
                  v-model="step"
                  alternative-labels
                  animated
                  flat
                  done-color="positive"
                  active-color="primary"
                  inactive-color="grey-6"
                  class="status-stepper"
                >
                  <q-step :name="1" title="Draf" caption="Order dibuat" icon="edit_note" :done="step > 1" />

                  <q-step
                    :name="3"
                    title="Disetujui"
                    caption="Menunggu Pembayaran"
                    icon="credit_card"
                    :done="step > 3"
                  >
                  </q-step>
                  <q-step
                    :name="4"
                    title="Dikirim"
                    caption="Pesanan selesai"
                    icon="local_shipping"
                    :done="step > 4"
                  >
                  </q-step>

                  <!-- <template v-slot:navigation>
                    <q-stepper-navigation>
                      <q-btn @click="$refs.stepper.next()" color="primary" :label="step === 4 ? 'Finish' : 'Continue'" />
                      <q-btn v-if="step > 1" flat color="primary" @click="$refs.stepper.previous()" label="Back" class="q-ml-sm" />
                    </q-stepper-navigation>
                  </template> -->
                </q-stepper>
              </div>
            </div>

            <!-- INFO ORDER -->
            <div class="row full-width q-mb-md" style="max-width: 100%">
              <div class="col-12 row q-col-gutter-md">
                <div class="col-12 col-md-4">
                  <q-card flat bordered class="order-info-card">
                    <q-card-section>
                      <div class="text-body text-weight-bold">Data Pelanggan</div>
                      <q-separator class="q-my-sm"></q-separator>
                      <div class="flex q-gutter-sm items-center">
                        <q-icon name="person_2" size="16px"> </q-icon>
                        <div>{{ order?.pelanggan?.nama }}</div>
                      </div>
                      <div class="flex q-gutter-sm items-center">
                        <q-icon name="badge" size="16px"> </q-icon>
                        <div>{{ order?.pelanggan?.kodeplgn || '-' }}</div>
                      </div>
                      <div class="flex q-gutter-sm items-center">
                        <q-icon name="place" size="16px"> </q-icon>
                        <div>{{ order?.pelanggan?.alamat || '-' }}</div>
                      </div>
                      <div class="flex q-gutter-sm items-center">
                        <q-icon name="phone" size="16px"> </q-icon>
                        <div>{{ order?.pelanggan?.telepon || '-' }}</div>
                      </div>
                      <div class="flex q-gutter-sm items-center">
                        <q-icon name="credit_card" size="16px"> </q-icon>
                        <div>
                          {{ order?.pelanggan?.norek || '-' }} -
                          {{ order?.pelanggan?.namabank || '-' }}
                        </div>
                      </div>
                    </q-card-section>
                  </q-card>
                </div>
                <div class="col-12 col-md-4">
                  <q-card flat bordered class="order-info-card">
                    <q-card-section class="">
                      <div class="flex q-gutter-sm items-center">
                        <q-icon name="add_shopping_cart" size="20px"> </q-icon>
                        <div class="text-body text-weight-bold">Informasi Order</div>
                      </div>
                      <q-separator class="q-my-sm"></q-separator>
                      <div class="flex q-gutter-sm items-center q-mb-sm">
                        <div>Dari Sales :</div>
                        <div>{{ order?.sales?.nama || '-' }}</div>
                      </div>
                      <div class="flex q-gutter-sm items-center q-mb-sm">
                        <q-icon name="watch" size="16px"> </q-icon>
                        <div>{{ formatDateTime(order?.tglorder) }}</div>
                      </div>
                      <div class="flex q-gutter-sm items-center">
                        <q-icon name="credit_card" size="16px"> </q-icon>
                        <div>{{ paymentLabel(order) }}</div>
                      </div>
                      <div class="flex q-gutter-sm items-center q-mt-sm">
                        <q-icon name="payments" size="16px"> </q-icon>
                        <div>Status bayar: {{ paymentStatusLabel(order?.status_pembayaran) }}</div>
                      </div>
                      <div class="flex q-gutter-sm items-center q-mt-sm">
                        <q-icon name="local_shipping" size="16px"> </q-icon>
                        <div>Kirim: {{ formatDateTime(order?.tanggal_kirim) }}</div>
                      </div>
                      <div class="flex q-gutter-sm items-center q-mt-sm">
                        <q-icon name="inventory" size="16px"> </q-icon>
                        <div>Terima: {{ formatDateTime(order?.tanggal_terima) }}</div>
                      </div>
                      <div class="q-mt-sm text-caption">Catatan: {{ order?.catatan || '-' }}</div>
                      <div v-if="order?.status_order === '9'" class="q-mt-sm text-negative">
                        Batal order: {{ order?.alasan_batal || '-' }}
                      </div>
                    </q-card-section>
                  </q-card>
                </div>
                <div class="col-12 col-md-4">
                  <q-card flat bordered class="order-info-card summary-order-card">
                    <q-card-section>
                      <div class="flex q-gutter-sm items-center">
                        <q-icon name="paid" size="22px"> </q-icon>
                        <div class="text-body text-weight-bold">Summary Order</div>
                      </div>

                      <q-separator class="q-my-sm"></q-separator>
                    </q-card-section>
                    <q-card-section
                      class="summary-panel"
                      :class="`${$q.dark.isActive ? 'bg-grey-9' : 'bg-grey-4'} q-ma-md`"
                      style="margin-top: -10px"
                    >
                      <q-markup-table flat bordered dense class="summary-table">
                        <tbody>
                          <tr>
                            <td>Total sebelum diskon</td>
                            <td class="text-right text-weight-bold">
                              Rp {{ formatRp(totalSebelumDiskon) }}
                            </td>
                          </tr>
                          <tr class="text-negative">
                            <td>Diskon rincian</td>
                            <td class="text-right text-weight-bold">
                              -Rp {{ formatRp(totalDiskonRincian) }}
                            </td>
                          </tr>
                          <tr class="text-negative">
                            <td>Diskon kuitansi</td>
                            <td class="text-right text-weight-bold">
                              -Rp {{ formatRp(order?.diskon_kuitansi || 0) }}
                            </td>
                          </tr>
                          <tr class="text-negative">
                            <td>Total diskon</td>
                            <td class="text-right text-weight-bold">
                              -Rp {{ formatRp(totalDiskon) }}
                            </td>
                          </tr>
                          <tr class="summary-divider">
                            <td colspan="2"></td>
                          </tr>
                          <tr>
                            <td>Down payment</td>
                            <td class="text-right text-weight-bold">
                              Rp {{ formatRp(order?.down_payment || 0) }}
                            </td>
                          </tr>
                          <tr>
                            <td>Sisa pembayaran</td>
                            <td class="text-right text-weight-bold">
                              Rp {{ formatRp(sisaPembayaran) }}
                            </td>
                          </tr>
                        </tbody>
                      </q-markup-table>
                      <div class="summary-total q-mt-sm">
                        <span>Total setelah diskon</span
                        ><strong>Rp {{ formatRp(order?.total_harga || 0) }}</strong>
                      </div>
                    </q-card-section>
                  </q-card>
                </div>
              </div>
            </div>
          </div>
          <q-card flat bordered class="col q-pa-none rincian-card">
            <q-list class="column full-height rincian-list">
              <q-item class="col-auto q-px-md q-py-sm">
                <q-item-section>
                  <q-item-label class="text-subtitle2 text-weight-bold">Daftar item</q-item-label>
                  <q-item-label caption>Rincian barang pada order penjualan.</q-item-label>
                </q-item-section>

                <q-item-section side top>
                  <q-badge outline color="primary" :label="`${jumlahItem} item`" />
                </q-item-section>
              </q-item>
              <q-separator spaced />
              <div class="col scroll rincian-scroll">
                <template v-for="(item, n) in order?.rincians" :key="n">
                  <q-item
                    class="item-row q-px-md q-py-sm"
                    @mouseover="hoveredId = n"
                    @mouseleave="hoveredId = null"
                  >
                    <q-item-section avatar>
                      <q-avatar color="grey-2" text-color="primary" icon="inventory_2" />
                    </q-item-section>
                    <q-item-section>
                      <q-item-label class="text-weight-bold">{{
                        item?.barang?.namagabung || item?.barang?.namabarang
                      }}</q-item-label>
                      <q-item-label caption>{{ item?.barang?.kodebarang || '-' }}</q-item-label>
                      <q-item-label
                        >{{ formatRp(item?.harga) }} x {{ item?.jumlah }}
                        <span class="text-grey"
                          >( {{ item?.barang?.satuan_k || 'Satuan Kecil' }} )</span
                        >
                      </q-item-label>
                      <q-item-label caption>
                        Total sebelum diskon: Rp {{ formatRp(totalSebelumDiskonItem(item)) }}
                      </q-item-label>
                      <q-item-label caption class="text-negative">
                        Diskon rincian: -Rp {{ formatRp(diskonRincianItem(item)) }}
                      </q-item-label>
                      <q-item-label caption class="text-negative">
                        Diskon: Rp {{ formatRp(diskonPerSatuan(item)) }}/{{
                          item?.satuan || item?.barang?.satuan_k || 'PCS'
                        }}
                        · Rp {{ formatRp(diskonPerSatuanBesar(item)) }}/{{
                          item?.satuans?.satuan_b || item?.barang?.satuan_b || 'DUS'
                        }}
                      </q-item-label>
                      <q-item-label>
                        <span class="text-grey">
                          Pemesanan Aktual Dalam Satuan {{ item.satuan || '-' }}
                        </span>
                        <span v-if="item?.satuan === item?.barang?.satuan_b">
                          ( {{ parseInt(item.jumlah) / parseInt(item.barang?.isi) }}
                          {{ item?.satuan }})
                        </span>
                      </q-item-label>
                    </q-item-section>
                    <q-item-section side>
                      <q-item-label caption>Total setelah diskon</q-item-label>
                      <q-item-label>
                        <div class="text-weight-bold text-body1">
                          Rp {{ formatRp(item?.subtotal || 0) }}
                        </div>
                      </q-item-label>
                    </q-item-section>
                  </q-item>
                  <q-separator></q-separator>
                </template>
                <!-- <div style="padding-bottom: 100px;"></div> -->
              </div>
            </q-list>
            <!-- <div style="margin-bottom: 200px;"></div> -->
          </q-card>
        </div>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { useQuasar } from 'quasar'
import { ref, computed, watch } from 'vue'
import { formatRp } from 'src/modules/formatter'

const props = defineProps({
  order: {
    type: Object,
    default: null,
  },
  loading: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['updateRincian', 'deleteRincian', 'updateStatus', 'setujuiDraft'])

const $q = useQuasar()
// const step = ref(1)
const hoveredId = ref(null)
const sedangMenyimpan = ref(false)
const edittedItem = ref(null)
const edittedIndex = ref(null)
const openEdit = ref(false)
const totalSebelumDiskon = computed(() => {
  const nilaiTersimpan = props.order?.total_sebelum_diskon
  if (nilaiTersimpan !== null && nilaiTersimpan !== undefined) {
    return Number(nilaiTersimpan) || 0
  }

  return (props.order?.rincians || []).reduce(
    (total, item) => total + totalSebelumDiskonItem(item),
    0,
  )
})
const totalDiskonRincian = computed(() =>
  (props.order?.rincians || []).reduce((total, item) => total + diskonRincianItem(item), 0),
)
const totalDiskon = computed(
  () => totalDiskonRincian.value + (Number(props.order?.diskon_kuitansi) || 0),
)
const jumlahItem = computed(() => props.order?.rincians?.length || 0)
const statusMeta = computed(() => {
  const status = Number(props.order?.status_order)
  const daftarStatus = {
    1: { label: 'Draf', color: 'grey-7' },
    2: { label: 'Diproses', color: 'orange-8' },
    3: { label: 'Disetujui', color: 'primary' },
    4: { label: 'Menunggu kirim', color: 'blue-8' },
    5: { label: 'Dikirim', color: 'teal-7' },
    6: { label: 'Selesai', color: 'positive' },
    9: { label: 'Dibatalkan', color: 'negative' },
  }

  return daftarStatus[status] || { label: 'Status tidak diketahui', color: 'grey-7' }
})
const sisaPembayaran = computed(() => {
  const pembayaranAwal = Number(props.order?.down_payment || props.order?.bayar) || 0
  return Math.max(0, (Number(props.order?.total_harga) || 0) - pembayaranAwal)
})

// const pelabelan = ref('Lanjutkan Status')

// console.log('order', props.order);
function totalSebelumDiskonItem(item) {
  if (item?.total_sebelum_diskon !== null && item?.total_sebelum_diskon !== undefined) {
    return Number(item.total_sebelum_diskon) || 0
  }

  return Math.round((Number(item?.jumlah) || 0) * (Number(item?.harga) || 0))
}
function diskonRincianItem(item) {
  return Math.max(0, totalSebelumDiskonItem(item) - (Number(item?.subtotal) || 0))
}
function diskonPerSatuan(item) {
  const jumlah = Number(item?.jumlah) || 0
  return jumlah > 0 ? diskonRincianItem(item) / jumlah : 0
}
function diskonPerSatuanBesar(item) {
  const isi = Math.max(1, Number(item?.isi || item?.barang?.isi) || 1)
  return diskonPerSatuan(item) * isi
}
function paymentLabel(order) {
  const sistem = {
    lunas: 'Lunas',
    dp: 'Down Payment (DP)',
    tempo: 'Tempo',
  }[order?.sistem_bayar]
  const cara = order?.cara_bayar ? ' · ' + (order.cara_bayar === 'cash' ? 'Cash' : 'Transfer') : ''

  return (sistem || order?.metode_bayar || '-') + cara
}
function paymentStatusLabel(status) {
  return Number(status) === 2 ? 'Lunas' : 'Belum lunas'
}
function formatDateTime(value) {
  if (!value) return '-'

  return new Intl.DateTimeFormat('id-ID', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(value))
}
// eslint-disable-next-line no-unused-vars
function edit(index, item) {
  edittedIndex.value = index
  edittedItem.value = item
  openEdit.value = true
  // console.log('edit', index, item);
}

// eslint-disable-next-line no-unused-vars
function hapus(item) {
  // console.log('delete', item);

  const rincians = props.order?.rincians?.filter((x) => x.id !== item?.id) || 0
  let totalRincians = 0
  for (let i = 0; i < rincians.length; i++) {
    const el = rincians[i]

    const qty = parseInt(el.jumlah) || 0
    const harga = parseInt(el.harga) || 0
    const subtotal = qty * harga || 0
    totalRincians += subtotal
  }

  const payload = {
    id: item?.id,
    order_id: props.order?.id,
    total_harga_order: totalRincians,
  }

  $q.dialog({
    title: 'Pemberitahuan',
    message: `Apakah Item dengan Nama ${item?.barang?.namabarang} Akan dihapus ?`,
    cancel: true,
  })
    .onOk(() => {
      emit('deleteRincian', payload)
      // console.log('OK', payload)
    })
    .onCancel(() => {
      // console.log('Cancel')
    })
    .onDismiss(() => {
      // console.log('I am triggered on both OK and Cancel')
    })
}

// eslint-disable-next-line no-unused-vars
function simpanEdit() {
  const ind = edittedIndex.value
  const item = props.order?.rincians[ind]

  const rincians = props.order?.rincians
  let totalRincians = 0
  for (let i = 0; i < rincians.length; i++) {
    const el = rincians[i]

    const qty = parseInt(el.jumlah)
    const harga = parseInt(el.harga)
    const subtotal = qty * harga
    totalRincians += subtotal
  }

  const payload = {
    id: item?.id,
    jumlah: item?.jumlah,
    satuan: item?.satuan,
    subtotal: parseInt(item?.jumlah || 0) * parseInt(item?.harga || 0),
    order_id: props.order?.id,
    total_harga_order: totalRincians,
  }
  console.log('simpan Edit', payload)

  emit('updateRincian', payload)

  openEdit.value = false
}

const step = computed({
  get: () => parseInt(props.order?.status_order) || 1,
  set: (value) => parseInt(value),
})

const pelabelan = computed(() => {
  if (step.value < 3) {
    return 'Setujui Draft'
  } else if (step.value === 3) {
    return 'Sudah ditransaksikan'
  } else if (step.value === 4) {
    return 'Kirim Pesanan'
  } else if (step.value > 4 && step.value < 9) {
    return 'Compleet'
  } else {
    return 'Di batalkan'
  }
})

// eslint-disable-next-line no-unused-vars
function lihatStep() {
  const tap = parseInt(props.order?.status_order) || 0

  // - 1: draft
  // - 2: menunggu persetujuan
  // - 3: disetujui
  // - 4: diproses
  // - 5: dikirim
  // - 6: diterima
  // - 9: dibatalkan

  if (tap < 3) {
    step.value = 1 // draft disini
  } else if (tap === 3) {
    step.value = 2 // disetujui
  } else if (tap === 4) {
    step.value = 3 // menunggu Pembayaran
  } else if (tap >= 5 && tap < 9) {
    step.value = 4 // dikirim
  } else if (tap === 9) {
    step.value = 5
  }

  step.value = tap
}

function lanjutkanStep() {
  if (props.loading || sedangMenyimpan.value || parseInt(props.order?.status_order) === 3) return

  sedangMenyimpan.value = true
  console.log('lanjutka step')
  let status = props?.order?.status_order
  if (step.value < 3) {
    step.value = 3
    status = '3'
  } else if (step.value === 3) {
    step.value = 3 // gak boleh lanjut nunggu pembayaran
    status = '3'
  } else if (step.value === 4) {
    step.value = 5 // dikirim
    status = '5'
  } else if (step.value === 5) {
    step.value = 6 // selesai
    status = '6'
  }

  const payload = {
    order_id: props?.order?.id,
    status_order: status,
  }

  if (parseInt(props?.order?.status_order) < 3) {
    emit('setujuiDraft', payload)
    return
  }

  emit('updateStatus', payload)
}

watch(
  () => props.loading,
  (sedangMemuat) => {
    if (!sedangMemuat && parseInt(props.order?.status_order) !== 3) {
      sedangMenyimpan.value = false
    }
  },
)
function batalkanOrder() {
  console.log('batalkan order')

  const payload = {
    order_id: props?.order?.id,
    status_order: '9',
  }

  $q.dialog({
    title: 'Pemberitahuan',
    message: `Apakah Order ini Dibatalkan ?`,
    cancel: true,
    prompt: {
      model: '',
      type: 'text',
      label: 'Alasan pembatalan (opsional)',
    },
  })
    .onOk((alasanBatal) => {
      payload.alasan_batal = String(alasanBatal || '').trim() || 'Dibatalkan oleh admin'
      emit('updateStatus', payload)
      // console.log('OK', payload)
    })
    .onCancel(() => {
      // console.log('Cancel')
    })
    .onDismiss(() => {
      // console.log('I am triggered on both OK and Cancel')
    })
}
</script>

<style scoped>
.order-dialog {
  overflow: hidden;
  border-radius: 16px;
}
.dialog-heading {
  border-bottom: 1px solid rgba(127, 127, 127, 0.18);
}
.order-dialog__body {
  overflow: hidden;
}
.order-action-bar,
.order-info-card,
.rincian-card {
  border: 1px solid rgba(127, 127, 127, 0.2);
  border-radius: 12px;
}
.order-action-bar {
  box-shadow: 0 3px 12px rgba(0, 0, 0, 0.06);
}
.status-stepper {
  border: 1px solid rgba(127, 127, 127, 0.2);
  border-radius: 12px;
  background: transparent;
}
.status-stepper :deep(.q-stepper__nav) {
  min-height: 94px;
}
.order-info-card {
  height: 100%;
  overflow: hidden;
}
.order-info-card :deep(.q-card__section) {
  padding: 18px;
}
.order-info-card .flex {
  min-width: 0;
}
.order-info-card .flex > div {
  overflow-wrap: anywhere;
}
.summary-table {
  overflow: hidden;
  border-color: rgba(128, 128, 128, 0.32);
  border-radius: 8px;
  background: transparent;
}
.summary-table :deep(td) {
  padding: 8px 10px;
  font-size: 13px;
}
.summary-divider td {
  height: 6px;
  padding: 0;
  background: rgba(128, 128, 128, 0.14);
}
.summary-total {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 12px;
  border-radius: 9px;
  color: #fff;
  background: #183d8f;
}
.summary-total strong {
  font-size: 18px;
}
.summary-panel {
  border: 1px solid rgba(128, 128, 128, 0.35);
  border-radius: 9px;
  box-shadow: inset 0 1px rgba(255, 255, 255, 0.04);
}
.summary-order-card {
  min-height: 0;
}
.rincian-card,
.rincian-list,
.rincian-scroll {
  min-height: 0;
}
.rincian-list {
  min-height: 360px;
}
.rincian-scroll {
  overscroll-behavior: contain;
}
.item-row {
  transition: background-color 0.16s ease;
}
.item-row:hover {
  background: rgba(25, 118, 210, 0.06);
}
@media (max-width: 599px) {
  .order-dialog {
    border-radius: 0;
  }
  .dialog-heading,
  .order-dialog__body {
    padding-left: 12px;
    padding-right: 12px;
  }
  .status-stepper :deep(.q-stepper__nav) {
    min-height: 82px;
  }
  .status-stepper :deep(.q-stepper__label) {
    font-size: 11px;
  }
  .order-info-card :deep(.q-card__section) {
    padding: 14px;
  }
}
</style>
