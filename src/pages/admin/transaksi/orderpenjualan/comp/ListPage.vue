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
                        refreshList
                      "
                    />
                    <q-input
                      v-model="store.params.tanggal_mulai"
                      class="q-ml-sm"
                      style="width: 165px"
                      dense
                      outlined
                      readonly
                      clearable
                      label="Dari tanggal"
                      @update:model-value="refreshList"
                    >
                      <template #append>
                        <q-icon name="event" class="cursor-pointer">
                          <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                            <q-date
                              v-model="store.params.tanggal_mulai"
                              mask="YYYY-MM-DD"
                              @update:model-value="refreshList"
                            />
                          </q-popup-proxy>
                        </q-icon>
                      </template>
                    </q-input>
                    <q-input
                      v-model="store.params.tanggal_selesai"
                      class="q-ml-sm"
                      style="width: 165px"
                      dense
                      outlined
                      readonly
                      clearable
                      label="Sampai tanggal"
                      @update:model-value="refreshList"
                    >
                      <template #append>
                        <q-icon name="event" class="cursor-pointer">
                          <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                            <q-date
                              v-model="store.params.tanggal_selesai"
                              mask="YYYY-MM-DD"
                              @update:model-value="refreshList"
                            />
                          </q-popup-proxy>
                        </q-icon>
                      </template>
                    </q-input>
                    <q-select
                      v-model="store.params.status_order"
                      class="q-ml-sm"
                      style="width: 190px"
                      dense
                      outlined
                      clearable
                      emit-value
                      map-options
                      label="Status order"
                      :options="statusOptions"
                      @update:model-value="refreshList"
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
            <q-separator />
          </div>

          <div ref="scrollTarget" class="col full-height scroll">
            <q-infinite-scroll
              @load="store.loadMore"
              ref="infiniteScroll"
              :disable="store?.isError || store?.meta?.next_page_url === null"
              :scroll-target="scrollTarget"
              :offset="200"
              :initial-index="store.params.page"
              class="q-py-sm"
            >
              <template v-if="store.items" #default>
                <q-intersection
                  v-for="(item, i) in store.items"
                  :key="i"
                  transition="fade"
                  class="example-item"
                >
                  <q-card
                    flat
                    class="cursor-pointer q-pa-sm q-mb-sm"
                    @click="emits('edit', item)"
                    @mouseover="hoveredId = i"
                    @mouseleave="hoveredId = null"
                    :class="hoveredId === i ? 'bg-grey-9 text-white' : ''"
                    style="transition: all 0.2s ease; border-radius: 10px"
                  >
                    <!-- Order Header -->
                    <q-card-section class="q-pb-sm flex justify-between items-center q-pa-sm">
                      <div>
                        <div
                          class="text-body2 text-weight-medium"
                          :class="$q.dark.isActive ? 'text-grey-5' : 'text-dark'"
                        >
                          Order # {{ item?.noorder }}
                        </div>
                        <div class="text-caption">
                          Tanggal : {{ humanDate(item?.tglorder) }} Jam :
                          {{ jamTnpDetik(item?.tglorder) }}
                        </div>
                        <div class="text-caption">
                          Pelanggan: {{ item?.pelanggan?.nama || '-' }} · Sales:
                          {{ item?.sales?.nama || '-' }}
                        </div>
                      </div>
                      <BadgeStatusOrder :status="item?.status_order" />
                    </q-card-section>
                    <q-separator />

                    <!-- Order Items -->
                    <q-card-section>
                      <div class="flex justify-between items-center full-width">
                        <div class="row items-center q-col-gutter-md">
                          <!-- Thumbnails -->
                          <div class="flex items-center" style="margin-left: 5px">
                            <div class="flex avatar-wrapper avatar-group">
                              <q-img
                                v-for="(img, index) in item.rincians?.length"
                                :key="index"
                                src="/images/No-Image.svg"
                                class="avatar-img"
                                :class="{ 'ml-negative': index !== 0 }"
                                :style="`border: 2px solid ${$q.dark.isActive ? 'white' : 'gray'};`"
                              />
                            </div>
                          </div>

                          <div class="col">
                            <div class="row items-center q-gutter-xs text-body">
                              <q-icon name="shopping_cart"></q-icon>
                              <span>{{ item?.rincians?.length }} Rincian item</span>
                            </div>
                            <div class="text-base text-weight-bold text-grey-7">
                              Total : Rp {{ formatRp(item.total_harga) }}
                            </div>
                          </div>
                        </div>
                        <app-btn-edit-list
                          @click.stop="emits('edit', item)"
                          tooltip="Lihat detail order"
                        />
                      </div>
                    </q-card-section>
                  </q-card>
                </q-intersection>
              </template>

              <template v-else #default>
                <div class="col full-height">
                  <AppEmptyList
                    empty-title="Data Order Penjualan tidak ditemukan"
                    empty-description="Harap menggunakan Filter atau Pencarian Data yang valid"
                  />
                </div>
              </template>

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
import { ref, onBeforeMount, defineAsyncComponent } from 'vue'
import { useAdminOrderPenjualanStore } from 'src/stores/admin/transaksi/orderpenjualan/list'
import { useQuasar } from 'quasar'
import { humanDate, jamTnpDetik, formatRp } from 'src/modules/formatter'

const BadgeStatusOrder = defineAsyncComponent(() => import('./BadgeStatusOrder.vue'))

const store = useAdminOrderPenjualanStore()
const { getList } = store
const emits = defineEmits(['add', 'edit'])
const $q = useQuasar()

const scrollTarget = ref(null)
const infiniteScroll = ref(null)
const hoveredId = ref(null)
const statusOptions = [
  { label: 'Semua status', value: null },
  { label: 'Draf', value: '1' },
  { label: 'Diproses', value: '2' },
  { label: 'Disetujui', value: '3' },
  { label: 'Tunggu Pengiriman', value: '4' },
  { label: 'Dikirim', value: '5' },
  { label: 'Selesai', value: '6' },
  { label: 'Batal Order', value: '9' },
]

const refreshList = () => {
  infiniteScroll.value?.reset()
  getList()
}

onBeforeMount(() => {
  getList()
})
</script>

<style lang="scss" scoped>
.avatar-wrapper {
  display: inline-flex;
  align-items: center;
}

.avatar-img {
  width: 40px;
  height: 40px;
  border-radius: 9999px;
  object-fit: cover;
  transition: transform 0.2s ease;
}

.avatar-img:hover {
  transform: scale(1.1);
  z-index: 1 !important;
}
.ml-negative {
  margin-left: -30px;
}

.example-item {
  height: 155px;
}
</style>
