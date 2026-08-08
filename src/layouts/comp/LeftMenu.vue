<template>
  <div class="fit column">
    <div class="col-auto">
      <div class="column flex-center q-pt-sm">
        <avatar-logo></avatar-logo>
      </div>
    </div>
    <div class="col full-height">
      <div class="column full-height flex-center">
        <div>
          <q-tabs
            v-model="store.tab"
            vertical
            align="justify"
            switch-indicator
            :active-class="app?.dark ? 'bg-grey-5 text-black' : 'bg-grey-9 text-white'"
            :class="app?.dark ? 'text-grey-6' : 'text-grey-10'"
          >
            <q-tab
              v-for="item in store?.tabs"
              :key="item?.name"
              :name="item?.name"
              @click="emits('selectTab', item)"
            >
              <q-icon :name="item?.icon" size="sm"></q-icon>
            </q-tab>
          </q-tabs>
        </div>
      </div>
    </div>
    <div class="col-auto">
      <div class="column flex-center q-pb-lg q-gutter-lg">
        <div>
          <q-tabs
            v-model="store.tab"
            vertical
            align="justify"
            switch-indicator
            :active-class="app?.dark ? 'bg-grey-5 text-black' : 'bg-grey-9 text-white'"
            :class="app?.dark ? 'text-grey-6' : 'text-grey-10'"
          >
            <q-tab
              v-for="item in store?.tabsBottom"
              :key="item?.name"
              :name="item?.name"
              @click="emits('selectTab', item)"
            >
              <q-icon :name="item?.icon" size="sm"></q-icon>
            </q-tab>
          </q-tabs>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useAppStore } from 'src/stores/app'
import { useLeftDrawerStore } from 'src/stores/app/leftdrawer'
import { defineAsyncComponent } from 'vue'
// import { useRoute } from 'vue-router';

const AvatarLogo = defineAsyncComponent(() => import('src/components/app/AvatarLogo.vue'))
const store = useLeftDrawerStore()
const app = useAppStore()
// const route = useRoute()

// const tab = ref('dashboard')

const emits = defineEmits(['selectTab'])
</script>
