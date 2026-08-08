<template>
  <div class="column fit">
    <div class="col full-height">
      <div class="full-height q-pa-sm">
        <q-list class="rounded-borders full-height column">
          <div class="col-auto">
            <q-item-label header>
              <div class="row full-width items-center">
                <div class="col-grow">
                  <div class="flex items-center q-gutter-sm">
                    <app-input
                      v-model="storelist.params.q"
                      prepend-icon="search"
                      label="Telusuri"
                      style="min-width: 250px"
                      :debounce="300"
                      :loading="storelist.loading"
                      @update:model-value="
                        (e) => {
                          infiniteScroll?.reset()
                          storelist.getNotaSales()
                        }
                      "
                    />
                    <app-input-date
                      :model="storelist.dateDisplay.from"
                      label="Dari"
                      style="min-width: 150px"
                      outlined
                      :debounce="300"
                      @set-model="
                        (val) => {
                          storelist.dateDisplay.from = val
                        }
                      "
                      @db-model="
                        (val) => {
                          storelist.params.from = val
                        }
                      "
                    />
                    <app-input-date
                      :model="storelist.dateDisplay.to"
                      label="Sampai"
                      style="min-width: 150px"
                      outlined
                      :debounce="300"
                      @set-model="
                        (val) => {
                          storelist.dateDisplay.to = val
                        }
                      "
                      @db-model="
                        (val) => {
                          storelist.params.to = val
                        }
                      "
                    />
                    <app-btn
                      round
                      color="grey-10"
                      class="text-yellow-9"
                      icon="search"
                      @click="refreshList"
                      :loading="storelist.loading"
                    />
                  </div>
                </div>

                <div class="col-auto">
                  <app-btn
                    icon="add"
                    tooltip="Tambah Data"
                    color="grey-10"
                    class="text-yellow-8"
                    @click="emits('add')"
                  />
                </div>
              </div>
            </q-item-label>
            <q-separator inset="item" />
          </div>
          <div ref="scrollTarget" class="col full-height scroll">
            <q-infinite-scroll
              @load="storelist.loadMore"
              ref="infiniteScroll"
              :disable="storelist?.isError || storelist?.meta?.next_page_url === null"
              :scroll-target="scrollTarget"
              :offset="150"
              :initial-index="storelist.params.page"
            >
              <q-intersection
                v-for="(item, i) in storelist.items"
                :key="i"
                transition="fade"
                class="example-item"
              >
                <q-item
                  clickable
                  v-ripple
                  @mouseover="hoveredId = item?.id"
                  @mouseleave="hoveredId = null"
                >
                  <q-item-section avatar>
                    <q-avatar color="yellow-9" text-color="white">{{
                      ambiltanggalaja(item.tgl)
                    }}</q-avatar>
                  </q-item-section>
                  <q-item-section>
                    <q-item-label lines="1"
                      >No. Penctatan Penagihan : {{ item?.notrans }} || Cara Bayar :
                      {{ item?.jenis_pembayaran }} || Keterangan :
                      {{ item?.keterangan }}
                    </q-item-label>
                    <q-item-label caption lines="2">
                      <span class="text-weight-bold">-- {{ item?.sales }}</span>
                      <span
                        class="text-weight-bold"
                        :class="app?.dark ? 'text-yellow-3' : 'text-orange-9'"
                      >
                        || TOTAL Pembayaran Hutang : </span
                      ><q-badge outline :color="app?.dark ? 'yellow-3' : 'orange-9'">{{
                        formatRpDouble(item?.totalhutang)
                      }}</q-badge>
                    </q-item-label>
                  </q-item-section>
                  <q-item-section v-if="hoveredId === item?.id" side>
                    <div class="flex q-gutter-sm">
                      <app-btn-edit-list @click="lihatdetail(item)" />
                      <q-btn
                        v-if="item?.flaging === null"
                        color="teal"
                        icon="vpn_key"
                        size="sm"
                        padding="sm"
                        round
                        dense
                        :loading="store.lock"
                        @click="store.kunci('1', item?.noorder)"
                      >
                        <q-tooltip>Kunci Data</q-tooltip>
                      </q-btn>
                      <q-btn
                        v-if="item?.flaging === null"
                        color="red"
                        icon="delete_forever"
                        size="sm"
                        padding="sm"
                        round
                        dense
                        :loading="store.loadingdeleteall"
                        @click="store.hapusall(item?.id, item?.noorder)"
                      >
                        <q-tooltip>Hapus Data</q-tooltip>
                      </q-btn>
                      <!-- <app-btn-vpn_key @click="lihatCetak(item)" /> -->
                      <!-- <app-btn-cetak @click="lihatCetak(item)" /> -->
                    </div>
                  </q-item-section>
                  <q-item-section v-else side top>
                    <q-item-label caption>{{ humanDate(item?.tgl) }}</q-item-label>
                    <!-- <q-item-label caption>{{ jamTnpDetik(item?.tgl) }}</q-item-label> -->
                  </q-item-section>
                </q-item>
                <q-separator inset="item" />
              </q-intersection>

              <template v-slot:loading>
                <div v-if="!storelist.isError" class="text-center q-my-md">
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
</template>

<script setup>
import { formatRpDouble, humanDate } from 'src/modules/utils'
import { useAdminFormTransaksiNotaSalesStore } from 'src/stores/admin/transaksi/notasales/form'
import { useAdminListTransaksiNotaSalesstore } from 'src/stores/admin/transaksi/notasales/list'
import { useAppStore } from 'src/stores/app'
import { computed, ref } from 'vue'

const hoveredId = ref(null)
const storelist = useAdminListTransaksiNotaSalesstore()
const storeform = useAdminFormTransaksiNotaSalesStore()
const scrollTarget = ref(null)
const infiniteScroll = ref(null)
const app = useAppStore()

const emits = defineEmits(['add', 'edit'])

const lihatdetail = (item) => {
  emits('edit', item)
  storeform.itemCetak = item
  // console.log('itemcetak xx', storeform.itemCetak)
}

const refreshList = async () => {
  // Reset infinite scroll
  infiniteScroll.value.reset()
  await storelist.getNotaSales()
}

function ambiltanggalaja(val) {
  // Periksa apakah val adalah string (format ISO atau format lain)
  if (typeof val === 'string') {
    // Konversi string ke objek Date
    const dateObj = new Date(val)
    // Periksa apakah konversi berhasil (valid date)
    if (!isNaN(dateObj.getTime())) {
      return dateObj.getDate()
    }
  }

  // Jika val sudah berupa objek Date
  if (val instanceof Date && !isNaN(val.getTime())) {
    return val.getDate()
  }

  // Fallback: jika format tidak dikenali, tampilkan tanggal hari ini
  console.warn('Format tanggal tidak valid:', val)
  return new Date().getDate()
}

// eslint-disable-next-line no-unused-vars
const next = computed(() => {
  let page = false

  if (storelist.meta?.next_page_url) {
    page = true
  }

  return page
})

defineExpose({ lihatdetail })
</script>
<style lang="scss" scoped>
.example-item {
  height: 56px;
}
</style>
