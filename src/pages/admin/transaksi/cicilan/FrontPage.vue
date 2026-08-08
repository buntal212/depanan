<template>
  <div v-if="isList">
    <ListPenjualanPage
      @back="isList = false"
      @bawa="bawaNota"
      @cicil="cicilNota"
      @kembali="kembaliTanpaBayar"
      @buka="bukaCicilan"
      @lunas="lunasNota"
    />
  </div>
  <div v-else class="q-pa-md">
    <div class="row items-center">
      <div class="col-10">
        <div class="row justify-center text-weight-bold text-h5 q-my-xs">Pembayaran Cicilan</div>
        <div class="row justify-center text-weight-bold q-my-xs">
          <div class="col-6">
            <div class="row justify-between">
              <div class="col-5 text-right">Nota :</div>
              <div class="col-6">{{ store?.item?.no_penjualan ?? '' }}</div>
            </div>
          </div>
        </div>
      </div>
      <div class="col-2 text-right">
        <app-btn
          v-if="store?.noNota"
          class="q-mr-xs"
          icon="attach_money"
          tooltip="Pembayaran"
          color="blue"
          @click="
            () => {
              store.formPembayaran.total = store.item?.total
              store.formPembayaran.no_penjualan = store.noNota
            }
          "
        />
        <app-btn
          icon="open_in_new"
          tooltip="Buka History Penjualan"
          color="primary"
          @click="isList = true"
        />
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
    <q-separator v-if="store?.item != null" />
    <div v-if="store?.item != null" class="row q-py-md">
      <div class="col-4"></div>
      <div class="col-5 text-weight-bold">Total</div>
      <div class="col-2 text-weight-bold text-right">{{ store?.item?.total }}</div>
    </div>
    <q-separator v-if="store?.item != null" />
  </div>
  <DialogCicilan />
  <DialogListCicilan />
  <DialogPelunasan />
</template>
<script setup>
import { Dialog } from 'quasar'
import { useCicilanPenjualanFormStore } from 'src/stores/admin/transaksi/cicilan/form'
import { useListCicilanPenjualanStore } from 'src/stores/admin/transaksi/cicilan/list'
import { defineAsyncComponent, ref, shallowRef } from 'vue'

const FormPage = shallowRef(defineAsyncComponent(() => import('./comp/FormPage.vue')))
const ListPenjualanPage = shallowRef(
  defineAsyncComponent(() => import('./comp/ListPenjualanPage.vue')),
)
const DialogCicilan = shallowRef(defineAsyncComponent(() => import('./comp/DialogCicilanPage.vue')))
const DialogListCicilan = shallowRef(
  defineAsyncComponent(() => import('./comp/DialogListCicilan.vue')),
)
const DialogPelunasan = shallowRef(defineAsyncComponent(() => import('./comp/DialogPelunasan.vue')))

const isList = ref(true)

const store = useCicilanPenjualanFormStore()
const list = useListCicilanPenjualanStore()
list.getList()

function bawaNota(val) {
  console.log('bawa nota', val)
  list.BawaNota(val)
  // isList.value=false
}
function cicilNota(val) {
  console.log('cicil nota', val)
  // console.log('list', list.params);
  if (list.params?.flag == 'semua') {
    store.item = val
    store.setForm('pelanggan_id', val.pelanggan_id)
    store.setForm('sales_id', val.sales_id)
    store.setForm('id', val.id)
    store.isOpen = true
  } else {
    Dialog.create({
      title: 'Peringatan',
      message:
        'Jumlah Total HUTANG dan CICILAN munkin tidak akan akurat karena tidak semua nota ditampilkan',
      ok: {
        label: 'Lanjutkan',
        color: 'primary',
      },
      cancel: {
        label: 'Batal',
        color: 'negative',
      },
      persistent: true,
    }).onOk(() => {
      store.item = val
      store.setForm('pelanggan_id', val.pelanggan_id)
      store.setForm('sales_id', val.sales_id)
      store.setForm('id', val.id)
      store.isOpen = true
    })
  }
  // isList.value=false
}
function lunasNota(val) {
  console.log('Lunas nota', val)
  // console.log('list', list.params);
  store.item = val
  store.setForm('pelanggan_id', val.pelanggan_id)
  store.setForm('sales_id', val.sales_id)
  store.setForm('id', val.id)
  store.setForm('no_penjualan', val.no_penjualan)
  store.isOpenDP = true
}

function bukaCicilan(val) {
  console.log('cicil nota', val)
  store.item = val
  store.isOpenList = true
  // isList.value=false
}
function kembaliTanpaBayar(val) {
  console.log('kembaliTanpaBayar nota', val)
  list.tidakNyicil(val)
}
</script>
