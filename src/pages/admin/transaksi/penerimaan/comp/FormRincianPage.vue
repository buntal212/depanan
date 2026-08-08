<template>
  <div class="fit column absolute">
    <div class="col full-height">
      <q-card flat bordered square class="full-height" style="overflow: hidden">
        <q-card-section class="q-px-md q-py-xs bg-yellow-8 text-black col-auto full-width">
          <div class="row items-center justify-between">
            <div class="f-12 text-weight-bold">
              <app-btn-back size="sm" @click="emits('back')" class="bg-black text-yellow-8" />
              Form Peneriaman
            </div>
          </div>
        </q-card-section>
        <q-card-section>
          <div class="row q-gutter-sm">
            <div class="col-3">
              <app-input
                label="No. order"
                disable
                v-model="store.form.noorder"
                style="width: 100%"
              />
            </div>
            <div class="col-3">
              <app-input
                label="No. Faktur"
                v-model="store.form.nofaktur"
                style="width: 100%"
                :valid="{ required: false }"
                :disable="store.form.nopenerimaan !== ''"
              />
            </div>

            <div class="col-3">
              <app-input-date
                :model="store.dateDisplay.tgl"
                label="Tgl Faktur"
                style="min-width: 150px"
                outlined
                :debounce="300"
                :disable="store.form.nopenerimaan !== ''"
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
            </div>
            <div
              class="col-1"
              v-if="
                store.form.nopenerimaan === undefined ||
                store.form.nopenerimaan === '' ||
                store.form.nopenerimaan === null
              "
            >
              <app-btn
                size="md"
                :dense="false"
                color="grey-10"
                class="text-yellow-8"
                icon="find_in_page"
                @click="cariorderan()"
              />
            </div>
            <div class="col-1" v-else-if="props?.data?.kunci === null">
              <q-btn
                round
                color="grey-10"
                class="text-yellow-9"
                icon="lock_open"
                @click="store.kirimstok(lists, store.form.nopenerimaan)"
                :loading="store.loadingstok"
              />
            </div>
            <div class="row" v-else-if="props?.data?.kunci === '1'">
              <div>
                <q-btn
                  size="sm"
                  padding="sm"
                  round
                  dense
                  color="yellow-9"
                  class="text-black"
                  icon="lock"
                />
              </div>
              <div class="q-pl-xs">
                <app-btn-cetak @click="cetakData()" />
              </div>
            </div>
            <div class="col-3">
              <!-- <app-input label="Supllier" disable v-model="store.form.suplier" /> -->
              <q-select
                outlined
                dense
                label="Supplier"
                v-model="store.form.kdsuplier"
                :options="storesupllier.itemsall"
                option-label="nama"
                option-value="kodesupl"
                emit-value
                map-options
                disable
              />
            </div>
            <div class="col-3">
              <q-select
                outlined
                dense
                label="Pembayaran"
                v-model="store.form.pembayaran"
                :options="['', 'Cash', 'Cash Tempo', 'Hutang']"
                :disable="store.form.nopenerimaan !== ''"
                @update:model-value="updatePembayaran()"
              />
            </div>
            <div class="col-2" v-if="store.form.pembayaran !== 'Cash'">
              <app-input
                label="Jumlah Hari Tempo"
                v-model="store.form.jumlahharitempo"
                type="number"
                input-class="text-right"
                :clearable="false"
                @update:model-value="updateJumlahHariTempo()"
              />
            </div>
            <div class="col-2" v-if="store.form.pembayaran !== 'Cash'">
              <app-input-date
                :model="store.dateDisplay.tgljthtempo"
                label="Tgl Jatuh Tempo"
                style="min-width: 150px"
                outlined
                disable
                :debounce="300"
                @set-model="
                  (val) => {
                    store.dateDisplay.tgljthtempo = val
                  }
                "
                @db-model="
                  (val) => {
                    store.form.tgljthtempo = val
                  }
                "
              />
            </div>
          </div>
          <q-separator class="q-mt-sm" />
        </q-card-section>
        <q-card-section style="max-height: 80%" class="scroll">
          <q-list v-for="(item, n) in store.rinci" :key="n" class="full-width">
            <transition-group>
              <q-item class="list-move" :key="n">
                <q-form
                  ref="refForm"
                  class="column full-height full-width"
                  @submit="onSubmit(item)"
                >
                  <q-item-section>
                    <div class="row q-gutter-xs">
                      <div class="col-12">
                        <span class="text-grey-8">{{ n + 1 }}. </span>
                        <span class="text-weight-medium">{{ item?.mbarang?.namabarang }}</span>
                        <span class="text-grey-8"> ({{ item?.kdbarang }})</span
                        ><span class="text-lime"> || Isi {{ item?.isi }} {{ item?.satuan_k }}</span>
                      </div>
                    </div>
                    <div class="row q-gutter-xs">
                      <div class="col-3">
                        <span class="q-mr-md"> </span>
                        <span class="text-weight-medium">
                          {{ item?.jumlahpo }} {{ item?.satuan_b }}</span
                        >
                        <span class="text-grey-8" v-if="item?.isi !== '1'">
                          ({{ item?.jumlahpo_k }} {{ item?.satuan_k }})</span
                        >
                      </div>
                      <div class="col-1">
                        <span> X </span>
                      </div>
                      <div class="col-3">
                        <span class="text-weight-medium"> {{ formatRpDouble(item?.hargapo) }}</span>
                      </div>
                      <div class="col-1">
                        <span> = </span>
                      </div>
                      <div class="col-3">
                        <span> {{ formatRpDouble(item.subtotal) }} </span>
                      </div>
                    </div>

                    <div class="row q-gutter-xs" v-if="props?.data?.kunci !== '1'">
                      <div class="col-2">
                        <app-input
                          label="No. Seri"
                          v-model="item.motif"
                          style="width: 100%"
                          :valid="{ required: false }"
                          :autofocus="n === 0"
                        />
                      </div>
                      <div class="col-2">
                        <AppInputRp
                          label="Barang Datang"
                          dense
                          outlined
                          v-model="item.sisajumlahbelumditerimax"
                          currency
                          @update:model-value="kurangisisabarangdatang(item)"
                        />
                      </div>
                      <div class="col-2">
                        <AppInputRp
                          label="Barang Rusak"
                          dense
                          outlined
                          v-model="item.itemrusak"
                          currency
                          :valid="null"
                          @update:model-value="kurangisisabarangdatang(item)"
                        />
                      </div>
                      <div class="col-2">
                        <AppInputRp
                          label="Barang Diterima"
                          dense
                          outlined
                          v-model="item.sisajumlahbelumditerima"
                          currency
                        />
                      </div>
                      <div class="col-2">
                        <app-input-rp
                          label="harga fix"
                          dense
                          outlined
                          v-model="item.hargafix"
                          currency
                        />
                      </div>

                      <div class="col-1 q-ml-auto side top" v-if="props?.data?.kunci !== '1'">
                        <div v-if="item.flaging !== '1'">
                          <app-btn
                            :loading="store.loading && store.form.id === item.id"
                            type="submit"
                            color="red"
                            icon="save"
                          />
                        </div>
                        <div v-else>
                          <q-icon name="done_all" color="yellow" size="md" />
                          <!-- <app-btn
                            :loading="store.loading && store.form.id === item.id"
                            color="lime"
                            class="text-black"
                            icon="done_all"
                          /> -->
                        </div>
                      </div>
                    </div>
                  </q-item-section>
                  <!-- <q-item-section top side>
                    <div class="text-grey-8">
                      <div>
                        <div class="colspan-2">{{ n + 1 }}.</div>
                      </div>
                    </div>
                  </q-item-section> -->
                  <!-- <q-item-section top side v-if="props?.data?.kunci != '1'">
                    <app-btn
                      :loading="store.loading && store.form.id === item.id"
                      type="submit"
                      color="teal"
                      icon="save"
                    />
                  </q-item-section> -->
                </q-form>
              </q-item>
            </transition-group>
            <q-separator class="q-mt-sm" />
          </q-list>
          <div class="q-mt-xl"></div>
        </q-card-section>
      </q-card>
    </div>
  </div>

  <dialogcariorderan-page />
  <dialog-cetakdata v-model="store.dialogCetak" :printdata="printdata" />
