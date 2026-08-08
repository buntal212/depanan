<template>
  <div class="fit column q-pa-md items-center f-24">
    <div class="full-width row">
      <div class="f-12 items-left col-1">
        <app-btn-back @click="emits('back')" class="bg-black text-yellow-8" />
      </div>
      <div class="text-center col-10 q-pr-xl">
        Form Pencatatan Nota Yang Dibawah/dikembalikan Sales
      </div>
    </div>
    <div class="text-center">No. Transaksi : {{ storeform.form.notrans || '-' }}</div>
    <div class="row full-width q-px-xl q-gutter-x-sm">
      <div class="col-3">
        <app-input-date
          :model="storeform.dateDisplay.tgl"
          label="Tgl pembayaran"
          style="min-width: 150px"
          outlined
          :disable="storeform.form.notrans !== ''"
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
      <div class="col-4">
        <app-select
          label="Sales Peminjam"
          v-model="storeform.form.kdsales"
          :options="sales"
          option-label="nama"
          option-value="id"
          :valid="storeform.form.kdsales === ''"
          :disable="storeform.form.notrans !== ''"
        />
      </div>
      <div class="col-4">
        <q-select
          outlined
          dense
          label="Status"
          v-model="storeform.form.keterangan"
          :options="['', 'Dipinjam', 'Dikembalikan']"
          :disable="storeform.form.notrans !== ''"
        />
      </div>

      <div class="col-auto" v-if="storeform.form.kunci !== '1'">
        <app-btn
          size="md"
          :dense="false"
          color="grey-10"
          class="text-yellow-8"
          icon="find_in_page"
          @click="carinota(storeform.form.keterangan)"
        />
      </div>
      <div class="col-auto">
        <app-btn
          size="md"
          :dense="false"
          color="grey-10"
          class="text-yellow-8"
          icon="vpn_key"
          :loading="storeform.loadingkunci"
          @click="kunci(storeform.form.notrans)"
        />
      </div>
      <div class="col-auto" v-if="storeform.form.kunci === '1'">
        <app-btn-cetak class="q-mr-xs" @click="lihatCetak()"></app-btn-cetak>
      </div>
    </div>
    <div class="full-width text-center"><q-separator class="q-mt-sm" /></div>
    <div class="full-width">
      <q-table
        title="Daftar Piutang Yang Dibayar"
        :rows="semuaRinci"
        :columns="columns"
        row-key="notaPenjualan"
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
            <q-td colspan="6" class="text-right text-weight-bold text-red"> Total </q-td>
            <q-td class="text-right text-weight-bold text-red">
              {{ formatRpDouble(totalJumlah) }}
            </q-td>
          </q-tr>
        </template>
        <template v-slot:body-cell-aksi="props">
          <q-td :props="props">
            <q-btn
              :loading="loadingItem[props.row.id]"
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
  <DialogListPiutang v-if="props.pelanggan.length" :pelanggan="props.pelanggan" />

  <DialogCetak v-if="storeform.opendialogCetak === true" v-model="storeform.opendialogCetak" />
  <DialogCetak v-else v-model="storeform.opendialogCetakkedua" />
</template>
<script setup>
import { notifError } from 'src/modules/notifs'
import { computed, defineAsyncComponent, onMounted, ref, shallowRef } from 'vue'
import { date, useQuasar } from 'quasar'
// import { formatRpDouble } from 'src/modules/utils'
import { useAdminFormTransaksiNotaSalesStore } from 'src/stores/admin/transaksi/notasales/form'
import { useAdminListTransaksiNotaSalesstore } from 'src/stores/admin/transaksi/notasales/list'

import DialogListPiutang from './DialogListPiutang.vue'
import { formatRpDouble } from 'src/modules/utils'
const DialogCetak = shallowRef(defineAsyncComponent(() => import('./cetak/DialogCetak.vue')))
const emits = defineEmits(['back'])

const $q = useQuasar()

const storeform = useAdminFormTransaksiNotaSalesStore()
const storelist = useAdminListTransaksiNotaSalesstore()

const loadingItem = ref({})

// const $q = useQuasar()

const props = defineProps({
  data: {
    type: Object,
    default: null,
  },
  pegawai: {
    type: Array,
    default: () => [],
  },
  pelanggan: {
    type: Array,
    default: () => [],
  },
})

