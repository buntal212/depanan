<template>
  <q-avatar :size="size">
    <!-- <img src="~assets/icon.svg"> -->
    <img src="~assets/Logojk.svg" />
  </q-avatar>
</template>

<script setup>
defineProps({
  size: {
    type: String,
    default: 'lg',
  },
})
</script>
