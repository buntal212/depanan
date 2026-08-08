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
        <app-select
          label="Berdasar Sales"
          v-model="store.params.sales"
          :options="getsales.sales"
          option-label="nama"
          option-value="id"
          :valid="store.params.sales === null"
          @update:model-value="
            (val) => {
              refseles = val
              store.sales = null
            }
          "
        />
        <app-select
          class="col-12"
          v-model="store.params.jnsbayar"
          label="Berdasar Jenis Bayar"
          :options="optionCaraBayar"
          option-label="label"
          option-value="value"
          :valid="store.params.jnsbayar === null"
          @update:model-value="
            (val) => {
              refjnsbayar = val
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

                if (store.params.sales != null || store.params.jnsbayar != null) {
                  const cari = getsales.sales.find((x) => x.id === store.params.sales)
                  store.sales = cari.nama

                  const caribyr = optionCaraBayar.find((x) => x.value === store.params.jnsbayar)
                  store.jnsbayar = caribyr.label
                } else {
                  store.sales = null
                  store.jnsbayar = null
                }

                store.params.sales = null
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
import { useLaporanPenjualanStore } from 'src/stores/admin/laporan/lap_penjualan/list'
import { useFromPenjualanStore } from 'src/stores/admin/transaksi/penjualan/form'
import { defineAsyncComponent, onMounted, ref, shallowRef } from 'vue'

const DialogCetak = shallowRef(defineAsyncComponent(() => import('./DialogCetak.vue')))
const store = useLaporanPenjualanStore()
const getsales = useFromPenjualanStore()

onMounted(() => {
  store.getdata()
})
getsales.getSales()
function cetakData() {
  store.dialogCetak = true
}
const refseles = ref(null)
const refjnsbayar = ref(null)
const optionCaraBayar = ref([
  { label: 'Lunas', value: '5' },
  { label: 'Down Payment (DP)', value: '7' },
  { label: 'Tempo', value: '2' },
  // { label: 'Hutang', value: '2' },
])
</script>
