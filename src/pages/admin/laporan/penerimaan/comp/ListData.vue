<template>
  <div class="q-pa-sm full-width">
    <template v-if="store.items.length > 0">
      <div v-if="store.supplier" class="row full-width q-px-md justify-between">
        <div class="col-auto flex-start text-bold q-pr-md">Supplier</div>
        <div class="col flex-end text-bold q-pr-md">: {{ store.supplier }}</div>
      </div>
      <div v-if="store.jnsbayar" class="row full-width q-px-md justify-between">
        <div class="col-auto flex-start text-bold q-pr-md">Pembayaran</div>
        <div class="col flex-end text-bold q-pr-md">: {{ store.jnsbayar }}</div>
      </div>
      <div class="row full-width q-px-md q-pb-sm justify-between">
        <div class="col-auto flex-start text-bold q-pr-md">Total Penerimaan</div>
        <div class="col flex-end text-bold q-pr-md">
          : Rp. {{ formattanpaRp(totalPenerimaan()) }}
        </div>
      </div>
      <q-markup-table style="width: 100%" wrap-cells>
        <thead>
          <tr class="text-bold text-center bg-yellow-8" style="border-bottom: solid">
            <td>NO PENERIMAAN</td>
            <td>TANGGAL FAKTUR</td>
            <td>SUPPLIER</td>
            <td>JENIS PEMBAYARAN</td>
            <td>PENERIMAAN</td>
          </tr>
        </thead>

        <tbody>
          <template v-for="item in store.items" :key="item">
            <tr class="bg-grey-9">
              <td class="text-bold text-left q-px-sm">{{ item.nopenerimaan }}</td>
              <td class="text-bold text-left q-px-sm">{{ item.tgl_faktur }}</td>
              <td class="text-bold text-left q-px-sm">{{ item.namasupplier }}</td>
              <td class="text-bold text-left q-px-sm">{{ item.jenis_pembayaran }}</td>
              <td class="text-bold text-right q-px-sm">
                <div class="row full-width justify-between">
                  <div class="col-auto flex-start">Rp.</div>
                  <div class="flex-end text-right">{{ formattanpaRp(item.total) }}</div>
                </div>
              </td>
            </tr>
            <tr>
              <td colspan="2">
                <div class="row justify-between q-px-sm">
                  <span class="text-bold flex-start"> RINCIAN </span>
                  <span class="text-bold flex-end"> NAMA BARANG </span>
                </div>
              </td>
              <td class="text-bold text-right">JUMLAH</td>
              <td class="text-bold text-right">HARGA BARANG</td>
              <td class="text-bold text-right">TOTAL</td>
            </tr>
            <template v-if="item.rinci && item.rinci?.length > 0">
              <template v-for="rincian in item.rinci" :key="rincian">
                <tr>
                  <!-- <td class="text-right text-bold q-px-sm">{{ rincian.namabarang }}</td> -->
                  <td colspan="2">
                    <div class="text-right q-px-sm">
                      {{ rincian.namabarang }}
                      (seri {{ rincian.motif }})
                    </div>
                    <div class="text-right q-px-sm">
                      Jumlah Barang Rusak: {{ rincian.jumlah_rusak_b }} {{ rincian.satuan_b }}
                    </div>
                  </td>
                  <td>
                    <div class="text-right q-px-sm">
                      {{ rincian.jumlah_datang_b }} {{ rincian.satuan_b }}
                    </div>
                  </td>
                  <td class="q-px-sm">
                    <div class="row justify-between">
                      <div class="col-auto flex-start">Rp.</div>
                      <div class="flex-end text-right q-pr-sm">
                        {{ formattanpaRp(rincian.hargafaktur) }}
                      </div>
                    </div>
                  </td>
                  <td class="q-px-sm">
                    <div class="row justify-between">
                      <div class="col-auto flex-start">Rp.</div>
                      <div class="flex-end text-right q-pr-sm">
                        {{ formattanpaRp(rincian.subtotalfix) }}
                      </div>
                    </div>
                  </td>
                </tr>
                <!-- <template v-if="store.reqs.jenis === '2'">
                  <tr v-for="(item, n) in rincian.items" :key="n">
                    <td></td>
                    <td class="text-left q-px-sm text-grey-8">- {{ item.item }}</td>
                    <td class="text-right q-px-sm text-grey-8" style="width: 20%">
                      {{ item.volume }} {{ item.satuan }} x
                      {{ formattanpaRp(item.harga) }}
                    </td>
                    <td class="text-right q-px-sm">
                      <div class="row justify-between">
                        <div class="col-auto flex-start text-grey-8">Rp.</div>
                        <div class="flex-end text-right q-pr-sm text-grey-8">
                          {{ formattanpaRp(item.pagu) }}
                        </div>
                      </div>
                    </td>
                  </tr>
                </template> -->
              </template>
            </template>
          </template>
        </tbody>
      </q-markup-table>
    </template>
    <!-- <template v-else-if="store.items.length === 0">
      <div class="row justify-center">
        Data Belum Ada, Silahkan Sesuaikan Parameter Terlebih Dahulu
      </div>
    </template> -->
  </div>
</template>
<script setup>
import { formattanpaRp } from 'src/modules/utils'
import { useLaporanPenerimaanStore } from 'src/stores/admin/laporan/penerimaan/list'

const store = useLaporanPenerimaanStore()

function totalPenerimaan() {
  const total = store.items.map((x) => parseFloat(x.total)).reduce((a, b) => a + b, 0)
  return total
}
</script>
<style scoped>
@media print {
  .q-markup-table table {
    border: 1px solid #000 !important;
    border-collapse: collapse !important;
  }
  .q-markup-table th,
  .q-markup-table td {
    border: 1px solid #000 !important;
    padding: 8px !important;
    text-decoration-color: #000 !important;
    color: black !important;
  }
  #printMe {
    margin: 10px;
    padding: 10px;
  }
  body * {
    visibility: visible;
  }
  #printMe,
  #printMe * {
    visibility: visible;
  }
}
</style>
