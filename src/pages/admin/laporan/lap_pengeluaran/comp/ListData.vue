<template>
  <div class="q-pa-sm full-width">
    <template v-if="store.items.length > 0">
      <div class="row full-width q-px-md q-pb-sm justify-between">
        <div class="col-auto flex-start text-bold q-pr-md">Total Pengeluaran</div>
        <div class="col flex-end text-bold q-pr-md">
          : Rp. {{ formattanpaRp(totalPengeluaran()) }}
        </div>
      </div>
      <div class="row q-px-md q-pb-md full-width">
        <span class="text-bold q-pr-sm"> Periode </span>
        <span class="text-bold q-pr-md">
          {{ store.dateDisplay.from }} - {{ store.dateDisplay.to }}
        </span>
      </div>
      <q-markup-table style="width: 100%" wrap-cells>
        <thead>
          <tr class="text-bold text-center bg-yellow-8" style="border-bottom: solid">
            <td style="min-width: 50px; max-width: 70px">NO PENGELUARAN</td>
            <td style="min-width: 30px; max-width: 50px">TANGGAL TRANSAKSI</td>
            <td colspan="2">KETERANGAN</td>
          </tr>
        </thead>

        <tbody>
          <template v-for="item in store.items" :key="item">
            <tr class="bg-grey-9">
              <td class="text-left q-px-sm">
                <div class="col text-bold">
                  {{ item.notrans }} ({{ formatDenganRp(item.total) }})
                </div>
              </td>
              <td class="text-center text-bold q-px-sm">{{ dateDbFormat(item.tgl) }}</td>
              <td colspan="2" class="text-bold text-left q-px-sm">{{ item.keterangan }}</td>
            </tr>
            <tr>
              <td>
                <div class="row justify-between q-px-sm">
                  <span class="text-bold flex-start"> RINCIAN </span>
                  <span class="text-bold flex-end"> ITEM PENGELUARAN </span>
                </div>
              </td>
              <td class="text-bold text-right">JUMLAH</td>
              <td class="text-bold text-right">HARGA</td>
              <td class="text-bold text-right">TOTAL</td>
            </tr>
            <template v-if="item.rincian && item.rincian?.length > 0">
              <template v-for="rincian in item.rincian" :key="rincian">
                <tr>
                  <td>
                    <div class="text-right q-px-sm">
                      {{ rincian.beban }}
                    </div>
                  </td>
                  <td>
                    <div class="text-right q-px-sm">
                      <span>{{ rincian?.volume }} {{ rincian?.satuan }}</span>
                    </div>
                  </td>
                  <td class="q-px-sm">
                    <div class="row justify-between">
                      <div class="col-auto flex-start">Rp.</div>
                      <div class="flex-end text-right q-pr-sm">
                        {{ formattanpaRp(rincian.nominal) }}
                      </div>
                    </div>
                  </td>
                  <td class="q-px-sm">
                    <div class="row justify-between">
                      <div class="col-auto flex-start">Rp.</div>
                      <div class="flex-end text-right q-pr-sm">
                        {{ formattanpaRp(rincian.subtotal) }}
                      </div>
                    </div>
                  </td>
                </tr>
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
import { dateDbFormat, formatDenganRp, formattanpaRp } from 'src/modules/utils'
import { useLaporanPengeluaranStore } from 'src/stores/admin/laporan/lap_pengeluaran/list'

const store = useLaporanPengeluaranStore()

function totalPengeluaran() {
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
