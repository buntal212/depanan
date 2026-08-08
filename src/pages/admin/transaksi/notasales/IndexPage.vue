<template>
  <div class="fit">
    <ListPage
      v-if="isList"
      @add="
        () => {
          storelist.itemNotaSales = null
          isList = false
        }
      "
      @edit="
        (data) => {
          storelist.itemNotaSales = data
          isList = false
        }
      "
    />

    <FormPage
      v-else
      :data="storelist.itemNotaSales"
      @back="isList = true"
      :pegawai="storepegawai.items"
      :pelanggan="storepelanggan.itemsall"
    />
  </div>
</template>

<script setup>
import { useAdminMasterPegawaiStore } from 'src/stores/admin/master/pegawai/list'
import { useAdminMasterPelangganStore } from 'src/stores/admin/master/pelanggan/list'
import { useAdminListTransaksiNotaSalesstore } from 'src/stores/admin/transaksi/notasales/list'
import { defineAsyncComponent, onMounted, ref } from 'vue'

const ListPage = defineAsyncComponent(() => import('./comp/ListPage.vue'))
const FormPage = defineAsyncComponent(() => import('./comp/FormPage.vue'))

const isList = ref(true)

const storelist = useAdminListTransaksiNotaSalesstore()
const storepegawai = useAdminMasterPegawaiStore()
const storepelanggan = useAdminMasterPelangganStore()

onMounted(() => {
  storelist.itemNotaSales = null
  storepegawai.getList()
  storelist.getNotaSales()
  storepelanggan.getListall()
})
</script>
