<template>
  <q-input
    ref="appInput"
    outlined
    :dense="dense"
    :label="label"
    :placeholder="placeholder"
    :type="type"
    :rules="[requiredRule, minRule, maxRule, emailRule, isNumberRule]"
    :lazy-rules="lazyRules"
    :clearable="clearable"
    :hide-bottom-space="true"
  >
    <template
      v-if="prependIcon!==null"
      #prepend
    >
      <q-icon
        :name="prependIcon"
        size="18px"
      />
    </template>
  </q-input>
</template>

<script setup>
import { ref } from 'vue'

const props = defineProps({
  dense: {
    type: Boolean,
    default: true
  },
  label: {
    type: String,
    default: ''
  },
  placeholder: {
    type: String,
    default: ''
  },
  prependIcon: {
    type: [Object, String],
    default: null
  },
  clearable: {
    type: Boolean,
    default: true
  },
  valid: {
    type: Object,
    default: null
  },
  lazyRules: {
    type: [Boolean, String],
    default: true
  },
  type: {
    type: String,
    default: 'text'
  },
  errorFromServer: {
    type: [Array, Object, Boolean],
    default: null
  }
})
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
</script>
