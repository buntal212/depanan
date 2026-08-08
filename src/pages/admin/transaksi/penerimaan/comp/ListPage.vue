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
                      v-model="storePenerimaanH.params.q"
                      prepend-icon="search"
                      label="Telusuri"
                      style="min-width: 250px"
                      :debounce="300"
                      @update:model-value="
                        (e) => {
                          infiniteScroll.reset()
                          storePenerimaanH.getList()
                        }
                      "
                    />
                    <app-input-date
                      :model="storePenerimaanH.dateDisplay.from"
                      label="Dari"
                      style="min-width: 150px"
                      outlined
                      :debounce="300"
                      @set-model="
                        (val) => {
                          storePenerimaanH.dateDisplay.from = val
                        }
                      "
                      @db-model="
                        (val) => {
                          storePenerimaanH.params.from = val
                        }
                      "
                    />
                    <app-input-date
                      :model="storePenerimaanH.dateDisplay.to"
                      label="Sampai"
                      style="min-width: 150px"
                      outlined
                      :debounce="300"
                      @set-model="
                        (val) => {
                          storePenerimaanH.dateDisplay.to = val
                        }
                      "
                      @db-model="
                        (val) => {
                          storePenerimaanH.params.to = val
                        }
                      "
                    />
                    <app-btn
                      round
                      color="grey-10"
                      class="text-yellow-9"
                      icon="search"
                      @click="refreshList"
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
              @load="storePenerimaanH.loadMore"
              ref="infiniteScroll"
              :disable="storePenerimaanH?.isError || storePenerimaanH?.meta?.next_page_url === null"
              :scroll-target="scrollTarget"
              :offset="150"
              :initial-index="storePenerimaanH.params.page"
            >
              <q-intersection
                v-for="(item, x) in lists"
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
                  <q-item-section avatar>
                    <q-avatar color="yellow-9" text-color="white">{{
                      ambiltanggalaja(item.tgl)
                    }}</q-avatar>
                  </q-item-section>
                  <q-item-section>
                    <q-item-label lines="1">
                      <span class="text-weight-bold"
                        >No. Penerimaan : {{ item?.nopenerimaan }}</span
                      >
                      <span class="text-weight-bold">
                        || Supplier : {{ item?.suplier }} || No. Faktur : {{ item?.nofaktur }}</span
                      >
                    </q-item-label>
                    <q-item-label caption lines="2">
                      <span class="text-weight-bold"
                        ><q-badge rounded outline :color="app?.dark ? 'grey' : 'grey-9'">
                          No. Order : {{ item?.noorder }}
                        </q-badge></span
                      >
                      <span class="text-weight-bold" v-if="item?.jenis_pembayaran === 'Cash'">
                        || Jenis Pembayaran : {{ item?.jenis_pembayaran }}</span
                      >
                      <span class="text-weight-bold" v-if="item?.jenis_pembayaran !== 'Cash'">
                        || Jenis Pembayaran : {{ item?.jenis_pembayaran }} || Tgl Jatuh Tempo :
                        {{ humanDate(item?.tgljatuhtempo) }} ({{
                          item?.jumlahharitempo
                        }}
                        hari)</span
                      >
                      <span
                        class="text-weight-bold"
                        :class="app?.dark ? 'text-yellow-3' : 'text-orange-9'"
                      >
                        || TOTAL BARANG DATANG : {{ formatRpDouble(item?.total) }}</span
                      >
                    </q-item-label>
                  </q-item-section>

                  <q-item-section v-if="hoveredId === item?.id" side>
                    <div class="flex q-gutter-sm">
                      <app-btn-edit-list @click="lihatdetail(item)" />
                      <q-btn
                        v-if="item?.kunci !== '1'"
                        color="red"
                        icon="delete_forever"
                        size="sm"
                        padding="sm"
                        round
                        dense
                        :loading="storePenerimaanH.loadingdeleteall"
                        @click="hapusall(item?.id, item?.nopenerimaan, item?.noorder)"
                      >
                        <q-tooltip>Hapus Data</q-tooltip>
                      </q-btn>
                    </div>
                  </q-item-section>
                  <q-item-section v-else side top>
                    <q-item-label caption>{{ humanDate(item?.tgl) }}</q-item-label>
                    <q-item-label caption>{{ jamTnpDetik(item?.tgl) }}</q-item-label>
                  </q-item-section>
                </q-item>
                <q-separator inset="item" />
              </q-intersection>

              <template v-slot:loading>
                <div v-if="!storePenerimaanH.isError" class="text-center q-my-md">
                  <q-spinner-dots color="yellow-9" size="40px" />
                </div>
              </template>
            </q-infinite-scroll>
          </div>
        </q-list>
      </div>
      <!-- <div class="column full-height flex-center">BELUM ADA DATA</div> -->
    </div>
  </div>
</template>

<script setup>
import { useQuasar } from 'quasar'
import { formatRpDouble, humanDate, jamTnpDetik } from 'src/modules/formatter'
import { useAdminListTransaksiPenerimaanBarangStore } from 'src/stores/admin/transaksi/penerimaan/list'
import { useAppStore } from 'src/stores/app'
import { computed, ref } from 'vue'

// const search = ref(null)
const storePenerimaanH = useAdminListTransaksiPenerimaanBarangStore()

const scrollTarget = ref(null)
const infiniteScroll = ref(null)
const hoveredId = ref(null)
const app = useAppStore()
const emits = defineEmits(['add', 'edit'])
const $q = useQuasar()

// onMounted(() => {
//   Promise.all([storeOrderH.getList()])
// })

// function lihatdetail(item) {
//   emits('edit', item)
// }

const lists = computed(() => {
  const arr = storePenerimaanH.items
  //console.log('arr', arr)
  return arr?.sort((a, b) => {
    return b.id - a.id
  })
})

const lihatdetail = (item) => {
  emits('edit', item)
}

const refreshList = async () => {
  // Reset infinite scroll
  infiniteScroll.value.reset()
  await storePenerimaanH.getList()
}

// function lihatdetail(val) {
//   storeOrderH.getallbynoorder(val)
// }

// eslint-disable-next-line no-unused-vars
const next = computed(() => {
  let page = false

  if (storePenerimaanH.meta?.next_page_url) {
    page = true
  }

  return page
})

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

function hapusall(id, nopenerimaan, noorder) {
  $q.dialog({
    dark: true,
    title: 'Peringatan',
    message: 'Apakah Data ini akan dihapus?',
    cancel: true,
    persistent: true,
  })
    .onOk(() => {
      // console.log('OK')
      storePenerimaanH.hapusall(id, nopenerimaan, noorder)
    })
    .onCancel(() => {
      // console.log('Cancel')
    })
    .onDismiss(() => {
      // console.log('I am triggered on both OK and Cancel')
    })
}
defineExpose({ lihatdetail })

// function loadMore(index, done) {
//   store.params.page = index
//   if (store.params.page === 1) {
//     store.getList()
//     done(false)
//     console.log('index',index);
//   } else {
//     console.log('else',index);
//     if (store.meta?.next_page_url) {
//       store.getList()
//     } else {
//       done(true)
//     }
//   }

//   console.log('load more',next.value);

// }
</script>
<style lang="scss" scoped>
.example-item {
  height: 56px;
}
</style>
