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
                        }
                      "
                    />
                    <app-btn
                      round
                      color="grey-10"
                      class="text-yellow-9"
                      icon="search"
                      @click="refreshList"
                      :loading="store.loading"
                    />
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
                  <q-item-section avatar>
                    <q-avatar color="yellow-9" text-color="white">{{ i + 1 }}</q-avatar>
                  </q-item-section>
                  <q-item-section>
                    <q-item-label lines="1" class="row"
                      ><span class="col-4 text-weight-bold"
                        >{{ item?.notrans }}
                        <span class="text-grey-7"> ({{ humanDate(item?.tgl) }}) </span>
                      </span>
                      <span class="col-2 text-weight-bold text-right">
                        {{ formatDenganRp(item?.total) }}
                      </span>
                    </q-item-label>
                    <q-item-label caption lines="2">
                      <span class="text-weight-bold">Keterangan : {{ item?.keterangan }} </span>
                    </q-item-label>
                  </q-item-section>
                  <q-item-section v-if="hoveredId === item?.id" side>
                    <div class="flex q-gutter-sm">
                      <app-btn-edit-list @click="edit(item)" />
                      <!-- <app-btn-delete-list @click="del(item)" /> -->
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
</template>
<script setup>
import { formatDenganRp, humanDate, jamTnpDetik } from 'src/modules/utils'
import { useFormTransaksiBebanStore } from 'src/stores/admin/transaksi/bebanpengeluaran/form'
import { useListTransaksiBebanStore } from 'src/stores/admin/transaksi/bebanpengeluaran/list'
import { computed, onBeforeMount, ref } from 'vue'

const store = useListTransaksiBebanStore()
const formdata = useFormTransaksiBebanStore()
const scrollTarget = ref(null)
const infiniteScroll = ref(null)
const hoveredId = ref(null)
// const items = ref([ {}, {}, {}, {}, {}, {}, {},{},{},{},{}, {} ])

const emits = defineEmits(['add', 'edit'])

onBeforeMount(() => {
  Promise.all([store.getList(null)])
})
const edit = (item) => {
  emits('edit', item)
  console.log('edit', item)
  formdata.rincian = item.rincian
  formdata.form.notrans = item.notrans
}

// eslint-disable-next-line no-unused-vars
const next = computed(() => {
  let page = false

  if (store.meta?.next_page_url) {
    page = true
  }

  return page
})

const refreshList = async () => {
  // Reset infinite scroll
  console.log('refresh', infiniteScroll.value.disable)
  infiniteScroll.value.reset() // Reset infinite scroll
  await store.getList()
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
