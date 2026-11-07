<template>
  <div class="column fit">
    <div class="col full-height">
      <div class="full-height q-pa-sm">
        <q-list class="rounded-borders full-height column">
          <div class="col-auto">
            <q-item-label header>
              <div class="row full-width items-center">
                <div class="col-grow f-24 text-weight-bold" :class="app?.dark ? 'text-amber-4' : 'text-primary'">
                  List Transaksi Retur Penjualan
                </div>
                <div class="col-auto text-right">
                  <div class="flex items-center q-col-gutter-x-sm">
                    <app-input-date
                      :model="store.dateDisplay.from"
                      label="Dari"
                      style="min-width: 150px"
                      outlined
                      :debounce="300"
                      @set-model="
                        (val) => {
                          store.dateDisplay.from = val
                        }
                      "
                      @db-model="
                        (val) => {
                          store.params.from = val
                          store.getList()
                        }
                      "
                    />
                    <app-input-date
                      :model="store.dateDisplay.to"
                      label="Sampai"
                      style="min-width: 150px"
                      outlined
                      :debounce="300"
                      @set-model="
                        (val) => {
                          store.dateDisplay.to = val
                        }
                      "
                      @db-model="
                        (val) => {
                          store.params.to = val
                          store.getList()
                        }
                      "
                    />
                    <app-input
                      v-model="store.params.q"
                      prepend-icon="search"
                      label="Telusuri"
                      style="min-width: 250px"
                      :debounce="300"
                      @update:model-value="
                        () => {
                          store.getList()
                        }
                      "
                    />
                    <div class="q-px-xs">
                      <app-btn
                        round
                        icon="refresh"
                        tooltip="Refresh"
                        color="grey-10"
                        class="text-yellow-8"
                        dense
                        @click="
                          () => {
                            store.getList()
                          }
                        "
                      />
                    </div>

                    <app-btn-back @click="emits('back')" />
                  </div>
                </div>
              </div>
            </q-item-label>
            <q-separator />
          </div>
          <div ref="scrollTarget" id="scrltrgt" class="col full-height" style="height: 600px; overflow-y: auto;">
            <q-infinite-scroll
              @load="loadMore"
              ref="infiniteScroll"
              :disable="store?.isError || !store?.meta?.next_page_url"
              :offset="150"
              debounce="500"
              :initial-index="store.params.page"
            >
              <q-intersection v-for="(item, i) in store.items" :key="i" transition="fade" class="example-item">
                <q-expansion-item
                  v-model="item.expand"
                  clickable
                  v-ripple
                  @mouseover="hoveredId = item?.id"
                  @mouseleave="hoveredId = null"
                  :class="{
                    'bg-grey-8 text-white': hoveredId === item?.id,
                    'bg-primary text-white': item.status === '' && hoveredId !== item?.id,
                  }"
                >
                  <template v-slot:header>
                    <q-item-section>
                      <q-item-label lines="1">
                        <div class="row items-center">
                          <div class="col-3 text-weight-bold">{{ item?.no_retur }}</div>
                          <div class="col-3 q-ml-sm text-grey-4">Nota: {{ item?.no_penjualan }}</div>
                          <div class="col-2 q-ml-sm text-weight-bold" :class="app?.dark ? 'text-amber-4' : 'text-primary'">
                            Rp {{ formatDouble(item?.total) }}
                          </div>
                          <div class="col-3 q-ml-sm flex items-center q-gutter-x-xs">
                            <q-badge :color="item.status === '1' ? 'positive' : 'grey-7'" class="text-caption">
                              {{ item.status === '1' ? 'Selesai' : 'Draft' }}
                            </q-badge>
                            <q-badge :color="statusReturBadge(item).color" class="text-caption">
                              {{ statusReturBadge(item).label }}
                            </q-badge>
                          </div>
                        </div>
                      </q-item-label>
                      <q-item-label lines="1">
                        <div class="row">
                          <div class="col-3 text-weight-bold">
                            <span>Pelanggan: </span>
                            {{ item?.header_penjualan?.pelanggan?.nama || item?.pelanggan?.nama || item?.header_penjualan?.keterangan?.nama || item?.keterangan?.nama || '-' }}
                          </div>
                          <div class="col-3 q-ml-sm">
                            Sales: {{ item?.header_penjualan?.sales?.nama || item?.sales?.nama || '-' }}
                          </div>
                        </div>
                      </q-item-label>
                    </q-item-section>
                    <q-item-section v-if="hoveredId === item?.id" side>
                      <div class="flex q-gutter-sm">
                        <app-btn
                          v-if="item.status === ''"
                          icon="check_circle"
                          color="primary"
                          tooltip="Selesaikan Transaksi dan Tambahkan stok"
                          @click="emits('selesai', item)"
                          :loading="item?.loading"
                          :disable="item?.loading"
                        />
                      </div>
                    </q-item-section>
                    <q-item-section v-else side top>
                      <q-item-label caption>{{ humanDate(item?.tgl) }}</q-item-label>
                      <q-item-label caption>{{ jamTnpDetik(item?.tgl) }}</q-item-label>
                      <app-btn
                        v-if="item?.loading"
                        :loading="item?.loading"
                        :disable="item?.loading"
                      />
                    </q-item-section>
                  </template>

                  <q-separator />

                  <!-- Rincian Informasi Retur (Expanded) -->
                  <div class="q-pa-sm" :class="app?.dark ? 'bg-grey-10' : 'bg-grey-3'">
                    <!-- Info Baris Identitas -->
                    <div
                      class="q-pa-sm rounded-borders q-mb-sm"
                      :class="app?.dark ? 'bg-grey-9 text-grey-2' : 'bg-white text-grey-9'"
                    >
                      <div class="row q-col-gutter-sm text-caption">
                        <div class="col-12 col-md-3">
                          <span class="text-grey-5">No. Nota Asal:</span>
                          <span class="text-weight-bold q-ml-xs text-primary">{{ item?.no_penjualan }}</span>
                        </div>
                        <div class="col-12 col-md-3">
                          <span class="text-grey-5">No. Retur:</span>
                          <span class="text-weight-bold q-ml-xs text-amber-4">{{ item?.no_retur }}</span>
                        </div>
                        <div class="col-12 col-md-3">
                          <span class="text-grey-5">Tanggal Retur:</span>
                          <span class="text-weight-bold q-ml-xs">{{ humanDate(item?.tgl) }} {{ jamTnpDetik(item?.tgl) }}</span>
                        </div>
                        <div class="col-12 col-md-3">
                          <span class="text-grey-5">Status:</span>
                          <q-badge :color="item.status === '1' ? 'positive' : 'grey-7'" class="q-ml-xs text-caption">
                            {{ item.status === '1' ? 'Selesai' : 'Draft' }}
                          </q-badge>
                          <q-badge :color="statusReturBadge(item).color" class="q-ml-xs text-caption">
                            {{ statusReturBadge(item).label }}
                          </q-badge>
                        </div>
                      </div>
                    </div>

                    <!-- Tabel Detail Barang Diretur -->
                    <div
                      class="row q-pa-sm text-weight-bold text-caption rounded-borders"
                      :class="app?.dark ? 'bg-grey-9 text-grey-3' : 'bg-grey-4 text-black'"
                    >
                      <div class="col-4">Barang & Motif</div>
                      <div class="col-1 text-center">Satuan</div>
                      <div class="col-1 text-right">Terjual</div>
                      <div class="col-1 text-right">Diretur</div>
                      <div class="col-1 text-right">Harga</div>
                      <div class="col-1 text-right">Bruto</div>
                      <div class="col-1 text-right">Diskon</div>
                      <div class="col-2 text-right">Subtotal</div>
                    </div>
                    <q-separator />

                    <div v-for="(detail, dIdx) in item?.detail" :key="detail?.id || dIdx">
                      <div
                        class="row items-center q-px-sm q-py-xs text-caption"
                        :class="app?.dark ? (dIdx % 2 === 0 ? 'bg-grey-9' : 'bg-grey-10') : (dIdx % 2 === 0 ? 'bg-white' : 'bg-grey-2')"
                      >
                        <div class="col-4">
                          <div class="text-weight-bold">{{ detail?.master_barang?.namabarang || detail?.kodebarang }}</div>
                          <div class="text-grey-5 text-italic">
                            Motif: {{ detail?.detail_penjualan?.motif || '-' }}
                          </div>
                        </div>
                        <div class="col-1 text-center">{{ detail?.master_barang?.satuan_k || 'PCS' }}</div>
                        <div class="col-1 text-right text-grey-5">
                          {{ detail?.detail_penjualan?.jumlah ? formatDouble(detail.detail_penjualan.jumlah) : '-' }}
                        </div>
                        <div class="col-1 text-right text-weight-bold" :class="app?.dark ? 'text-amber-4' : 'text-deep-orange-9'">
                          {{ formatDouble(detail?.jumlah) }}
                        </div>
                        <div class="col-1 text-right">{{ formatDouble(detail?.harga_jual) }}</div>
                        <div class="col-1 text-right">{{ formatDouble((Number(detail?.harga_jual) || 0) * (Number(detail?.jumlah) || 0)) }}</div>
                        <div class="col-1 text-right">{{ formatDouble(detail?.diskon) }}</div>
                        <div class="col-2 text-right text-weight-bold">
                          Rp {{ formatDouble(detail?.subtotal) }}
                        </div>
                      </div>
                    </div>

                    <!-- Ringkasan Nominal Retur -->
                    <div class="row justify-end q-mt-sm">
                      <div class="col-12 col-sm-8 col-md-5 col-lg-4">
                        <div
                          class="q-pa-sm rounded-borders text-body2 shadow-1"
                          :class="app?.dark ? 'bg-grey-9 text-grey-2' : 'bg-white text-grey-9'"
                        >
                          <div class="text-subtitle2 text-weight-bold q-pb-xs" :class="app?.dark ? 'text-amber-4' : 'text-primary'">
                            Rincian Nominal Retur
                          </div>
                          <q-separator :dark="app?.dark" class="q-my-xs" />

                          <div class="row justify-between q-py-xs">
                            <span>Subtotal Retur:</span>
                            <span class="text-weight-bold">Rp {{ formatDouble(hitungSubtotalRetur(item)) }}</span>
                          </div>

                          <div class="row justify-between q-py-xs" :class="Number(item?.diskon_kuitansi) > 0 ? (app?.dark ? 'text-amber-3' : 'text-orange-9') : 'text-grey-5'">
                            <span>Diskon Nota Retur:</span>
                            <span v-if="item?.diskon_kuitansi !== null && Number(item?.diskon_kuitansi) > 0" class="text-weight-bold">
                              - Rp {{ formatDouble(item?.diskon_kuitansi) }}
                            </span>
                            <span v-else class="text-caption text-italic">Rincian historis tidak tersedia</span>
                          </div>

                          <div class="row justify-between q-py-xs" :class="item?.dpp !== null ? '' : 'text-grey-5'">
                            <span>DPP (Dasar Pengenaan Pajak):</span>
                            <span v-if="item?.dpp !== null" class="text-weight-bold">Rp {{ formatDouble(item?.dpp) }}</span>
                            <span v-else class="text-caption text-italic">Rincian historis tidak tersedia</span>
                          </div>

                          <div class="row justify-between q-py-xs" :class="Number(item?.ppn_nominal) > 0 ? 'text-primary' : 'text-grey-5'">
                            <span>PPN Retur:</span>
                            <span v-if="item?.ppn_nominal !== null && Number(item?.ppn_nominal) > 0" class="text-weight-bold">
                              PPN ({{ formatDouble(item?.ppn_persen) }}%): Rp {{ formatDouble(item?.ppn_nominal) }}
                            </span>
                            <span v-else class="text-caption text-italic">Rincian historis tidak tersedia</span>
                          </div>

                          <q-separator :dark="app?.dark" class="q-my-xs" />

                          <div class="row justify-between q-py-xs text-subtitle1 text-weight-bolder" :class="app?.dark ? 'text-white' : 'text-black'">
                            <span>Total Nilai Retur:</span>
                            <span :class="app?.dark ? 'text-amber-4' : 'text-primary'">
                              Rp {{ formatDouble(item?.total) }}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </q-expansion-item>
                <q-separator />
              </q-intersection>

              <template v-slot:loading>
                <div v-if="!store.isError" class="text-center q-my-md">
                  <q-spinner-dots color="primary" size="40px" />
                </div>
              </template>
            </q-infinite-scroll>
          </div>
        </q-list>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { formatDouble } from 'src/modules/formatter'
