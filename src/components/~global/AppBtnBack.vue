<template>
  <q-btn 
      round
      :icon="tabArrowBack"
      dense 
      :type="type"
    >
    <q-tooltip v-if="tooltip">{{ tooltip }}</q-tooltip>
  </q-btn>
</template>

<script setup>
import { tabArrowBack } from 'quasar-extras-svg-icons/tabler-icons-v2'
defineProps({
  tooltip: {
    type: String,
    default: 'Kembali'
  },
  type: {
    type: String,
    default: 'button'
  }
})

</script>