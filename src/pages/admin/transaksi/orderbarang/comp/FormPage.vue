<template>
  <div class="fit column">
    <div class="col-auto">
      <div class="row items-center q-pa-lg">
        <div class="col-grow">
          <app-btn-back @click="emits('back')" />
        </div>
        <div class="col-auto">
          <!-- <app-btn :dense="false" label="Simpan" color="primary" /> -->
        </div>
      </div>
    </div>
    <div class="col full-height q-px-lg q-pb-lg">
      <q-card flat class="col full-height">
        <q-form class="full-height" @submit="onSubmit">
          <q-card-section class="full-height q-pa-lg scroll">
            <div class="row q-col-gutter-md justify-around">
              <div :class="`col-${isMobile ? 12 : 6}`" class="row q-col-gutter-md">
                <!-- <app-input
                  class="col-12"
                  v-model="store.form.namabarang"
                  label="Nama Barang"
                  :valid="{ required: false }"
                /> -->
                <div class="col-12 text-center text-h5">FORM ORDER</div>
                <app-input class="col-5" v-model="store.form.noorder" label="No. Order" disable />
                <app-select
                  class="col-6"
                  v-model="store.form.kdsuplier"
                  label="Supplier"
                  :options="storesuplier.itemsall"
                  option-label="nama"
                  option-value="kodesupl"
                />
                <div class="col-1" align="right">
                  <app-btn
                    class="col-1"
                    icon="add"
                    tooltip="Tambah Data"
                    color="primary"
                    type="submit"
                  />
                </div>
              </div>
            </div>
            <q-separator class="q-my-md" />

            <div class="row q-col-gutter-md justify-around">
              <div class="col-12">
                <q-list bordered class="rounded-borders">
                  <q-item v-for="(item, n) in lists" :key="n">
                    <q-item-section top>
                      <q-item-label lines="1">
                        <span class="text-weight-medium">[{{ item?.mbarang?.namabarang }}]</span>
                        <span class="text-grey-8"> - {{ item?.kdbarang }}</span>
                      </q-item-label>
                      <q-item-label
                        caption
                        lines="1"
                        class="q-mt-xs text-body2 text-weight-bold text-primary text-uppercase"
                      >
                        {{ item?.jumlahpo }} x {{ item?.hargapo }}</q-item-label
                      >
                    </q-item-section>

                    <q-item-section top side>
                      <div class="text-grey-8 q-gutter-xs">
                        <q-btn class="gt-xs" size="12px" flat dense round icon="delete" />
                        <q-btn class="gt-xs" size="12px" flat dense round icon="done" />
                        <q-btn size="12px" flat dense round icon="more_vert" />
                      </div>
                    </q-item-section>
                  </q-item>
                </q-list>
              </div>
            </div>
          </q-card-section>
        </q-form>
      </q-card>
    </div>
  </div>
  <dialog-rinci-page />
</template>
<script setup>
import { useQuasar } from 'quasar'
import { useAdminFormTransaksiOrderBarangStore } from 'src/stores/admin/transaksi/orderbarang/form'
import DialogRinciPage from './DialogRinciPage.vue'
import { computed, onMounted } from 'vue'
import AppSelect from 'src/components/~global/AppSelect.vue'
import { useAdminMasterSupplierStore } from 'src/stores/admin/master/supplier/list'

const store = useAdminFormTransaksiOrderBarangStore()
const emits = defineEmits(['back'])

const $q = useQuasar()
const isMobile = computed(() => {
  return $q.screen.lt.sm // Quasar screen size helper
})
function onSubmit() {
  store.fixed = true
}

const props = defineProps({
  data: {
    type: Object,
    default: null,
  },
})

const lists = computed(() => {
  const arr = props.data?.rinci
  console.log('arr', arr)
  return arr?.sort((a, b) => {
    return b.id - a.id
  })
})

onMounted(() => {
  store.initReset(props.data)
})

const storesuplier = useAdminMasterSupplierStore()
</script>
