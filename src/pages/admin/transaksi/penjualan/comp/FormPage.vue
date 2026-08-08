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
        clearable
        valid
        :options="store.sales"
        :disable="store?.item?.detail?.length>0"
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
      <div class="col-auto" style="width: 25%;">Produk</div>
      <div class="col-auto" style="width: 15%;">Jumlah (SB)</div>
      <div class="col-auto" style="width: 15%;">Jumlah (SK)</div>
      <div class="col-auto" style="width: 10%;">isi</div>
      <div class="col-auto" style="width: 10%;">Jumlah (allSK)</div>
      <div class="col-auto" style="width: 15%;">Harga Jual</div>
      <div class="col-auto" style="width: 10%;">Diskon (Rp)</div>
    </div>
  <q-separator />
  <div class="row items-center q-col-gutter-x-sm">
    <div class="col-auto" style="width: 25%;">
      <AppSelectLocal
        ref="refSelectBarang"
        v-model="store.barang"
        url="v1/transaksi/penjualan/list-barang"
        :option-label="opt=> opt?.barang?.namabarang+' - Seri '+ opt?.motif + ' - ' + (opt?.jumlah_k===0 ? '' : '(stok '+opt?.jumlah_k+ '  '+ opt?.satuan_k+' )') "
        :option-value="opt=> opt"
        label="Cari barang"
        :filter-min="3"
        filter-by="namabarang"

        @selected="selected($event)"
        @on-input="onInput($event)"
      />
    </div>
    <div class="col-auto" style="width: 15%;">
      <app-input ref="refJumlahB" v-model="store.form.jumlahB" :label="'Jumlah ('+ (store?.barang?.satuan_b??'')+')'"  :autofocus="false" @keyup.enter.stop="onEnterinput()"
      @clear=setNol(strJumlahB) @update:model-value="(val)=>{
        const _removedZeros = val?.replace(/^0+/, '')

        store.setForm('jumlahB',_removedZeros)
        setJumlah()
      }"
      />
    </div>
    <div class="col-auto" style="width: 15%;">
      <app-input ref="refJumlah" v-model="store.form.jumlahK" :label="'Jumlah ('+ (store?.barang?.satuan_k??'')+')'"  :autofocus="false" @keyup.enter.stop="onEnterinput()"
       @clear=setNol(strJumlah) @update:model-value="(val)=>{
        const _removedZeros = val?.replace(/^0+/, '')
        store.setForm('jumlahK',_removedZeros)
        setJumlah()
      }"
      />
    </div>
    <div class="col-auto" style="width: 10%;">
      <app-input-rp currency outlined v-model="store.form.isi" label="isi" :autofocus="false" readonly  />
    </div>
    <div class="col-auto" style="width: 10%;">
      <app-input-rp currency outlined v-model="store.form.jumlah" :label="'(Stok'+ (store?.barang?.jumlah_k??0)+')'" :autofocus="false" readonly  />
    </div>
    <div class="col-auto" style="width: 15%;">
      <app-input-rp v-if="store.form.jumlahB>0 && store.form.jumlahK<=0" currency v-model="store.form.hargaJualB" label="Harga Jual" outlined :autofocus="false" @keyup.enter.stop="onEnterinput()"
      @update:model-value="(val)=>{
        const jual=olahUang(val)
        store.setForm('harga_jual',jual/store.form.isi)
        console.log('gede', jual,store.form.harga_jual);

    }" />
      <app-input-rp v-else currency v-model="store.form.harga_jual" label="Harga Jual" outlined :autofocus="false" @keyup.enter.stop="onEnterinput()"
      @clear="()=>{
      store.setForm('harga_jual',isNaN(store?.barang?.hargajual1)?0:parseFloat(store?.barang?.hargajual1))
    }" />
    </div>
    <div class="col-auto" style="width: 10%;"><app-input-rp currency outlined v-model="store.form.diskon" label="Diskon (Rp)" :autofocus="false" @keyup.enter.stop="onEnterinput()" @clear=setNol(strDsikon) /></div>

  </div>
</template>
<script setup>
import { olahUang } from 'src/modules/utils'
import { useFromPenjualanStore } from 'src/stores/admin/transaksi/penjualan/form'
import { defineAsyncComponent, ref, shallowRef } from 'vue'

const AppSelectLocal=shallowRef(defineAsyncComponent(() => import('./AppSelect.vue')))
// const AppInput=shallowRef(defineAsyncComponent(() => import('src/components/app/AppInput.vue')))
const store=useFromPenjualanStore()

const refSelectBarang=ref(null)
const refJumlah=ref(null)
const refJumlahB=ref(null)
const strJumlah=ref('jumlahK')
const strJumlahB=ref('jumlahB')
const strDsikon=ref('diskon')
function selected(val){
  // console.log('ref', refSelectBarang.value?.refAuto);
  // console.log('store', store.barang);
  const keys=Object.keys(val)
  if(keys?.length>0){
    store.barang=val
    // console.log('store', store.barang);

    store.setForm('kodebarang',store?.barang?.barang?.kodebarang)
    const harju1=isNaN(store?.barang?.barang?.hargajual1)?0:Math.ceil(parseFloat(store?.barang?.barang?.hargajual1))
    const harju2=isNaN(store?.barang?.barang?.hargajual2)?0:Math.ceil(parseFloat(store?.barang?.barang?.hargajual2))
    const harbel=isNaN(store?.barang?.harga_beli_k)?0:Math.ceil(parseFloat(store?.barang?.harga_beli_k))
    if(!store.form.sales_id) store.setForm('harga_jual',harju1)
    else store.setForm('harga_jual',harju2)
    store.setForm('harga_beli',harbel)
    store.setForm('isi',isNaN(store?.barang?.isi)?(parseFloat(store?.barang?.barang?.isi)):parseFloat(store?.barang?.isi))
    store.setForm('motif',store?.barang?.motif ?? '')

    const harju=olahUang(store.form.harga_jual)

    store.setForm('hargaJualB', harju* store.form.isi)
    console.log('form', store.form, harju);
  }
  setTimeout(() => {
    refSelectBarang.value?.refAuto?.validate()
    // console.log('ref', refSelectBarang.value?.refAuto?.validate());

  },100)

}
function setJumlah(){
  const isi= parseFloat(store.form.isi) ?? 1
  const jumB=((isNaN(parseFloat(store.form.jumlahB))?0:parseFloat(store.form.jumlahB)) * isi)
  const jumK= (isNaN(parseFloat(store.form.jumlahK))?0:parseFloat(store.form.jumlahK))
  const jumlah= jumB + jumK
  console.log('set jumlah', store.form,olahUang(store.form.harga_jual));

  store.setForm('jumlah',jumlah)
}
function validasi(){
  const jumlah=refJumlah.value?.appInput?.validate()
  const barang=refSelectBarang.value?.refAuto?.validate()
  console.log('jumlah',jumlah, 'barang', barang);
  if(jumlah && barang) return true
  else return false

}
function onInput(){
  // console.log('on input', val);
  // console.log('input', store.barang);
  // if(val?.length<3) store.resetForm()
  store.resetForm()
}

function onEnterinput(){
  console.log('on enter input',refSelectBarang.value,refSelectBarang.value?.refAuto);
  if(validasi()) store.simpanDetail()

  refSelectBarang.value?.refAuto?.focus()
}
function setNol(val){
  console.log('nol',val);
  store.setForm(val,0)
}
</script>
