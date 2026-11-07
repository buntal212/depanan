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
                      <div class="row justify-between items-start f-16">
                        <div class="col-auto text-weight-bold">
                          Total Nota Nomor : {{ store.formPembayaran.no_penjualan }}
                        </div>
                        <div class="col-auto">
                          <div
                            v-if="totalDiskonItem > 0"
                            class="row justify-between items-center q-gutter-x-md text-caption text-grey-4"
                          >
                            <span>Total Kotor Barang :</span>
                            <span class="text-right">Rp {{ formatDouble(totalKotorBarang) }}</span>
                          </div>
                          <div
                            v-if="totalDiskonItem > 0"
                            class="row justify-between items-center q-gutter-x-md text-caption text-amber-3"
                          >
                            <span>Diskon Item :</span>
                            <span class="text-right">- Rp {{ formatDouble(totalDiskonItem) }}</span>
                          </div>
                          <div
                            class="row justify-between items-center q-gutter-x-md text-subtitle1 text-weight-bold text-white"
                          >
                            <span>Subtotal Barang :</span>
                            <span class="text-right">Rp {{ formatDouble(subtotalBarang) }}</span>
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

                    <!-- Diskon Nota (Rp) -->
                    <div class="col-12 q-mb-sm">
                      <div class="row q-col-gutter-sm items-center">
                        <div class="col-12">
                          <app-input-rp
                            v-model="store.formPembayaran.diskon_kuitansi"
                            outlined
                            currency
                            label="Diskon Nota (Rp)"
                            valid
                            :disable="store.loadingPembayaran"
                            @update:model-value="onUpdateDiskonNota"
                          />
                        </div>
                      </div>

                      <!-- Ringkasan Ringkas Tema Gelap -->
                      <div class="q-mt-sm q-pa-sm bg-grey-10 text-grey-3 rounded-borders text-caption">
                        <div class="row justify-between q-py-xs">
                          <span>Subtotal Barang:</span>
                          <span class="text-weight-medium">{{ formatDouble(subtotalBarang) }}</span>
                        </div>
                        <div v-if="diskonNota > 0" class="row justify-between q-py-xs text-amber-3">
                          <span>Diskon Nota:</span>
                          <span>- {{ formatDouble(diskonNota) }}</span>
                        </div>
                        <q-separator dark class="q-my-xs" />
                        <div class="row justify-between q-py-xs text-weight-bold text-subtitle2 text-white">
                          <span>Total Sementara:</span>
                          <span class="text-amber-4">{{ formatDouble(totalSementara) }}</span>
                        </div>
                      </div>
                    </div>

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

      <!-- Dialog Konfirmasi PPN -->
      <q-dialog v-model="openDialogKonfirmasiPpn" persistent>
        <q-card style="min-width: 480px; max-width: 95vw;" class="q-pa-md bg-grey-10 text-white">
          <q-card-section class="row items-center q-pb-none">
            <div class="text-h6 text-weight-bold">Konfirmasi PPN & Pembayaran</div>
            <q-space />
            <q-btn icon="close" flat round dense v-close-popup :disable="store.loadingPembayaran" />
          </q-card-section>

          <q-separator dark class="q-my-sm" />

          <q-card-section class="q-pa-sm">
            <!-- Checkbox / Toggle PPN -->
            <div class="q-pa-sm bg-grey-9 text-grey-2 rounded-borders q-mb-md">
              <q-checkbox
                v-model="store.formPembayaran.kena_ppn"
                dark
                :disable="!ppnConfigAktif || tarifPpnPersen <= 0"
                :label="`Kenakan PPN (${tarifPpnPersen}%)`"
                color="primary"
                class="text-grey-2 text-weight-medium"
              />
              <div v-if="!ppnConfigAktif || tarifPpnPersen <= 0" class="text-caption text-negative q-ml-md">
                * Konfigurasi PPN backend saat ini nonaktif.
              </div>
            </div>

            <!-- Rincian Informasi Reaktif -->
            <div class="q-pa-sm bg-grey-9 text-grey-2 rounded-borders text-body2">
              <div class="row justify-between q-py-xs">
                <span>Subtotal Barang:</span>
                <span class="text-weight-bold">{{ formatDouble(subtotalBarang) }}</span>
              </div>
              <div class="row justify-between q-py-xs text-amber-3">
                <span>Diskon Nota (read-only):</span>
                <span>{{ diskonNota > 0 ? '- ' + formatDouble(diskonNota) : 'Rp 0' }}</span>
              </div>
              <div class="row justify-between q-py-xs">
                <span>DPP (Dasar Pengenaan Pajak):</span>
                <span class="text-weight-bold">{{ formatDouble(dpp) }}</span>
              </div>
              <div class="row justify-between q-py-xs" :class="store.formPembayaran.kena_ppn ? 'text-primary' : 'text-grey-5'">
                <span>PPN ({{ store.formPembayaran.kena_ppn ? tarifPpnPersen : 0 }}%):</span>
                <span class="text-weight-bold">{{ formatDouble(ppnNominal) }}</span>
              </div>
              <q-separator dark class="q-my-xs" />
              <div class="row justify-between q-py-xs text-h6 text-weight-bolder text-white">
                <span>Total Tagihan:</span>
                <span class="text-amber-4">{{ formatDouble(totalTagihanFinal) }}</span>
              </div>
            </div>

            <div class="q-mt-sm q-pa-sm bg-grey-9 text-grey-2 rounded-borders text-body2">
              <div class="row justify-between q-py-xs">
                <span>Jenis Pembayaran:</span>
                <span class="text-weight-bold text-white">{{ labelJenisPembayaran }}</span>
              </div>
              <div v-if="['5', '7'].includes(store.formPembayaran.flag)" class="row justify-between q-py-xs">
                <span>Cara Bayar:</span>
                <span class="text-weight-bold text-uppercase text-white">{{ store.formPembayaran.cara_bayar || 'cash' }}</span>
              </div>

              <!-- Kasus Lunas (flag == '5') -->
              <template v-if="store.formPembayaran.flag === '5'">
                <div class="q-my-sm">
                  <div class="row items-center q-col-gutter-sm">
                    <div class="col-8">
                      <app-input-rp
                        ref="refBayar"
                        v-model="store.formPembayaran.bayar"
                        dark
                        outlined
                        currency
                        label="Nominal Bayar"
                        :rules="[
                          (val) => {
                            const b = Number(olahUang(val)) || 0
                            return b >= totalTagihanFinal || `Kurang bayar (Min: Rp ${formatDouble(totalTagihanFinal)})`
                          }
                        ]"
                        @update:model-value="updateBayar"
                        @keyup.enter="simpanTransaksiFinal"
                        :disable="store.loadingPembayaran"
                      />
                    </div>
                    <div class="col-4">
                      <q-btn
                        color="amber-9"
                        text-color="dark"
                        class="full-width text-weight-bold"
                        label="Bayar Pas"
                        :disable="store.loadingPembayaran"
                        @click="setBayarPas"
                      />
                    </div>
                  </div>
                </div>

                <div class="row justify-between items-center q-py-xs">
                  <span>Kembalian:</span>
                  <span
                    class="text-weight-bold text-h6"
                    :class="kembalianFinal >= 0 ? 'text-positive' : 'text-negative'"
                  >
                    Rp {{ formatDouble(Math.max(0, kembalianFinal)) }}
                  </span>
                </div>

                <div v-if="nominalBayarFinal < totalTagihanFinal" class="text-caption text-negative text-center q-mt-xs text-weight-bold">
                  ⚠️ Pembayaran kurang Rp {{ formatDouble(totalTagihanFinal - nominalBayarFinal) }}!
                </div>
              </template>

              <!-- Kasus Down Payment / DP (flag == '7' atau '8') -->
              <template v-else-if="['7', '8'].includes(store.formPembayaran.flag)">
                <div class="q-my-sm">
                  <app-input-rp
                    ref="refBayar"
                    v-model="store.formPembayaran.bayar"
                    dark
                    outlined
                    currency
                    valid
                    label="Nominal Down Payment (DP)"
                    :rules="[
                      (val) => {
                        const b = Number(olahUang(val)) || 0
                        if (b < 0) return 'Nominal DP tidak boleh negatif'
                        if (totalTagihanFinal > 0 && b >= totalTagihanFinal) return 'Nominal DP harus kurang dari total tagihan'
                        return true
                      }
                    ]"
                    @update:model-value="updateBayar"
                    @keyup.enter="simpanTransaksiFinal"
                    :disable="store.loadingPembayaran"
                  />
                </div>

                <div class="row justify-between items-center q-py-xs">
                  <span>Sisa Piutang:</span>
                  <span class="text-weight-bold text-h6 text-amber-3">
                    Rp {{ formatDouble(sisaPiutangFinal) }}
                  </span>
                </div>

                <div v-if="totalTagihanFinal > 0 && nominalBayarFinal >= totalTagihanFinal" class="text-caption text-negative text-center q-mt-xs text-weight-bold">
                  ⚠️ Nominal DP harus kurang dari total tagihan!
                </div>
                <div v-else-if="nominalBayarFinal < 0" class="text-caption text-negative text-center q-mt-xs text-weight-bold">
                  ⚠️ Nominal DP tidak boleh negatif!
                </div>
              </template>

              <!-- Kasus Tempo (flag == '2') -->
              <template v-else-if="store.formPembayaran.flag === '2'">
                <div class="row justify-between items-center q-py-xs">
                  <span>Nominal Bayar:</span>
                  <span class="text-weight-bold text-white">Rp 0 (Tempo)</span>
                </div>
                <div class="row justify-between items-center q-py-xs">
                  <span>Sisa Piutang:</span>
                  <span class="text-weight-bold text-h6 text-amber-3">
                    Rp {{ formatDouble(sisaPiutangFinal) }}
                  </span>
                </div>
              </template>
            </div>
          </q-card-section>

          <q-card-actions align="right" class="q-pt-md">
            <q-btn flat label="Kembali / Ubah" color="grey-5" v-close-popup :disable="store.loadingPembayaran" />
            <q-btn
              label="Simpan Transaksi"
              color="primary"
              :loading="store.loadingPembayaran"
              :disable="tombolSimpanFinalDisabled"
              @click="simpanTransaksiFinal"
            />
          </q-card-actions>
        </q-card>
      </q-dialog>

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
import { computed, defineAsyncComponent, ref, shallowRef, watch } from 'vue'

