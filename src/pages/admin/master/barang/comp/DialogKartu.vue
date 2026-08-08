<template>
  <q-dialog persistent backdrop-filter="blur(4px)">
    <q-card style="min-width: 80vw; max-width: 180vw; height: 600px">
      <q-layout view="lHh Lpr lFf" container class="rounded-borders">
        <q-header>
          <q-bar class="bg-black text-white">
            <div>KARTU STOK BARANG</div>
            <q-space />

            <!-- <q-btn dense flat icon="close" @click="close()" v-close-popup> -->
            <q-btn dense flat icon="close" @click="close()">
              <q-tooltip>Close</q-tooltip>
            </q-btn>
          </q-bar>
          <q-card-section :class="app?.dark ? 'bg-black text-white' : 'bg-white text-black'">
            <div class="col q-gutter-sm q-px-md">
              <app-input
                v-model="store.params.x"
                prepend-icon="search"
                label="Telusuri Seri"
                style="min-width: 350px"
                :debounce="300"
                @update:model-value="
                  (e) => {
                    store.getList()
                    console.log('item cari', store.kartuStok?.transaksi)
                  }
                "
              />
            </div>
            <div class="row q-gutter-sm q-px-md q-py-md">
              <app-select
                v-model="store.params.bulan"
                class="col-3"
                label="Pilih Bulan"
                outlined
                :options="store.pilihbulan"
                option-label="label"
                option-value="value"
              />
              <app-input v-model="store.params.tahun" class="col-3" label="Tahun" outlined />
              <app-btn
                class="bg-yellow-8 text-black"
                label="Ambil Data"
                :loading="store.loading"
                @click="ambilData()"
              />
            </div>
          </q-card-section>
        </q-header>
        <q-page-container>
          <div id="printMe">
            <div class="row full-width justify-center q-px-sm">
              <kop-cetak />
              <table class="full-width">
                <thead>
                  <tr>
                    <th class="text-center">No</th>
                    <th class="text-center">Tanggal</th>
                    <th class="text-center">Transaksi</th>
                    <th class="text-center">Penerimaan</th>
                    <th class="text-center">Pengeluaran</th>
                    <th class="text-center">Total Stok</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(item, n) in store.kartuStok?.transaksi" :key="n">
                    <td class="text-center">{{ n + 1 }}</td>
                    <td class="text-center">{{ humanDate(item?.tanggal) }}</td>
                    <td>
                      {{ item.notransaksi }}
                      <span v-if="item?.seri">|| Seri : {{ item?.seri }}</span>
                    </td>
                    <td>
                      <span v-if="Math.floor(item.debit / (item?.isi > 0 ? item?.isi : 1)) >= 0"
                        >{{ Math.floor(item.debit / (item?.isi > 0 ? item?.isi : 1)) }}
                        {{ item?.satuan_b }}</span
                      >
                      <span
                        v-if="
                          Math.floor(item.debit / (item?.isi > 0 ? item?.isi : 1)) > 0 &&
                          item?.debit % (item?.isi > 0 ? item?.isi : 1) > 0
                        "
                      >
                      </span>
                      <span v-if="item?.debit % (item?.isi > 0 ? item?.isi : 1) > 0">
                        Lebih {{ item?.debit % (item?.isi > 0 ? item?.isi : 1) }}
                        {{ item?.satuan_k }}</span
                      >

                      <span
                        :class="app?.dark ? 'text-yellow-8' : 'text-brown-8'"
                        style="font-size: x-small"
                      >
                        ({{ item.debit }} {{ item.satuan_k }})</span
                      >
                    </td>
                    <td>
                      <span v-if="Math.floor(item.kredit / (item?.isi > 0 ? item?.isi : 1)) >= 0"
                        >{{ Math.floor(item.kredit / (item?.isi > 0 ? item?.isi : 1)) }}
                        {{ item?.satuan_b }}</span
                      >
                      <span
                        v-if="
                          Math.floor(item.kredit / (item?.isi > 0 ? item?.isi : 1)) > 0 &&
                          item?.kredit % (item?.isi > 0 ? item?.isi : 1) > 0
                        "
                      >
                      </span>
                      <span v-if="item?.kredit % (item?.isi > 0 ? item?.isi : 1) > 0">
                        Lebih {{ item?.kredit % (item?.isi > 0 ? item?.isi : 1) }}
                        {{ item?.satuan_k }}</span
                      >

                      <span
                        :class="app?.dark ? 'text-yellow-8' : 'text-brown-8'"
                        style="font-size: x-small"
                      >
                        ({{ item.kredit }} {{ item.satuan_k }})
                      </span>
                    </td>
                    <td class="content-center">
                      <span v-if="Math.floor(item.total / (item?.isi > 0 ? item?.isi : 1)) >= 0"
                        >{{ Math.floor(item.total / (item?.isi > 0 ? item?.isi : 1)) }}
                        {{ item?.satuan_b }}</span
                      >
                      <span
                        v-if="
                          Math.floor(item.total / (item?.isi > 0 ? item?.isi : 1)) > 0 &&
                          item?.total % (item?.isi > 0 ? item?.isi : 1) > 0
                        "
                      >
                      </span>
                      <span v-if="item?.total % (item?.isi > 0 ? item?.isi : 1) > 0">
                        Lebih {{ item?.total % (item?.isi > 0 ? item?.isi : 1) }}
                        {{ item?.satuan_k }}</span
                      >
                      <span
                        :class="app?.dark ? 'text-yellow-8' : 'text-brown-8'"
                        style="font-size: x-small"
                      >
                        ({{ item.total }} {{ item.satuan_k }})
                      </span>
                    </td>
                  </tr>
                  <tr class="text-bold">
                    <td class="text-right" colspan="3">Jumlah Stok</td>
                    <td>
                      <span
                        v-if="
                          Math.floor(
                            totalDebit() / (store.kartuStok?.isi > 0 ? store.kartuStok?.isi : 1),
                          ) >= 0
                        "
                        >{{
                          Math.floor(
                            totalDebit() / (store.kartuStok?.isi > 0 ? store.kartuStok?.isi : 1),
                          )
                        }}
                        {{ store.kartuStok?.satuan_b }}</span
                      >
                      <span
                        v-if="
                          Math.floor(
                            totalDebit() / (store.kartuStok?.isi > 0 ? store.kartuStok?.isi : 1),
                          ) > 0 &&
                          totalDebit() % (store.kartuStok?.isi > 0 ? store.kartuStok?.isi : 1) > 0
                        "
                      >
                      </span>
                      <span
                        v-if="
                          totalDebit() % (store.kartuStok?.isi > 0 ? store.kartuStok?.isi : 1) > 0
                        "
                      >
                        Lebih
                        {{ totalDebit() % (store.kartuStok?.isi > 0 ? store.kartuStok?.isi : 1) }}
                        {{ store.kartuStok?.satuan_k }}</span
                      >
                      <!-- {{ store.kartuStok?.total?.total_debitbesar }} {{ store.kartuStok?.satuan_b }} -->
                      <span
                        :class="app?.dark ? 'text-yellow-8' : 'text-brown-8'"
                        style="font-size: x-small"
                      >
                        ({{ totalDebit() }} {{ store.kartuStok?.satuan_k }})
                      </span>
                    </td>
                    <td>
                      <span
                        v-if="
                          Math.floor(
                            totalKredit() / (store.kartuStok?.isi > 0 ? store.kartuStok?.isi : 1),
                          ) >= 0
                        "
                        >{{
                          Math.floor(
                            totalKredit() / (store.kartuStok?.isi > 0 ? store.kartuStok?.isi : 1),
                          )
                        }}
                        {{ store.kartuStok?.satuan_b }}</span
                      >
                      <span
                        v-if="
                          Math.floor(
                            totalKredit() / (store.kartuStok?.isi > 0 ? store.kartuStok?.isi : 1),
                          ) > 0 &&
                          totalKredit() % (store.kartuStok?.isi > 0 ? store.kartuStok?.isi : 1) > 0
                        "
                      >
                      </span>
                      <span
                        v-if="
                          totalKredit() % (store.kartuStok?.isi > 0 ? store.kartuStok?.isi : 1) > 0
                        "
                      >
                        Lebih
                        {{ totalKredit() % (store.kartuStok?.isi > 0 ? store.kartuStok?.isi : 1) }}
                        {{ store.kartuStok?.satuan_k }}</span
                      >

                      <span
                        :class="app?.dark ? 'text-yellow-8' : 'text-brown-8'"
                        style="font-size: x-small"
                      >
                        ({{ totalKredit() }} {{ store.kartuStok?.satuan_k }})
                      </span>
                    </td>
                    <td>
                      <span
                        v-if="
                          Math.floor(
                            totalStok() / (store.kartuStok?.isi > 0 ? store.kartuStok?.isi : 1),
                          ) >= 0
                        "
                        >{{
                          Math.floor(
                            totalStok() / (store.kartuStok?.isi > 0 ? store.kartuStok?.isi : 1),
                          )
                        }}
                        {{ store.kartuStok?.satuan_b }}</span
                      >
                      <span
                        v-if="
                          Math.floor(
                            totalStok() / (store.kartuStok?.isi > 0 ? store.kartuStok?.isi : 1),
                          ) > 0 &&
                          totalStok() % (store.kartuStok?.isi > 0 ? store.kartuStok?.isi : 1) > 0
                        "
                      >
                      </span>
                      <span
                        v-if="
                          totalStok() % (store.kartuStok?.isi > 0 ? store.kartuStok?.isi : 1) > 0
                        "
                      >
                        Lebih
                        {{ totalStok() % (store.kartuStok?.isi > 0 ? store.kartuStok?.isi : 1) }}
                        {{ store.kartuStok?.satuan_k }}</span
                      >
                      <span
                        :class="app?.dark ? 'text-yellow-8' : 'text-brown-8'"
                        style="font-size: x-small"
                      >
                        ({{ totalStok() }} {{ store.kartuStok?.satuan_k }})
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </q-page-container>

        <q-footer>
          <q-card-section class="q-pa-none bg-black text-white">
            <div class="q-pa-md row justify-end items-end">
              <div class="items-end">
                <q-btn v-print="printObj" unelevated color="dark" round size="sm" icon="print">
                  <q-tooltip class="primary" :offset="[10, 10]"> Print </q-tooltip>
                </q-btn>
              </div>
            </div>
          </q-card-section>
        </q-footer>
      </q-layout>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { useAdminMasterBarangStore } from 'src/stores/admin/master/barang/list'
