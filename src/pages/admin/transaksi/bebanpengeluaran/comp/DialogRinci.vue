<template>
  <q-dialog class="full-width q-mt-lg" backdrop-filter="blur(4px)" persistent>
    <q-card style="width: 80vw; max-width: 80vw">
      <q-card-section class="row items-center q-pb-none">
        <div class="full-width full-height q-pb-sm text-center text-h6">Rincian Beban</div>
        <q-space />
        <q-btn class="absolute-top-right" icon="close" flat round dense @click="closeDialog" />
      </q-card-section>

      <q-card-section class="q-pt-none">
        <q-form class="full-height" @submit="onSubmit">
          <q-card-section class="full-height q-pa-lg scroll">
            <div class="row q-col-gutter-md justify-around">
              <div class="row q-col-gutter-md">
                <app-select
                  class="col-12"
                  v-model="store.form.kodebeban"
                  label="Pilih Beban"
                  :options="selectBeban?.items"
                  option-label="beban"
                  option-value="kodebeban"
                  clearable
                  @update:model-value="(val) => isiproduk(val)"
                />
                <app-input
                  class="col-12"
                  v-model="store.form.volume"
                  label="Volume"
                  :valid="{ required: false }"
                  @update:model-value="
                    (val) => {
                      store.form.subtotal = parseFloat(store.form.nominal) * parseFloat(val)
                    }
                  "
                />
                <app-select
                  class="col-4"
                  v-model="store.form.satuan"
                  label="Satuan"
                  :options="selectSatuan.items"
                  option-label="satuan"
                  option-value="satuan"
                />
                <app-input
                  class="col-12"
                  currency
                  v-model="store.form.nominal"
                  :label="Nominal"
                  :valid="{ required: false }"
                  @update:model-value="
                    (val) => {
                      store.form.subtotal = parseFloat(store.form.volume) * parseFloat(val)
                    }
                  "
                />

                <app-input
                  class="col-12"
                  :model-value="formatDenganRp(store.form.subtotal)"
                  label="Subtotal"
                  readonly
                  :valid="{ required: true }"
                />

                <div class="col-12">
                  <q-separator class="q-my-md" />
                  <app-btn
                    :loading="store.loading"
                    type="submit"
                    :dense="false"
                    label="Simpan"
                    color="grey-10"
                    class="text-yellow-9"
                  />
                </div>
              </div>
            </div>
          </q-card-section>
        </q-form>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { formatDenganRp } from 'src/modules/utils'
import { useAdminMasterSatuanSelectStore } from 'src/stores/admin/master/satuan/select'
import { useFormTransaksiBebanStore } from 'src/stores/admin/transaksi/bebanpengeluaran/form'
import { useSelectBebanStore } from 'src/stores/admin/transaksi/bebanpengeluaran/select'
import { computed, onMounted } from 'vue'
// import { useFormOrderTransaksiStore } from 'src/stores/order/form'

const store = useFormTransaksiBebanStore()
const selectBeban = useSelectBebanStore()
const selectSatuan = useAdminMasterSatuanSelectStore()
onMounted(() => {
  selectBeban.getList()
  selectSatuan.getDataAll()
  console.log('beban', selectBeban.items)
})
defineProps({
  data: {
    type: Object,
    default: null,
  },
})
function isiproduk(val) {
  const it = selectBeban.items.find((x) => x.kodebeban === val)
  console.log('produk', it)
  if (it) {
    store.form.beban = it.beban
  }
}
const formatNilai = computed(() => {
  return new Intl.NumberFormat('id-ID', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(store.form.nominal)
})
const Nominal = computed(() => {
  return `Nominal Rp. ${formatNilai.value}`
})
function onSubmit() {
  store.saveData().then(() => {
    console.log('fooorm', store.form)
    store.form.kodebeban = null
    store.form.beban = null
    store.form.satuan = null
    store.form.volume = 0
    store.form.nominal = 0
    store.form.subtotal = 0
    // store.form.rincians = [];
    closeDialog()
  })
}

const closeDialog = () => {
  store.dialogrincis = false
}
</script>
