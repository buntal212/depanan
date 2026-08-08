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
import { useLaporanLabaRugi } from 'src/stores/admin/laporan/labarugi/storedata'
import { defineAsyncComponent, ref } from 'vue'
const ListPage = defineAsyncComponent(() => import('../labarugi/comp/PageComp.vue'))
const store = useLaporanLabaRugi()
const isList = ref(true)
</script>
