<template>
  <div class="column fit">
    <div class="col full-height">
      <div class="full-height q-pa-sm">
        <q-list class="rounded-borders full-height column">
          <div class="col-auto">
            <q-item-label header>
              <div class="row full-width items-center">
                <div class="col-grow">
                  <!-- <app-btn-back @click="emits('back')" /> -->
                </div>
                <div class="col-auto">
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
                          reload()
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
                          reload()
                        }
                      "
                    />
                    <app-select
                      v-model="store.params.flag"
                      label="Pilih Status"
                      option-label="label"
                      option-value="value"
                      :options="store.flagOptions"
                      @update:model-value="
                        (e) => {
                          reload()
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
                        (e) => {
                          reload()
                        }
                      "
                    />
                    <div class="col">
                      <app-btn
                        round
                        icon="refresh"
                        tooltip="Refresh"
                        color="grey-10"
                        class="text-yellow-8"
                        dense
                        @click="
                          () => {
                            reload()
                          }
                        "
                      />
                    </div>
                    <div class="col">
                      <app-btn
                        icon="add"
                        color="grey-10"
                        class="text-yellow-8"
                        tooltip="Buka Form"
                        @click="emits('add')"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </q-item-label>
            <q-separator />
          </div>

          <div ref="scrollTarget" id="scrtrgt" class="col full-height" style="height: 600px; overflow-y: auto;">
            <q-infinite-scroll
              @load="loadMore"
              ref="infiniteScroll"
              :disable="store?.isError || store?.meta?.next_page_url === null"
              :offset="150"
              debounce="500"
              :initial-index="store.params.page"
              >
              <!-- scroll-target="#scrtrgt" -->
              <q-intersection v-for="(item, i) in store.items" :key="i" transition="fade" class="example-item">
                <q-expansion-item
                  v-model="item.expand"
                  clickable
                  v-ripple
                  @mouseover="hoveredId = item?.id"
                  @mouseleave="hoveredId = null"
                  :class="{ 'bg-grey-8 text-white': hoveredId === item?.id }"
                >
                  <template v-slot:header>
                    <q-item-section>
                      <q-item-label lines="1">
                        <div class="row">
                          <div class="col-3">{{ item?.no_penjualan }}</div>
                          <div class="col-2 q-ml-sm">{{ formatDouble(item?.total) }}</div>
                          <div class="col-2 q-ml-sm">{{ formatDouble(item?.total_diskon) }}</div>
                          <div class="col-2 q-ml-sm">{{ statusFlag(item) }}</div>
                          <div v-if="item?.tempo" class="col-2 q-ml-sm">
                            {{ dateFullFormat(item?.tempo) }}
                            <span class="f-10 text-italic">(tempo)</span>
                          </div>
                        </div>
                      </q-item-label>
                      <q-item-label lines="1">
                        <div class="row">
                          <div class="col-3 text-weight-bold">
                            <span v-if="item?.pelanggan">Pelanggan:</span>
                            {{ item?.pelanggan?.nama }}
                          </div>
                          <div v-if="item?.sales" class="col-2 q-ml-sm">
                            Sales : {{ item?.sales?.nama }}
                          </div>
                        </div>
                        <div class="row" v-if="item?.keterangan">
                          <div class="col-3 text-weight-bold">
                            {{ item?.keterangan?.nama }}
                          </div>
                          <div class="col-2 q-ml-sm">
                            {{ item?.keterangan?.tlp }}
                          </div>
                          <div class="col-5 q-ml-sm">
                            {{ item?.keterangan?.alamat }}
                          </div>
                        </div>
                      </q-item-label>
                    </q-item-section>
                    <q-item-section v-if="hoveredId === item?.id" side>
                      <div class="flex q-gutter-sm">
                        <app-btn
                          v-if="item?.flag == null || item?.flag == '1'"
                          icon="input"
                          color="orange"
                          tooltip="Gunakan Nomor Penjualan"
                          @click="emits('useNota', item)"
                        />
                        <app-btn
                          v-if="item?.flag == null"
                          class="q-mr-xs"
                          icon="attach_money"
                          tooltip="Pembayaran"
                          color="blue"
                          @click="emits('bayar', item)"
                        />
                        <app-btn
                          v-if="['2', '3', '4', '7', '8'].includes(item?.flag)"
                          class="q-mr-xs"
                          icon="event_available"
                          tooltip="Tanggal Tempo Pembayaran"
                          color="primary"
                          @click="emits('tempo', item)"
                        />
                        <app-btn-cetak
                          v-if="item?.flag !== null"
                          class="q-mr-xs"
                          @click="lihatCetak(item)"
                        ></app-btn-cetak>
                        <app-btn
                          v-if="item?.flag !== null && String(item?.flag) !== '6'"
                          class="q-mr-xs"
                          icon="local_shipping"
                          color="teal"
                          tooltip="Cetak Surat Jalan"
                          @click="lihatSuratJalan(item)"
                        />
                      </div>
                    </q-item-section>

                    <q-item-section v-else side top>
                      <q-item-label caption>{{ humanDate(item?.tgl) }}</q-item-label>
                      <q-item-label caption>{{ jamTnpDetik(item?.tgl) }}</q-item-label>
                    </q-item-section>
                  </template>
                  <q-separator />
                  <div
                    class="row q-pa-sm text-weight-bold"
                    :class="app?.dark ? 'bg-grey-10' : 'bg-grey-3 text-black'"
                  >
                    <div class="col-5">Barang</div>
                    <div class="col-1 text-right">Jumlah</div>
                    <div class="col-1 text-right">Satuan</div>
                    <div class="col-2 text-right">Harga</div>
                    <div class="col-1 text-right">Diskon</div>
                    <div class="col-2 text-right">Subtotal</div>
                  </div>
                  <q-separator />
                  <div
                    v-if="item?.flag != null"
                    class="row q-pa-sm text-weight-bold f-10 text-italic"
                    :class="app?.dark ? 'bg-grey-9' : 'bg-grey-4 text-black'"
                  >
                    (Detail Penjualan )
                  </div>
                  <div v-for="detail in item?.detail" :key="detail?.id">
                    <div
                      class="row q-px-sm"
                      :class="app?.dark ? 'bg-grey-9' : 'bg-grey-4 text-black'"
                    >
                      <div class="col-5">
                        {{
                          detail?.master_barang?.namabarang +
                          ' ' + (detail?.motif ?detail?.motif + ' ':'')  +
                          (item?.flag != null
                            ? ''
                            : detail?.master_barang?.stok === null
                              ? ''
                              : '(stok ' +
                                detail?.master_barang?.stok.jumlah_k +
                                '  ' +
                                detail?.master_barang?.stok.satuan_k +
                                ' )')
                        }}
                      </div>
                      <div class="col-1 text-right">{{ detail?.jumlah }}</div>
                      <div class="col-1 text-right">{{ detail?.master_barang?.satuan_k }}</div>
                      <div class="col-2 text-right">{{ formatDouble(detail?.harga_jual) }}</div>
                      <div class="col-1 text-right">{{ formatDouble(detail?.diskon) }}</div>
                      <div class="col-2 text-right">{{ formatDouble(detail?.subtotal) }}</div>
                    </div>
                  </div>
                  <template v-if="item?.flag != null">
                    <q-separator />
                    <div
                      class="row q-pa-sm text-weight-bold f-10 text-italic"
                      :class="app?.dark ? 'bg-grey-9 text-yellow-3' : 'bg-grey-4 text-black'"
                    >
                      (Detail Penjualan Fifo)
                    </div>
                    <div v-for="detail in item?.detail_fifo" :key="detail?.id">
                      <div
                        class="row q-px-sm"
                        :class="app?.dark ? 'bg-grey-9 text-yellow-3' : 'bg-grey-4 text-black'"
                      >
                        <div class="col-5">
                          {{
                            detail?.master_barang?.namabarang +
                            ' ' + (detail?.motif ?detail?.motif + ' ':'') +
                            (item?.flag != null
                              ? ''
                              : detail?.master_barang?.stok === null
                                ? ''
                                : '(stok ' +
                                  detail?.master_barang?.stok.jumlah_k +
                                  '  ' +
                                  detail?.master_barang?.stok.satuan_k +
                                  ' )')
                          }}
                        </div>
                        <div class="col-1 text-right">{{ detail?.jumlah }}</div>
                        <div class="col-1 text-right">
                          {{ detail?.master_barang?.satuan_k }}
                        </div>
                        <div class="col-2 text-right">
                          {{ formatDouble(detail?.harga_jual) }}
                        </div>
                        <div class="col-1 text-right">
                          {{ formatDouble(detail?.diskon) }}
                        </div>
                        <div class="col-2 text-right">
                          {{ formatDouble(detail?.subtotal) }}
                        </div>
                      </div>
                    </div>
                  </template>

                  <q-separator />
                  <!-- Ringkasan Pembayaran (Subtotal Barang, Diskon Nota, DPP, PPN, Total Tagihan Final) -->
                  <div
                    class="row justify-end q-pa-sm"
                    :class="app?.dark ? 'bg-grey-10' : 'bg-grey-3'"
                  >
                    <div class="col-12 col-sm-8 col-md-5 col-lg-4">
                      <div
                        class="q-pa-sm rounded-borders text-body2"
                        :class="app?.dark ? 'bg-grey-9 text-grey-2' : 'bg-white text-grey-9'"
                      >
                        <div
                          class="text-subtitle2 text-weight-bold q-pb-xs"
                          :class="app?.dark ? 'text-amber-4' : 'text-primary'"
                        >
                          Ringkasan Pembayaran
                        </div>
                        <q-separator :dark="app?.dark" class="q-my-xs" />

                        <div class="row justify-between q-py-xs">
                          <span>Subtotal Barang:</span>
                          <span class="text-weight-bold">Rp {{ formatDouble(hitungSubtotalBarang(item)) }}</span>
                        </div>

                        <div
                          class="row justify-between q-py-xs"
                          :class="getDiskonNota(item) > 0 ? (app?.dark ? 'text-amber-3' : 'text-orange-9') : ''"
                        >
                          <span>Diskon Nota:</span>
                          <span class="text-weight-bold">
                            {{ getDiskonNota(item) > 0 ? '- Rp ' + formatDouble(getDiskonNota(item)) : 'Rp 0' }}
                          </span>
                        </div>

                        <div class="row justify-between q-py-xs">
                          <span>DPP (Dasar Pengenaan Pajak):</span>
                          <span class="text-weight-bold">Rp {{ formatDouble(hitungDpp(item)) }}</span>
                        </div>

                        <div
                          class="row justify-between q-py-xs"
                          :class="getNominalPpn(item) > 0 ? 'text-primary' : (app?.dark ? 'text-grey-5' : 'text-grey-7')"
                        >
                          <span>PPN ({{ formatDouble(getPersenPpn(item)) }}%):</span>
                          <span class="text-weight-bold">Rp {{ formatDouble(getNominalPpn(item)) }}</span>
                        </div>

                        <q-separator :dark="app?.dark" class="q-my-xs" />

                        <div
                          class="row justify-between q-py-xs text-subtitle1 text-weight-bolder"
                          :class="app?.dark ? 'text-white' : 'text-black'"
                        >
                          <span>Total Tagihan Final:</span>
                          <span :class="app?.dark ? 'text-amber-4' : 'text-primary'">
                            Rp {{ formatDouble(item?.total) }}
                          </span>
                        </div>

                        <template v-if="item?.flag !== null">
                          <q-separator :dark="app?.dark" class="q-my-xs" />
                          <div class="row justify-between q-py-xs text-caption">
                            <span>Bayar:</span>
                            <span class="text-weight-bold">Rp {{ formatDouble(item?.bayar) }}</span>
                          </div>
                          <div class="row justify-between q-py-xs text-caption">
                            <span>{{ item?.flag === '5' ? 'Kembalian:' : 'Sisa Tagihan:' }}</span>
                            <span class="text-weight-bold">Rp {{ formatDouble(hitungSisaBayar(item)) }}</span>
                          </div>
                        </template>
                      </div>
                    </div>
                  </div>

                  <!-- Section: Informasi Retur Penjualan (Hanya tampil jika ada retur) -->
                  <template v-if="hasRetur(item)">
                    <q-separator />
                    <div
                      class="row justify-end q-pa-sm"
                      :class="app?.dark ? 'bg-grey-10' : 'bg-grey-3'"
                    >
                      <div class="col-12 col-sm-10 col-md-8 col-lg-7">
                        <div
                          class="q-pa-md rounded-borders text-body2 shadow-1"
                          :class="app?.dark ? 'bg-grey-9 text-grey-2' : 'bg-white text-grey-9'"
                        >
                          <!-- Header Section Retur -->
                          <div class="row items-center justify-between q-pb-sm">
                            <div class="row items-center q-gutter-x-sm">
                              <q-icon name="assignment_return" color="orange" size="sm" />
                              <span
                                class="text-subtitle2 text-weight-bold"
                                :class="app?.dark ? 'text-orange-4' : 'text-deep-orange-9'"
                              >
                                Informasi Retur Penjualan
                              </span>
                            </div>
                            <div>
                              <q-badge
                                :color="statusReturBadge(item).color"
                                :text-color="statusReturBadge(item).textColor"
                                class="q-py-xs q-px-sm text-weight-bold"
                              >
                                {{ statusReturBadge(item).label }}
                              </q-badge>
                            </div>
                          </div>
                          <q-separator :dark="app?.dark" class="q-mb-sm" />

                          <!-- List Transaksi Retur -->
                          <div
                            v-for="(retur, rIdx) in getListRetur(item)"
                            :key="retur?.id || rIdx"
                            class="q-pa-sm q-mb-sm rounded-borders"
                            :class="app?.dark ? 'bg-grey-10' : 'bg-grey-2'"
                          >
                            <div class="row justify-between items-center q-pb-xs">
                              <div class="row items-center q-gutter-x-sm">
                                <span class="text-weight-bold text-caption text-primary">#{{ retur?.no_retur }}</span>
                                <span class="text-caption text-grey-5">
                                  ({{ humanDate(retur?.tgl) }} {{ jamTnpDetik(retur?.tgl) }})
                                </span>
                              </div>
                              <div class="flex items-center q-gutter-x-xs">
                                <q-badge
                                  :color="isReturFinal(retur) ? 'positive' : 'grey-7'"
                                  class="text-caption text-weight-bold"
                                >
                                  {{ isReturFinal(retur) ? 'Selesai' : 'Draft' }}
                                </q-badge>
                              </div>
                            </div>

                            <!-- Rincian Barang yang diretur -->
                            <div v-if="retur?.detail && retur.detail.length > 0" class="q-my-xs">
                              <div
                                class="row text-caption text-weight-bold q-py-xs rounded-borders"
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
                              <div
                                v-for="(rd, dIdx) in retur.detail"
                                :key="rd?.id || dIdx"
                                class="row items-center text-caption q-py-xs"
                                :class="app?.dark ? (dIdx % 2 === 0 ? 'bg-grey-9 text-grey-2' : 'bg-grey-10 text-grey-3') : (dIdx % 2 === 0 ? 'bg-white text-grey-9' : 'bg-grey-2 text-grey-9')"
                              >
                                <div class="col-4">
                                  <div class="text-weight-bold">{{ rd?.master_barang?.namabarang || rd?.kodebarang }}</div>
                                  <div class="text-grey-5 text-italic">
                                    Motif: {{ rd?.detail_penjualan?.motif || rd?.motif || '-' }}
                                  </div>
                                </div>
                                <div class="col-1 text-center">{{ rd?.master_barang?.satuan_k || 'PCS' }}</div>
                                <div class="col-1 text-right text-grey-5">
                                  {{ rd?.detail_penjualan?.jumlah ? formatDouble(rd.detail_penjualan.jumlah) : '-' }}
                                </div>
                                <div class="col-1 text-right text-weight-bold" :class="app?.dark ? 'text-amber-4' : 'text-deep-orange-9'">
                                  {{ formatDouble(rd?.jumlah) }}
                                </div>
                                <div class="col-1 text-right">{{ formatDouble(rd?.harga_jual) }}</div>
                                <div class="col-1 text-right">{{ formatDouble((Number(rd?.harga_jual) || 0) * (Number(rd?.jumlah) || 0)) }}</div>
                                <div class="col-1 text-right">{{ formatDouble(rd?.diskon) }}</div>
                                <div class="col-2 text-right text-weight-bold">
                                  Rp {{ formatDouble(rd?.total || rd?.subtotal) }}
                                </div>
                              </div>
                            </div>

                            <!-- Rincian Nominal Snapshot Retur -->
                            <div class="row justify-end q-mt-xs">
                              <div class="col-12 col-md-7 col-lg-6">
                                <div
                                  class="q-pa-xs rounded-borders text-caption"
                                  style="border-top: 1px dashed rgba(128,128,128,0.3)"
                                >
                                  <div class="row justify-between q-py-xs">
                                    <span class="text-grey-5">Subtotal Retur:</span>
                                    <span class="text-weight-bold">Rp {{ formatDouble(retur?.subtotal || retur?.dpp || retur?.total) }}</span>
                                  </div>
                                  <div
                                    class="row justify-between q-py-xs"
                                    :class="Number(retur?.diskon_kuitansi) > 0 ? (app?.dark ? 'text-amber-3' : 'text-orange-9') : 'text-grey-5'"
                                  >
                                    <span>Diskon Nota Retur:</span>
                                    <span v-if="retur?.diskon_kuitansi !== null && Number(retur?.diskon_kuitansi) > 0" class="text-weight-bold">
                                      - Rp {{ formatDouble(retur?.diskon_kuitansi) }}
                                    </span>
                                    <span v-else class="text-caption text-italic">Rincian historis tidak tersedia</span>
                                  </div>
                                  <div class="row justify-between q-py-xs" :class="retur?.dpp !== null ? '' : 'text-grey-5'">
                                    <span>DPP (Dasar Pengenaan Pajak):</span>
                                    <span v-if="retur?.dpp !== null" class="text-weight-bold">Rp {{ formatDouble(retur?.dpp) }}</span>
                                    <span v-else class="text-caption text-italic">Rincian historis tidak tersedia</span>
                                  </div>
                                  <div class="row justify-between q-py-xs" :class="Number(retur?.ppn_nominal) > 0 ? 'text-primary' : 'text-grey-5'">
                                    <span>PPN Retur:</span>
                                    <span v-if="retur?.ppn_nominal !== null && Number(retur?.ppn_nominal) > 0" class="text-weight-bold">
                                      PPN ({{ formatDouble(retur?.ppn_persen) }}%): Rp {{ formatDouble(retur?.ppn_nominal) }}
                                    </span>
                                    <span v-else class="text-caption text-italic">Rincian historis tidak tersedia</span>
                                  </div>
                                  <q-separator :dark="app?.dark" class="q-my-xs" />
                                  <div class="row justify-between items-center q-pt-xs text-caption text-weight-bold">
                                    <span>Nilai Retur{{ isReturFinal(retur) ? '' : ' (Draft)' }}:</span>
                                    <span :class="isReturFinal(retur) ? (app?.dark ? 'text-amber-4' : 'text-deep-orange-9') : 'text-grey-5'">
                                      Rp {{ formatDouble(retur?.total) }}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>

                          <!-- Kumulatif Retur Selesai -->
                          <q-separator :dark="app?.dark" class="q-my-sm" />
                          <div class="row justify-between items-center text-body2 q-py-xs">
                            <span class="text-weight-bold">Total Barang Diretur (Selesai):</span>
                            <span class="text-weight-bold">{{ formatDouble(totalQtyReturSelesai(item)) }} PCS</span>
                          </div>
                          <div class="row justify-between items-center text-subtitle2 text-weight-bolder q-py-xs">
                            <span :class="app?.dark ? 'text-white' : 'text-black'">Total Nilai Retur Kumulatif:</span>
                            <span class="text-weight-bolder" :class="app?.dark ? 'text-amber-4' : 'text-deep-orange-9'">
                              Rp {{ formatDouble(totalNilaiReturSelesai(item)) }}
                            </span>
                          </div>
                          <div
                            v-if="totalNilaiReturDraft(item) > 0"
                            class="row justify-between items-center text-caption text-grey-5 q-py-xs"
                          >
                            <span>* Draft Retur (Belum Selesai, tidak dihitung kumulatif):</span>
                            <span>Rp {{ formatDouble(totalNilaiReturDraft(item)) }}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </template>
                </q-expansion-item>
                <q-separator />
              </q-intersection>

              <template v-slot:loading>
                <div v-if="!store.isError" class="text-center q-my-md">
                  <q-spinner-dots color="yellow-9" size="40px" />
                </div>
              </template>
            </q-infinite-scroll>
          </div>
        </q-list>
      </div>
      <!-- <div class="column full-height flex-center">
        BELUM ADA DATA
      </div> -->
    </div>
  </div>
  <DialogCetak v-model="store.opendialogCetakkedua" />
  <DialogSuratJalan v-model="store.openDialogSuratJalan" />
</template>

<script setup>
// import { useQuasar } from 'quasar'
import { formatDouble } from 'src/modules/formatter'
import { dateFullFormat, humanDate, jamTnpDetik } from 'src/modules/utils'
import { useListPenjualanStore } from 'src/stores/admin/transaksi/penjualan/list'
import { useAppStore } from 'src/stores/app'
import { computed, defineAsyncComponent, onBeforeMount, ref, shallowRef } from 'vue'

// const search = ref(null)
const store = useListPenjualanStore()
const app = useAppStore()
const DialogCetak = shallowRef(defineAsyncComponent(() => import('./cetak/DialogCetak.vue')))
const DialogSuratJalan = shallowRef(
  defineAsyncComponent(() => import('./cetak/DialogSuratJalan.vue')),
)
const scrollTarget = ref(null)
const infiniteScroll = ref(null)
const hoveredId = ref(null)
// const items = ref([ {}, {}, {}, {}, {}, {}, {},{},{},{},{}, {} ])

const emits = defineEmits(['add', 'edit', 'useNota', 'bayar', 'tempo'])

// const $q = useQuasar()
onBeforeMount(() => {
  // Promise.all([
  //   store.getList(null)
  // ])
})
function reload() {
  store.items = []
  infiniteScroll.value?.reset()
  store.getList()
}
function loadMore(index, done) {
  // const el = scrollTarget?.value
  // if (el) {
  //   console.log('scrollTop:', el.scrollTop)
  //   console.log('scrollHeight:', el.scrollHeight)
  //   console.log('clientHeight:', el.clientHeight)
  //   console.log('offset trigger:', el.scrollHeight - el.scrollTop - el.clientHeight)
  // }
  store.loadMore(index, done)
  // ?.then(()=>{
  //   // console.log('load ms',infiniteScroll.value, index);
  //   // infiniteScroll.value?.updateScrollTarget()
  // })

}
function lihatCetak(item) {
  store.itemCetak = item
  store.opendialogCetakkedua = true
}

function lihatSuratJalan(item) {
  store.itemSuratJalan = item
  store.openDialogSuratJalan = true
}

function statusFlag(item) {
  const flag = item?.flag
  const tempo = item?.tempo
  let status = ''
  if (!tempo && ['2', '7', '8'].includes(flag)) {
    status = 'Belum Dikirim'
  } else {
    switch (flag) {
      case null:
        status = 'Draft'
        break
      case '1':
        status = 'Pesanan Sales'
        break
      case '2':
        status = 'Belum Ada Cicilan'
        break
      case '3':
        status = 'Proses Cicilan'
        break
      case '4':
        status = 'Dibawa Sales'
        break
      case '5':
        status = 'Lunas'
        break
      case '6':
        status = 'Batal'
        break
      case '7':
        status = 'Down Payment (DP)'
        break
      // case '8':
      //   status = 'Tempo'
      //   break

      default:
        break
    }
  }
  // console.log('status', status, flag);

  return status
}

// eslint-disable-next-line no-unused-vars
const next = computed(() => {
  let page = false

  if (store.meta?.next_page_url) {
    page = true
  }

  return page
})

function hitungSubtotalBarang(item) {
  if (Array.isArray(item?.detail) && item.detail.length > 0) {
    return item.detail.reduce((sum, d) => sum + (parseFloat(d?.subtotal) || 0), 0)
  }
  if (item?.subtotal !== null && item?.subtotal !== undefined) {
    return Number(item.subtotal) + Number(item?.diskon_kuitansi || 0)
  }
  const total = Number(item?.total || 0)
  const ppn = Number(item?.ppn_nominal || 0)
  const diskonNota = Number(item?.diskon_kuitansi || 0)
  return total - ppn + diskonNota
}

function getDiskonNota(item) {
  return Number(item?.diskon_kuitansi || 0)
}

function hitungDpp(item) {
  const subtotal = hitungSubtotalBarang(item)
  const diskonNota = getDiskonNota(item)
  return Math.max(0, subtotal - diskonNota)
}

function getPersenPpn(item) {
  return Number(item?.ppn_persen || 0)
}

function getNominalPpn(item) {
  return Number(item?.ppn_nominal || 0)
}

function hitungSisaBayar(item) {
  const bayar = Number(item?.bayar || 0)
  const total = Number(item?.total || 0)
  if (item?.flag === '5') {
    return Math.max(0, bayar - total)
  }
  return Math.max(0, total - bayar)
}

function getListRetur(item) {
  if (Array.isArray(item?.header_retur)) return item.header_retur
  if (Array.isArray(item?.headerRetur)) return item.headerRetur
  return []
}

function hasRetur(item) {
  return getListRetur(item).length > 0
}

function isReturFinal(retur) {
  return String(retur?.status) === '1'
}

function totalQtyTerjual(item) {
  if (Array.isArray(item?.detail) && item.detail.length > 0) {
    return item.detail.reduce((sum, d) => sum + (parseFloat(d?.jumlah) || 0), 0)
  }
  if (Array.isArray(item?.detail_fifo) && item.detail_fifo.length > 0) {
    return item.detail_fifo.reduce((sum, d) => sum + (parseFloat(d?.jumlah) || 0), 0)
  }
  return 0
}

function totalQtyReturSelesai(item) {
  const list = getListRetur(item)
  return list.reduce((total, retur) => {
    if (!isReturFinal(retur)) return total
    if (!Array.isArray(retur?.detail)) return total
    return total + retur.detail.reduce((sum, rd) => sum + (parseFloat(rd?.jumlah) || 0), 0)
  }, 0)
}

function totalNilaiReturSelesai(item) {
  const list = getListRetur(item)
  return list.reduce((sum, retur) => {
    if (!isReturFinal(retur)) return sum
    return sum + (parseFloat(retur?.total) || 0)
  }, 0)
}

function totalNilaiReturDraft(item) {
  const list = getListRetur(item)
  return list.reduce((sum, retur) => {
    if (isReturFinal(retur)) return sum
    return sum + (parseFloat(retur?.total) || 0)
  }, 0)
}

function statusReturBadge(item) {
  const qtyJual = totalQtyTerjual(item)
  const qtyRetur = totalQtyReturSelesai(item)
  const hasDraft = getListRetur(item).some((r) => !isReturFinal(r))

  if (qtyRetur > 0 && qtyJual > 0 && qtyRetur >= qtyJual) {
    return {
      label: hasDraft ? 'Retur Seluruhnya (+Draft)' : 'Retur Seluruhnya',
      color: 'negative',
      textColor: 'white',
    }
  }

  if (qtyRetur > 0) {
    return {
      label: hasDraft ? 'Retur Sebagian (+Draft)' : 'Retur Sebagian',
      color: 'deep-orange',
      textColor: 'white',
    }
  }

  if (hasDraft) {
    return {
      label: 'Draft Retur',
      color: 'grey-8',
      textColor: 'white',
    }
  }

  return {
    label: 'Retur',
    color: 'orange',
    textColor: 'white',
  }
}
</script>
<style lang="scss" scoped>
.example-item {
  min-height: 56px;
}
</style>
