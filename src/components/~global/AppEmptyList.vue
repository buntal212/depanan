<template>
  <q-card
    flat
    class="full-height column flex flex-center"
    rounded
  >
    <q-icon
      :name="emptyIcon"
      size="48px"
      class="q-mb-md opacity-50"
    />
    <div class="q-mb-sm">
      {{ emptyTitle }}
    </div>
    <div class="text-body2 text-grey-6 dark:text-grey-5" style="max-width: 400px;">
      {{ emptyDescription }}
    </div>
  </q-card>
</template>

<script setup>
defineProps({
  emptyTitle: {
    type:String,
    default: 'Belum Ada Data'
  },
  emptyDescription: {
    type:String,
    default: null
  },
  emptyIcon: {
    type: String,
    default: 'remove_shopping_cart'
  }
})
</script>