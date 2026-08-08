<template>
  <div v-if="store.item==null">
    <noData/>
  </div>
  <div v-else>
    <div class="row q-pa-sm">
    <div class="col-3">Produk</div>
    <div class="col-1 text-right">Jumlah</div>
    <div class="col-1 text-right">Satuan</div>
    <div class="col-2 text-right">Harga</div>
    <div class="col-2 text-right">Diskon</div>
    <div class="col-2 text-right">Subtotal</div>
    <div class="col-1 text-right">
      <div class="q-mr-sm">#</div>
    </div>
  </div>
    <div v-for="detail in store.item?.detail" :key="detail?.id">
      <div class="row items-center q-pa-sm">
        <div class="col-3">{{detail?.master_barang?.namabarang +' '+detail?.motif}}</div>
          <template v-if="parseFloat(detail.jumlah) % parseFloat(detail?.isi) == 0">
            <div class="col-1 text-right">{{formatDouble(Math.floor(parseFloat(detail?.jumlah)/ parseFloat(detail.isi)))}}</div>
            <div class="col-1 text-right">{{detail?.master_barang?.satuan_b}}</div>
            <div class="col-2 text-right">{{formatDouble(parseFloat(detail?.harga_jual)* parseFloat(detail?.isi))}}</div>
          </template>
          <template v-else>
            <div class="col-1 text-right">{{formatDouble(detail?.jumlah)}}</div>
            <div class="col-1 text-right">{{detail?.master_barang?.satuan_k}}</div>
            <div class="col-2 text-right">{{formatDouble(detail?.harga_jual)}}</div>
          </template>

          <div class="col-2 text-right">{{formatDouble(detail?.diskon)}}</div>
          <div class="col-2 text-right">{{formatDouble(detail?.subtotal)}}</div>
          <div class="col-1 text-right">
            <div class="q-ml-sm">
              <q-btn color="negative" :icon="uiwDelete" padding="sm" round dense flat size="9px" :loading="detail?.loading" :disable="detail?.loading" @click="del(detail)">
                <q-tooltip>Delete Data</q-tooltip>
              </q-btn>

            </div>
          </div>
      </div>
    </div>

  </div>
</template>
<script setup>
import { Dialog } from 'quasar'
import { useFromPenjualanStore } from 'src/stores/admin/transaksi/penjualan/form'
import { uiwDelete } from 'quasar-extras-svg-icons/uiw-icons'
import { defineAsyncComponent, shallowRef } from 'vue'
import { formatDouble } from 'src/modules/formatter'

const noData=shallowRef(defineAsyncComponent(() => import('src/components/app/AppNoData.vue')))
const store=useFromPenjualanStore()
const del = (item) => {
  Dialog.create({
    title: 'Peringatan',
    message: 'Apakah Data ini akan dihapus?',
    cancel: true,
    // persistent: true
  })
    .onOk(() => {
      // const params = { id: selected.value }
      store.deleteDetail(item)
    })
    .onCancel(() => {
      console.log('Cancel')
    })
    .onDismiss(() => {
      // console.log('I am triggered on both OK and Cancel')
    })
}
</script>