import { useProfilStore } from 'src/stores/admin/profil'
import { onMounted, ref } from 'vue'
import KopCetak from './KopCetak.vue'
import { humanDate } from 'src/modules/utils'
import { useAppStore } from 'src/stores/app'
// import { usePrint } from 'vue3-print-nb'

const profil = useProfilStore()
const store = useAdminMasterBarangStore()
const app = useAppStore()
onMounted(async () => {})

function ambilData() {
  store.getList()
  // {
  //   store.kartuStok = store.meta
  // }
  console.log('items', store.kartuStok)
}

const close = () => {
  store.selectedKodebarang = null
  store.getList()
  store.dialogKartu = false
}

function totalDebit() {
  const arr = store.kartuStok?.transaksi?.reduce((acc, item) => {
    return acc + (item.debit || 0)
  }, 0)
  return arr
}
function totalKredit() {
  const arr = store.kartuStok?.transaksi?.reduce((acc, item) => {
    return acc + (item.kredit || 0)
  }, 0)
  return arr
}

function totalStok() {
  return totalDebit() - totalKredit()
}

const printed = ref(false)
const printObj = {
  id: 'printMe',
  popTitle: 'Printed from ' + profil.profilData?.namatoko + ' app',

  beforeOpenCallback() {
    printed.value = true
    console.log('wait...')
  },

  openCallback() {
    console.log('opened')
  },

  closeCallback() {
    printed.value = false
    console.log('closePrint')
  },
}
</script>

<style>
/* Tambahkan border pada setiap td dan th */
table,
th,
td {
  border: 1px solid black;
  border-collapse: collapse;
  padding: 5px;
}
</style>
