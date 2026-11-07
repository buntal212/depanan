<template>
  <div v-if="isList">
    <HistoryPenjualanPage @add="()=>{
      store.resetPembayaran()
      isList = false
      }"
      @use-nota="useNota"
      @bayar="bayar"
      @tempo="tempo"
    />
  </div>
  <div v-else class="q-pa-md">
    <div class="row items-center">
      <div class="col-1">
        <app-btn-back @click="isList = true" />
      </div>
      <div class="col-10">
        <div class="row justify-center text-weight-bold text-h5 q-my-xs">Penjualan</div>
        <div v-if="dariOrder" class="row justify-center text-primary text-weight-medium q-mb-xs">
          Melanjutkan Order # {{ dariOrder }}
        </div>
        <div class="row justify-center text-weight-bold q-my-xs">
          <div class="col-5 text-center">
            <div class="row justify-center q-col-gutter-x-xs">
              <div class="col-auto text-right">Nota :</div>
              <div class="col-auto">
                {{ store.noNota ?? 'nota tersedia setelah diisimpan satu data' }}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="col-1 text-right">
        <!-- <app-btn-cetak v-if="store?.noNota" class="q-mr-xs" @click="lihatCetak()"></app-btn-cetak> -->
        <app-btn
          v-if="store?.noNota"
          class="q-mr-xs"
          icon="attach_money"
          tooltip="Pembayaran"
          color="blue"
          @click="
            () => {
              bukaPembayaran(store.item)
              console.log('store.formPembayaran', store.formPembayaran)
            }
          "
        />
        <!-- <app-btn
          icon="open_in_new"
          tooltip="Buka History Penjualan"
          color="primary"
          @click="isList = true"
        /> -->
      </div>
    </div>

    <q-separator />

    <div class="q-my-xs">
      <div v-if="store.loading" class="row full-width justify-between items-center q-pa-xs">
        <div class="col-auto">
          <q-spinner-pie color="grey-5" size="20px" />
          <q-spinner-pie color="grey-5" size="30px" />
          <q-spinner-pie color="grey-5" size="40px" />
        </div>
        <div class="col-auto">Sedang menyimpan</div>
        <div class="col-auto">
          <q-spinner-pie color="grey-5" size="40px" />
          <q-spinner-pie color="grey-5" size="30px" />
          <q-spinner-pie color="grey-5" size="20px" />
        </div>
      </div>
      <FormPage v-else />
    </div>
    <q-separator />
    <div class="q-my-xs">
      <ListPage />
    </div>
    <q-separator v-if="store?.item != null" />
    <div v-if="store?.item != null" class="row q-py-md">
      <div class="col-4"></div>
      <div class="col-3 text-weight-bold">Total</div>
      <div class="col-2 text-weight-bold text-right">
        {{ formatDouble(totalDiskonItem) }}
      </div>
      <div class="col-2 text-weight-bold text-right">{{ formatDouble(subtotalBarang) }}</div>
    </div>
    <q-separator v-if="store?.item != null" />
  </div>
  <DialogPembayaranPage v-model="store.openPembayaran" />
  <DialogCetak v-model="store.opendialogCetak" />
  <DialogTempo v-model="store.openDialogTempo" />
</template>
<script setup>
import { date } from 'quasar'
import { formatDouble } from 'src/modules/formatter'
import { useFromPenjualanStore } from 'src/stores/admin/transaksi/penjualan/form'
import { useListPenjualanStore } from 'src/stores/admin/transaksi/penjualan/list'
import { computed, defineAsyncComponent, ref, shallowRef } from 'vue'
import { useRoute } from 'vue-router'

const FormPage = shallowRef(defineAsyncComponent(() => import('./comp/FormPage.vue')))
const ListPage = shallowRef(defineAsyncComponent(() => import('./comp/ListPage.vue')))
const HistoryPenjualanPage = shallowRef(
  defineAsyncComponent(() => import('./comp/HistoryPenjualanPage.vue')),
)
const DialogPembayaranPage = shallowRef(
  defineAsyncComponent(() => import('./comp/DialogPembayaranPage.vue')),
)
const DialogCetak = shallowRef(defineAsyncComponent(() => import('./comp/cetak/DialogCetak.vue')))
const DialogTempo = shallowRef(defineAsyncComponent(() => import('./comp/DialogTempo.vue')))

const subtotalBarang = computed(() => {
  if (Array.isArray(store?.item?.detail) && store.item.detail.length > 0) {
    return store.item.detail.reduce((acc, row) => acc + (Number(row.subtotal) || 0), 0)
  }
  return Number(store?.item?.subtotal || 0)
})

const totalDiskonItem = computed(() => {
  if (Array.isArray(store?.item?.detail) && store.item.detail.length > 0) {
    return store.item.detail.reduce((acc, row) => acc + (Number(row.diskon) || 0), 0)
  }
  return Number(store?.item?.total_diskon || 0)
})

const isList = ref(true)
const route = useRoute()
const dariOrder = route.query.dari_order || null
const store = useFromPenjualanStore()
const list = useListPenjualanStore()
if (dariOrder) isList.value = false
list.getList()
store.getSales()
function useNota(val) {
  // console.log('use nota',  val);
  isList.value = false
  store.dariOrder = Boolean(val?.noorder) || String(val?.no_penjualan || '').startsWith('OPJ-')
  store.form.sales_id = val?.sales_id
  store.noNota = val?.no_penjualan
  store.item = val
  store.pastikanSalesTersedia(val?.sales)
  store.siapkanPembayaran(val)
}
function bayar(item) {
  console.log('bayar', item)
  bukaPembayaran(item)
}
function bukaPembayaran(item) {
  store.siapkanPembayaran(item)
  store.openPembayaran = true
}
function tempo(item) {
  store.formTempo.jml_tempo=30
  const nextMth=date.addToDate(Date.now(),{day:store.formTempo.jml_tempo})

  store.formTempo.tgl_kirim = date.formatDate(Date.now(), 'YYYY-MM-DD')
  store.dispTempo = date.formatDate(Date.now(), 'DD MMMM YYYY')
  store.formTempo.tempo = date.formatDate(nextMth, 'YYYY-MM-DD')
  store.formTempo.id=item.id
  store.item=item
  store.openDialogTempo = true
  setTimeout(() => {
    if(item?.expand) delete item.expand
  },100)
}
// function lihatCetak(item) {
//   console.log('item', item)
//   store.opendialogCetak = true
// }
</script>
