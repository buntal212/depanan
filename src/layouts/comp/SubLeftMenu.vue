<template>
  <div class="fit column">
    <div class="col-auto">
      <div class="flex items-center q-pa-md">
        <q-icon :name="tab?.icon" size="sm"></q-icon>
        <div class="q-ml-sm text-weight-bold text-h6">{{ tab?.label }}</div>
      </div>
      <q-separator></q-separator>
    </div>
    <div class="col full-height scroll">
      <q-list bordered separator dense>
        <q-item
          v-for="(item, i) in tab?.subs"
          :key="i"
          v-ripple
          clickable
          :active="menu === item"
          :active-class="app?.dark ? 'bg-grey-5 text-black' : 'bg-grey-9 text-white'"
          @click="emits('menuClick', item)"
          :class="{
            'bg-negative text-white': item?.name === 'page-pulang' && pasien?.status !== '3',
          }"
        >
          <q-item-section avatar>
            <q-icon :name="item?.icon" size="xs" />
          </q-item-section>
          <q-item-section>{{ item?.label }}</q-item-section>
        </q-item>
      </q-list>
    </div>
  </div>
</template>

<script setup>
import { useAppStore } from 'src/stores/app'

defineProps({
  tab: {
    type: Object,
    default: null,
  },
  menu: {
    type: Object,
    default: null,
  },
})
const app = useAppStore()
const emits = defineEmits(['menuClick'])
</script>
