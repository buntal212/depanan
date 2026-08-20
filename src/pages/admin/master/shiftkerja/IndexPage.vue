<template>
  <div class="fit">
    <ListPage v-if="isList" @add="openForm(null)" @edit="openForm" />
    <FormPage v-else :data="item" @back="isList = true" />
  </div>
</template>

<script setup>
import { defineAsyncComponent, ref } from 'vue'

const ListPage = defineAsyncComponent(() => import('./comp/ListPage.vue'))
const FormPage = defineAsyncComponent(() => import('./comp/FormPage.vue'))
const isList = ref(true)
const item = ref(null)
const openForm = (data) => {
  item.value = data
  isList.value = false
}
</script>
