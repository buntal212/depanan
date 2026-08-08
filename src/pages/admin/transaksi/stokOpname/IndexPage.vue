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
import { useAdminListTransaksiStokOpnameStore } from 'src/stores/admin/transaksi/opname/list'
import { defineAsyncComponent, ref } from 'vue'
const ListPage = defineAsyncComponent(() => import('./comp/ListPage.vue'))
const store = useAdminListTransaksiStokOpnameStore()

const isList = ref(true)
</script>

<style scoped></style>
