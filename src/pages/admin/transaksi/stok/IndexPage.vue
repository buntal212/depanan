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
import { useAdminListTransaksiStokBarangStore } from 'src/stores/admin/transaksi/stok/list'
import { defineAsyncComponent, ref } from 'vue'
const ListPage = defineAsyncComponent(() => import('./comp/ListPage.vue'))
const store = useAdminListTransaksiStokBarangStore()

const isList = ref(true)
</script>

<style scoped></style>
