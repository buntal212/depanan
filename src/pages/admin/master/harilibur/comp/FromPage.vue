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
                <app-input-date
                  class="col-12"
                  :model="store.dateDisplay.tgl"
                  label="Tanggal Libur"
                  :valid="{ required: false }"
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

                <app-input
                  label="Keterangan"
                  class="col-12"
                  :valid="{ required: false }"
                  v-model="store.form.keterangan"
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
          </q-card-section>
        </q-form>
      </q-card>
    </div>
  </div>
</template>

<script setup>
import { useQuasar } from 'quasar'
import { useAdminMasterFormHariLibur } from 'src/stores/admin/master/harilibur/form'
import { computed, onMounted } from 'vue'

const emits = defineEmits(['back'])
const $q = useQuasar()
const isMobile = computed(() => {
  return $q.screen.lt.sm // Quasar screen size helper
})

const store = useAdminMasterFormHariLibur()

// const props = defineProps({
//   data: {
//     type: Object,
//     default: null,
//   },
// })
onMounted(() => {
  // store.initReset(props.data)
})

function onSubmit() {
  store.save()
}
</script>
