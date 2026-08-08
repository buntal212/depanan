<template>
  <div class="fit">
    <AsyncComp />
  </div>
</template>
<script setup>
import { defineAsyncComponent } from 'vue'

const AsyncComp = defineAsyncComponent(() => import('./comp/HakAksesPage.vue'))
</script>
