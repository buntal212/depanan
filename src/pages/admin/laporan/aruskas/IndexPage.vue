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
import { useLaporanArusKas } from 'src/stores/admin/laporan/aruskas/storedata'
import { defineAsyncComponent, ref } from 'vue'
const ListPage = defineAsyncComponent(() => import('./comp/PageComp.vue'))
const store = useLaporanArusKas()
const isList = ref(true)
</script>
