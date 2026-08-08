<template>
  <div class="flex column flex-center bg-loading-bg__table" style="height: 300px">
    <div>
      <q-icon name="receipt_long" color="grey-5" size="60px" />
    </div>
    <div class="text-grey-5 q-mt-sm">
      {{ text }}
    </div>
  </div>
</template>
<script setup>
defineProps({
  text: {
    type: String,
    default: 'Tidak Ada Data',
  },
})
</script>