</template>

<script setup>
import { useAdminListTransaksiOrderBarangStore } from 'src/stores/admin/transaksi/orderbarang/list'
import dialogcariorderanPage from './dialogcariorderanPage.vue'

import { formatRpDouble, olahUang } from 'src/modules/formatter'
import { useAdminFormTransaksiPenerimaanBarangStore } from 'src/stores/admin/transaksi/penerimaan/form'

import AppInputRp from 'src/components/~global/AppInputRp.vue'

import { notifError } from 'src/modules/notifs'
import { computed, defineAsyncComponent, onMounted, ref } from 'vue'
import { useAdminMasterSupplierStore } from 'src/stores/admin/master/supplier/list'

const DialogCetakdata = defineAsyncComponent(() => import('./cetak/DialogCetak.vue'))

const store = useAdminFormTransaksiPenerimaanBarangStore()
const storeorder = useAdminListTransaksiOrderBarangStore()
const storesupllier = useAdminMasterSupplierStore()
const emits = defineEmits(['back'])
const printdata = ref(null)

function cariorderan() {
  storeorder.fixed = true
  storeorder.getorderanfix()
}

function onSubmit(val) {
  // console.log('val', val)
  if (store.form.nofaktur === '') {
    notifError('No Faktur Tidak Boleh Kosong...!!!')
  } else if (store.form.pembayaran === '') {
    notifError('Pembayaran Tidak Boleh Kosong...!!!')
  } else {
    store.form.id = val?.id
    store.form.idx = val?.idx
    store.form.motif = val?.motif
    store.form.kdbarang = val?.kdbarang
    store.form.jumlahorder = olahUang(val?.jumlahpo)
    store.form.jumlahpo = olahUang(val?.sisajumlahbelumditerima)
    store.form.jumlah_datang_b = olahUang(val?.sisajumlahbelumditerimax)
    store.form.jumlahpo_k = val?.jumlahpo_k
    store.form.satuan_b = val?.satuan_b
    store.form.satuan_k = val?.satuan_k
    store.form.isi = val?.isi
    store.form.hargafaktur = val?.hargapo
    store.form.hargaasli = olahUang(val?.hargafix)
    store.form.jumlahbarangrusak = olahUang(val?.itemrusak)
    store.form.totalditerimabias = olahUang(val?.totalditerimabias)
    store.form.totalpenerimaanall =
      parseFloat(olahUang(store.form.jumlah_datang_b)) +
      parseFloat(olahUang(store.form.totalditerimabias))

    // console.log('store.form.totalpenerimaanall', store.form.totalpenerimaanall)

    if (
      parseFloat(olahUang(store.form.jumlahorder)) ===
      parseFloat(olahUang(store.form.totalpenerimaanall))
    ) {
      store.form.flagingx = '1'
    } else {
      store.form.flagingx = null
    }

    if (parseFloat(olahUang(store.form.jumlahorder)) < parseFloat(store.form.totalpenerimaanall)) {
      notifError('Jumlah yang Anda Masukkan Melebihi jumlah pesanan...!!!')
    } else {
      store.save()
    }
  }
}