import { humanDate, jamTnpDetik } from 'src/modules/utils'
import { useListTransaksiReturPenjualanStore } from 'src/stores/admin/transaksi/returPenjualan/retur'
import { useAppStore } from 'src/stores/app'

const emits = defineEmits(['back', 'selesai'])
const store = useListTransaksiReturPenjualanStore()
const app = useAppStore()

const scrollTarget = ref(null)
const infiniteScroll = ref(null)
const hoveredId = ref(null)

function hitungSubtotalRetur(item) {
  if (Array.isArray(item?.detail) && item.detail.length > 0) {
    return item.detail.reduce((sum, d) => sum + (Number(d?.subtotal) || 0), 0)
  }
  return Number(item?.total || 0)
}

function hitungQtyRetur(item) {
  if (!Array.isArray(item?.detail)) return 0
  return item.detail.reduce((sum, d) => sum + (Number(d?.jumlah) || 0), 0)
}

function hitungQtyTerjual(item) {
  if (Array.isArray(item?.header_penjualan?.detail)) {
    return item.header_penjualan.detail.reduce((sum, d) => sum + (Number(d?.jumlah) || 0), 0)
  }
  if (Array.isArray(item?.detail)) {
    return item.detail.reduce((sum, d) => sum + (Number(d?.detail_penjualan?.jumlah) || 0), 0)
  }
  return 0
}

function statusReturBadge(item) {
  const qtyRetur = hitungQtyRetur(item)
  const qtyTerjual = hitungQtyTerjual(item)
  const isDraft = String(item?.status) !== '1'

  if (isDraft) {
    return { label: 'Draft Retur', color: 'grey-8', textColor: 'white' }
  }
  if (qtyRetur > 0 && qtyTerjual > 0 && qtyRetur >= qtyTerjual) {
    return { label: 'Retur Seluruhnya', color: 'negative', textColor: 'white' }
  }
  return { label: 'Retur Sebagian', color: 'deep-orange', textColor: 'white' }
}

function loadMore(index, done) {
  store.loadMore(index, done)
}
</script>

<style lang="scss" scoped>
.example-item {
  min-height: 56px;
}
</style>
