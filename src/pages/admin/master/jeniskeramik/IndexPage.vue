<template>
  <div class="fit">
    <ListPage
      v-if="isList"
      @add="
        () => {
          item = null
          isList = false
        }
      "
      @edit="
        (data) => {
          // console.log('edit', data);

          item = data
          isList = false
        }
      "
    />

    <FormPage v-else :data="item" @back="isList = true" />
  </div>
</template>

<script setup>
import { defineAsyncComponent, ref } from 'vue'
const ListPage = defineAsyncComponent(() => import('./comp/ListPage.vue'))
const FormPage = defineAsyncComponent(() => import('./comp/FromPage.vue'))

const isList = ref(true)
const item = ref(null)
</script>

<style scoped></style>
