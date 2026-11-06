<template>
  <div class="fit">
    <ListPage
      v-if="isList"
      @add="
        () => {
          storeList.item = null
          isList = true
        }
      "
      @edit="
        (data) => {
          console.log('from emit',data);
          
          storeList.item = data
          isList = true
          openDialogOrder=true
        }
      "
    />

    <!-- <FormPage v-else :data="item" @back="isList = true" /> -->
    <DialogOrderPenjualan v-model="openDialogOrder" :order="storeList.item" :loading="storeList.loadingStatus"
      @update-rincian="onUpdateRincian"
      @delete-rincian="onDeleteRincian" 
      @update-status="onUpdateStatus"
      @setujui-draft="setujuiDraft"
    />
  </div>
</template>

<script setup>
import { defineAsyncComponent, ref } from 'vue'
import { useAdminOrderPenjualanStore } from 'src/stores/admin/transaksi/orderpenjualan/list'
import { notifError } from 'src/modules/notifs'


const ListPage = defineAsyncComponent(() => import('./comp/ListPage.vue'))
// const FormPage = defineAsyncComponent(() => import('./comp/FormPage.vue'))
const DialogOrderPenjualan = defineAsyncComponent(()=> import('./comp/DialogOrderPenjualan.vue'))

const isList = ref(true)
const openDialogOrder = ref(false)

const storeList = useAdminOrderPenjualanStore()
const { onUpdateRincian, onDeleteRincian, onUpdateStatus } = storeList

const setujuiDraft = async (payload) => {
  const hasil = await storeList.onUpdateStatus(payload)
  if (!hasil?.order || !hasil?.penjualan) {
    notifError('Draft penjualan belum berhasil dibuat. Silakan coba lagi.')
    return
  }

  if (storeList.item?.id === hasil.order.id) {
    storeList.item = { ...storeList.item, ...hasil.order }
  }
}
</script>

<style scoped></style>
