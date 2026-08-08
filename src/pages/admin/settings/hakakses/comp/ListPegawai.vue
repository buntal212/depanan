<template>
  <div class="fit column absolute">
    <div class="col full-height">
      <q-card flat bordered square class="full-height" style="overflow: hidden">
        <q-card-section class="q-px-md q-py-xs bg-primary text-white col-auto full-width">
          <div class="row items-center justify-between">
            <div class="f-12 text-weight-bold">Data Pegawai</div>
          </div>
        </q-card-section>
        <q-card-section style="max-height: 98%" class="scroll">
          <q-list>
            <transition-group>
              <q-item v-for="(item, n) in lists" :key="n" class="list-move">
                <q-item-section>
                  <div class="row full-width q-gutter-xs">
                    <div class="col-12">
                      <q-item-label>{{ item?.nama }}</q-item-label>
                    </div>
                    <div class="col-2">
                      <q-item-label class="text-weight-medium"> Username </q-item-label>
                    </div>
                    <div class="col-1">
                      <q-item-label class="text-weight-medium"> :</q-item-label>
                    </div>
                    <div class="col-4">
                      <q-item-label class="text-weight-medium"> {{ item?.username }}</q-item-label>
                    </div>
                  </div>
                  <div class="row full-width q-gutter-xs">
                    <div class="col-2">
                      <q-item-label class="text-weight-medium"> E-mail </q-item-label>
                    </div>
                    <div class="col-1">
                      <q-item-label class="text-weight-medium"> :</q-item-label>
                    </div>
                    <div class="col-4">
                      <q-item-label class="text-weight-medium"> {{ item?.email }}</q-item-label>
                    </div>
                  </div>
                  <div class="row full-width q-gutter-xs">
                    <div class="col-2">
                      <q-item-label class="text-weight-medium"> Alamat </q-item-label>
                    </div>
                    <div class="col-1">
                      <q-item-label class="text-weight-medium"> :</q-item-label>
                    </div>
                    <div class="col-4">
                      <q-item-label class="text-weight-medium"> {{ item?.alamat }}</q-item-label>
                    </div>
                  </div>
                  <div class="row full-width q-gutter-xs">
                    <div class="col-2">
                      <q-item-label class="text-weight-medium"> Jabatan </q-item-label>
                    </div>
                    <div class="col-1">
                      <q-item-label class="text-weight-medium"> :</q-item-label>
                    </div>
                    <div class="col-4">
                      <q-item-label class="text-weight-medium"> {{ item?.jabatan }}</q-item-label>
                    </div>
                  </div>
                  <q-separator class="q-mt-sm" />
                </q-item-section>
                <q-item-section top side>
                  <div class="q-gutter-sm">
                    <q-btn
                      class="gt-xs"
                      size="12px"
                      flat
                      dense
                      round
                      icon="person_pin"
                      @click="emits('tambah', item)"
                    />
                    <q-btn
                      class="gt-xs"
                      size="12px"
                      flat
                      dense
                      round
                      icon="visibility"
                      @click="emits('lihat', item)"
                    />
                  </div>
                </q-item-section>
              </q-item>
            </transition-group>
          </q-list>
        </q-card-section>
      </q-card>
    </div>
  </div>
  <DialogHakAksesPage :submenu="props.submenu" />
</template>
<script setup>
import { computed } from 'vue'
import DialogHakAksesPage from './DialogHakAksesPage.vue'
const emits = defineEmits(['lihat', 'tambah'])

const props = defineProps({
  data: {
    type: Object,
    default: null,
  },
  flaging: {
    type: String,
    default: '',
  },
  submenu: {
    type: Array,
    default: () => [],
  },
})

const lists = computed(() => {
  const arr = props.data
  // console.log('arr', arr)
  return arr?.sort((a, b) => {
    return b.id - a.id
  })
})
</script>
