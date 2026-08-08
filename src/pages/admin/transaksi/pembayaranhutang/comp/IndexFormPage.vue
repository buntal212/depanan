<template>
  <div class="fit column q-pa-md items-center f-24">
    <div class="full-width row">
      <div class="f-12 items-left col-1">
        <app-btn-back @click="emits('back')" class="bg-black text-yellow-8" />
      </div>
      <div class="text-center col-10 q-pr-xl">Form Pembayaran Hutang</div>
    </div>
    <div class="text-center">No. Pembayaran : {{ storeform.form.nopembayaran }}</div>
    <div class="row full-width q-px-xl q-gutter-x-sm">
      <div class="col-3">
        <app-input-date
          :model="storeform.dateDisplay.tgl"
          label="Tgl pembayaran"
          style="min-width: 150px"
          outlined
          :disable="storeform.form.nopembayaran !== ''"
          @set-model="
            (val) => {
              storeform.dateDisplay.tgl = val
            }
          "
          @db-model="
            (val) => {
              storeform.form.tgl = val
            }
          "
        />
      </div>
      <div class="col-3">
        <app-select
          label="Supplier"
          v-model="storeform.form.kdsuplier"
          :options="storesupllier.itemsall"
          option-label="nama"
          option-value="kodesupl"
          :valid="storeform.form.kdsuplier === ''"
          :disable="storeform.form.nopembayaran !== ''"
        />
      </div>
      <div class="col-2">
        <q-select
          outlined
          dense
          label="Cara Bayar"
          v-model="storeform.form.carabayar"
          :options="['', 'Transfer', 'Tunai']"
          :disable="storeform.form.nopembayaran !== ''"
        />
      </div>
      <div class="col-3">
        <q-input
          outlined
          dense
          label="Keterangan"
          v-model="storeform.form.keterangan"
          :options="['', 'Transfer', 'Tunai']"
          :disable="storeform.form.nopembayaran !== ''"
        />
      </div>
      <div class="col-auto">
        <app-btn
          size="md"
          :dense="false"
          color="grey-10"
          class="text-yellow-8"
          icon="find_in_page"
          @click="carihutang()"
        />
      </div>
    </div>
    <div class="full-width text-center"><q-separator class="q-mt-sm" /></div>
    <div class="full-width">
      <q-table
        title="Daftar Hutang Yang Dibayar"
        :rows="semuaRinci"
        :columns="columns"
        row-key="nopenerimaan"
        flat
        bordered
        class="q-mt-md"
        :pagination="{ rowsPerPage: 0 }"
        hide-bottom
      >
        <template v-slot:body-cell-no="props">
          <q-td :props="props">
            {{ props.rowIndex + 1 }}
          </q-td>
        </template>

        <template v-slot:bottom-row>
          <q-tr>
            <q-td colspan="4" class="text-right text-weight-bold text-red"> Total </q-td>
            <q-td class="text-right text-weight-bold text-red">
              {{ formatRpDouble(totalJumlah) }}
            </q-td>
          </q-tr>
        </template>
        <template v-slot:body-cell-aksi="props">
          <q-td :props="props">
            <q-btn
              :loadingrincian="props.row._deleting"
              icon="delete"
              color="red"
              flat
              dense
              @click="hapusData(props.row)"
            />
          </q-td>
        </template>
      </q-table>
    </div>
  </div>
  <DialogListHutang :msupplier="storesupllier.itemsall" />
</template>
<script setup>
import { useAdminMasterSupplierStore } from 'src/stores/admin/master/supplier/list'
import { useAdminFormTransaksiPembayaranHutangStore } from 'src/stores/admin/transaksi/pembayaranhutang/form'

import DialogListHutang from './DialogListHutang.vue'
import { notifError } from 'src/modules/notifs'
import { computed, onMounted } from 'vue'
import { date, useQuasar } from 'quasar'
import { formatRpDouble } from 'src/modules/utils'
import { useAdminListTransaksiPembayaranHutangStore } from 'src/stores/admin/transaksi/pembayaranhutang/list'

const emits = defineEmits(['back'])

const storeform = useAdminFormTransaksiPembayaranHutangStore()
const storelist = useAdminListTransaksiPembayaranHutangStore()
const storesupllier = useAdminMasterSupplierStore()

const $q = useQuasar()

const props = defineProps({
  data: {
    type: Object,
    default: null,
  },
})

const semuaRinci = computed(() => {
  return storelist.rinci.map((item) => ({
    id: item.id,
    nopenerimaan: item.nopenerimaan,
    noorder: item.penerimaan?.noorder || '-',
    nofaktur: item.penerimaan?.nofaktur || '-',
    total: Number(item.total) || 0,
    _deleting: false, // ← ini tambahan
  }))
})

const columns = [
  { name: 'no', label: 'No.', field: 'no', align: 'left' },
  { name: 'nopenerimaan', label: 'No. Penerimaan', field: 'nopenerimaan', align: 'left' },
  { name: 'noorder', label: 'No. Orderan', field: 'noorder', align: 'left' },
  { name: 'nofaktur', label: 'No. Faktur', field: 'nofaktur', align: 'left' },
  {
    name: 'total',
    label: 'Jumlah',
    field: 'total',
    align: 'right',
    format: (val) => formatRpDouble(val),
  },
  {
    name: 'aksi',
    label: 'Aksi',
    field: 'aksi',
    align: 'center',
  },
]

const totalJumlah = computed(() => {
  return semuaRinci.value.reduce((sum, item) => sum + (parseFloat(item.total) || 0), 0)
})

function carihutang() {
  if (storeform.form.kdsuplier === '') {
    return notifError('Maaf Supplier Tidak Boleh Kosong...!!!')
  } else if (storeform.form.carabayar === '') {
    return notifError('Maaf Cara Bayar Tidak Boleh Kosong...!!!')
  } else if (storeform.form.keterangan === '') {
    return notifError('Maaf Keterangan Tidak Boleh Kosong...!!!')
  } else {
    storeform.basic = true
    storeform.listhutang()
  }
}

function hapusData(item) {
  // const arr = storelist.rinci.filter((x) => x.id !== item.id)
  // storelist.rinci = arr
  $q.dialog({
    dark: true,
    title: 'Peringatan',
    message: 'Apakah Data ini akan dihapus?',
    cancel: true,
    persistent: true,
  })
    .onOk(async () => {
      // console.log('OK')
      item._deleting = true
      try {
        await storelist.deleteData(item.id, storeform.form.nopembayaran)
      } catch (e) {
        console.log('del Pembayaran Hutang error', e)
      } finally {
        item._deleting = false // reset loading
      }
    })
    .onCancel(() => {
      // console.log('Cancel')
    })
    .onDismiss(() => {
      // console.log('I am triggered on both OK and Cancel')
    })
}

onMounted(() => {
  if (
    props?.data?.notrans === '' ||
    props?.data?.notrans === null ||
    props?.data?.notrans === undefined
  ) {
    storeform.form.nopembayaran = ''
    storeform.form.kdsuplier = ''
    storeform.form.carabayar = ''
    storeform.form.keterangan = ''
  } else {
    storeform.form.nopembayaran = props?.data?.notrans
    storeform.form.tgl = props?.data?.tgl
    storeform.dateDisplay.tgl = date.formatDate(props?.data?.tgl, 'DD MMMM YYYY')
    storeform.form.kdsuplier = props?.data?.kdsuplier
    storeform.form.carabayar = props?.data?.jenis_pembayaran
    storeform.form.keterangan = props?.data?.keterangan
    storelist.rinci = props?.data?.rinci
  }
})

storesupllier.getAllList()
</script>
