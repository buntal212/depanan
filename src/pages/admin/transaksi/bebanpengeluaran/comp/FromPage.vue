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
        <q-form class="full-height">
          <q-card-section class="full-height q-pa-lg scroll">
            <div class="row q-col-gutter-md justify-around">
              <div :class="`col-${isMobile ? 12 : 6}`" class="row q-col-gutter-md">
                <app-input-date
                  :disable="store.form.notrans !== '' && store.form.notrans !== null"
                  :model="store.dateDisplay.tgl"
                  class="col-12"
                  label="Tanggal"
                  outlined
                  @set-model="
                    (val) => {
                      store.dateDisplay.tgl = val
                    }
                  "
                  @db-model="
                    (val) => {
                      store.form.tgl = val
                    }
                  "
                />
                <app-input
                  class="col-12"
                  v-model="store.form.keterangan"
                  label="Keterangan"
                  :valid="{ required: false }"
                  :disable="store.form.notrans !== '' && store.form.notrans !== null"
                />

                <div class="col-12">
                  <q-separator class="q-my-md" />
                  <div class="row justify-around">
                    <app-btn
                      v-if="store.form.flaging !== '1'"
                      :loading="store.loading"
                      type="button"
                      :dense="false"
                      label="Tambah Rincian"
                      color="grey-10"
                      class="text-yellow-9"
                      clickable
                      @click="tambahRinci()"
                    />
                    <template v-if="store.form.notrans">
                      <app-btn
                        v-if="gantiKunci()"
                        round
                        dense
                        tooltip="kunci"
                        color="grey-10"
                        class="text-yellow-9"
                        size="md"
                        icon="lock_open"
                        @click="kuncitrans()"
                        :loading="store.lock"
                      >
                      </app-btn>
                      <app-btn
                        v-else
                        round
                        dense
                        tooltip="kunci"
                        color="grey-10"
                        class="text-yellow-9"
                        size="md"
                        icon="lock"
                        @click="kuncitrans()"
                        :loading="store.lock"
                      >
                      </app-btn>
                    </template>
                  </div>
                </div>
              </div>
            </div>
            <div class="col full-height q-px-lg q-pt-lg q-pb-lg">
              <ListRinci />
            </div>
          </q-card-section>
        </q-form>
      </q-card>
    </div>
  </div>

  <DialogRinci v-model="store.dialogrincis" :data="data" />
</template>

<script setup>
import { date, useQuasar } from 'quasar'
import { notifError } from 'src/modules/notifs'
import { dateFullFormat } from 'src/modules/utils'
import { useFormTransaksiBebanStore } from 'src/stores/admin/transaksi/bebanpengeluaran/form'
import { computed, defineAsyncComponent, onMounted } from 'vue'

const ListRinci = defineAsyncComponent(() => import('./ListRincian.vue'))
const DialogRinci = defineAsyncComponent(() => import('./DialogRinci.vue'))
const emits = defineEmits(['back'])
const $q = useQuasar()
const isMobile = computed(() => {
  return $q.screen.lt.sm // Quasar screen size helper
})

const store = useFormTransaksiBebanStore()
const props = defineProps({
  data: {
    type: Object,
    default: null,
  },
})
onMounted(() => {
  console.log('props', props.data)
  if (
    props?.data?.notrans === '' ||
    props?.data?.notrans === null ||
    props?.data?.notrans === undefined
  ) {
    store.form.notrans = ''
    store.form.kodebeban = null
    store.form.tgl = date.formatDate(Date.now(), 'YYYY-MM-DD')
    store.dateDisplay.tgl = date.formatDate(Date.now(), 'DD MMMM YYYY')
    store.form.keterangan = null
    store.form.volume = 0
    store.form.satuan = null
    store.form.nominal = 0
    store.form.subtotal = 0
    store.form.flaging = null
    store.rincian = []
  } else {
    store.form.notrans = props?.data?.notrans
    store.form.kodebeban = props?.data?.kodebeban
    store.form.tgl = props?.data?.tgl
    store.dateDisplay.tgl = dateFullFormat(props?.data?.tgl)
    store.form.keterangan = props?.data?.keterangan
    store.form.volume = 0
    store.form.satuan = props?.data?.satuan
    store.form.nominal = 0
    store.form.subtotal = 0
    store.form.flaging = props?.data?.flaging
    store.rincian = props?.data?.rincian
  }
})
console.log('getprops', props?.data)
function tambahRinci() {
  store.dialogrincis = true
}

function gantiKunci() {
  const valx = store.form.flaging === '1'
  console.log('row kunci', valx)
  return !valx
}
function kuncitrans() {
  if (store.form.flaging === '1') {
    notifError('Maaf Data ini Sudah Terkunci...!!')
  } else {
    $q.dialog({
      title: 'Peringatan',
      message: 'Apakah Anda yakin akan Mengunci Data?',
      cancel: true,
      persistent: true,
    })
      .onOk(() => {
        const payload = {
          notrans: store.form.notrans,
          flaging: store.form.flaging,
        }
        console.log('payload', payload)
        store.kunci(payload)
      })
      .onCancel(() => {
        console.log('Cancel')
      })
      .onDismiss(() => {})
  }
}
</script>
