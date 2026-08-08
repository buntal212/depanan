<template>
  <div class="flex items-center q-gutter-lg text-xs">
    <!-- Quantity Control -->
    <div class="flex items-center">
      <!-- Decrease -->
      <q-btn
        @click="decrease"
         :disable="jumlahTotal >= maxPcs"
          flat
          size="md"
          padding="sm"
        >
        <q-icon name="remove" size="20px"></q-icon>
         <!-- <div style="font-size: 20px;"> - </div> -->
      </q-btn>

      <!-- Input -->
      <q-input
        type="number"
        dense
        outlined
        hide-bottom-space
        :model-value="displayValue"
        @update:model-value="onInput"
        input-class="text-center"
        min="0"
        :max="inputMode === 'pcs' ? maxPcs : Math.floor(maxPcs / isi)"
      />

      <!-- Increase -->
      <q-btn
        @click="increase"
        :disable="jumlahTotal >= maxPcs"
        flat
        size="md"
        padding="sm"
      >
        <q-icon name="add" size="20px"></q-icon>
      </q-btn>
    </div>

    <!-- Unit Toggle -->
    <q-btn-group rounded outline class="text-sm overflow-hidden">
      <q-btn
        :label="satuanKecil"
        @click="handleSatuanKecil"
        flat
        class="h-8"
        :class="inputMode === satuanKecil ? 'bg-primary text-white' : ''"
      />
      <q-btn
        :label="satuanBesar"
        @click="handleSatuanBesar"
        flat
        class="h-8 relative-position"
        :disable="maxPcs < isi"
        :class="inputMode === satuanBesar ? 'bg-primary text-white' : ''"
      >
        <q-tooltip v-if="showTooltip">
          Stok belum cukup untuk {{ satuanBesar }}
        </q-tooltip>
      </q-btn>
    </q-btn-group>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { useQuasar } from 'quasar'

const $q = useQuasar()

const props = defineProps({
  modelValue: { type: Number, required: true },
  maxPcs: { type: Number, default: 1000 },
  isiPerDus: { type: [Number, String], default: 1 },
  satuanBesar: { type: String, default: 'Dus' },
  satuanKecil: { type: String, default: 'Pcs' },
  defaultUnit: { type: String, default: 'Pcs' },
})

const emit = defineEmits(['update:modelValue', 'update:inputMode'])

const isi = computed(() => parseInt(props.isiPerDus) || 1)
const inputMode = ref('')
const showTooltip = ref(false)
const hasInteracted = ref(false)
const internalValue = ref(props.modelValue)

const jumlahTotal = computed({
  get: () => internalValue.value,
  set: (val) => {
    hasInteracted.value = true
    const nilai = Math.max(0, Math.min(props.maxPcs, parseInt(val) || 0))
    internalValue.value = nilai
  },
})

const displayValue = computed(() => {
  return inputMode.value === props.satuanBesar
    ? Math.floor(jumlahTotal.value / isi.value)
    : jumlahTotal.value
})

function onInput(val) {
  const parsed = parseInt(val) || 0
  jumlahTotal.value =
    inputMode.value === props.satuanBesar ? parsed * isi.value : parsed
}

function increase() {
  hasInteracted.value = true
  const step = inputMode.value === props.satuanBesar ? isi.value : 1
  if (jumlahTotal.value + step <= props.maxPcs) {
    jumlahTotal.value += step
  }
}

function decrease() {
  hasInteracted.value = true
  const step = inputMode.value === props.satuanBesar ? isi.value : 1
  if (jumlahTotal.value - step >= 0) {
    jumlahTotal.value -= step
  }
}

function handleSatuanBesar() {
  if (props.maxPcs < isi.value) {
    $q.notify({
      type: 'warning',
      message: `Stok belum cukup untuk ${props.satuanBesar}`,
    })
    return
  }
  inputMode.value = props.satuanBesar
  emit('update:inputMode', props.satuanBesar)
}

function handleSatuanKecil() {
  inputMode.value = props.satuanKecil
  emit('update:inputMode', props.satuanKecil)
}

onMounted(() => {
  inputMode.value = props.defaultUnit
  internalValue.value = props.modelValue
  hasInteracted.value = false
})

watch(inputMode, () => {
  if (!hasInteracted.value) {
    internalValue.value = props.modelValue
  } else {
    jumlahTotal.value = 0
  }
})

watch(() => props.modelValue, (val) => {
  internalValue.value = val
})

watch(internalValue, (val) => {
  if (val !== props.modelValue) {
    emit('update:modelValue', val)
  }
})
</script>
