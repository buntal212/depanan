<template>
  <!-- <pre>{{ props.data?.rinci }}</pre> -->
  <div class="fit column q-pa-md items-center f-24">
    <div class="full-width row">
      <div class="f-12 items-left col-1">
        <app-btn-back @click="emits('back')" class="bg-black text-yellow-8" />
      </div>
      <div class="text-center col-10 q-pr-xl">Form Pembayaran Piutang</div>
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
          label="Pelanggan"
          v-model="storeform.form.pelanggan_id"
          :options="storepelanggan.itemsall"
          :loading="storepelanggan.loading"
          option-label="nama"
          option-value="id"
          :valid="storeform.form.pelanggan_id === ''"
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
          @click="caripiutang()"
        />
      </div>
    </div>
    <div class="full-width text-center"><q-separator class="q-mt-sm" /></div>
    <div class="full-width">
      <q-table
        title="Daftar Hutang Yang Dibayar"
        :rows="semuaRinci"
        :columns="columns"
        row-key="nopembayaran"
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
            <q-td colspan="3" class="text-right text-weight-bold text-red"> Total </q-td>
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
  <DialogListHutang :pelanggan="storepelanggan.itemsall" />
</template>
<script setup>
import DialogListHutang from './DialogListHutang.vue'
import { notifError } from 'src/modules/notifs'
import { computed, onMounted } from 'vue'
import { date, useQuasar } from 'quasar'
import { formatRpDouble } from 'src/modules/utils'
import { useAdminMasterPelangganStore } from 'src/stores/admin/master/pelanggan/list'
import { useAdminFormTransaksiPembayaranPiutangStore } from 'src/stores/admin/transaksi/pembayaranpiutang/form'
import { useAdminListTransaksiPembayaranPiutangStore } from 'src/stores/admin/transaksi/pembayaranpiutang/list'

const emits = defineEmits(['back'])

const storeform = useAdminFormTransaksiPembayaranPiutangStore()
const storelist = useAdminListTransaksiPembayaranPiutangStore()
const storepelanggan = useAdminMasterPelangganStore()

const $q = useQuasar()

const props = defineProps({
  data: {
    type: Object,
    default: null,
  },
})

const semuaRinci = computed(() => {
  const tgl = props.data?.tgl
  return (storelist.rinci || []).map((item) => ({
    id: item.id,
    nopenjualan: item.no_penjualan,
    tgl_bayar: item.tgl_bayar || tgl,
    nofaktur: item.penerimaan?.nofaktur || '-',
    total: Number(item.jumlah) || 0,
    _deleting: false, // ← ini tambahan
  }))
})

const columns = [
  { name: 'no', label: 'No.', field: 'no', align: 'left' },
  { name: 'nopenjualan', label: 'No. Penjualan', field: 'nopenjualan', align: 'left' },
  { name: 'tgl_bayar', label: 'Tgl Bayar', field: 'tgl_bayar', align: 'left' },
  {
    name: 'jumlah',
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

function caripiutang() {
  if (storeform.form.pelanggan_id === '') {
    return notifError('Maaf Pelanggan Tidak Boleh Kosong...!!!')
  } else if (storeform.form.carabayar === '') {
    return notifError('Maaf Cara Bayar Tidak Boleh Kosong...!!!')
  } else if (storeform.form.keterangan === '') {
    return notifError('Maaf Keterangan Tidak Boleh Kosong...!!!')
  } else {
    storeform.basic = true
    storeform.listpiutang()
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
  console.log('props', props.data)
  if (
    props?.data?.nopembayaran === '' ||
    props?.data?.nopembayaran === null ||
    props?.data?.nopembayaran === undefined
  ) {
    storeform.form.nopembayaran = ''
    storeform.form.pelanggan_id = ''
    storeform.form.carabayar = ''
    storeform.form.keterangan = ''
    storeform.form.tgl = date.formatDate(Date.now(), 'YYYY-MM-DD')
    storeform.dateDisplay.tgl = date.formatDate(Date.now(), 'DD MMMM YYYY')
    storelist.rinci = []
  } else {
    storeform.form.nopembayaran = props?.data?.nopembayaran
    storeform.form.tgl = props?.data?.tgl_bayar
    storeform.dateDisplay.tgl = date.formatDate(props?.data?.tgl, 'DD MMMM YYYY')
    storeform.form.pelanggan_id = props?.data?.kdpelanggan
    storeform.form.carabayar = props?.data?.jenis_pembayaran
    storeform.form.keterangan = props?.data?.keterangan
    storelist.rinci = props?.data?.rinci
  }
})
storepelanggan.getListall()
</script>
