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
                      :disable="store.loadingPembayaran || pembayaranOrderTerkunci"
                      :loading="store.loadingPembayaran"
                    />
                    <app-select
                      v-if="['5', '7'].includes(store.formPembayaran.flag)"
                      class="col-12"
                      v-model="store.formPembayaran.cara_bayar"
                      label="Pilih Cara Bayar"
                      :options="['cash', 'transfer']"
                      :disable="store.loadingPembayaran || pembayaranOrderTerkunci"
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
                    <div v-if="store.formPembayaran.pelanggan_id" class="col-12">
                      <q-card flat bordered class="q-pa-sm">
                        <div class="text-caption text-grey-6">Pelanggan dari order</div>
                        <div class="text-weight-bold">
                          {{ store?.item?.pelanggan?.nama || store.formPembayaran.dataPelanggan.nama || '-' }}
                        </div>
                        <div class="text-caption">
                          {{ store?.item?.pelanggan?.telepon || store.formPembayaran.dataPelanggan.tlp || '-' }}
                          · {{ store?.item?.pelanggan?.alamat || store.formPembayaran.dataPelanggan.alamat || '-' }}
                        </div>
                      </q-card>
                    </div>
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

                    <!-- Diskon Nota & PPN -->
                    <div class="col-12 q-mb-sm">
                      <div class="row q-col-gutter-sm items-center">
                        <div class="col-12 col-sm-7">
                          <app-input-rp
                            v-model="store.formPembayaran.diskon_kuitansi"
                            outlined
                            currency
                            label="Diskon Nota (Rp)"
                            :disable="store.loadingPembayaran"
                            @update:model-value="onPerubahanKalkulasi"
                          />
                        </div>
                        <div class="col-12 col-sm-5 flex items-center">
                          <q-toggle
                            v-model="store.formPembayaran.kena_ppn"
                            :label="`Kenakan PPN (${tarifPpnPersen}%)`"
                            color="primary"
                            :disable="store.loadingPembayaran || tarifPpnPersen <= 0"
                            @update:model-value="onPerubahanKalkulasi"
                          />
                        </div>
                      </div>

                      <!-- Ringkasan Ringkas Tema Gelap -->
                      <div class="q-mt-sm q-pa-sm bg-grey-10 text-grey-3 rounded-borders text-caption">
                        <div class="row justify-between q-py-xs">
                          <span>Subtotal Barang:</span>
                          <span class="text-weight-medium">{{ formatDouble(kalkulasi.subtotalBarang) }}</span>
                        </div>
                        <div v-if="kalkulasi.diskonNota > 0" class="row justify-between q-py-xs text-negative">
                          <span>Diskon Nota:</span>
                          <span>- {{ formatDouble(kalkulasi.diskonNota) }}</span>
                        </div>
                        <div v-if="kalkulasi.diskonNota > 0 || store.formPembayaran.kena_ppn" class="row justify-between q-py-xs">
                          <span>DPP:</span>
                          <span class="text-weight-medium">{{ formatDouble(kalkulasi.dpp) }}</span>
                        </div>
                        <div v-if="store.formPembayaran.kena_ppn" class="row justify-between q-py-xs">
                          <span>PPN ({{ tarifPpnPersen }}%):</span>
                          <span class="text-weight-medium">{{ formatDouble(kalkulasi.ppnNominal) }}</span>
                        </div>
                        <q-separator dark class="q-my-xs" />
                        <div class="row justify-between q-py-xs text-weight-bold text-subtitle2 text-white">
                          <span>Total Tagihan:</span>
                          <span class="text-amber-4">{{ formatDouble(kalkulasi.totalTagihan) }}</span>
                        </div>
                      </div>
                    </div>

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
                        :rules="[
                          (val) => {
                            const b = parseInt(olahUang(val)) || 0
                            const tot = parseInt(store.formPembayaran.total) || 0
                            return (b >= 0 && (tot <= 0 || b < tot)) || 'Nominal DP harus < total tagihan'
                          }
                        ]"
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
import { api } from 'src/boot/axios'
import { formatDouble, olahUang } from 'src/modules/formatter'
import { notifError } from 'src/modules/notifs'
import { useFromPenjualanStore } from 'src/stores/admin/transaksi/penjualan/form'
import { useListPenjualanStore } from 'src/stores/admin/transaksi/penjualan/list'
import { computed, defineAsyncComponent, ref, shallowRef, watch } from 'vue'

const DialogCetak = shallowRef(defineAsyncComponent(() => import('./cetak/DialogCetak.vue')))
const $q = useQuasar()
const isMobile = computed(() => {
  return $q.screen.lt.sm // Quasar screen size helper
})
const store = useFromPenjualanStore()
const storelist = useListPenjualanStore()

const optionCaraBayar = computed(() => [
  { label: 'Lunas', value: '5' },
  { label: 'Down Payment (DP)', value: '7' },
  { label: 'Tempo', value: '2' },
  // { label: 'Hutang', value: '2' },
])
const pembayaranOrderTerkunci = computed(() => Boolean(store?.item?.order_sumber?.sistem_bayar))
const refPelanggan = ref(null)
const refBayar = ref(null)

