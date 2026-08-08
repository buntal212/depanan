<template>
  <div class="row full-width items-center justify-between">
    <div class="col-grow">
      <div class="flex items-center flex-center q-col-gutter-sm">
        <app-input
          v-model="store.params.q"
          prepend-icon="search"
          label="Telusuri No. Penerimaan"
          style="min-width: 300px"
          :debounce="300"
          @update:model-value="
            (e) => {
              store.getdata()
            }
          "
        />

        <app-select
          label="Pilih Bulan"
          v-model="store.params.bulan"
          :options="store.bulans"
          option-label="nama"
          option-value="value"
          :valid="store.params.bulan === ''"
          @update:model-value="
            (e) => {
              store.supplier = null
            }
          "
        />
        <app-select
          label="Pilih Tahun"
          v-model="store.params.tahun"
          :options="store.tahuns"
          option-label="value"
          option-value="value"
          :valid="store.params.tahun === ''"
          @update:model-value="
            (e) => {
              store.supplier = null
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
  <div v-if="store.items" class="row justify-end q-pr-md">
    <q-btn icon="print" class="text-yellow-8" color="grey-10" round dense @click="cetakData()"
      ><q-tooltip>Cetak</q-tooltip></q-btn
    >
  </div>
  <DialogCetak v-model="store.dialogCetak" />
</template>
<script setup>
import { useLaporanArusKas } from 'src/stores/admin/laporan/aruskas/storedata'
import { defineAsyncComponent, onMounted, shallowRef } from 'vue'

const DialogCetak = shallowRef(defineAsyncComponent(() => import('./DialogCetak.vue')))
const store = useLaporanArusKas()
onMounted(() => {
  store.getdata()
  store.generateTahuns()
})
// const refsupplier = ref(null)
// const refjnsbayar = ref(null)
function cetakData() {
  store.dialogCetak = true
}
</script>
