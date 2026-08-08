<!-- eslint-disable vue/no-parsing-error -->
<template>
    <div class="row q-mb-md">
      <div class="col-6">
        <app-select
        ref="refSelectSales"
        v-model="store.form.sales_id"
        option-label="nama"
        option-value="id"
        label="Cari Sales"
        :options="store.sales"

      />
      </div>
      <div class="col-6 text-right">

        <app-btn class="q-mr-xs" icon="restore" tooltip="Nota Baru" color="green" @click="()=>{
          store.noNota=null
          store.resetForm()
          store.item=null
        }" />
      </div>
    </div>
    <div class="row q-mb-sm">
      <div class="col-6">Produk</div>
      <div class="col-2 ">Jumlah</div>
      <div class="col-2 ">Harga</div>
      <div class="col-2">Diskon (Rp)</div>
    </div>
  <q-separator />
  <div class="row items-center q-col-gutter-sm">
    <!-- <div class="col-6">
      <AppSelectLocal
        ref="refSelectBarang"
        v-model="store.barang"
        url="v1/transaksi/penjualan/list-barang"
        :option-label="opt=> opt.namabarang + ' ' + (opt?.brand===null ? '' : opt?.brand) + ' ' + (opt?.seri===null ? '' : opt?.seri)+ ' ' + (opt?.ukuran===null ? '' : opt?.ukuran)"
        :option-value="opt=> opt"
        label="Cari barang"
        :filter-min="3"
        filter-by="namabarang"

        @selected="selected($event)"
        @on-input="onInput($event)"
      />
    </div> -->
    <div class="col-2">
      <app-input ref="refJumlah" v-model="store.form.jumlah" label="Jumlah" :autofocus="false" @keyup.enter.stop="onEnterinput()"
      :rules="[(val) => parseFloat(val)>0 || 'Jumlah barang harus lebih besar dari 0']" @clear=setNol(strJumlah)
      />
    </div>
    <div class="col-2"><app-input v-model="store.form.harga_jual" label="Harga" :autofocus="false" @keyup.enter.stop="onEnterinput()" @clear="()=>{
      store.setForm('harga_jual',isNaN(store?.barang?.hargajual1)?0:parseFloat(store?.barang?.hargajual1))
    }" /></div>
    <div class="col-2"><app-input v-model="store.form.diskon" label="Diskon (Rp)" :autofocus="false" @keyup.enter.stop="onEnterinput()" @clear=setNol(strDsikon) /></div>
  </div>
</template>
<script setup>
import { useFromPenjualanStore } from 'src/stores/admin/transaksi/penjualan/form'
import { ref } from 'vue'

// const AppInput=shallowRef(defineAsyncComponent(() => import('src/components/app/AppInput.vue')))
const store=useFromPenjualanStore()

const refSelectBarang=ref(null)
const refJumlah=ref(null)
const strJumlah=ref('jumlah')
const strDsikon=ref('diskon')

function validasi(){
  const jumlah=refJumlah.value?.appInput?.validate()
  const barang=refSelectBarang.value?.refAuto?.validate()
  console.log('jumlah',jumlah, 'barang', barang);
  if(jumlah && barang) return true
  else return false

}
function onEnterinput(){
  console.log('on enter input');
  if(validasi()) store.simpanDetail()


}
function setNol(val){
  console.log('nol',val);

  store.setForm(val,0)
}
</script>
