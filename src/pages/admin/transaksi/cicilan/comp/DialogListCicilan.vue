<template>
  <q-dialog persistent v-model="store.isOpenList">
    <q-card style="min-width: 550px">
      <q-card-section class="row items-center">
        <div class="text-h6">Daftar Cicilan</div>
        <q-space />
        <q-btn icon="close" flat round dense v-close-popup />
      </q-card-section>

      <q-card-section class="q-pt-none scroll-section">
        <q-list separator>
          <q-item v-for="(item, index) in store.item?.cicilan" :key="index">
            <q-item-section>
              <q-item-label>Cicilan ke-{{ index + 1 }}</q-item-label>
              <q-item-label caption lines="1">
                <div class="row">
                  <div class="col-6">Rp. {{ formatDouble(item.jumlah) }}</div>
                  <div class="col-6 text-right">Tanggal Input {{ humanDate(item.tgl_bayar) }}</div>
                </div>
              </q-item-label>
            </q-item-section>
            <q-item-section side>
              <app-btn
                color="negative"
                icon="delete"
                tooltip="Hapus Cililan"
                dense
                :loading="item.loading"
                :disable="item.loading"
                @click="store.hapusCicilan(item)"
              />
            </q-item-section>
          </q-item>
        </q-list>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { formatDouble } from 'src/modules/formatter'

import { humanDate } from 'src/modules/utils'
import { useCicilanPenjualanFormStore } from 'src/stores/admin/transaksi/cicilan/form'
const store = useCicilanPenjualanFormStore()
</script>

<style scoped>
.scroll-section {
  max-height: 60vh;
  overflow-y: auto;
}
</style>
