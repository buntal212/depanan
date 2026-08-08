<template>
  <div class="fit">
    <ListPage
      v-if="isList"
      @add="
        () => {
          storeform.itemPembayaranpiutang = null
          isList = false
        }
      "
      @edit="
        (data) => {
          storeform.itemPembayaranpiutang = data
          isList = false
        }
      "
    />

    <FormPage v-else :data="storeform.itemPembayaranpiutang" @back="isList = true" />
  </div>
</template>

<script setup>
import { useAdminFormTransaksiPembayaranPiutangStore } from 'src/stores/admin/transaksi/pembayaranpiutang/form'
import { defineAsyncComponent, ref } from 'vue'

const ListPage = defineAsyncComponent(() => import('./comp/ListPage.vue'))
const FormPage = defineAsyncComponent(() => import('./comp/IndexFormPage.vue'))

const isList = ref(true)

const storeform = useAdminFormTransaksiPembayaranPiutangStore()

storeform.itemPembayaranpiutang = []
</script>
