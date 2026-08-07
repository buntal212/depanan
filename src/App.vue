<template>
  <router-view />
</template>

<script setup>
import { useQuasar } from 'quasar';
import { onBeforeMount } from 'vue';
import { useAppStore } from './stores/app';
import { useLeftDrawerStore } from './stores/app/leftdrawer';
import { useAdminMasterSatuanSelectStore } from './stores/admin/master/satuan/select';

//

const $q = useQuasar()
const app = useAppStore()
const adminLeftMenu = useLeftDrawerStore()
const selectSatuan = useAdminMasterSatuanSelectStore()

onBeforeMount(() => {
  $q.dark.set(app?.dark)
  Promise.all([
    adminLeftMenu.getMenu(),
    selectSatuan.getDataAll()
  ])
})
</script>
