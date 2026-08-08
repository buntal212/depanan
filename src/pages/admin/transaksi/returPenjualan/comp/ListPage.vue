<template>
  <div class="column fit">
    <div class="col full-height">
      <div class="full-height q-pa-sm">
        <q-list class="rounded-borders full-height column">
          <div class="col-auto">
            <q-item-label header>
              <div class="row full-width items-center">
                <div class="col-grow f-24">List Transaksi Retur Penjualan</div>
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
                        (e) => {
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
              <!-- scroll-target="#scrltrgt" -->
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
                        <div class="row">
                          <div class="col-3">{{ item?.no_penjualan }}</div>
                          <div class="col-2 q-ml-sm">{{ item?.no_retur }}</div>
                          <div class="col-2 q-ml-sm">{{ formatDouble(item?.total) }}</div>
                          <div class="col-2 q-ml-sm">{{ statusFlag(item?.status) }}</div>
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
                  <div class="row q-pa-sm text-weight-bold">
                    <div class="col-5">Barang</div>
                    <div class="col-1 text-right">Jumlah</div>
                    <div class="col-1 text-right">Satuan</div>
                    <div class="col-2 text-right">Harga</div>
                    <div class="col-2 text-right">Subtotal</div>
                  </div>
                  <q-separator />
                  <div v-for="detail in item?.detail" :key="detail?.id">
                    <div class="row q-px-sm">
                      <div class="col-5">
                        {{ detail?.master_barang?.namabarang }}
                      </div>
                      <div class="col-1 text-right">{{ detail?.jumlah }}</div>
                      <div class="col-1 text-right">{{ detail?.master_barang?.satuan_k }}</div>
                      <div class="col-2 text-right">{{ formatDouble(detail?.harga_jual) }}</div>
                      <div class="col-2 text-right">{{ formatDouble(detail?.subtotal) }}</div>
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

const emits = defineEmits(['back', 'selesai'])
const store = useListTransaksiReturPenjualanStore()

const scrollTarget = ref(null)
const infiniteScroll = ref(null)
const hoveredId = ref(null)

function statusFlag(flag) {
  let status = ''
  switch (flag) {
    case '':
      status = 'Draft'
      break
    case '1':
      status = 'Selesai'
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

    default:
      break
  }
  // console.log('status', status, flag);

  return status
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

