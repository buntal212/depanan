<template>
  <div class="fit">
    <ListPage v-if="isList" @add="isList = false" />

    <FormPage v-else @back="isList = true" />
  </div>
</template>

<script setup>
import { defineAsyncComponent, ref } from 'vue'
const ListPage = defineAsyncComponent(() => import('./comp/ListPage.vue'))
const FormPage = defineAsyncComponent(() => import('./comp/FormPage.vue'))

const isList = ref(true)
</script>

<style scoped></style>
