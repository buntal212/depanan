<template>
  <q-dialog persistent backdrop-filter="blur(4px)">
    <q-card style="min-width: 80vw; max-width: 180vw; height: 600px">
      <q-layout view="lHh Lpr lFf" container class="rounded-borders">
        <q-header>
          <q-bar class="bg-black text-white">
            <div>PILIH DATA BARANG</div>
            <q-space />

            <q-btn dense flat icon="close" v-close-popup>
              <q-tooltip>Close</q-tooltip>
            </q-btn>
          </q-bar>
        </q-header>
        <q-page-container>
          <q-list class="rounded-borders full-height column">
            <div class="col-auto">
              <q-item-label header>
                <div class="row full-width items-center">
                  <div class="col-grow">
                    <div class="flex items-center">
                      <app-input
                        v-model="storeSelect.params.q"
                        prepend-icon="search"
                        label="Telusuri"
                        style="min-width: 250px"
                        :debounce="300"
                        @update:model-value="
                          (e) => {
                            infiniteScroll.reset()
                            storeSelect.getList()
                          }
                        "
                      />
                    </div>
                  </div>
                </div>
              </q-item-label>
              <q-separator />
            </div>
            <div ref="scrollTarget" class="col full-height scroll">
              <q-infinite-scroll
                @load="storeSelect.loadMore"
                ref="infiniteScroll"
                :disable="storeSelect?.isError || storeSelect?.meta?.next_page_url === null"
                :scroll-target="scrollTarget"
                :offset="150"
                :initial-index="storeSelect.params.page"
              >
                <q-intersection
                  v-for="(item, x) in storeSelect.items"
                  :key="x"
                  transition="fade"
                  class="example-item"
                >
                  <q-item
                    clickable
                    v-ripple
                    @mouseover="hoveredId = item?.id"
                    @mouseleave="hoveredId = null"
                  >
                    <q-item-section>
                      <q-item-label lines="1">
                        <span class="text-weight-bold">
                          {{ item?.namabarang }} Seri {{ item?.motif }}</span
                        >
                        <span class="text-yellow-7"> || Kode : {{ item?.kdbarang }}</span>
                      </q-item-label>
                      <q-item-label caption lines="2">
                        <span class="text-weight-bold"
                          ><q-badge class="q-pa-xs" rounded outline color="yellow-8">
                            Jumlah Stok Sekarang : {{ item?.jumlah_k }} {{ item?.satuan_k }}
                          </q-badge></span
                        >
                        <!-- <span class="text-weight-bold text-red">
                            || TOTAL BARANG DATANG : {{ formatRpDouble(item?.total) }}</span
                          > -->
                      </q-item-label>
                    </q-item-section>
                    <q-item-section v-if="hoveredId === item?.id" side>
                      <div class="flex q-gutter-sm">
                        <app-btn
                          icon="add"
                          class="text-yellow-8"
                          tooltip="Pilih Data"
                          color="grey-10"
                          @click="pilihitem(item)"
                        />
                      </div>
                    </q-item-section>
                    <q-item-section v-else side top>
                      <q-item-label caption>{{ humanDate(item?.updated_at) }}</q-item-label>
                      <q-item-label caption>{{ jamTnpDetik(item?.updated_at) }}</q-item-label>
                    </q-item-section>
                  </q-item>
                  <q-separator />
                </q-intersection>

                <template v-slot:loading>
                  <div v-if="!storeSelect.isError" class="text-center q-my-md">
                    <q-spinner-dots color="primary" size="40px" />
                  </div>
                </template>
              </q-infinite-scroll>
            </div>
          </q-list>
        </q-page-container>

        <q-footer>
          <q-card-section class="q-pa-none bg-black text-white">
            <div class="q-pa-md row justify-end items-end">
              <div class="items-end">
                <!-- <q-btn v-print="printObj" unelevated color="dark" round size="sm" icon="print">
                  <q-tooltip class="primary" :offset="[10, 10]"> Print </q-tooltip>
                </q-btn> -->
              </div>
            </div>
          </q-card-section>
        </q-footer>
      </q-layout>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { humanDate, jamTnpDetik } from 'src/modules/utils'
import { useFormTransaksiPenyesuaianStore } from 'src/stores/admin/transaksi/penyesuaian/form'
import { useSelectStockStore } from 'src/stores/admin/transaksi/penyesuaian/select'
import { onMounted, ref } from 'vue'

const storeSelect = useSelectStockStore()
const store = useFormTransaksiPenyesuaianStore()
const scrollTarget = ref(null)
const infiniteScroll = ref(null)
const hoveredId = ref(null)

onMounted(async () => {
  console.log('data Dialog', storeSelect.items)
})

function pilihitem(item) {
  store.form.kdbarang = item.kdbarang
  store.form.namabarang = item.namabarang
  store.form.motif = item.motif
  store.form.stok_id = item.id

  const stok = Math.floor(item.jumlah_k / (item?.isi > 0 ? item?.isi : 1))
  const sisa = item?.jumlah_k % (item?.isi > 0 ? item?.isi : 1)

  store.form.stoksekarang =
    sisa === 0
      ? `${stok} ${item.satuan_b}`
      : `${stok} ${item.satuan_b} lebih ${sisa} ${item.satuan_k}`

  console.log('stok', stok, sisa)

  store.dialogBarang = false
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
