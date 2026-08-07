<template>
  <q-layout view="lHr LpR lfr">

    <q-page-container>
      <q-page class="fit column">
        <div class="col full-height relative-position">
          <div class="absolute fit q-pa-md">
            <router-view />
          </div>
        </div>
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { useQuasar } from 'quasar';
import { useAppStore } from 'src/stores/app';
import { onMounted } from 'vue';

const $q = useQuasar()
const app = useAppStore()

onMounted(() => {
  $q.dark.set(app?.dark)
})

</script>