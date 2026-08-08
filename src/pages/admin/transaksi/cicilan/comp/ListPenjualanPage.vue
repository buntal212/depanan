<template>
  <div class="column fit">
    <div class="col full-height">
      <div class="full-height q-pa-sm">
        <q-list class="rounded-borders full-height column">
          <div class="col-auto">
            <q-item-label header>
              <div class="row full-width items-center">
                <div class="col-auto">
                  <div class="flex items-center">
                    <app-input
                      v-model="store.params.q"
                      prepend-icon="search"
                      label="Telusuri nomor nota"
                      style="min-width: 250px"
                      :debounce="300"
                      @update:model-value="
                        (e) => {
                          reload()
                        }
                      "
                    />
                  </div>
                </div>
                <div class="col-auto">
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
                </div>
                <div class="col-auto">
                  <app-input
                    v-model="store.params.sales"
                    prepend-icon="search"
                    label="Telusuri Nama sales"
                    style="min-width: 250px"
                    :debounce="300"
                    @update:model-value="
                      (e) => {
                        reload()
                      }
                    "
                  />
                </div>
                <div class="col-auto">
                  <app-input
                    v-model="store.params.pelanggan"
                    prepend-icon="search"
                    label="Telusuri Nama planggan"
                    style="min-width: 250px"
                    :debounce="300"
                    @update:model-value="
                      (e) => {
                        reload()
                      }
                    "
                  />
                </div>

                <q-space />
                <div class="col-auto">
                  <app-btn
                    color="grey-10"
                    class="text-yellow-8"
                    icon="refresh"
                    tooltip="refresh"
                    @click="store.getList"
                  />
                </div>
              </div>
            </q-item-label>
            <q-separator />
          </div>

          <div ref="scrollTarget" id="scrltrgt" class="col full-height">
            <q-infinite-scroll
              @load="store.loadMore"
              ref="infiniteScroll"
              :disable="store?.isError || store?.meta?.next_page_url === null"
              :offset="150"
              :initial-index="store.params.page"
              >
              <!-- scroll-target="#scrltrgt" -->
              <!-- <q-item> -->
                <q-expansion-item expand-icon-toggle>
                  <template v-slot:header>
                    <q-item-section>
                      <q-item-label lines="1">
                        <div class="row text-weight-bold q-col-gutter-x-sm">
                          <div class="col-auto" style="width: calc(100% / 7)">No Penjualan</div>
                          <div class="col-auto" style="width: calc(100% / 7)">Total</div>
                          <div class="col-auto" style="width: calc(100% / 7)">DP / Pembayaran</div>
                          <div class="col-auto" style="width: calc(100% / 7)">
                            Total Diskon<span class="text-italic f-10 q-ml-xs">(jika ada)</span>
                          </div>
                          <div class="col-auto" style="width: calc(100% / 7)">
                            Total Retur <span class="text-italic f-10 q-ml-xs">(jika ada)</span>
                          </div>
                          <div class="col-auto" style="width: calc(100% / 7)">
                            Total - Diskon - Retur
                            <span class="text-italic f-10 q-ml-xs">(jika ada)</span>
                          </div>
                          <div class="col-auto text-right" style="width: calc(100% / 7)">Status</div>
                        </div>
                      </q-item-label>
                      <q-item-label lines="1">
                        <div class="row text-weight-bold">
                          <div class="col-3 text-weight-bold">Nama Pelanggan</div>
                          <div class="col-2 q-ml-sm">Nama Sales</div>
                          <div class="col-2 q-ml-sm">
                            Total cicilan <span class="text-italic f-10 q-ml-xs">(jika ada)</span>
                          </div>
                        </div>
                      </q-item-label>
                    </q-item-section>
                    <q-item-section side top>
                      <q-item-label caption>Tanngal</q-item-label>
                      <q-item-label caption>Jam</q-item-label>
                    </q-item-section>

                  </template>
                </q-expansion-item>
              <!-- </q-item> -->
              <q-separator />
              <q-intersection v-for="(item, i) in store.items" :key="i" transition="fade" class="example-item">
                <q-expansion-item
                  v-model="item.expand"
                  clickable
                  v-ripple
                  expand-icon-toggle
                  @mouseover="hoveredId = item?.id"
                  @mouseleave="hoveredId = null"
                  :class="{ 'bg-grey-8 text-white': hoveredId === item?.id }"
                >
                  <template v-slot:header>
                    <q-item-section>
                      <q-item-label lines="1">
                        <div class="row q-col-gutter-x-sm">
                          <div class="col-auto" style="width: calc(100% / 7)">
                            {{ item?.no_penjualan }}
                          </div>
                          <div class="col-auto" style="width: calc(100% / 7)">
                            {{ formatDouble(item?.total + item?.total_diskon)
                            }}<span class="text-italic f-10 q-ml-xs">(total)</span>
                          </div>
                          <div class="col-auto" style="width: calc(100% / 7)">
                            <span v-if="item?.bayar > 0">
                              {{
                                item?.kembali > 0
                                  ? formatDouble(item?.bayar - item?.kembali)
                                  : formatDouble(item?.bayar)
                              }}
                              <span class="text-italic f-10 q-ml-xs">{{
                                parseInt(item?.kembali) < 0 ? '(DP)' : '(Pembayaran)'
                              }}</span></span
                            >
                          </div>
                          <div class="col-auto" style="width: calc(100% / 7)">
                            <span v-if="item?.total_diskon > 0">
                              {{ formatDouble(item?.total_diskon) }}
                              <span class="text-italic f-10 q-ml-xs">(diskon)</span></span
                            >
                          </div>
                          <div class="col-auto" style="width: calc(100% / 7)">
                            <span v-if="totalRetur(item) > 0">
                              {{ formatDouble(totalRetur(item))
                              }}<span class="text-italic f-10 q-ml-xs">(retur)</span></span
                            >
                          </div>
                          <div class="col-auto" style="width: calc(100% / 7)">
                            <span v-if="item?.total_diskon > 0 || totalRetur(item) > 0">
                              {{ formatDouble(item?.total - totalRetur(item))
                              }}<span class="text-italic f-10 q-ml-xs"
                                >(total - diskon - retur)</span
                              ></span
                            >
                          </div>
                          <div class="col-auto text-right" style="width: calc(100% / 7)">
                            {{ statusFlag(item?.flag) }}
                          </div>
                        </div>
                      </q-item-label>
                      <q-item-label lines="1">
                        <div class="row">
                          <div class="col-3 text-weight-bold">
                            Pelanggan: {{ item?.pelanggan?.nama??item?.keterangan?.nama }}
                          </div>
                          <div class="col-2 q-ml-sm">{{ item?.sales?.nama }}</div>
                          <div v-if="item?.cicilan?.length > 0" class="col-2 q-ml-sm">
                            Total cicilan :
                            {{
                              formatDouble(
                                item?.cicilan?.reduce((total, item) => total + item?.jumlah, 0),
                              )
                            }}
                          </div>
                        </div>
                      </q-item-label>
                      <q-item-label v-if="item?.flag!='5' && item?.tempo" lines="1">
                        <div class="row f-10 text-italic">
                          <div  class="col-2 "/>
                          <div  class="col-4 ">
                            tempo : {{ dateFullFormat(item?.tempo) }} <span v-if="item?.jml_tempo" class="q-ml-xs"> || {{ item?.jml_tempo }} hari</span>
                          </div>

                            <div v-if="item?.tgl_kirim" class="col-4">
                              tgl kirim : {{ dateFullFormat(item?.tgl_kirim) }} ||  umur nota : {{ umurNota(item) }} hari
                            </div>
                            <div v-if="item?.tgl_kirim && item?.jml_tempo" class="col-2">
                               {{ item?.jml_tempo - umurNota(item) }} hari lagi
                            </div>
                        </div>
                      </q-item-label>
                    </q-item-section>
                    <q-item-section v-if="hoveredId === item?.id" side>
                      <div class="flex q-gutter-sm">
                        <app-btn
                          v-if="(item?.flag == '2' || item?.flag == '3') && item?.tempo"
                          icon="card_travel"
                          color="orange"
                          tooltip="Di bawa Sales"
                          @click="
                            () => {
                              emits('bawa', item)
                              item.expand = !item.expand
                            }
                          "
                          :loading="item?.loading"
                          :disable="item?.loading"
                        />
                        <app-btn
                          v-if="['4']?.includes(item?.flag)"
                          class="q-mr-xs"
                          icon="price_check"
                          tooltip="Bayar Cililan"
                          color="green"
                          @click="
                            () => {
                              emits('cicil', item)
                              item.expand = !item.expand
                            }
                          "
                          :loading="item?.loading"
                          :disable="item?.loading"
                        />
                        <app-btn
                          v-if="['7', '8']?.includes(item?.flag) && item?.tempo"
                          class="q-mr-xs text-black"
                          icon="price_check"
                          tooltip="Pelunasan"
                          color="yellow-8"
                          @click="
                            () => {
                              emits('lunas', item)
                              item.expand = !item.expand
                            }
                          "
                          :loading="item?.loading"
                          :disable="item?.loading"
                        />
                        <app-btn
                          v-if="item?.flag == '4'"
                          class="q-mr-xs"
                          icon="money_off_csred"
                          tooltip="Kembali tanpa bayar cicilan"
                          color="secondary"
                          @click="
                            () => {
                              emits('kembali', item)
                              item.expand = !item.expand
                            }
                          "
                          :loading="item?.loading"
                          :disable="item?.loading"
                        />
                        <app-btn
                          v-if="['3', '5']?.includes(item?.flag)"
                          class="q-mr-xs"
                          icon="view_list"
                          tooltip="List Cicilan"
                          color="secondary"
                          @click="
                            () => {
                              emits('buka', item)
                              item.expand = !item.expand
                            }
                          "
                          :loading="item?.loading"
                          :disable="item?.loading"
                        />
                        <!-- <app-btn  icon="card_travel" color="orange" tooltip="Di bawa Sales" @click="emits('bawa', item)"/>
                      <app-btn  class="q-mr-xs" icon="price_check" tooltip="Bayar Cililn" color="green" @click="emits('cicil', item)"/>
                      <app-btn  class="q-mr-xs" icon="money_off_csred" tooltip="Kembali tanpa bayar cicilan" color="secondary" @click="emits('kembali', item)" /> -->
                      </div>
                    </q-item-section>
                    <q-item-section v-else side top>
                      <q-item-label caption>{{ humanDate(item?.tgl) }}</q-item-label>
                      <q-item-label caption>{{ jamTnpDetik(item?.tgl) }}</q-item-label>
                    </q-item-section>
                  </template>
                  <q-separator />
                  <div
                    class="row q-pa-sm"
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
                  <div v-for="detail in item?.detail" :key="detail?.id">
                    <div
                      class="row q-px-sm"
                      :class="app?.dark ? 'bg-grey-9' : 'bg-grey-3 text-black'"
                    >
                      <div class="col-5">
                        {{
                          (detail?.master_barang?.namabarang ?? '') +
                            ' '   + (detail?.motif ? detail?.motif + ' ':'')
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
                          formatDouble(
                            item?.header_retur
                              ?.flatMap((m) => m.detail)
                              .filter((m) => m.kodebarang === detail?.kodebarang)
                              ?.reduce((acc, it) => acc + it.subtotal, 0),
                          )
                        }}
                      </div>
                      <div class="col-2 text-right">{{ formatDouble(subtotal(item, detail)) }}</div>
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
      <!-- <div class="column full-height flex-center">
        BELUM ADA DATA
      </div> -->
    </div>
  </div>
