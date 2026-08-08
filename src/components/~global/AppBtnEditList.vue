<template>
  <q-btn color="orange" :icon="tabEdit" size="sm" padding="sm" round dense>
    <q-tooltip>{{ tooltip }}</q-tooltip>
  </q-btn>
</template>
<script setup>
import { tabEdit } from 'quasar-extras-svg-icons/tabler-icons-v2'
defineProps({
  tooltip:{
    type:String,
    default: 'Edit data'
  }
})

</script>