const DialogCetak = shallowRef(defineAsyncComponent(() => import('./cetak/DialogCetak.vue')))
const $q = useQuasar()
const isMobile = computed(() => {
  return $q.screen.lt.sm // Quasar screen size helper
})
const store = useFromPenjualanStore()

const optionCaraBayar = computed(() => [
  { label: 'Lunas', value: '5' },
  { label: 'Down Payment (DP)', value: '7' },
  { label: 'Tempo', value: '2' },
])
const pembayaranOrderTerkunci = computed(() => Boolean(store?.item?.order_sumber?.sistem_bayar))
const refPelanggan = ref(null)
const refBayar = ref(null)

const openDialogKonfirmasiPpn = ref(false)
const ppnConfigAktif = ref(false)
const tarifPpnPersen = ref(Number(store?.item?.ppn_persen || 0))

// 1. Subtotal barang dari detail penjualan
const subtotalBarang = computed(() => {
  if (Array.isArray(store?.item?.detail) && store.item.detail.length > 0) {
    return store.item.detail.reduce((acc, row) => acc + (Number(row.subtotal) || 0), 0)
  }
  return Number(store?.item?.subtotal || 0)
})

// Total diskon item dari rincian barang
const totalDiskonItem = computed(() => {
  if (Array.isArray(store?.item?.detail) && store.item.detail.length > 0) {
    return store.item.detail.reduce((acc, row) => acc + (Number(row.diskon) || 0), 0)
  }
  return Number(store?.item?.total_diskon || 0)
})

