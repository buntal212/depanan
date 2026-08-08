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
  console.log('itemCetak di list', store.itemCetak)
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
</script>
<style lang="scss" scoped>
.example-item {
  min-height: 56px;
}
</style>
