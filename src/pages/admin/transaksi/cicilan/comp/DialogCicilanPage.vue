<template>
  <q-dialog
    v-model="store.isOpen"
    persistent
    @show="
      () => {
        store.form.jumlah = 0
      }
    "
  >
    <q-card style="min-width: 550px">
      <q-card-section class="row items-center q-pb-none">
        <div class="text-h6">Pembayaran Cicilan</div>
        <q-space />
        <q-btn icon="close" flat round dense v-close-popup @click="store.isOpenDetail = false" />
      </q-card-section>

      <q-card-section class="q-pt-none">
        <div class="row q-mt-sm justify-between">
          <div class="col-4">Total Hutang</div>
          <div class="col-3 text-right">{{ formatDouble(totalHutang()) || 0 }}</div>
        </div>
        <div class="row q-mt-sm justify-between">
          <div class="col-4">Total Down Payment</div>
          <div class="col-3 text-right">{{ formatDouble(totalDp()) }}</div>
        </div>
        <div class="row q-mt-sm justify-between">
          <div class="col-4">Total Retur</div>
          <div class="col-3 text-right">{{ formatDouble(totalRetur()) }}</div>
        </div>
        <div class="row q-mt-sm justify-between">
          <div class="col-4">Total Cicilan</div>
          <div class="col-3 text-right">{{ formatDouble(totalCicilan()) }}</div>
        </div>
        <div class="row q-mt-sm justify-between">
          <div class="col-4">Sisa Hutang</div>
          <div class="col-3 text-right">
            {{ formatDouble(totalHutang() - totalCicilan() - totalDp() - totalRetur()) }}
          </div>
        </div>
        <div class="row justify-end">
          <q-btn
            size="sm"
            padding="none"
            flag
            icon="info"
            flat
            @click="store.isOpenDetail = !store.isOpenDetail"
          >
            <q-tooltip>{{
              store.isOpenDetail ? 'Tutup detail hutang' : 'Melihat detail hutang'
            }}</q-tooltip></q-btn
          >
        </div>
        <div v-if="store.isOpenDetail">
          <div class="row">
            <div style="width: 32%" class="col-auto">Nota</div>
            <div style="width: 17%" class="col-auto text-right">Hutang</div>
            <div style="width: 17%" class="col-auto text-right">DP</div>
            <div style="width: 17%" class="col-auto text-right">Dibayar</div>
            <div style="width: 17%" class="col-auto text-right">Sisa</div>
          </div>
          <q-separator />
          <div v-for="item in cariPenjualan()" :key="item.id" class="row">
            <div style="width: 32%" class="col-auto">{{ item.no_penjualan }}</div>

            <div style="width: 17%" class="col-auto text-right">
              {{ formatDouble(item?.total - item?.bayar - retur(item)) }}
            </div>
            <div style="width: 17%" class="col-auto text-right">
              {{ formatDouble(item?.bayar) }}
            </div>
            <div style="width: 17%" class="col-auto text-right">
              {{ formatDouble(cariCicilan(item)) }}
            </div>
            <div style="width: 17%" class="col-auto text-right">
              {{ formatDouble(item?.total - item?.bayar - cariCicilan(item) - retur(item)) }}
            </div>
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
          @keyup.enter="store.simpanCicilan"
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
          @click="store.simpanCicilan"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { formatDouble } from 'src/modules/formatter'
import { useCicilanPenjualanFormStore } from 'src/stores/admin/transaksi/cicilan/form'
import { useListCicilanPenjualanStore } from 'src/stores/admin/transaksi/cicilan/list'

const store = useCicilanPenjualanFormStore()
const list = useListCicilanPenjualanStore()
function updateValue(val) {
  const _removedZeros = val?.replace(/^0+/, '')
  if (val > 1) {
    store.form.jumlah = _removedZeros
  }
  // store.form.jumlah = val
}
function cariCicilan(item) {
  return item?.cicilan?.reduce((a, b) => a + parseFloat(b.jumlah), 0) ?? 0
}
function totalCicilan() {
  const total =
    list.items
      ?.filter((f) => f.pelanggan_id === store?.item?.pelanggan?.id)
      ?.flatMap((x) => x?.cicilan)
      ?.reduce((a, b) => a + parseFloat(b?.jumlah ?? 0), 0) ?? 0

  return total
}
function totalDp() {
  const dp =
    list.items
      ?.filter((f) => f.pelanggan_id === store?.item?.pelanggan?.id)
      ?.reduce((a, b) => a + parseFloat(b?.bayar ?? 0), 0) ?? 0
  const item = store.item
  const dp1 = item.bayar
  return !item.pelanggan_id ? dp1 : dp
}
function totalHutang() {
  // ada pelanggan
  const hutang =
    list.items
      ?.filter((f) => f.pelanggan_id === store?.item?.pelanggan?.id)
      ?.reduce((a, b) => a + parseFloat(b?.total ?? 0), 0) ?? 0
  // const retur=list.items?.filter(f=>f.pelanggan_id===store?.item?.pelanggan?.id)?.flatMap(x=>x?.header_retur)?.reduce((a, b) => a + parseFloat(b?.total??0), 0) ?? 0
  // const dp=list.items?.filter(f=>f.pelanggan_id===store?.item?.pelanggan?.id)?.reduce((a, b) => a + parseFloat(b?.bayar??0), 0) ?? 0

  const adaPelangganId = hutang

  // tidak ada pelanggan id
  const item = store.item
  const hutang1 = item?.total
  // const retur1=item?.header_retur?.reduce((a, b) => a + parseFloat(b?.total??0), 0) ?? 0
  // const dp1=item.bayar

  const tanpaPelangganId = hutang1

  return adaPelangganId > 0 ? adaPelangganId : tanpaPelangganId > 0 ? tanpaPelangganId : 0
}
function totalRetur() {
  let retur =
    list.items
      ?.filter((f) => f.pelanggan_id === store?.item?.pelanggan?.id)
      ?.flatMap((x) => x?.header_retur)
      ?.reduce((a, b) => a + parseFloat(b?.total ?? 0), 0) ?? 0
  // const item=store.item
  // if(retur?.length==0 || !item.pelanggan_id) retur=item?.header_retur?.reduce((a, b) => a + parseFloat(b?.total??0), 0) ?? 0

  return retur
}
function cariPenjualan() {
  const data = list.items?.filter((f) => f.pelanggan_id === store?.item?.pelanggan?.id)
  // const item=store.item
  // if(data?.length==0 || !item.pelanggan_id)data.push(item)
  return data
}
function retur(item) {
  return item?.header_retur?.reduce((a, b) => a + parseFloat(b.total), 0) ?? 0
}
</script>
