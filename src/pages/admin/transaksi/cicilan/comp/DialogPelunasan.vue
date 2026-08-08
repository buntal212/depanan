<template>
  <q-dialog
    v-model="store.isOpenDP"
    persistent
    @show="
      () => {
        store.form.jumlah = 0
      }
    "
  >
    <q-card style="min-width: 550px">
      <q-card-section class="row items-center q-pb-none">
        <div class="text-h6">Pelunasan Down Payment</div>
        <q-space />
        <q-btn icon="close" flat round dense v-close-popup @click="store.isOpenDP = false" />
      </q-card-section>

      <q-card-section class="q-pt-none">
        <div class="row q-mt-sm justify-between">
          <div class="col-4">Total Nota</div>
          <div class="col-3 text-right">{{ formatDouble(totalHutang()) || 0 }}</div>
        </div>
        <div class="row q-mt-sm justify-between">
          <div class="col-4">Pembayranan Down Payment</div>
          <div class="col-3 text-right">{{ formatDouble(totalDp()) }}</div>
        </div>
        <div class="row q-mt-sm justify-between">
          <div class="col-4">Retur</div>
          <div class="col-3 text-right">{{ formatDouble(totalRetur()) }}</div>
        </div>
        <!-- <div class="row q-mt-sm justify-between">
          <div class="col-4">Total Cicilan</div>
          <div class="col-3 text-right">{{ formatDouble(totalCicilan()) }}</div>
        </div> -->
        <div class="row q-mt-sm justify-between">
          <div class="col-4">Sisa Pembayaran</div>
          <div class="col-3 text-right">
            {{ formatDouble(totalHutang() - totalDp() - totalRetur()) }}
          </div>
        </div>

        <app-input-rp
          currency
          v-model="store.form.jumlah"
          label="Jumlah Dibayarkan"
          outlined
          dense
          class="q-mt-sm"
          :disable="store.loading"
          @update:model-value="updateValue"
          @keyup.enter="store.simpanPelunasan"
        />

        <app-select
          class="col-12"
          v-model="store.form.cara_bayar"
          label="Pilih Cara Bayar"
          :options="['cash', 'transfer']"
          :disable="store.loading"
          :loading="store.loading"
        />
      </q-card-section>

      <q-card-actions align="right">
        <app-btn
          label="Simpan"
          color="grey-10"
          class="text-yellow-9"
          :loading="store.loading"
          :disable="store.loading || store.form.jumlah <= 0"
          @click="store.simpanPelunasan"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { formatDouble } from 'src/modules/formatter'
import { useCicilanPenjualanFormStore } from 'src/stores/admin/transaksi/cicilan/form'
// import { useListCicilanPenjualanStore } from 'src/stores/admin/transaksi/cicilan/list'

const store = useCicilanPenjualanFormStore()
// const list = useListCicilanPenjualanStore()
function updateValue(val) {
  const _removedZeros = val?.replace(/^0+/, '')
  if (val > 1) {
    store.form.jumlah = _removedZeros
  }
  // store.form.jumlah = val
}
function totalDp() {
  const item = store.item
  return item.bayar ?? 0
}
function totalHutang() {
  // tidak ada pelanggan id
  const item = store.item
  const hutang1 = item?.total

  return hutang1
}
function totalRetur() {
  const item = store.item
  const retur = item?.header_retur?.reduce((a, b) => a + parseFloat(b?.total ?? 0), 0) ?? 0

  return retur
}
</script>
