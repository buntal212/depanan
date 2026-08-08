<template>
  <q-dialog maximized persistent>
    <q-card flat>
      <div class="fit column">
        <div class="col-auto">
          <div class="row items-center q-pa-lg">
            <div class="col-grow">
              <app-btn-back @click="store.openPembayaran = false" />
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
                    <div v-if="store?.item != null" class="col-12 q-py-md">
                      <div class="row justify-between f-16">
                        <div class="col-auto text-weight-bold">
                          Total Nota Nomor : {{ store.formPembayaran.no_penjualan }}
                        </div>
                        <div class="col-auto text-weight-bold text-right f-20">
                          <div class="row justify-end">
                            {{
                              formatDouble(store?.item?.total + (store?.item?.total_diskon ?? 0))
                            }}
                          </div>
                          <div v-if="store?.item?.total_diskon > 0" class="row justify-end">
                            {{ formatDouble(store?.item?.total_diskon) }}
                          </div>
                          <div v-if="store?.item?.total_diskon > 0" class="row justify-end">
                            {{ formatDouble(store?.item?.total) }}
                          </div>
                        </div>
                      </div>
                    </div>

                    <app-select
                      class="col-12"
                      v-model="store.formPembayaran.flag"
                      label="Pilihan Pembayaran"
                      :options="optionCaraBayar"
                      option-label="label"
                      option-value="value"
                      @update:model-value="selectCaraBayar"
                      :disable="store.loadingPembayaran"
                      :loading="store.loadingPembayaran"
                    />
                    <app-select
                      v-if="['5', '7'].includes(store.formPembayaran.flag)"
                      class="col-12"
                      v-model="store.formPembayaran.cara_bayar"
                      label="Pilih Cara Bayar"
                      :options="['cash', 'transfer']"
                      :disable="store.loadingPembayaran"
                      :loading="store.loadingPembayaran"
                    />
                    <app-select-server
                      v-if="!store.formPembayaran.dataPelanggan.nama"
                      ref="refPelanggan"
                      class="col-12"
                      v-model="store.formPembayaran.pelanggan_id"
                      url="v1/transaksi/penjualan/list-pelanggan"
                      option-value="id"
                      :option-label="(opt) => opt.nama + ' ' + opt?.alamat"
                      label="Cari Pelanggan"
                      :filter-min="3"
                      clearable
                      :rules="[
                        (val) =>
                          (store.formPembayaran.cara_bayar == '2' ? !!val : true) || 'Harap di isi',
                      ]"
                      :disable="store.loadingPembayaran"
                      @update:model-value="setPelanggan"
                    />
                    <template v-if="!store.formPembayaran.pelanggan_id">
                      <div class="col-12 q-mb-md">
                        <div class="row text-weight-bold q-mb-sm justify-center">
                          Data Pelanggan
                        </div>
                        <div class="row">
                          <div class="col-12">
                            <app-input
                              v-model="store.formPembayaran.dataPelanggan.nama"
                              label="Nama Pelanggan"
                              :disable="store.loadingPembayaran"
                              @update:model-value="setNamaPelanggan"
                            />
                          </div>
                        </div>
                        <div class="row">
                          <div class="col-12">
                            <app-input
                              v-model="store.formPembayaran.dataPelanggan.tlp"
                              label="Tlp Pelanggan"
                              :disable="store.loadingPembayaran"
                            />
                          </div>
                        </div>
                        <div class="row">
                          <div class="col-12">
                            <app-input
                              v-model="store.formPembayaran.dataPelanggan.alamat"
                              label="Alamat Pelanggan"
                              :disable="store.loadingPembayaran"
                            />
                          </div>
                        </div>
                      </div>
                    </template>
                    <template v-if="store.formPembayaran.flag == '5'">
                      <app-input-rp
                        ref="refBayar"
                        class="col-6"
                        v-model="store.formPembayaran.bayar"
                        outlined
                        currency
                        label="Bayar"
                        :rules="[
                          (val) =>
                            parseInt(olahUang(val)) >= parseInt(store.formPembayaran.total) ||
                            'nominal pembayaran kurang',
                        ]"
                        @update:model-value="updateBayar"
                        :disable="store.loadingPembayaran"
                      />
                      <div
                        class="col-3"
                        :class="
                          parseInt(store.formPembayaran.total) >
                            parseInt(olahUang(store.formPembayaran.bayar)) ||
                          !parseInt(olahUang(store.formPembayaran?.bayar))
                            ? 'text-negative'
                            : ''
                        "
                      >
                        {{ formatDouble(store.formPembayaran.kembali) }}
                      </div>
                      <div
                        v-if="
                          parseInt(store.formPembayaran.total) >
                          parseInt(olahUang(store.formPembayaran.bayar))
                        "
                        class="col-3 text-negative text-center"
                      >
                        Kurang bayar
                      </div>
                    </template>
                    <template v-if="['7','8'].includes(store.formPembayaran.flag) ">
                      <app-input-rp
                        ref="refBayar"
                        class="col-6"
                        v-model="store.formPembayaran.bayar"
                        outlined
                        currency
                        label="Bayar"
                        valid
                        @update:model-value="updateBayar"
                        :disable="store.loadingPembayaran"
                      />
                      <div class="col-3">
                        {{ formatDouble(store.formPembayaran.kembali) }}
                      </div>
                      <div
                        v-if="
                          parseInt(store.formPembayaran.total) >
                          parseInt(olahUang(store.formPembayaran.bayar))
                        "
                        class="col-3 text-center f-16"
                      >
                        Kurang bayar
                      </div>
                    </template>

                    <div class="col-12">
                      <q-separator class="q-my-md" />
                      <app-btn
                        :loading="store.loadingPembayaran"
                        :disable="store.loadingPembayaran"
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
      <DialogCetak v-model="store.opendialogCetak" />
    </q-card>
  </q-dialog>
