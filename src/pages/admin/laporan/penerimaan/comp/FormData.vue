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
        <app-select
          label="Berdasar Supplier"
          v-model="store.params.supplier"
          :options="storesupllier.itemsall"
          option-label="nama"
          option-value="kodesupl"
          :valid="store.params.supplier === ''"
          @update:model-value="
            (e) => {
              store.supplier = null
            }
          "
        />
        <app-select
          label="Berdasar Jenis Bayar"
          v-model="store.params.jnsbayar"
          :options="['', 'Cash', 'Cash Tempo', 'Hutang']"
          :valid="store.params.jnsbayar === ''"
          onfocus="this.select()"
          @update:model-value="
            (e) => {
              store.jnsbayar = null
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
                if (store.params.supplier != null || store.params.jnsbayar != null) {
                  store.jnsbayar = store.params.jnsbayar
                  const as = storesupllier.itemsall.find(
                    (x) => x.kodesupl === store.params.supplier,
                  )
                  store.supplier = as.nama
                } else {
                  store.supplier = null
                  store.jnsbayar = null
                }

                store.params.supplier = null
                store.params.jnsbayar = null
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
import { useLaporanPenerimaanStore } from 'src/stores/admin/laporan/penerimaan/list'
import { useAdminMasterSupplierStore } from 'src/stores/admin/master/supplier/list'
import { defineAsyncComponent, onMounted, shallowRef } from 'vue'

const DialogCetak = shallowRef(defineAsyncComponent(() => import('./DialogCetak.vue')))
const store = useLaporanPenerimaanStore()
const storesupllier = useAdminMasterSupplierStore()
onMounted(() => {
  store.getdata()
})
// const refsupplier = ref(null)
// const refjnsbayar = ref(null)
function cetakData() {
  store.dialogCetak = true
}
</script>