// const lists = computed(() => {
//   const arr = store?.rinci
//   console.log('sasasasa', arr)
//   return arr?.sort((a, b) => {
//     return b.id - a.id
//   })
// })

const props = defineProps({
  data: {
    type: Object,
    default: null,
  },
  flaging: {
    type: String,
    default: '',
  },
})

const lists = computed(() => {
  const arr = props.data?.rinci
  console.log('arr', arr)
  return arr?.sort((a, b) => {
    return b.id - a.id
  })
})

function kurangisisabarangdatang(item) {
  item.sisajumlahbelumditerima = olahUang(item.sisajumlahbelumditerimax) - olahUang(item.itemrusak)
}

function cetakData() {
  store.dialogCetak = true
}

function updatePembayaran() {
  if (store.form.pembayaran === 'Cash') {
    store.form.jumlahharitempo = 0
    updateJumlahHariTempo()
  }
}

function updateJumlahHariTempo() {
  const hari = parseInt(store.form.jumlahharitempo)
  const tgl = new Date(store.form.tgl)
  tgl.setDate(tgl.getDate() + hari)
  store.form.tgljthtempo = tgl.toISOString().split('T')[0]
  store.dateDisplay.tgljthtempo = tgl.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  })
}

if (props?.data) {
  const rinciterima = props?.data?.rinci
  const rinciorder = store.rinci?.filter((x) => x.noorder === props?.data?.noorder)

  const kodebarang = rinciterima?.map((x) => x.kdbarang)
  const newset = kodebarang?.length ? [...new Set(kodebarang)] : []
  const rincians = []
  for (let i = 0; i < newset.length; i++) {
    const el = newset[i]
    const obterima = rinciterima?.filter((x) => x.kdbarang === el)

    const obj = {
      kdbarang: rinciorder?.filter((x) => x.kdbarang === el)[0]?.kdbarang,
      namabarang: rinciorder?.filter((x) => x.kdbarang === el)[0]?.mbarang?.namabarang,
      jumlahorder: rinciorder?.filter((x) => x.kdbarang === el)[0]?.jumlahpo,
      jumlahterima: obterima?.map((x) => parseInt(x.jumlah_b)).reduce((a, b) => a + b, 0),
      hargafaktur: obterima?.map((x) => parseInt(x.hargafaktur)).reduce((a, b) => a + b, 0),
      subtotalfix: obterima?.map((x) => parseInt(x.subtotalfix)).reduce((a, b) => a + b, 0),
    }
    rincians.push(obj)
  }

  const penerimaan = {
    nopenerimaan: props?.data?.nopenerimaan,
    nofaktur: props?.data?.nofaktur,
    noorder: props?.data?.noorder,
    suplier: props?.data?.suplier,
    tanggal: props?.data?.tgl,
    total: props?.data?.total,
    totalfix: props?.data?.totalfix,
    rincians: rincians,
  }

  onMounted(() => {
    store.dataprops = penerimaan
    storesupllier.getAllList()
  })
}
</script>
