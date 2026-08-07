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
              <div :class="`col-${isMobile ? 12 : 6}`" class="row q-col-gutter-md">
                <app-input
                  class="col-12"
                  v-model="store.form.nama"
                  label="Nama Pegawai"
                  :valid="{ required: false }"
                />
                <app-input class="col-6" v-model="store.form.username" label="Username" />
                <app-input class="col-6" v-model="store.form.password" label="Password" />
                <app-input class="col-6" v-model="store.form.email" label="Email" />
                <app-input class="col-6" v-model="store.form.jabatan" label="Jabatan" />
                <app-input class="col-12" v-model="store.form.alamat" label="Alamat" />
                <app-input
                  class="col-5"
                  v-model="store.form.nohp"
                  label="No. Hp"
                  :valid="{ number: true }"
                  @update:model-value="
                    (val) => {
                      //untuk hapus o dipean angka pake ini yaa
                      const _removedZeros = val?.replace(/^0+/, '')
                      if (val > 1) store.form.isi = _removedZeros
                    }
                  "
                />
                <!-- <app-input
                  class="col-6"
                  v-model="store.form.hargajual1"
                  label="Harga Jual 1"
                  :valid="{ number: true }"
                  @update:model-value="
                    (val) => {
                      //untuk hapus o dipean angka pake ini yaa
                      const _removedZeros = val?.replace(/^0+/, '')
                      if (val > 1) store.form.hargajual1 = _removedZeros
                    }
                  "
                />
                <app-input
                  class="col-6"
                  v-model="store.form.hargajual2"
                  label="Harga Jual 2"
                  :valid="{ number: true }"
                  @update:model-value="
                    (val) => {
                      //untuk hapus o dipean angka pake ini yaa
                      const _removedZeros = val?.replace(/^0+/, '')
                      if (val > 1) store.form.hargajual2 = _removedZeros
                    }
                  "
                /> -->
                <div class="col-12">
                  <q-separator class="q-my-md" />
                  <app-btn
                    :loading="store.loading"
                    type="submit"
                    :dense="false"
                    label="Simpan"
                    color="teal"
                  />
                </div>
              </div>
              <!-- <div :class="`col-${isMobile ? 12 : 6}`" class="row q-col-gutter-md">
                <div>
                  <app-btn type="submit" :dense="false" label="Simpan" color="primary" />
                </div>
              </div> -->
            </div>
          </q-card-section>
        </q-form>
      </q-card>
    </div>
  </div>
</template>

<script setup>
import { useQuasar } from 'quasar'
import { useAdminFormMasterPegawaiStore } from 'src/stores/admin/master/pegawai/form'
import { computed, onMounted } from 'vue'

const emits = defineEmits(['back'])
const $q = useQuasar()
const isMobile = computed(() => {
  return $q.screen.lt.sm // Quasar screen size helper
})

const store = useAdminFormMasterPegawaiStore()

onMounted(() => {
  store.initReset()
})

function onSubmit() {
  // console.log('submit form barang');

  store.save()
}
</script>
