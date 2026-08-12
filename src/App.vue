<template>
  <router-view />
</template>

<script setup>
import { useQuasar } from 'quasar'
import { onMounted } from 'vue'
import { useAppStore } from './stores/app'
// import { useAdminMasterSatuanSelectStore } from './stores/admin/master/satuan/select'
// import { useAdminMasterBrandSelectStore } from './stores/admin/master/brand/select'
// import { useAdminMasterJenisSelectStore } from './stores/admin/master/jeniskeramik/select'

const $q = useQuasar()
const app = useAppStore()
// const selectSatuan = useAdminMasterSatuanSelectStore()
// const selectBrands = useAdminMasterBrandSelectStore()
// const selectJenis = useAdminMasterJenisSelectStore()

onMounted(() => {
  $q.dark.set(app?.dark)
})
</script>