// Total kotor barang sebelum diskon item (murni tanpa PPN)
const totalKotorBarang = computed(() => {
  return Math.round((subtotalBarang.value + totalDiskonItem.value) * 100) / 100
})

// 2. Diskon Nota (Rp)
const diskonNota = computed(() => {
  const raw = olahUang(store.formPembayaran.diskon_kuitansi)
  return Math.max(0, Number(raw) || 0)
})

// 3. Total Sementara untuk Dialog Pertama (HANYA Subtotal Barang - Diskon Nota, TANPA PPN)
const totalSementara = computed(() => {
  return Math.max(0, Math.round((subtotalBarang.value - diskonNota.value) * 100) / 100)
})

// 4. Perhitungan Khusus Dialog Konfirmasi Kedua (PPN & Final)
const dpp = computed(() => {
  return totalSementara.value
})

const ppnNominal = computed(() => {
  if (store.formPembayaran.kena_ppn && tarifPpnPersen.value > 0 && ppnConfigAktif.value) {
    return Math.round(dpp.value * tarifPpnPersen.value) / 100
  }
  return 0
})

const totalTagihanFinal = computed(() => {
  return Math.round((dpp.value + ppnNominal.value) * 100) / 100
})

const labelJenisPembayaran = computed(() => {
  const f = store.formPembayaran.flag
  if (f === '5') return 'Lunas'
  if (f === '7' || f === '8') return 'Down Payment (DP)'
  if (f === '2') return 'Tempo'
  return '-'
})

