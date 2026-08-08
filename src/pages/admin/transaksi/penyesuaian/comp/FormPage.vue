<template>
  <div class="fit column">
    <div class="col-auto">
      <div class="row items-center q-pa-lg">
        <div class="col-grow">
          <app-btn-back @click="emits('back')" />
        </div>
        <div class="col-auto">
          <!-- <app-btn :dense="false" label="Simpan" color="primary" /> -->
        </div>
      </div>
    </div>
    <div class="col full-height q-px-lg q-pb-lg">
      <q-card flat class="col full-height">
        <q-form class="full-height" @submit="onSubmit">
          <q-card-section class="full-height q-pa-lg scroll">
            <div class="row q-col-gutter-md justify-around">
              <div :class="`col-${isMobile ? 12 : 10}`" class="row q-col-gutter-md justify-center">
                <div class="full-width q-gutter-md">
                  <app-input-date
                    :model="store.dateDisplay.tgl"
                    class="col-12"
                    label="Tanggal"
                    outlined
                    @set-model="
                      (val) => {
                        store.dateDisplay.tgl = val
                      }
                    "
                    @db-model="
                      (val) => {
                        store.form.tgl = val
                      }
                    "
                  />
                  <div class="row q-gutter-x-md content-center">
                    <div>
                      <app-btn
                        icon="add"
                        class="text-yellow-8"
                        color="grey-10"
                        tooltip="Pilih Barang"
                        @click="pilihbarang"
                      />
                    </div>

                    <app-input
                      class="col"
                      readonly
                      v-model="store.form.namabarang"
                      label="Pilih Barang (Klik Tombol Tambah)"
                      :valid="{ required: false }"
                    />
                    <app-input class="col-2" readonly v-model="store.form.motif" label="Seri" />
                  </div>

                  <app-input
                    class="col-12"
                    readonly
                    v-model="store.form.stoksekarang"
                    label="Stok Sebelum Penyesuaian"
                  />

                  <app-select
                    class="col-12"
                    v-model="store.form.keterangan"
                    label="Bertambah / Berkurang"
                    :options="store.tambahkurang"
                    option-label="label"
                    option-value="label"
                    @update:model-value="store.jumlahBaru"
                  />
                  <app-input
                    class="col-12"
                    v-model="store.form.jumlah_k"
                    label="Jumlah Penyesuaian"
                    :valid="{ required: false }"
                    @update:model-value="store.updateJumlahK"
                  />
                  <app-input
                    class="col-12"
                    readonly
                    v-model="store.form.jumlahakhir"
                    label="Stok Akhir"
                    @update:model-value="store.updateStokAkhir"
                  />
                  <div class="col-12">
                    <q-separator class="q-my-md" />
                    <app-btn
                      :loading="store.loading"
                      type="submit"
                      :dense="false"
                      label="Simpan"
                      color="grey-10"
                      class="text-yellow-9"
                    />
                  </div>
                </div>
              </div>
            </div>
          </q-card-section>
        </q-form>
      </q-card>
    </div>
  </div>

  <dialog-barang v-model="store.dialogBarang" />
</template>

<script setup>
import { useQuasar } from 'quasar'
import { useFormTransaksiPenyesuaianStore } from 'src/stores/admin/transaksi/penyesuaian/form'
import { computed, defineAsyncComponent, onMounted } from 'vue'

const DialogBarang = defineAsyncComponent(() => import('./DialogBarang.vue'))

const emits = defineEmits(['back'])
const $q = useQuasar()
const isMobile = computed(() => {
  return $q.screen.lt.sm // Quasar screen size helper
})

const store = useFormTransaksiPenyesuaianStore()

const props = defineProps({
  data: {
    type: Object,
    default: null,
  },
})

function pilihbarang() {
  store.dialogBarang = true
}

onMounted(() => {
  store.initReset(props.data)
})

function onSubmit() {
  console.log('submit form', store.form)
  if (store.form.tgl === null || store.form.kdbarang === null || store.form.stok_id === null) {
    $q.notify({
      message: 'Form Tidak Boleh Ada Yang Kosong',
      color: 'negative',
      icon: 'icon-mat-warning',
    })
    return
  }
  if (store.form.jumlah_k === 0) {
    $q.notify({
      message: 'Jumlah Tidak Boleh 0',
      color: 'negative',
      icon: 'icon-mat-warning',
    })
    return
  }
  store.save()
}
</script>
