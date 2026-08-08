<template>
  <div class="fit">
    <ListPage
      v-if="isList"
      @add="
        () => {
          storeform.itemPembayaranhutang = null
          isList = false
        }
      "
      @edit="
        (data) => {
          storeform.itemPembayaranhutang = data
          isList = false
        }
      "
    />

    <FormPage v-else :data="storeform.itemPembayaranhutang" @back="isList = true" />
  </div>
</template>

<script setup>
import { useAdminFormTransaksiPembayaranHutangStore } from 'src/stores/admin/transaksi/pembayaranhutang/form'
import { defineAsyncComponent, ref } from 'vue'

const ListPage = defineAsyncComponent(() => import('./comp/ListPage.vue'))
const FormPage = defineAsyncComponent(() => import('./comp/IndexFormPage.vue'))

const isList = ref(true)

const storeform = useAdminFormTransaksiPembayaranHutangStore()

storeform.itemPembayaranhutang = []
</script>
