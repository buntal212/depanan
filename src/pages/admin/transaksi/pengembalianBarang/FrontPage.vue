<template>
  <template v-if="isList=='listPenjualan'">
    <Suspense>
      <list-penjualan-page
        @list="()=>isList='list'"
        @form="(val)=>{
          form.item = val
          form.setForm(val)
          isList='form'
        }"
      />
      <template #fallback>
        <Loading />
      </template>
    </Suspense>
  </template>

  <template v-if="isList=='list'">
    <Suspense>
      <list-page
        @back="()=>isList='listPenjualan'"
      />
      <template #fallback>
        <Loading />
      </template>
    </Suspense>
  </template>

  <template v-if="isList=='form'">
    <Suspense>
      <form-page
        @back="()=>{
          form.item = null
          form.resetForm()
          isList='listPenjualan'
        }"
        @selesai="selesai"
      />
      <template #fallback>
        <Loading />
      </template>
    </Suspense>
  </template>
</template>

<script setup>
import { defineAsyncComponent, ref } from 'vue'
import { useListPengembalianStore } from 'src/stores/admin/transaksi/pengembalianBarang/list'
import { useFormPengembalianStore } from 'src/stores/admin/transaksi/pengembalianBarang/form'

const listPage = defineAsyncComponent(() =>
  import('./comp/ListPage.vue')
)
const formPage = defineAsyncComponent(() =>
  import('./comp/FormPage.vue')
)
const listPenjualanPage = defineAsyncComponent(() =>
  import('./comp/ListPenjualanPage.vue')
)
const Loading = defineAsyncComponent(() =>
  import('src/components/app/AppLoading.vue')
)

// State untuk tracking halaman aktif
const isList = ref('listPenjualan')

// Store
const list = useListPengembalianStore()
const form = useFormPengembalianStore()

// Load initial data
list.getList()

// Handler setelah form selesai
function selesai(data) {
  const index = list.items.findIndex(i => i.id == data?.id)
  if (index >= 0) {
    list.items[index] = data
  } else {
    list.items.unshift(data)
  }
  isList.value = 'list'
}
</script>
