<template>
  <div class="fit column">
    <div class="full-height full-width">
      <div class="row full-height">
        <q-card flat bordered square class="col-6 full-height">
          <FormRincianPage @back="emits('back')" :data="data" />
        </q-card>
        <q-card flat bordered square class="col-6 full-height">
          <ListRincianPage :data="data" />
        </q-card>
      </div>
    </div>
  </div>
</template>
<script setup>
import FormRincianPage from './FormRincianPage.vue'
import ListRincianPage from './ListRincianPage.vue'
// import { formatRpDouble } from 'src/modules/utils'

const emits = defineEmits(['back'])

defineProps({
  data: {
    type: Object,
    default: null,
  },
})

// const lists = computed(() => {
//   const arr = props.data?.rinci
//   return arr?.sort((a, b) => {
//     return b.id - a.id
//   })
// })
</script>
