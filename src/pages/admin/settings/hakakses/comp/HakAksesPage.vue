<template>
  <div class="fit column">
    <div class="full-height full-width">
      <div class="row full-height">
        <q-card flat bordered square class="col-6 full-height">
          <ListPegawai
            :data="storepegawai.itemsset"
            @lihat="lihat"
            @tambah="tambah"
            :submenu="storepegawai.itemssubmenu"
          />
        </q-card>
        <q-card flat bordered square class="col-6 full-height">
          <ListHakAkses />
        </q-card>
      </div>
    </div>
  </div>
</template>
<script setup>
import { useAdminMasterPegawaiStore } from 'src/stores/admin/master/pegawai/list'
import ListPegawai from './ListPegawai.vue'
import ListHakAkses from './ListHakAkses.vue'
import { useAdminFormMasterPegawaiStore } from 'src/stores/admin/master/pegawai/form'

const storepegawai = useAdminMasterPegawaiStore()
const store = useAdminFormMasterPegawaiStore()

function lihat(val) {
  storepegawai.olah(val)
}

function tambah(val) {
  console.log('val', val)
  store.payload.userid = val.id
  store.dialog = true
}

storepegawai.getListsetting()
storepegawai.submenu()
</script>