const nominalBayarFinal = computed(() => {
  return Number(olahUang(store.formPembayaran.bayar)) || 0
})

const kembalianFinal = computed(() => {
  return nominalBayarFinal.value - totalTagihanFinal.value
})

const sisaPiutangFinal = computed(() => {
  if (store.formPembayaran.flag === '2') {
    return totalTagihanFinal.value
  }
  return Math.max(0, totalTagihanFinal.value - nominalBayarFinal.value)
})

const tombolSimpanFinalDisabled = computed(() => {
  if (store.loadingPembayaran) return true
  const bayar = nominalBayarFinal.value
  const total = totalTagihanFinal.value

  if (store.formPembayaran.flag === '5') {
    return bayar < total
  }
  if (['7', '8'].includes(store.formPembayaran.flag)) {
    return bayar < 0 || (total > 0 && bayar >= total)
  }
  return false
})

function setBayarPas() {
  store.formPembayaran.bayar = totalTagihanFinal.value
  store.formPembayaran.kembali = 0
  setTimeout(() => {
    refBayar.value?.refInput?.validate?.()
  }, 50)
}

function onUpdateDiskonNota() {
  const totSementara = totalSementara.value
  store.formPembayaran.total = totSementara
}

async function muatPengaturanPpn() {
  try {
    const { data } = await api.get('/v1/settings/ppn')
    const config = data?.result
    ppnConfigAktif.value = Boolean(config?.aktif && Number(config?.persen) > 0)
    tarifPpnPersen.value = Number(config?.persen || 0)

    if (ppnConfigAktif.value) {
      if (store.formPembayaran.kena_ppn === undefined || store.formPembayaran.kena_ppn === null) {
        store.formPembayaran.kena_ppn = true
      }
    } else {
      store.formPembayaran.kena_ppn = false
    }
  } catch (e) {
    console.error('Gagal memuat pengaturan PPN', e)
    if (Number(store?.item?.ppn_persen || 0) > 0) {
      ppnConfigAktif.value = true
      tarifPpnPersen.value = Number(store.item.ppn_persen)
      store.formPembayaran.kena_ppn = true
    } else {
      ppnConfigAktif.value = false
      tarifPpnPersen.value = 0
      store.formPembayaran.kena_ppn = false
    }
  }
}

watch(
  () => store.openPembayaran,
  async (buka) => {
    if (buka) {
      openDialogKonfirmasiPpn.value = false
      await muatPengaturanPpn()

      const totSementara = totalSementara.value
      store.formPembayaran.total = totSementara

      if (store.formPembayaran.flag === '2') {
        store.formPembayaran.bayar = 0
        store.formPembayaran.kembali = 0
      } else if (['7', '8'].includes(store.formPembayaran.flag)) {
        if (store.formPembayaran.bayar === undefined || store.formPembayaran.bayar === null) {
          store.formPembayaran.bayar = 0
        }
        store.formPembayaran.kembali = 0
      }
    }
  },
  { immediate: true }
)

