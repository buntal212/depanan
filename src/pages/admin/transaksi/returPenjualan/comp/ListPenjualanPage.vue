<template>
  <div class="column fit">
    <div class="col full-height">
      <div class="full-height q-pa-sm">
        <q-list class="rounded-borders full-height column">
          <div class="col-auto">
            <q-item-label header>
              <div class="row full-width items-center">
                <div class="col-grow f-24">List Penjualan</div>
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
                    <div class="q-px-xs">
                      <app-btn
                        round
                        icon="refresh"
                        color="grey-10"
                        class="text-yellow-8"
                        tooltip="Refresh"
                        dense
                        @click="
                          () => {
                            reload()
                          }
                        "
                      />
                    </div>
                    <app-btn
                      icon="history"
                      tooltip="Buka History Retur Penjualan"
                      color="grey-10"
                      class="text-yellow-8"
                      @click="emits('list')"
                    />
                  </div>
                </div>
              </div>
            </q-item-label>
            <q-separator />
          </div>
          <div ref="scrollTarget" id="scrltrgt" class="col full-height">
            <q-infinite-scroll
              @load="loadMore"
              ref="infiniteScroll"
              :disable="store?.isError || store?.meta?.next_page_url === null"
              :offset="150"
              :initial-index="store.params.page"
              >
              <!-- scroll-target="#scrltrgt" -->
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
                          <div class="col-2 q-ml-sm">{{ statusFlag(item?.flag) }}</div>
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
                          icon="input"
                          color="orange"
                          tooltip="retur nota ini"
                          @click="emits('form', item)"
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
                    <div class="col-1 text-right">Jumlah Retur</div>
                    <div class="col-1 text-right">Harga</div>
                    <div class="col-1 text-right">Diskon</div>
                    <div class="col-1 text-right">Retur</div>
                    <div class="col-2 text-right">Subtotal</div>
                  </div>
                  <template v-if="item?.flag != null">
                    <q-separator />
                    <div v-for="detail in item?.detail" :key="detail?.id">
                      <div
                        class="row q-px-sm"
                        :class="app?.dark ? 'bg-grey-9' : 'bg-grey-3 text-black'"
                      ><div class="col-5">

                        {{
                          detail?.master_barang?.namabarang ??
                          '' +
                            ' '  + (detail?.motif ? detail?.motif + ' ':'')
                        }}
                      </div>
                      <div class="col-1 text-right">{{ formatDouble(detail?.jumlah) }}</div>
                      <div class="col-1 text-right">
                        {{ formatDouble(detailRetur(item, detail)) }}
                      </div>
                      <div class="col-1 text-right">{{ formatDouble(detail?.harga_jual) }}</div>
                      <div class="col-1 text-right">{{ formatDouble(detail?.diskon) }}</div>
                      <div class="col-1 text-right">
                        {{
                          item?.header_retur?.length >0?formatDouble(
                            item?.header_retur
                              ?.flatMap((m) => m.detail)
                              .filter((m) => m.kodebarang === detail?.kodebarang && m.detail_penjualan_id===detail?.id)
                              ?.reduce((acc, it) => acc + it.subtotal, 0),
                          ):0
                        }}
                      </div>
                      <div class="col-2 text-right">{{ formatDouble(subtotal(item, detail)) }}</div>
                      </div>
                    </div>
                  </template>
                </q-expansion-item>
                <q-separator />
              </q-intersection>

              <template v-slot:loading>
                <div v-if="!store.isError" class="text-center q-my-md">
                  <q-spinner-dots color="yellow-8" size="40px" />
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
import { useListReturPenjualanStore } from 'src/stores/admin/transaksi/returPenjualan/list'
import { ref } from 'vue'
import { formatDouble } from 'src/modules/formatter'
import { humanDate, jamTnpDetik } from 'src/modules/utils'
import { useAppStore } from 'src/stores/app'

const emits = defineEmits(['list', 'form'])
const store = useListReturPenjualanStore()
const app = useAppStore()
const scrollTarget = ref(null)
const infiniteScroll = ref(null)
const hoveredId = ref(null)

function reload() {
  store.items = []
  store.getList()
  infiniteScroll.value?.reset()
}
function loadMore(index, done) {

  store.loadMore(index, done)


}
function detailRetur(item, detail) {
  let total = 0
  if (item?.header_retur?.length > 0) {
    total = item?.header_retur
      ?.flatMap((m) => m?.detail)
      .filter((f) => f?.kodebarang === detail?.kodebarang&&f?.detail_penjualan_id===detail?.id)
      ?.reduce((total, item) => total + item?.jumlah, 0)
  }
  return total || 0
}

function subtotal(item, detail) {
  const subtotal = detail?.subtotal ?? 0
  const diskon = detail?.diskon ?? 0
  let returTotal = 0

  if (item?.header_retur?.length > 0) {
    returTotal = item?.header_retur
      ?.flatMap((m) => m?.detail)
      .filter((f) => f?.kodebarang === detail?.kodebarang&&f?.detail_penjualan_id===detail?.id)
      ?.reduce((total, item) => total + item?.subtotal, 0)
  }

  return subtotal - diskon - (returTotal || 0)
}
function statusFlag(flag) {
  let status = ''
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
  // console.log('status', status, flag);

  return status
}
</script>
<style lang="scss" scoped>
.example-item {
  min-height: 56px;
}
</style>

