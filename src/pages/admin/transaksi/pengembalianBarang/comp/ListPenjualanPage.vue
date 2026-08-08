<template>
  <div class="column fit">
    <div  class="col full-height">
      <div class="full-height q-pa-sm">
        <q-list class="rounded-borders full-height column">
          <div class="row items-center q-mb-sm">
            <div class="text-h6">List Penjualan</div>
            <q-space />
            <div class="row items-center q-gutter-x-sm">
              <app-input-date
                :model="list.dateDisplay.from"
                label="Dari"
                style="min-width: 150px"
                outlined
                :debounce="300"
                @set-model="
                  (val) => {
                    list.dateDisplay.from = val
                  }
                "
                @db-model="
                  (val) => {
                    list.params.from = val
                    reload()
                  }
                "
              />
              <app-input-date
                :model="list.dateDisplay.to"
                label="Sampai"
                style="min-width: 150px"
                outlined
                :debounce="300"
                @set-model="
                  (val) => {
                    list.dateDisplay.to = val
                  }
                "
                @db-model="
                  (val) => {
                    list.params.to = val
                    reload()
                  }
                "
              />
              <app-input
                v-model="list.params.q"
                prepend-icon="search"
                label="Telusuri"
                style="min-width: 250px"
                :debounce="300"
                @update:model-value="() => reload()"
              />
              <app-btn
                round
                color="grey-10"
                class="text-yellow-8"
                icon="refresh"
                dense
                tooltip="Refresh"
                @click="reload()"
              />

              <app-btn
                icon="list"
                tooltip="List Pengembalian"
                color="primary"
                @click="$emit('list')"
              />
            </div>
        </div>

        <div class="row items-center q-pb-sm text-weight-bold">
          <div class="col-3">No Penjualan</div>
          <div class="col-2">Total</div>
          <div class="col-2">Total Diskon</div>
          <div class="col-2">Total Retur</div>
          <div class="col-auto">Status</div>
          <div class="col"></div>
        </div>
        <div ref="scrollTarget" id="scrltrgt" class="col full-height"  style="height: 600px; overflow-y: auto;">
          <q-infinite-scroll
            @load="loadMore"
            ref="infiniteScroll"
            :disable="list.loading || list.isError || !list.meta?.next_page_url"
            :offset="150"
            debounce="500"
            :initial-index="list.params.page"
            scroll-target="#scrtrgt"
          >
            <q-intersection v-for="(item, i) in list.items" :key="i" transition="fade" class="example-item">
              <q-expansion-item
                v-model="item.expand"
                clickable
                v-ripple
                @mouseover="hoveredId = item?.id"
                @mouseleave="hoveredId = null"
                :class="{ 'bg-grey-8 text-white': hoveredId === item?.id }"
              >
                <template #header>
                  <q-item-section>
                    <q-item-label lines="1">
                      <div class="row">
                        <div class="col-3">{{ item?.no_penjualan }}</div>
                        <div class="col-2">{{ formatDouble(item?.total) }}</div>
                        <div class="col-2">{{ formatDouble(item?.total_diskon) }}</div>
                        <div class="col-2">
                          {{
                            formatDouble(
                              item?.header_retur?.reduce((sum, r) => sum + r.total, 0) || 0,
                            )
                          }}
                        </div>
                        <div class="col-auto">{{ statusFlag(item?.flag) }}</div>
                      </div>
                    </q-item-label>
                    <q-item-label  lines="1">
                      <div class="row">
                        <div class="col-3">{{ item?.pelanggan?.nama??item?.keterangan?.nama }}</div>
                        <div class="col-5 q-ml-sm">{{ item?.pelanggan?.alamat??item?.keterangan?.alamat }}</div>
                      </div>
                    </q-item-label>
                  </q-item-section>
                  <q-item-section v-if="hoveredId === item?.id" side>
                    <div class="flex q-gutter-sm">
                      <app-btn
                        v-if="['2', '3', '5'].includes(item?.flag)"
                        icon="archive"
                        color="orange"
                        tooltip="Pengembalian Barang"
                        @click="$emit('form', item)"
                      />
                    </div>
                  </q-item-section>
                  <q-item-section v-else side top>
                    <q-item-label caption>{{ humanDate(item?.tgl) }}</q-item-label>
                    <q-item-label caption>{{ jamTnpDetik(item?.tgl) }}</q-item-label>
                  </q-item-section>
                </template>

                <q-separator />
                <q-card class="q-ma-xs" :class="{ 'bg-grey-8 text-white': hoveredId === item?.id }">
                  <q-card-section>
                    <div class="row q-pa-xs">
                      <div class="col-5">Barang</div>
                      <div class="col-1 text-right">Jumlah</div>
                      <div class="col-1 text-right">Jumlah Retur</div>
                      <div class="col-1 text-right">Harga</div>
                      <div class="col-1 text-right">Diskon</div>
                      <div class="col-1 text-right">Retur</div>
                      <div class="col-2 text-right">Subtotal</div>
                    </div>
                    <template v-if="item?.detail?.length">
                      <div
                        v-for="detail in item?.detail"
                        :key="detail?.id"
                        class="row  q-gutter-y-sm"
                      >
                        <div class="col-5">

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
                                .filter((m) => m.kodebarang === detail?.kodebarang)
                                ?.reduce((acc, it) => acc + it.subtotal, 0),
                            ):0
                          }}
                        </div>
                        <div class="col-2 text-right">{{ formatDouble(subtotal(item, detail)) }}</div>
                      </div>
                    </template>
                    <div v-else class="q-pa-md text-center text-grey">Tidak ada detail barang</div>
                  </q-card-section>
                </q-card>
              </q-expansion-item>
              <q-separator />
            </q-intersection>

            <template #loading>
              <div v-if="!list.isError" class="text-center q-my-md">
                <q-spinner-dots color="primary" size="40px" />
              </div>
            </template>
          </q-infinite-scroll>
        </div>
        </q-list>


      </div>

      <q-separator />


    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useListPenjualanStore } from 'src/stores/admin/transaksi/penjualan/list'
import { formatDouble } from 'src/modules/formatter'
import { humanDate, jamTnpDetik } from 'src/modules/utils'

// Store
const list = useListPenjualanStore()
list.getList()
// Refs
const scrollTarget = ref(null)
const infiniteScroll = ref(null)
const hoveredId = ref(null)
function reload() {
  list.items = []
  infiniteScroll.value?.reset()
  list.getList()
}
function loadMore(index, done) {
// const el = scrollTarget?.value
//   if (el) {
//     console.log('scrollTop:', el.scrollTop)
//     console.log('scrollHeight:', el.scrollHeight)
//     console.log('clientHeight:', el.clientHeight)
//     console.log('offset trigger:', el.scrollHeight - el.scrollTop - el.clientHeight)
//   }
  list.loadMore(index, done)


}
function detailRetur(item, detail) {
  let total = 0
  if (item?.header_retur?.length > 0) {
    total = item?.header_retur
      ?.flatMap((m) => m?.detail)
      .filter((f) => f?.kodebarang === detail?.kodebarang)
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
      .filter((f) => f?.kodebarang === detail?.kodebarang)
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