watch(
  () => openDialogKonfirmasiPpn.value,
  (buka) => {
    if (buka) {
      setTimeout(() => {
        refBayar.value?.refInput?.focus?.()
      }, 100)
    }
  }
)

function validasiAwal() {
  if (!store.formPembayaran.flag) {
    notifError('Pilihan Pembayaran Belum dipilih')
    return false
  }
  if (!store?.item?.sales_id && store.formPembayaran.flag == '2') {
    notifError('Pembayaran Secara Kredit Harus Memilih Sales')
    return false
  }
  if (
    !store?.formPembayaran?.pelanggan_id &&
    !store.formPembayaran.dataPelanggan?.nama &&
    ['2', '7', '8'].includes(store.formPembayaran.flag)
  ) {
    notifError('Harus ada data pelanggan')
    return false
  }

  const dNota = diskonNota.value
  const subtotal = subtotalBarang.value
  if (dNota > subtotal) {
    notifError('Diskon nota tidak boleh melebihi subtotal barang')
    return false
  }

  return true
}

function onSubmit() {
  console.log('submit form pembayaran', refPelanggan.value, store.formPembayaran)

  if (validasiAwal()) {
    if (store.formPembayaran.flag === '5') {
      const bayarSaatIni = Number(olahUang(store.formPembayaran.bayar)) || 0
      if (bayarSaatIni === 0) {
        store.formPembayaran.bayar = totalTagihanFinal.value
        store.formPembayaran.kembali = 0
      }
    } else if (store.formPembayaran.flag === '2') {
      store.formPembayaran.bayar = 0
      store.formPembayaran.kembali = 0
    } else if (['7', '8'].includes(store.formPembayaran.flag)) {
      if (store.formPembayaran.bayar === undefined || store.formPembayaran.bayar === null) {
        store.formPembayaran.bayar = 0
      }
      store.formPembayaran.kembali = 0
    }
    openDialogKonfirmasiPpn.value = true
  }
}

function simpanTransaksiFinal() {
  if (store.loadingPembayaran) return

  const finalTotal = totalTagihanFinal.value
  store.formPembayaran.total = finalTotal

  const bayar = Number(olahUang(store.formPembayaran.bayar)) || 0

  if (store.formPembayaran.flag === '5') {
    if (bayar < finalTotal) {
      notifError(`Nominal pembayaran kurang! Total tagihan final adalah ${formatDouble(finalTotal)}`)
      return
    }
    store.formPembayaran.kembali = Math.max(0, bayar - finalTotal)
  } else if (['7', '8'].includes(store.formPembayaran.flag)) {
    if (bayar < 0) {
      notifError('Nominal DP tidak boleh negatif')
      return
    }
    if (finalTotal > 0 && bayar >= finalTotal) {
      notifError(`Nominal DP (${formatDouble(bayar)}) harus kurang dari total tagihan final (${formatDouble(finalTotal)})`)
      return
    }
    store.formPembayaran.kembali = 0
  } else if (store.formPembayaran.flag === '2') {
    store.formPembayaran.bayar = 0
    store.formPembayaran.kembali = 0
  }

  store
    .simpanPembayaran()
    .then((res) => {
      if (res?.status == 200) {
        openDialogKonfirmasiPpn.value = false
        store.openPembayaran = false
        store.opendialogCetak = true
      }
    })
    .catch((err) => {
      console.error('Gagal simpan pembayaran', err)
    })
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
    store.formPembayaran.bayar = 0
  } else {
    store.formPembayaran.cara_bayar = 'cash'
    store.formPembayaran.bayar = 0
    store.formPembayaran.kembali = 0
  }
}

function updateBayar(val) {
  const normalAngka = olahUang(val)
  const total = totalTagihanFinal.value
  const bayar = Number(normalAngka) || 0
  if (store.formPembayaran.flag === '5') {
    store.formPembayaran.kembali = Math.max(0, bayar - total)
  } else {
    store.formPembayaran.kembali = 0
  }
}
</script>
