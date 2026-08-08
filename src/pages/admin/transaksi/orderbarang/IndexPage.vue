<template>
  <div class="fit">
    <ListPage
      v-if="isList"
      @add="
        () => {
          store.item = null
          isList = false
        }
      "
      @edit="
        (data) => {
          store.item = data
          isList = false
        }
      "
    />

    <FormPage v-else :data="store?.item" @back="isList = true" />
  </div>
</template>

<script setup>
import { useAdminMasterSupplierStore } from 'src/stores/admin/master/supplier/list'
import { useAdminFormTransaksiOrderBarangStore } from 'src/stores/admin/transaksi/orderbarang/form'
import { defineAsyncComponent, ref } from 'vue'
const ListPage = defineAsyncComponent(() => import('./comp/ListPage.vue'))
const FormPage = defineAsyncComponent(() => import('./comp/FormPage.vue'))

const isList = ref(true)
const storesuplier = useAdminMasterSupplierStore()

const store = useAdminFormTransaksiOrderBarangStore()
store.item = []

storesuplier.getAllList()
</script>

<style scoped></style>