</template>

<script setup>
// import { useQuasar } from 'quasar'
import { date } from 'quasar'
import { formatDouble } from 'src/modules/formatter'
import { dateFullFormat, humanDate, jamTnpDetik } from 'src/modules/utils'
import { useListCicilanPenjualanStore } from 'src/stores/admin/transaksi/cicilan/list'
import { useAppStore } from 'src/stores/app'
import { computed, ref } from 'vue'

// const search = ref(null)
const store = useListCicilanPenjualanStore()
const app = useAppStore()

const scrollTarget = ref(null)
const infiniteScroll = ref(null)
const hoveredId = ref(null)
// const items = ref([ {}, {}, {}, {}, {}, {}, {},{},{},{},{}, {} ])

const emits = defineEmits(['bawa', 'cicil', 'kembali', 'buka', 'lunas'])

function reload() {
  store.items = []
  store.getList()
  infiniteScroll.value?.reset()
}
function umurNota(item){
  const kirim=new Date(item?.tgl_kirim)
  const skr=new Date()
  const diff=date.getDateDiff(skr,kirim,  'days')
  return diff>0?diff:0
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
function totalRetur(item) {
  let total = 0
  if (item?.header_retur?.length > 0) {
    total = item?.header_retur?.reduce((total, item) => total + item?.total, 0)
  }
  return total
}
function detailRetur(item, detail) {
  let total = 0
  if (item?.header_retur?.length > 0) {
    total = item?.header_retur
      ?.flatMap((m) => m?.detail)
      .filter((f) => f?.kodebarang === detail?.kodebarang)
      ?.reduce((total, item) => total + item?.jumlah, 0)
  }
  return total
}
function subtotal(item, detail) {
  let total = 0
  const subtotal = detail?.subtotal ?? 0
  const diskon = detail?.diskon ?? 0
  if (item?.header_retur?.length > 0) {
    total = item?.header_retur
      ?.flatMap((m) => m?.detail)
      .filter((f) => f?.kodebarang === detail?.kodebarang)
      ?.reduce((total, item) => total + item?.subtotal, 0)
  }
  return subtotal - diskon - total
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
