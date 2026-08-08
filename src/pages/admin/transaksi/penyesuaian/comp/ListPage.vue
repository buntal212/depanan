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
                        }
                      "
                    />
                  </div>
                </div>

                <div class="col-auto">
                  <app-btn
                    icon="add"
                    tooltip="Tambah Data"
                    class="text-yellow-8"
                    color="grey-10"
                    @click="emits('add')"
                  />
                </div>
              </div>
            </q-item-label>
            <q-separator />
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
                v-for="(item, i) in store.items"
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
                  <!-- <q-item-section avatar>
                    <q-avatar color="teal" text-color="white">{{ item.namabarang[0] }}</q-avatar>
                  </q-item-section> -->
                  <q-item-section>
                    <q-item-label lines="1">
                      <span class="text-weight-bold"> {{ item?.nopenyesuaian }} ||</span>
                      <span class="text-yellow-7">
                        Nama Barang : {{ item?.namabarang }} {{ item?.motif }}</span
                      >
                    </q-item-label>
                    <q-item-label caption lines="2">
                      <span class="text-weight-bold"
                        ><q-badge class="q-pa-xs" rounded outline>
                          Jumlah {{ item?.keterangan }} ({{ item?.jumlah_k }} {{ item?.satuan_k }})
                        </q-badge></span
                      >
                    </q-item-label>
                  </q-item-section>
                  <!-- <q-item-section v-if="hoveredId === item?.id" side>
                    <div class="flex q-gutter-sm">
                      <app-btn-edit-list @click="edit(item)" />
                    </div>
                  </q-item-section> -->
                  <q-item-section side top>
                    <q-item-label caption>{{ humanDate(item?.created_at) }}</q-item-label>
                    <q-item-label caption>{{ jamTnpDetik(item?.created_at) }}</q-item-label>
                  </q-item-section>
                </q-item>
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
    </div>
  </div>
</template>
<script setup>
import { humanDate, jamTnpDetik } from 'src/modules/utils'
import { useListTransaksiPenyesuaianStore } from 'src/stores/admin/transaksi/penyesuaian/list'
import { computed, onMounted, ref } from 'vue'

const store = useListTransaksiPenyesuaianStore()
const scrollTarget = ref(null)
const infiniteScroll = ref(null)
const hoveredId = ref(null)

const emits = defineEmits(['add', 'edit'])
onMounted(() => {
  store.getList()
})
// const edit = (item) => {
//   console.log('item', item)
//   emits('edit', item)
// }

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
  height: 56px;
}
</style>
