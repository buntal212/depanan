<template>
  <q-page>
    <Suspense>
      <!-- main content -->
      <AsyncComp />
      <!-- loading state -->
      <template #fallback>
        <Loading />
      </template>
    </Suspense>
  </q-page>
</template>
<script setup>
import { defineAsyncComponent } from 'vue'
const Loading=defineAsyncComponent(() => import('src/components/app/AppLoading.vue'))
const AsyncComp = defineAsyncComponent(() =>
  import('./FrontPage.vue')
)
</script>
