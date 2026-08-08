<template>
  <q-dialog v-model="store.dialog">
    <q-card style="width: 300px">
      <q-card-section>
        <div class="text-h6">Pilih Menu</div>
      </q-card-section>

      <q-card-section class="q-pt-none">
        <q-select
          v-model="store.payload.submenu"
          outlined
          dense
          :options="options"
          use-input
          option-label="label"
          option-value="id"
          clearable
          emit-value
          map-options
          @filter="filterFnmedia"
          @update:model-value="
            (val) => {
              settings(val)
            }
          "
        >
          <template #option="scope">
            <q-item v-bind="scope.itemProps"
              ><q-item-section avatar>
                <q-item-label>
                  <span class="text-bold"
                    >{{ scope.opt.label }} ( {{ scope.opt.menus?.label }} )</span
                  >
                </q-item-label>
              </q-item-section>
            </q-item>
          </template>
          <template #no-option>
            <q-item>
              <q-item-section class="text-grey"> Data Tidak Ditemukan.... </q-item-section>
            </q-item>
          </template>
        </q-select>
      </q-card-section>

      <q-card-actions align="right" class="text-teal">
        <!-- <q-btn color="primary" label="Simpan" @click="store.tambahhakakses()" /> -->
        <app-btn
          label="Simpan"
          color="grey-10"
          class="text-yellow-9"
          @click="store.tambahhakakses()"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>
<script setup>
import { useAdminFormMasterPegawaiStore } from 'src/stores/admin/master/pegawai/form'
import { ref } from 'vue'

const store = useAdminFormMasterPegawaiStore()
const props = defineProps({
  submenu: {
    type: Array,
    default: () => [],
  },
})
const options = ref([props.submenu])

function filterFnmedia(val, update) {
  if (val === '') {
    update(() => {
      options.value = props.submenu
    })
    return
  }
  update(() => {
    const needle = val.toLowerCase()

    options.value = props.submenu.filter(
      (v) => v.label.toString().toLowerCase().indexOf(needle) > -1,
    )
  })
}

function settings(val) {
  console.log('val', val)
  const menuse = props.submenu.find((x) => x.id === val)
  console.log('menuse', menuse?.menu_id)
  store.payload.menu = menuse.menu_id
}
</script>
