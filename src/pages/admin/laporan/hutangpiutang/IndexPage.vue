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
import { useLaporanHutangPiutang } from 'src/stores/admin/laporan/hutangpiutang/storedata'
import { defineAsyncComponent, ref } from 'vue'
const ListPage = defineAsyncComponent(() => import('../hutangpiutang/comp/PageComp.vue'))
const store = useLaporanHutangPiutang()
const isList = ref(true)
</script>
