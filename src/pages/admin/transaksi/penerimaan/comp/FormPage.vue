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
  <pre>{{ data }}</pre>
</template>
<script setup>
import { useAdminFormTransaksiPenerimaanBarangStore } from 'src/stores/admin/transaksi/penerimaan/form'
import FormRincianPage from './FormRincianPage.vue'
import ListRincianPage from './ListRincianPage.vue'
import { onMounted } from 'vue'
// import { formatRpDouble } from 'src/modules/utils'

const store = useAdminFormTransaksiPenerimaanBarangStore()
const emits = defineEmits(['back'])

const props = defineProps({
  data: {
    type: Object,
    default: null,
  },
})
onMounted(() => {
  // console.log('penerimaan', props?.data)
  if (
    props?.data?.nopenerimaan === '' ||
    props?.data?.nopenerimaan === null ||
    props?.data?.nopenerimaan === undefined
  ) {
    store.form.nopenerimaan = ''
    store.form.nofaktur = ''
    store.form.noorder = ''
    store.form.kdsuplier = ''
    store.form.pembayaran = 'Cash'
    store.form.jumlahharitempo = 0
    store.form.tgljthtempo = ''
    store.rinci = []
  } else {
    store.form.noorder = props?.data?.noorder
    store.form.kdsuplier = props?.data?.kdsuplier
    store.form.nopenerimaan = props?.data?.nopenerimaan
    store.form.nofaktur = props?.data?.nofaktur
    store.rinci = props?.data?.orderan_h?.rinci
    store.form.kunci = props?.data?.kunci
    store.form.pembayaran = props?.data?.jenis_pembayaran
    store.form.jumlahharitempo = props?.data?.jumlahharitempo
    store.form.tgljthtempo = props?.data?.tgljatuhtempo
    store.hiden = true
  }
})

// const lists = computed(() => {
//   const arr = props.data?.rinci
//   return arr?.sort((a, b) => {
//     return b.id - a.id
//   })
// })
</script>
