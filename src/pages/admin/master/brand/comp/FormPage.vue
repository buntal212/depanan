<template>
  <div class="fit column">
    <div class="col-auto row items-center q-pa-lg">
      <app-btn-back @click="emits('back')" />
    </div>

    <div class="col full-height q-px-lg q-pb-lg">
      <q-card flat class="full-height">
        <q-form class="full-height" @submit="onSubmit">
          <q-card-section class="full-height q-pa-lg scroll">
            <div class="row justify-around">
              <div class="col-12 col-md-6">
                <div class="text-h6 q-mb-md">{{ props.data ? 'Edit Brand' : 'Tambah Brand' }}</div>
                <app-input
                  v-model="store.form.brand"
                  label="Nama Brand"
                  :valid="{ required: false }"
                />
                <div class="q-mt-lg">
                  <q-separator class="q-mb-md" />
                  <app-btn
                    type="submit"
                    label="Simpan"
                    color="primary"
                    :dense="false"
                    :loading="store.loading"
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
import { useAdminFormMasterBrandStore } from 'src/stores/admin/master/brand/form'
import { onMounted } from 'vue'

const props = defineProps({ data: { type: Object, default: null } })
const emits = defineEmits(['back', 'saved'])
const store = useAdminFormMasterBrandStore()

onMounted(() => store.initReset(props.data))

async function onSubmit() {
  await store.save()
  emits('saved')
}
</script>
