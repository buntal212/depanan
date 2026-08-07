<template>
  <q-btn class="glossy" 
      :rounded="label ? true : false" 
      :round="label ? false : true"
      no-caps
      :color="color"
      :dense="dense"
      :loading="loading" 
      >
      <div class="flex items-center" :class="{' q-px-md': label}">
        <div v-if="icon" :class="{'q-mr-sm': label}"><q-icon :name="icon" size="1.5em"  /></div>
        <div v-if="label">{{ label }}</div>
      </div>
      <template v-slot:loading>
        Loading...
      </template>
    <q-tooltip v-if="tooltip">{{ tooltip }}</q-tooltip>
  </q-btn>
</template>

<script setup>

defineProps({
  label: {
    type: String,
    default: null
  },
  icon: {
    type: [String, Object],
    default: null
  },
  prependIcon: {
    type: [String, Object],
    default: null
  },
  tooltip: {
    type: String,
    default: null
  },
  loading: {
    type: Boolean,
    default: false
  },
  dense: {
    type: Boolean,
    default: true
  },
  color: {
    type: String,
    default: 'primary'
  }
})

</script>