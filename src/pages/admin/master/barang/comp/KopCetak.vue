<template>
  <div class="row full-width justify-between">
    <div class="flex-start content-center">
      <div v-if="profil.fotoProfil">
        <q-img
          :src="profil.fotoProfil"
          style="width: 100px; height: 100px; border-radius: 50%; object-fit: cover"
          spinner-color="primary"
        />
      </div>
    </div>
    <div class="col flex-end content-center q-pl-sm">
      <div class="text-bold" style="font-size: x-large">
        {{ profil.profilData.namatoko }}
      </div>
      <div>
        {{ profil.profilData.alamat }}
      </div>
      <div>
        <span class="q-pr-sm">Telp : {{ profil.profilData.telepon }}</span>
        <span>email : {{ profil.profilData.email }} </span>
      </div>
    </div>
  </div>
  <q-separator />
  <div class="row q-px-md q-py-md full-width">
    <span class="text-bold q-pr-md"> KARTU STOK </span>
    <span> {{ store.kartuStok?.namabarang }} </span>
    <span class="q-pl-md content-center" style="font-size: small">
      (1 {{ store.kartuStok?.satuan_b }} ISI {{ store.kartuStok?.isi }}
      {{ store.kartuStok?.satuan_k }})
    </span>
  </div>
</template>
<script setup>
import { useAdminMasterBarangStore } from 'src/stores/admin/master/barang/list'
import { useProfilStore } from 'src/stores/admin/profil'
const profil = useProfilStore()
const store = useAdminMasterBarangStore()
</script>