</template>
<script setup>
import { useQuasar } from 'quasar'
import { formatDouble, olahUang } from 'src/modules/formatter'
import { useFromPenjualanStore } from 'src/stores/admin/transaksi/penjualan/form'
import { useListPenjualanStore } from 'src/stores/admin/transaksi/penjualan/list'
import { computed, defineAsyncComponent, ref, shallowRef } from 'vue'
import { notifError } from 'src/modules/notifs'

const DialogCetak = shallowRef(defineAsyncComponent(() => import('./cetak/DialogCetak.vue')))
const $q = useQuasar()
const isMobile = computed(() => {
  return $q.screen.lt.sm // Quasar screen size helper
})
const store = useFromPenjualanStore()


const storelist = useListPenjualanStore()

const optionCaraBayar = ref([
  { label: 'Lunas', value: '5' },
  { label: 'Down Payment (DP)', value: '7' },
  { label: 'Tempo', value: '2' },
  // { label: 'Hutang', value: '2' },
])
const refPelanggan = ref(null)
function validasi(){
  let valid=false

  if(!store.formPembayaran.flag) return notifError('Pilihan Pembayaran Belum dipilih')
  else if (!store?.item?.sales_id && store.formPembayaran.flag == '2') return notifError('Pembayaran Secara Kredit Harus Memilih Sales')
  else if ((!store?.formPembayaran?.pelanggan_id && !store.formPembayaran.dataPelanggan?.nama) && ['2','7','8'].includes(store.formPembayaran.flag)) return notifError('Harus ada data pelanggan')

  else valid = true

    return valid
}
function onSubmit() {
  console.log('submit form pembayaran', refPelanggan.value, store.formPembayaran)

  if(validasi()){
    store
      .simpanPembayaran()
      .then((res) => {
        if (res?.status == 200) {
          store.opendialogCetak = true
          store.openPembayaran = false
          console.log('cetak', storelist.itemCetak)
        }
      })
      .then(() => {
        store.resetPembayaran()
      })
    }
}
function setNamaPelanggan() {
  // console.log('set nama', val)
  if(store.formPembayaran.pelanggan_id) store.formPembayaran.pelanggan_id=null

}
function setPelanggan() {
  // console.log('set nama', val)
  if(store.formPembayaran.dataPelanggan.nama) {
    store.formPembayaran.dataPelanggan = {
                                          nama: '',
                                          tlp: '',
                                          alamat: '',
                                        }
  }
}
function selectCaraBayar(val) {
  console.log('cara bayar', val)
  if (val == '2') {
    store.formPembayaran.bayar = 0
    store.formPembayaran.kembali = 0
    store.formPembayaran.cara_bayar = ''
  } else {
    store.formPembayaran.cara_bayar = 'cash'
  }
}
const refBayar = ref(null)
function updateBayar(val) {
  // console.log('upda ba', val,refBayar.value?.appInput.validate());
  const _removedZeros = val?.replace(/^0+/, '')
  const normalAngka = olahUang(_removedZeros)
  //untuk hapus o dipean angka pake ini yaa
  if (normalAngka > 1) {
    // store.formPembayaran.bayar = normalAngka
    store.formPembayaran.kembali = parseInt(normalAngka) - store.formPembayaran.total
  }
  setTimeout(() => {
    refBayar.value?.appInput?.validate()
  }, 50)
}
</script>
