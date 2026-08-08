<template>
  <div class="column fit">
    <div class="col full-height">
      <div class="full-height q-pa-sm">
        <q-list class="rounded-borders full-height column">
          <div class="col-auto">
            <q-item-label header>
              <div class="row full-width items-center">
                <div class="col-grow">
                  <div class="flex items-center">
                    <app-input
                      v-model="store.params.q"
                      prepend-icon="search"
                      label="Telusuri"
                      style="min-width: 350px"
                      :debounce="300"
                      @update:model-value="
                        (e) => {
                          infiniteScroll.reset()
                          store.getList()
                        }
                      "
                    />
                    <div class="q-pl-sm" />
                    <q-btn-dropdown
                      class="text-yellow-8"
                      color="grey-10"
                      rounded
                      fab-mini
                      glossy
                      dropdown-icon="filter_alt"
                      menu-self="bottom start"
                      transition-show="scale"
                      transition-hide="scale"
                    >
                      <q-list class="justify-center q-pr-sm">
                        <q-item
                          v-for="item in store.filterstok"
                          :key="item.value"
                          clickable
                          v-close-popup
                          @click="filter(item)"
                        >
                          <q-item-section>
                            <q-item-label>{{ item.label }}</q-item-label>
                          </q-item-section>
                        </q-item>
                      </q-list>
                    </q-btn-dropdown>
                    <div class="q-pl-sm" />
                    <div>
                      <q-item-label>{{ label }}</q-item-label>
                    </div>
                  </div>
                </div>

                <div class="col-auto">
                  <app-btn
                    icon="add"
                    class="text-yellow-8"
                    tooltip="Tambah Data"
                    color="grey-10"
                    @click="emits('add')"
                  />
                </div>
              </div>
            </q-item-label>
            <q-separator inset="item" />
          </div>

          <div ref="scrollTarget" class="col full-height scroll">
            <q-infinite-scroll
              @load="store.loadMore"
              ref="infiniteScroll"
              :disable="store?.isError || store?.meta?.next_page_url === null"
              :scroll-target="scrollTarget"
              :offset="150"
              :initial-index="1"
            >
              <q-intersection
                v-for="item in store.items"
                :key="item.kodebarang"
                transition="fade"
                class="example-item"
              >
                <q-item
                  clickable
                  v-ripple
                  @mouseover="hoveredId = item?.id"
                  @mouseleave="hoveredId = null"
                  :class="{ 'bg-grey-8 text-white': hoveredId === item?.id }"
                >
                  <q-item-section avatar>
                    <q-avatar>
                      <q-img
                        v-if="item.image"
                        :src="getImageUrl(item.image)"
                        @click="imgClick(getImageUrl(item.image))"
                      />
                    </q-avatar>
                  </q-item-section>
                  <q-item-section>
                    <q-item-label lines="1"
                      >{{ item?.namabarang }}
                      <q-badge class="bg-grey-8" style="font-size: smaller"
                        >Keterangan : per {{ item?.satuan_b }}
                        <template v-if="item?.satuan_b !== item?.satuan_k">
                          isi {{ item?.isi }} {{ item?.satuan_k }}
                        </template>
                      </q-badge>
                    </q-item-label>
                    <q-item-label caption lines="2">
                      <span class="text-weight-bold"
                        >Kategori: {{ item?.kategori }}
                        <template v-if="item?.jeniskeramik">({{ item?.jeniskeramik }}) </template>
                      </span>
                      |
                      <q-badge
                        class="text-weight-bold"
                        outline
                        :class="
                          app?.dark
                            ? {
                                'text-yellow-8 q-px-sm q-py-xs rounded':
                                  item?.stok_kecil > item?.minim_stok,
                                'text-red q-px-sm q-py-xs rounded':
                                  store.params.minim_stok === 1 ||
                                  item?.stok_kecil <= item?.minim_stok,
                              }
                            : {
                                'bg-yellow-10 q-px-sm q-py-xs rounded':
                                  item?.stok_kecil > item?.minim_stok,
                                'bg-red-9 q-px-sm q-py-xs rounded':
                                  store.params.minim_stok === 1 ||
                                  item?.stok_kecil <= item?.minim_stok,
                              }
                        "
                        >Stok Sekarang :
                        <span
                          v-if="Math.floor(item.stok_kecil / (item?.isi > 0 ? item?.isi : 1)) >= 0"
                        >
                          {{ Math.floor(item.stok_kecil / (item?.isi > 0 ? item?.isi : 1)) }}
                          {{ item?.satuan_b }}
                        </span>
                        <span
                          class="q-px-xs"
                          v-if="
                            Math.floor(item.stok_kecil / (item?.isi > 0 ? item?.isi : 1)) > 0 &&
                            item?.stok_kecil % (item?.isi > 0 ? item?.isi : 1) > 0
                          "
                        >
                          lebih
                        </span>
                        <span v-if="item?.stok_kecil % (item?.isi > 0 ? item?.isi : 1) > 0">
                          {{ item?.stok_kecil % (item?.isi > 0 ? item?.isi : 1) }}
                          {{ item?.satuan_k }}
                        </span>
                      </q-badge>
                      <span class="q-px-sm">
                        <q-badge
                          class="text-weight-bold"
                          outline
                          :class="
                            app?.dark
                              ? {
                                  'text-yellow-8 q-px-sm q-py-xs rounded':
                                    item?.stok_kecil > item?.minim_stok,
                                  'text-red q-px-sm q-py-xs rounded':
                                    store.params.minim_stok === 1 ||
                                    item?.stok_kecil <= item?.minim_stok,
                                }
                              : {
                                  'bg-yellow-10 q-px-sm q-py-xs rounded':
                                    item?.stok_kecil > item?.minim_stok,
                                  'bg-red-9 q-px-sm q-py-xs rounded':
                                    store.params.minim_stok === 1 ||
                                    item?.stok_kecil <= item?.minim_stok,
                                }
                          "
                        >
                          atau ({{ item?.stok_kecil }} {{ item?.satuan_k }})
                        </q-badge>
                      </span>
                    </q-item-label>
                  </q-item-section>
                  <q-item-section v-if="hoveredId === item?.id" side>
                    <div class="flex q-gutter-sm">
                      <q-btn
                        icon="assignment_turned_in"
                        color="teal-7"
                        round
                        dense
                        @click="kartuStok(item)"
                        ><q-tooltip>Kartu Stok</q-tooltip></q-btn
                      >
                      <app-btn-edit-list @click="edit(item)" />
                      <app-btn-delete-list @click="del(item)" />
                    </div>
                  </q-item-section>
                  <q-item-section v-else side top>
                    <q-item-label caption>{{ humanDate(item?.created_at) }}</q-item-label>
                    <q-item-label caption>{{ jamTnpDetik(item?.created_at) }}</q-item-label>
                  </q-item-section>
                </q-item>
                <q-separator inset="item" />
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
  <DialogImage ref="dialogImage" />
  <DialogKartu v-model="store.dialogKartu" />
