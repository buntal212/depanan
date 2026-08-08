<template>
  <!-- <q-layout view="lHr lpR lFr"> -->
  <q-layout view="lHr LpR lfr">
    <!-- <q-header elevated class="bg-primary text-white" height-hint="98">
      <q-toolbar>

        <q-toolbar-title>
          {{selectedTab?.label || selectedMenu?.label}}
        </q-toolbar-title>

      </q-toolbar>
    </q-header> -->

    <!-- left drawer -->
    <q-card
      v-if="leftSubOpen"
      class="absolute full-height"
      style="z-index: 9; margin-left: 56px; width: 250px"
    >
      <SubLeftMenu
        :tab="selectedTab"
        :menu="selectedMenu"
        @menu-click="
          (val) => {
            selectedMenu = val
            toLink(val)
          }
        "
      />
    </q-card>

    <q-drawer
      show-if-above
      behavior="desktop"
      no-swipe-open
      mini
      v-model="leftDrawerOpen"
      side="left"
      bordered
      class="z-top"
    >
      <LeftMenu
        ref="refLeftMenu"
        @select-tab="
          (val) => {
            //  console.log(val)
            selectedTab = val

            if (val?.subs?.length) {
              if (!leftSubOpen) {
                leftSubOpen = true
              }
            } else {
              selectedMenu = null
              leftSubOpen = false
              toLink(val)
            }
          }
        "
      />
    </q-drawer>

    <q-drawer v-model="rightDrawerOpen" side="right" overlay bordered>
      <!-- drawer content -->
    </q-drawer>

    <q-page-container @click="leftSubOpen = false">
      <q-page class="fit column">
        <div class="col-auto">
          <q-card square class="shadow-1">
            <div class="row items-center justify-between q-px-md q-py-sm">
              <div class="kiri">
                {{ selectedMenu?.label || selectedTab?.label }}
              </div>
              <div class="kanan row items-center">
                <!-- Counter ditambahkan di sini -->
                <app-counter class="q-mr-md" />

                <q-btn
                  dense
                  :icon="heroOutline24Moon"
                  size="sm"
                  flat
                  @click="
                    () => {
                      app.dark = !app.dark
                      $q.dark.set(app?.dark)
                    }
                  "
                ></q-btn>
              </div>
            </div>
          </q-card>
        </div>
        <div class="col full-height relative-position scroll">
          <div class="absolute fit">
            <router-view />
          </div>
        </div>
      </q-page>

      <NgurusiSocket />
    </q-page-container>

    <!-- <q-footer bordered class="bg-grey-8 text-white">
      <div class="row justify-between items-center q-px-md q-py-sm">
        <div>Kiri</div>
        <div>Kanan</div>
      </div>
    </q-footer> -->

  </q-layout>
</template>

<script setup>
import { useQuasar } from 'quasar'
import { useLeftDrawerStore } from 'src/stores/app/leftdrawer'
// eslint-disable-next-line no-unused-vars
import { defineAsyncComponent, onMounted, ref, watchEffect } from 'vue'
import { heroOutline24Moon } from 'quasar-extras-svg-icons/hero-icons-v2'
import { useAppStore } from 'src/stores/app'
import { useRoute, useRouter } from 'vue-router'
// eslint-disable-next-line no-unused-vars
import { watch } from 'vue'

const LeftMenu = defineAsyncComponent(() => import('./comp/LeftMenu.vue'))
const SubLeftMenu = defineAsyncComponent(() => import('./comp/SubLeftMenu.vue'))
const AppCounter = defineAsyncComponent(() => import('src/components/app/AppCounter.vue'))
const NgurusiSocket = defineAsyncComponent(() => import('./comp/NgurusiSocket.vue'))

const refLeftMenu = ref(null)

const left = useLeftDrawerStore()
const app = useAppStore()

const leftDrawerOpen = ref(false)
const leftSubOpen = ref(false)
const rightDrawerOpen = ref(false)

const selectedTab = ref(null)
const selectedMenu = ref(null)

const $q = useQuasar()
const router = useRouter()
const route = useRoute()

onMounted(() => {
  // left.tab = 'dashboard'
  selectedTab.value = left.tabs[0]
  initMenu()

  // console.log('refLeftMenu',refLeftMenu.value);
})

function initMenu() {
  // console.log('left route',route?.fullPath);

  const leftMenuInStore = left?.tabs?.map((x) => x?.link)
  const findMenu = leftMenuInStore?.find((x) => x === route?.fullPath) ?? null // cari di menu utama
  left.setTab(route?.fullPath)

  if (!findMenu) {
    const findMenuSub =
      left?.tabs?.find((x) => x?.subs?.find((y) => y?.link === route?.fullPath)) ?? null // cari di menu sub

    if (findMenuSub) {
      const target = findMenuSub.subs?.find((y) => y?.link === route?.fullPath)
      // console.log('target', target);
      selectedMenu.value = target
    }
    // console.log('findMenuSub',findMenuSub);
    selectedTab.value = findMenuSub
    // console.log('selectedTab',selectedTab.value);
  } else {
    selectedTab.value = findMenu
    selectedMenu.value = null
  }

  // console.log('left menu in store',findMenu);

  // selectedTab.value = left.tabs[0]
  // selectedMenu.value = null
  $q.dark.set(app?.dark)
}

function toLink(val) {
  // console.log(val);
  const link = val?.link
  if (link) {
    const firstTxt = link?.charAt(0)
    let newLink = null
    if (firstTxt !== '/') {
      newLink = `/${link}`
    } else {
      newLink = link
    }
    router.push(newLink)
  }
}

// watch(() => route?.fullPath, (obj, old) => {
//   console.log('watch route lama',old);
//   console.log('watch route baru',obj);

//   initMenu()
// })

// watchEffect(() => {
//   if (route?.fullPath) {
//     initMenu()
//   }
// })
</script>
