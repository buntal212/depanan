<template>
  <q-avatar :size="size">
    <img src="~assets/icon.svg">
  </q-avatar>
</template>

<script setup>
defineProps({
  size: {
    type: String,
    default: 'lg'
  }
})
</script>