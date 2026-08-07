<template>
  <q-input
    ref="appInput"
    :label="label"
    :dense="type !== 'textarea'"
    :autogrow="type === 'textarea'"
    outlined
    standout="bg-yellow-3"
    :class="`q-mb-xs ${classTambahan}`"
    :autofocus="autofocus"
    :readonly="readonly"
    :disable="disable"
    :type="type"
    :rules="[requiredRule, minRule, maxRule, emailRule, isNumberRule]"
    :lazy-rules="lazyRules"
    :hide-bottom-space="true"
    :clearable="clearable"
    :debounce="debounce"
    :error="errorFromServer?.length > 0"
    :error-message="errorFromServer?.length ? errorFromServer[0]: null"
    @update:model-value="updatedModel"
  >
    <template v-if="append" #append>
      <q-icon v-if="!appendBtn" :name="appendIcon" size="xs" class="cursor-pointer" v-ripple @click="emits('appendClick')" />
      <q-btn v-if="appendBtn" label="cek" outline color="primary" size="sm" v-ripple @click="emits('appendClick')" />
    </template>
  </q-input>
</template>

<script setup>
import { ref } from 'vue'
// const bg = ref(false)
const props = defineProps({
  label: {
    type: String,
    default: 'Label'
  },
  autofocus: {
    type: Boolean,
    default: true
  },
  readonly: {
    type: Boolean,
    default: false
  },
  disable: {
    type: Boolean,
    default: false
  },
  append: {
    type: Boolean,
    default: false
  },
  appendIcon: {
    type: String,
    default: 'icon-mat-close'
  },
  appendBtn: {
    type: Boolean,
    default: false
  },
  appendBtnLabel: {
    type: String,
    default: 'Cek'
  },
  classTambahan: {
    type: String,
    default: ''
  },
  type: {
    type: String,
    default: 'text'
  },
  valid: {
    type: Object,
    default: null
  },
  lazyRules: {
    type: [Boolean, String],
    default: true
  },
  hint: {
    type: String,
    default: null
  },
  errorFromServer: {
    type: [Array, Object, Boolean],
    default: null
  },
  debounce: {
    type: Number,
    default: 500
  },
  clearable: {
    type: Boolean,
    default: false
  }

})

const emits = defineEmits(['appendClick', 'update:modelValue'])

const appInput = ref(null)

defineExpose({ appInput })

const requiredRule = (val) => {
  if (props.valid === null) {
    return true
  }
  return (!!val || props.valid?.required || val === 0) || 'Harap diisi'
}

const minRule = (val) => {
  if (props.valid === null) {
    return true
  }
  if (!props.valid?.min) {
    return true
  }
  return (val && val.length >= parseInt(props.valid?.min)) || `Min ${props.valid?.min} char`
}

const maxRule = (val) => {
  if (props.valid === null) {
    return true
  }
  if (!props.valid?.max) {
    return true
  }
  return (val && val.length <= parseInt(props.valid?.max)) || `Max ${props.valid?.max} char`
}

const emailRule = (val) => {
  if (props.valid === null) {
    return true
  }
  if (!props.valid?.email) {
    return true
  }
  return isValidMail(val) || 'email tidak valid'
}

const isNumberRule = (val) => {
  if (props.valid === null) {
    return true
  }
  if (!props.valid?.number) {
    return true
  }
  return (!isNaN(val) && !isNaN(parseFloat(val))) || 'Harus angka'
}

const isValidMail = (val) => {
  const emailPattern = /^(?=[a-zA-Z0-9@._%+-]{6,254}$)[a-zA-Z0-9._%+-]{1,64}@(?:[a-zA-Z0-9-]{1,63}\.){1,8}[a-zA-Z]{2,63}$/
  return emailPattern.test(val)
}

const updatedModel = (e) => {
  emits('update:modelValue', e)
}

</script>

<style lang="scss" scoped>
.q-field--dense .q-field__bottom {
    display:none;
}

.q-field--error .q-field--highligted {
  background: none;
}
// .q-field--standout.q-field--highlighted .q-field__control {
//     box-shadow: 0 1px 5px rgb(0 0 0 / 20%), 0 2px 2px rgb(0 0 0 / 14%), 0 3px 1px -2px rgb(0 0 0 / 12%);
//     background: rgb(250, 173, 173);
// }

</style>
