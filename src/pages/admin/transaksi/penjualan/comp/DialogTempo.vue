<template>
<q-dialog maximized persistent>
  <q-card flat >
    <div class="fit column">
      <div class="col-auto">
          <div class="row items-center q-pa-lg">
            <div class="col-grow">
              <app-btn-back @click="store.openDialogTempo = false" />
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
                  <div :class="`col-${isMobile ? 12 : 6}`" class="row q-col-gutter-md items-center">
                    <div class="col-12 f-16 text-center">Form Tanggal Jatuh Tempo</div>
                    <div class="col-12 f-12 text-center">No penjualan {{ store?.item?.no_penjualan }} Tgl {{dateFullFormat( store.item?.tgl)}}</div>
                    <div class="col-12 f-10 text-center">Tanggal Jatuh tempo terisi sama dengan barang dikirm</div>
                    <app-input-date
                      :model="store.dispTempo"
                      class="col-12"
                      label="Tanggal Kirim"
                      outlined
                      dense
                      @set-display="store.dispTempo = $event"
                      @db-model="updateKirim"
                    />
                    <app-input v-model="store.formTempo.jml_tempo" label="Jumlah Tempo ( hari )" class="col-12" @update:model-value="updateJml" />
                    <div class="col-12 f-12">Tanggal Jatuh Tempo {{dateFullFormat( store.formTempo?.tempo)}}</div>

                    <div class="col-12">
                      <q-separator class="q-my-md" />
                      <app-btn
                        :loading="store.loadingTempo"
                        :disable="store.loadingTempo"
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
          </q-card>
        </div>
    </div>
  </q-card>
</q-dialog>
</template>
<script setup>
import { date, useQuasar } from 'quasar'
import { dateFullFormat } from 'src/modules/formatter'
import { useFromPenjualanStore } from 'src/stores/admin/transaksi/penjualan/form'
import { computed } from 'vue'

const store = useFromPenjualanStore()
const $q = useQuasar()
const isMobile = computed(() => {
  return $q.screen.lt.sm // Quasar screen size helper
})

function onSubmit(){
  console.log('submit tempo', store.formTempo);
  store.simpanTempo()
}
function updateKirim(val){
  console.log('set anu', val);
  store.formTempo.tgl_kirim = val
  updateTempo()
}
function updateJml(val){
  const _removedZeros = val?.replace(/^0+/, '')
  const jml=parseInt(_removedZeros)
  console.log('set anu', val);
  store.formTempo.jml_tempo = !isNaN(jml)?jml:0
  updateTempo()
}
function updateTempo(){
  const kirim=new Date(store.formTempo.tgl_kirim)
  const nextMth=date.addToDate(kirim,{day:store.formTempo.jml_tempo})
  store.formTempo.tempo = date.formatDate(nextMth, 'YYYY-MM-DD')
  console.log('update tempo', store.formTempo);

}
</script>