const sales = computed(() => {
  if (!Array.isArray(props.pegawai)) return []
  const sales = props.pegawai.filter((f) => f?.jabatan === 'Sales')
  const salesx = sales.map((x) => {
    return {
      id: x.id,
      nama: x.nama,
    }
  })
  return salesx
})

const semuaRinci = computed(() => {
  return storelist.rinci.map((item) => ({
    id: item.id,
    notaPenjualan: item.notaPenjualan,
    tgljatuhtempo: item.tgljatuhtempo || '-',
    pelanggan: item?.hederpenjualan?.pelanggan?.nama || '-',
    alamat: item?.hederpenjualan?.pelanggan?.alamat || '-',
    sales: item?.hederpenjualan?.sales?.nama || '-',
    // terbayar: item.terbayar || '-',
    total: Number(item.total) || 0,
    _deleting: false, // ← ini tambahan
  }))
})

const columns = [
  { name: 'no', label: 'No.', field: 'no', align: 'left' },
  { name: 'notaPenjualan', label: 'No. Penjualan', field: 'notaPenjualan', align: 'left' },
  { name: 'pelanggan', label: 'Pelanggan', field: 'pelanggan', align: 'left' },
  { name: 'alamat', label: 'Alamat', field: 'alamat', align: 'left' },
  { name: 'tgljatuhtempo', label: 'Tgl Jatuh Tempo', field: 'tgljatuhtempo', align: 'left' },
  { name: 'sales', label: 'Sales', field: 'sales', align: 'left' },
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

function carinota(val) {
  if (storeform.form.kdsales === '') {
    return notifError('Maaf Sales Tidak Boleh Kosong...!!!')
  } else if (storeform.form.keterangan === '') {
    return notifError('Maaf Status Tidak Boleh Kosong...!!!')
  } else {
    storeform.basicpiutang = true
    storeform.caripiutang(val)
  }
}

function lihatCetak() {
  // console.log('lihat cetak', storeform.itemCetak)
  const namasales = sales.value.find((f) => f?.id === storeform.form.kdsales)
  storeform.opendialogCetakkedua = true
  storeform.itemCetak = storelist.items.find((x) => x.notrans === storeform.form.notrans)
  storeform.itemCetak.sales = namasales.nama
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
      loadingItem.value[item.id] = true
      console.log('OK', item._deleting)
      try {
        await storelist.deleteData(
          item.id,
          storeform.form.notrans,
          item.notaPenjualan,
          storeform.form.keterangan,
        )
      } catch (e) {
        console.log('del Pembayaran Hutang error', e)
      } finally {
        loadingItem.value[item.id] = false
      }
    })
    .onCancel(() => {
      // console.log('Cancel')
    })
    .onDismiss(() => {
      // console.log('I am triggered on both OK and Cancel')
    })
}

function kunci(value) {
  if (storeform.form.kunci === '1') {
    return notifError('Maaf Data ini Sudah Dikunci...!!')
  } else {
    storeform.kunci(value).then(() => {
      // if (res?.status == 200) {
      storeform.opendialogCetak = true
      // console.log('cetaaaks', storeform.itemCetak)
      // }
    })
  }
}

onMounted(() => {
  // if (!props.data) return
  if (
    props?.data?.notrans === '' ||
    props?.data?.notrans === null ||
    props?.data?.notrans === undefined
  ) {
    storeform.form.notrans = ''
    storeform.form.kdsales = ''
    storeform.form.keterangan = ''
    storeform.form.kunci = ''
    storelist.rinci = []
  } else {
    storeform.form.notrans = props?.data?.notrans
    storeform.form.tgl = props?.data?.tgl
    storeform.form.kunci = props?.data?.kunci
    storeform.dateDisplay.tgl = date.formatDate(props?.data?.tgl, 'DD MMMM YYYY')
    const kdsales = parseInt(props?.data?.kdsales)
    const sales = props.pegawai.find((f) => f?.id === kdsales)

    storeform.form.kdsales = sales?.id ?? null

    // console.log('storeform.form.kdsales', storeform.form.kdsales)
    storeform.form.keterangan = props?.data?.keterangan
    storelist.rinci = props?.data?.rinci

    // console.log('rincian', storelist.rinci)
  }
})
</script>
