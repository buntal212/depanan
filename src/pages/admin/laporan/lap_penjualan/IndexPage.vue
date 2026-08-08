<template>
  <div class="fit">
    <ListPage
      v-if="isList"
      @add="
        () => {
          store.items = null
          isList = false
        }
      "
      @edit="
        (data) => {
          store.items = data
          isList = false
        }
      "
    />
  </div>
</template>

<script setup>
import { useLaporanPenjualanStore } from 'src/stores/admin/laporan/lap_penjualan/list'
import { useAdminMasterSupplierStore } from 'src/stores/admin/master/supplier/list'
import { defineAsyncComponent, ref } from 'vue'
const ListPage = defineAsyncComponent(() => import('./comp/PageComp.vue'))
const store = useLaporanPenjualanStore()
const storesuplier = useAdminMasterSupplierStore()
const isList = ref(true)
storesuplier.getAllList()
</script>
