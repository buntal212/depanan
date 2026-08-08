<template>
  <router-view />
</template>

<script setup>
import { useQuasar } from 'quasar'
import { onMounted } from 'vue'
import { useAppStore } from './stores/app'
import { useLeftDrawerStore } from './stores/app/leftdrawer'
// import { useAdminMasterSatuanSelectStore } from './stores/admin/master/satuan/select'
// import { useAdminMasterBrandSelectStore } from './stores/admin/master/brand/select'
// import { useAdminMasterJenisSelectStore } from './stores/admin/master/jeniskeramik/select'
import { useProfilStore } from './stores/admin/profil'

const $q = useQuasar()
const app = useAppStore()
const adminLeftMenu = useLeftDrawerStore()
// const selectSatuan = useAdminMasterSatuanSelectStore()
// const selectBrands = useAdminMasterBrandSelectStore()
// const selectJenis = useAdminMasterJenisSelectStore()
const profiltoko = useProfilStore()

onMounted(() => {
  const token = localStorage.getItem('token')
  if (token) {
    Promise.all([
      adminLeftMenu.getMenu(),
      // selectSatuan.getDataAll(),
      // selectBrands.getDataAll(),
      // selectJenis.getDataAll(),
      profiltoko.getProfil(),
    ])
  }
  $q.dark.set(app?.dark)
})
</script>
