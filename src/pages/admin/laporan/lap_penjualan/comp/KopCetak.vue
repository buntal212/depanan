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
  <div>
    <q-separator />
  </div>
  <div class="row q-px-md q-pt-md justify-center full-width">
    <span class="text-bold q-pr-md"> LAPORAN PENJUALAN </span>
  </div>
  <div class="row q-px-md q-pb-md justify-center full-width">
    <span class="text-bold q-pr-md"> Periode </span>
    <span class="text-bold q-pr-md">
      {{ store.dateDisplay.from }} - {{ store.dateDisplay.to }}
    </span>
  </div>
  <!-- <div class="row full-width"> -->
  <!-- <div class="row full-width q-px-md justify-between">
    <div class="col-2 flex-start text-bold q-pr-md">Periode Penerimaan</div>
    <div class="col flex-end text-bold q-pr-md">
      : {{ store.dateDisplay.from }} - {{ store.dateDisplay.to }}
    </div>
  </div> -->
  <!-- </div> -->
  <!-- <div class="row full-width"> -->

  <!-- </div> -->
</template>
<script setup>
import { useLaporanPenjualanStore } from 'src/stores/admin/laporan/lap_penjualan/list'
import { useProfilStore } from 'src/stores/admin/profil'
const profil = useProfilStore()
const store = useLaporanPenjualanStore()
</script>