const tarifPpnPersen = ref(Number(store?.item?.ppn_persen || 0))

const subtotalBarang = computed(() => {
  if (Array.isArray(store?.item?.detail) && store.item.detail.length > 0) {
    return store.item.detail.reduce((acc, row) => acc + (Number(row.subtotal) || 0), 0)
  }
  return Number(store?.item?.subtotal || 0)
})

const kalkulasi = computed(() => {
  const subtotal = subtotalBarang.value
  const diskonNotaRaw = olahUang(store.formPembayaran.diskon_kuitansi)
  const diskonNota = Math.max(0, Number(diskonNotaRaw) || 0)
  const dpp = Math.max(0, Math.round((subtotal - diskonNota) * 100) / 100)

  let ppnNominal = 0
  if (store.formPembayaran.kena_ppn && tarifPpnPersen.value > 0) {
    ppnNominal = Math.round(dpp * tarifPpnPersen.value) / 100
  }

  const totalTagihan = Math.round((dpp + ppnNominal) * 100) / 100

  return {
    subtotalBarang: subtotal,
    diskonNota,
    dpp,
    ppnNominal,
    totalTagihan,
  }
})

function onPerubahanKalkulasi() {
  const totBaru = kalkulasi.value.totalTagihan
  const totalLama = Number(store.formPembayaran.total) || 0
  store.formPembayaran.total = totBaru

  if (store.formPembayaran.flag === '5') {
    const bayarSaatIni = Number(olahUang(store.formPembayaran.bayar)) || 0
    if (bayarSaatIni === 0 || bayarSaatIni === totalLama) {
      store.formPembayaran.bayar = totBaru
      store.formPembayaran.kembali = 0
    } else {
      store.formPembayaran.kembali = Math.max(0, bayarSaatIni - totBaru)
    }
  } else if (store.formPembayaran.flag === '2') {
    store.formPembayaran.bayar = 0
    store.formPembayaran.kembali = 0
  } else if (['7', '8'].includes(store.formPembayaran.flag)) {
    store.formPembayaran.kembali = 0
  }

  setTimeout(() => {
    refBayar.value?.appInput?.validate()
  }, 50)
}

watch(
  () => store.openPembayaran,
  async (buka) => {
    if (buka) {
      let tarif = Number(store?.item?.ppn_persen || 0)
      if (tarif <= 0) {
        try {
          const { data } = await api.get('/v1/settings/ppn')
          if (data?.result?.aktif) {
            tarif = Number(data?.result?.persen || 0)
          }
        } catch (e) {
          console.error('Gagal memuat pengaturan PPN', e)
        }
      }
      tarifPpnPersen.value = tarif
      onPerubahanKalkulasi()
    }
  },
  { immediate: true }
)

function validasi() {
  let valid = false

  if (!store.formPembayaran.flag) return notifError('Pilihan Pembayaran Belum dipilih')
  else if (!store?.item?.sales_id && store.formPembayaran.flag == '2') return notifError('Pembayaran Secara Kredit Harus Memilih Sales')
  else if ((!store?.formPembayaran?.pelanggan_id && !store.formPembayaran.dataPelanggan?.nama) && ['2', '7', '8'].includes(store.formPembayaran.flag)) return notifError('Harus ada data pelanggan')

  const diskonNota = kalkulasi.value.diskonNota
  const subtotal = kalkulasi.value.subtotalBarang
  if (diskonNota > subtotal) {
    return notifError('Diskon nota tidak boleh melebihi subtotal barang')
  }

  const bayar = Number(olahUang(store.formPembayaran.bayar)) || 0
  const total = Number(store.formPembayaran.total) || 0

  if (store.formPembayaran.flag === '5' && bayar < total) {
    return notifError('Nominal pembayaran kurang')
  }

  if (['7', '8'].includes(store.formPembayaran.flag) && (bayar < 0 || (total > 0 && bayar >= total))) {
    return notifError('Nominal DP harus kurang dari total tagihan')
  }

  valid = true
  return valid
}

function onSubmit() {
  console.log('submit form pembayaran', refPelanggan.value, store.formPembayaran)

  if (validasi()) {
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
  if (store.formPembayaran.pelanggan_id) store.formPembayaran.pelanggan_id = null
}

function setPelanggan() {
  if (store.formPembayaran.dataPelanggan.nama) {
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
  } else if (['7', '8'].includes(val)) {
    store.formPembayaran.kembali = 0
    store.formPembayaran.cara_bayar = 'cash'
  } else {
    store.formPembayaran.cara_bayar = 'cash'
    store.formPembayaran.bayar = store.formPembayaran.total
    store.formPembayaran.kembali = 0
  }
  setTimeout(() => {
    refBayar.value?.appInput?.validate()
  }, 50)
}

function updateBayar(val) {
  const normalAngka = olahUang(val)
  const total = Number(store.formPembayaran.total) || 0
  const bayar = Number(normalAngka) || 0
  if (store.formPembayaran.flag === '5') {
    store.formPembayaran.kembali = Math.max(0, bayar - total)
  } else {
    store.formPembayaran.kembali = 0
  }
  setTimeout(() => {
    refBayar.value?.appInput?.validate()
  }, 50)
}
</script>
