<template>
  <q-page>
    <div class="fit q-pa-md">
      <AsyncComp />
    </div>
  </q-page>
</template>
<script setup>
import { defineAsyncComponent } from 'vue'

const AsyncComp = defineAsyncComponent(() => import('./comp/PageProfil.vue'))
</script>
