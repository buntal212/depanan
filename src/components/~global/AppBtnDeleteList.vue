<template>
  <q-btn color="negative" :icon="uiwDelete" size="sm" padding="sm" round dense>
    <q-tooltip>Delete Data</q-tooltip>
  </q-btn>
</template>
<script setup>
import { uiwDelete } from 'quasar-extras-svg-icons/uiw-icons'
</script>