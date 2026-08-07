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
          item = data
          isList = false
        }
      "
    />

    <FormPage v-else :data="item" @back="isList = true" />
  </div>
</template>

<script setup>
import { useAdminMasterSupplierStore } from 'src/stores/admin/master/supplier/list'
import { defineAsyncComponent, ref } from 'vue'
const ListPage = defineAsyncComponent(() => import('./comp/ListPage.vue'))
const FormPage = defineAsyncComponent(() => import('./comp/FormPage.vue'))

const isList = ref(true)
const storesuplier = useAdminMasterSupplierStore()

storesuplier.getAllList()
</script>

<style scoped></style>
