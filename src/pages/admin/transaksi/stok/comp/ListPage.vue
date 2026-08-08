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
                      style="min-width: 250px"
                      :debounce="300"
                      @update:model-value="
                        (e) => {
                          infiniteScroll.reset()
                          store.getList()
                          // storePenerimaanH.getList()
                        }
                      "
                    />
                  </div>
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
              :initial-index="store.params.page"
            >
              <q-intersection
                v-for="(item, x) in store.items"
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
                    <q-avatar color="yellow-8" text-color="white">{{ item?.brand[0] }}</q-avatar>
                  </q-item-section>
                  <q-item-section>
                    <q-item-label lines="1">
                      <span class="text-weight-bold"
                        >Nama Barang : {{ item?.namabarang }} Motif : {{ item?.motif }}</span
                      >
                      <span class="text-grey-8"> ({{ item?.kdbarang }})</span>
                      <span class="text-weight-bold">
                        || Keterangan : 1 {{ item?.satuan_b }} ({{ item?.isi }}
                        {{ item?.satuan_k }})</span
                      >
                    </q-item-label>
                    <q-item-label caption lines="2">
                      <span class="text-weight-bold"
                        ><q-badge rounded outline :color="app?.dark ? 'grey-5' : 'grey-8'">
                          No. Penerimaan : {{ item?.nopenerimaan }}
                        </q-badge></span
                      >
                      <span> || </span>
                      <span
                        class="text-weight-bold"
                        :class="app?.dark ? 'text-yellow-3' : 'text-orange-9'"
                      >
                        Jumlah :
                        <span v-if="Math.floor(item.jumlah_k / (item?.isi > 0 ? item?.isi : 1)) > 0"
                          >{{ Math.floor(item.jumlah_k / (item?.isi > 0 ? item?.isi : 1)) }}
                          {{ item?.satuan_b }}</span
                        >
                        <span
                          v-if="
                            Math.floor(item.jumlah_k / (item?.isi > 0 ? item?.isi : 1)) > 0 &&
                            item?.jumlah_k % (item?.isi > 0 ? item?.isi : 1) > 0
                          "
                        >
                          lebih
                        </span>
                        <span v-if="item?.jumlah_k % (item?.isi > 0 ? item?.isi : 1) > 0"
                          >{{ item?.jumlah_k % (item?.isi > 0 ? item?.isi : 1) }}
                          {{ item?.satuan_k }}</span
                        >
                      </span>
                      <span
                        v-if="item?.isi > 1"
                        :class="app?.dark ? 'text-yellow-3' : 'text-orange-9'"
                      >
                        ({{ item?.jumlah_k }} {{ item?.satuan_k }})
                      </span>
                      <span> || </span>
                      <span
                        class="text-weight-bold"
                        :class="app?.dark ? 'text-green-3' : 'text-teal-9'"
                      >
                        Harga Satuan Kecil : {{ formatRpDouble(item?.harga_beli_k) }} per({{
                          item?.satuan_k
                        }})</span
                      >
                      <span
                        class="text-weight-bold"
                        :class="app?.dark ? 'text-green-3' : 'text-teal-9'"
                      >
                        || Harga Satuan Besar : {{ formatRpDouble(item?.harga_beli_b) }} per({{
                          item?.satuan_b
                        }})</span
                      >
                    </q-item-label>
                  </q-item-section>
                  <!-- <q-item-section v-if="hoveredId === item?.id" side>
                    <div class="flex q-gutter-sm">
                      <app-btn-edit-list @click="lihatdetail(item)" />
                      <app-btn-delete-list />
                    </div>
                  </q-item-section>
                  <q-item-section v-else side top>
                    <q-item-label caption>{{ humanDate(item?.tgl) }}</q-item-label>
                    <q-item-label caption>{{ jamTnpDetik(item?.tgl) }}</q-item-label>
                  </q-item-section> -->
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
      <!-- <div class="column full-height flex-center">BELUM ADA DATA</div> -->
    </div>
  </div>
</template>

<script setup>
import { formatRpDouble } from 'src/modules/formatter'
import { useAdminListTransaksiStokBarangStore } from 'src/stores/admin/transaksi/stok/list'
import { useAppStore } from 'src/stores/app'
import { computed, ref } from 'vue'

// const search = ref(null)
const store = useAdminListTransaksiStokBarangStore()
const app = useAppStore()
const scrollTarget = ref(null)
const infiniteScroll = ref(null)
const hoveredId = ref(null)

const emits = defineEmits(['add', 'edit'])

// onMounted(() => {
//   Promise.all([storeOrderH.getList()])
// })

// function lihatdetail(item) {
//   emits('edit', item)
// }

const lihatdetail = (item) => {
  emits('edit', item)
}

// function lihatdetail(val) {
//   storeOrderH.getallbynoorder(val)
// }

// eslint-disable-next-line no-unused-vars
const next = computed(() => {
  let page = false

  if (store.meta?.next_page_url) {
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