</template>

<script setup>
import { date, useQuasar } from 'quasar'
import { humanDate, jamTnpDetik } from 'src/modules/utils'
// import { useAdminFormMasterBarangStore } from 'src/stores/admin/master/barang/form'
import { useAdminMasterBarangStore } from 'src/stores/admin/master/barang/list'
import { computed, defineAsyncComponent, onBeforeMount, ref, shallowRef } from 'vue'
import { pathImg } from 'src/boot/axios'
import DialogImage from './DialogImage.vue'
import { useAppStore } from 'src/stores/app'
const DialogKartu = shallowRef(defineAsyncComponent(() => import('./DialogKartu.vue')))

// const search = ref(null)
const store = useAdminMasterBarangStore()
const app = useAppStore()

const scrollTarget = ref(null)
const infiniteScroll = ref(null)
const hoveredId = ref(null)
const label = ref('All Stock')
// const items = ref([ {}, {}, {}, {}, {}, {}, {},{},{},{},{}, {} ])

const emits = defineEmits(['add', 'edit'])
const dialogImage = ref(null)

const $q = useQuasar()
onBeforeMount(() => {
  store.params.minim_stok = 0
  store.params.x = null
  store.params.bulan = date.formatDate(Date.now(), 'MM')
  store.params.tahun = date.formatDate(Date.now(), 'YYYY')
  // store.getList()
  // Promise.all([
  //   store.getList(null)
  // ])
})
// Fungsi untuk mendapatkan URL gambar
const getImageUrl = (image) => {
  if (image instanceof File || image instanceof Blob) {
    return URL.createObjectURL(image)
  }
  return pathImg + image // Jika gambar sudah ada di server
}
const imgClick = (val) => {
  console.log('img', val)
  // store.image = val
  // store.setExpand()
  dialogImage.value.openDialog(val)
}

const edit = (item) => {
  console.log('ediitx', item.rincians)
  emits('edit', item)
}
const del = (item) => {
  $q.dialog({
    title: 'Peringatan',
    message: 'Apakah Data ini akan dihapus?',
    cancel: true,
    // persistent: true
  })
    .onOk(() => {
      // const params = { id: selected.value }
      store.deleteItem(item?.id)
    })
    .onCancel(() => {
      console.log('Cancel')
    })
    .onDismiss(() => {
      // console.log('I am triggered on both OK and Cancel')
    })
}

// eslint-disable-next-line no-unused-vars
const next = computed(() => {
  let page = false

  if (store.meta?.next_page_url) {
    page = true
  }

  return page
})

const filter = (val) => {
  store.params.minim_stok = val.value
  label.value = val.label
  infiniteScroll.value.reset()
  store.getList()
}

const kartuStok = (item) => {
  store.kartuStok = item
  store.selectedKodebarang = item?.kodebarang
  store.kartuStok.transaksi = store.cariTotalArray(item?.transaksi)
  store.dialogKartu = true
  console.log('barang di select', store.selectedKodebarang)
}
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
