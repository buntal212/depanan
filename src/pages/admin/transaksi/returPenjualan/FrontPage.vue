<template>
  <template v-if="isList=='listPenjualan'">
  <Suspense>
    <list-penjualan-page @list="()=>isList='list'" @form="(val)=>{
        // console.log('form', val);
        // form.item=val
        form.setForm(val)
        isList='form'
      }"/>
    <template #fallback>
      <Loading />
    </template>
  </Suspense>
  </template>
  <template v-if="isList=='list'">
  <Suspense>
    <list-page @back="()=>isList='listPenjualan'" @selesai="listSelesai"/>
    <template #fallback>
      <Loading />
    </template>
  </Suspense>
  </template>
  <template v-if="isList=='form'">
  <Suspense>
    <form-page @back="()=>{
        form.item=null
        form.resetForm()
        isList='listPenjualan'
      }"
      @selesai="selesai"/>
    <template #fallback>
      <Loading />
    </template>
  </Suspense>
  </template>

</template>
<script setup>
import { useListReturPenjualanStore } from 'src/stores/admin/transaksi/returPenjualan/list'
import { useFormReturPenjualanStore } from 'src/stores/admin/transaksi/returPenjualan/form'
import { defineAsyncComponent, ref } from 'vue'
import { useListTransaksiReturPenjualanStore } from 'src/stores/admin/transaksi/returPenjualan/retur'
const listPage = defineAsyncComponent(() =>
  import('./comp/ListPage.vue')
)
const formPage = defineAsyncComponent(() =>
  import('./comp/FormPage.vue')
)
const listPenjualanPage = defineAsyncComponent(() =>
  import('./comp/ListPenjualanPage.vue')
)

const Loading=defineAsyncComponent(() => import('src/components/app/AppLoading.vue'))

const isList=ref('listPenjualan')

const list=useListReturPenjualanStore()

const form=useFormReturPenjualanStore()

const retur=useListTransaksiReturPenjualanStore()
list.getList()
retur.getList()

function selesai(data){

  const index=list.items.findIndex(i=>i.id==data?.pj.id)
  if(index>=0){
    list.items[index]=data?.pj
  }
  const indexret=retur.items.findIndex(i=>i.id==data?.data.id)
  if(indexret>=0){
    retur.items[indexret]=data?.data
  }
  isList.value='list'
  // console.log('selesai front', data, index);

}
function listSelesai(val){
  console.log('val', val);
  val.loading=true
  form.selesai({no_retur:val.no_retur})
  .then((data) => {
    val.loading=false
    selesai(data)
    const isi= data?.data
    const index=retur.items.findIndex(i=>i.id==isi.id)
    if(index>=0){
      retur.items[index]=isi
    }

  }).catch(() => {
    val.loading=false

  })
  .finally(() => {
    val.loading=false
  })

}
</script>
