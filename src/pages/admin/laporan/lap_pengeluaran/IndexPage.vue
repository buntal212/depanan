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
import { useLaporanPengeluaranStore } from 'src/stores/admin/laporan/lap_pengeluaran/list'
import { defineAsyncComponent, ref } from 'vue'
const ListPage = defineAsyncComponent(() => import('./comp/PageComp.vue'))
const store = useLaporanPengeluaranStore()
const isList = ref(true)
</script>
