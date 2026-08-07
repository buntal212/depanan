<template>
  <q-select
    ref="refAuto"
    :options="optionx"
    :label="label"
    dense
    :outlined="outlined"
    hide-bottom-space
    no-error-icon
    :input-debounce="!filterred?500:0"
    emit-value
    map-options
    use-input
    fill-input
    hide-selected
    :option-value="optionValue"
    :option-label="optionLabel"
    :disable="disable"
    :loading="loading"
    lazy-rules
    :rules="[anotherValid]"
    behavior="menu"
    transition-show="jump-up"
    transition-hide="jump-down"
    :bottom-slots="hint !== null "
    @filter="filterFn"
    @new-value="createValue"
  >
    <template #no-option>
      <q-item>
        <q-item-section class="text-grey">
          No results
        </q-item-section>
      </q-item>
    </template>
    <template v-if="hint" #hint>
      {{ props.hint }}
    </template>
  </q-select>
</template>

<script setup>
import { ref } from 'vue'
const emits = defineEmits(['selected', 'onEnter'])
const props = defineProps({
  options: { type: Array, default: () => [] },
  label: { type: String, default: 'Label' },
  disable: { type: Boolean, default: false },
  loading: { type: Boolean, default: false },
  optionValue: { type: [Object, Array, String, Function], default: 'name' },
  optionLabel: { type: [Object, Array, String, Function], default: 'name' },
  filled: { type: Boolean, default: true },
  outlined: { type: Boolean, default: true },
  valid: { type: Boolean, default: false },
  filterred: { type: Boolean, default: true },
  hint: { type: String, default: null }
})
const refAuto = ref(null)
const optionx = ref(props.options)


function filterFn (val, update) {
  // console.log('filter', val);
  
  if (val === '') {
    update(() => {
      optionx.value = props?.options

      // here you have access to "ref" which
      // is the Vue reference of the QSelect
    })
    return
  }

  update(() => {
    const needle = val?.toLowerCase()
    const newOption = props?.options?.filter(v => v[refAuto.value.optionLabel]?.toLowerCase().indexOf(needle) > -1)
    // console.log('options', props?.options);
    // console.log('needle', needle);
    // console.log('optionx', newOption);
    
    optionx.value = [...newOption]
    
  })
      
}

function anotherValid (val) {
  if (props.valid) {
    return true
  }
  return (val !== null && val !== '') || 'Harap diisi'
}

function createValue (val, done) {
  if (!props.filterred) {
    emits('onEnter', val)
    done(val)
  }
}
</script>

<style lang="scss" scoped>
.q-virtual-scroll__content {
  .q-item {
    min-height: 39px !important;
  }
}

</style>
