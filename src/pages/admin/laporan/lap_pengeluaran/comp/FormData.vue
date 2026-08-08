<template>
  <div class="row full-width items-center justify-between">
    <div class="col-grow">
      <div class="flex items-center flex-center q-col-gutter-sm">
        <app-input
          v-model="store.params.q"
          prepend-icon="search"
          label="Telusuri"
          style="min-width: 300px"
          :debounce="300"
          @update:model-value="
            (e) => {
              store.getdata()
            }
          "
        />
        <app-input-date
          :model="store.dateDisplay.from"
          label="Dari"
          style="min-width: 150px"
          outlined
          :debounce="300"
          @set-model="
            (val) => {
              store.dateDisplay.from = val
            }
          "
          @db-model="
            (val) => {
              store.params.tglawal = val
            }
          "
        />
        <app-input-date
          :model="store.dateDisplay.to"
          label="Sampai"
          style="min-width: 150px"
          outlined
          :debounce="300"
          @set-model="
            (val) => {
              store.dateDisplay.to = val
            }
          "
          @db-model="
            (val) => {
              store.params.tglakhir = val
            }
          "
        />

        <div>
          <app-btn
            :loading="store.loading"
            type="button"
            :dense="false"
            label="Ambil Data"
            color="grey-10"
            class="text-yellow-9"
            @click="
              () => {
                store.getdata()
              }
            "
          />
        </div>
      </div>
    </div>
  </div>
  <div class="col q-py-md full-width">
    <q-separator />
  </div>
  <div v-if="store.items.length > 0" class="row justify-end q-pr-md">
    <q-btn icon="print" class="text-yellow-8" color="grey-10" round dense @click="cetakData()"
      ><q-tooltip>Cetak</q-tooltip></q-btn
    >
  </div>
  <DialogCetak v-model="store.dialogCetak" />
</template>
<script setup>
import { useLaporanPengeluaranStore } from 'src/stores/admin/laporan/lap_pengeluaran/list'
import { defineAsyncComponent, shallowRef } from 'vue'

const DialogCetak = shallowRef(defineAsyncComponent(() => import('./DialogCetak.vue')))
const store = useLaporanPengeluaranStore()

function cetakData() {
  store.dialogCetak = true
}
</script>
