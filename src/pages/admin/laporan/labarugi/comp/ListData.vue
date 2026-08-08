<template>
  <div class="row full-width justify-center q-pt-md q-pb-md">
    <template v-if="store.items">
      <div class="col-12 text-center q-pb-md">
        <div class="text-bold">LAPORAN LABA RUGI</div>
        <div class="text-bold">
          Periode {{ monthOnly(store.params.bulan) }} {{ store.params.tahun }}
        </div>
      </div>
      <q-markup-table class="" style="width: 50%" wrap-cells>
        <thead></thead>

        <tbody>
          <tr class="bg-yellow-9">
            <td class="text-bold">Pendapatan dari Penjualan</td>
            <td class="text-bold text-right">Jumlah (Rp)</td>
          </tr>
          <tr v-for="item in store.items?.penjualan" :key="item">
            <td>
              <div class="row q-pl-sm">- {{ item.keterangan }}</div>
            </td>
            <td class="text-right">{{ formattanpaRp(item.total) }}</td>
          </tr>
          <tr>
            <td>
              <div class="row q-pl-sm">- Harga Pokok Penjualan</div>
            </td>
            <td class="text-right">({{ formattanpaRp(store.items?.hpp) }})</td>
          </tr>
          <tr class="bg-grey-9">
            <td class="text-bold text-center">Laba Kotor</td>
            <td class="text-bold text-right">{{ formattanpaRp(store.items?.laba_kotor) }}</td>
          </tr>
          <tr class="bg-yellow-9">
            <td class="text-bold">Beban Operasioanl</td>
            <td class="text-bold text-right">Jumlah (Rp)</td>
          </tr>
          <tr v-for="item in store.items?.beban" :key="item">
            <td>
              <div class="row q-pl-sm">- {{ item.keterangan }}</div>
            </td>
            <td class="text-right">({{ formattanpaRp(item.total) }})</td>
          </tr>
          <tr class="bg-grey-9">
            <td class="text-bold text-center">Laba Bersih</td>
            <td class="text-bold text-right">
              {{ formattanpaRp(store.items?.laba_operasional) }}
            </td>
          </tr>
          <!-- <tr class="">
            <td class="text-bold">Laba Bersih</td>
            <td class="text-bold text-right">{{ formattanpaRp(store.items?.laba_operasional) }}</td>
          </tr> -->
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
// import { formattanpaRp } from 'src/modules/utils'
import { formattanpaRp, monthOnly } from 'src/modules/utils'
import { useLaporanLabaRugi } from 'src/stores/admin/laporan/labarugi/storedata'

const store = useLaporanLabaRugi()

// function totalPenerimaan() {
//   const total = store.items.map((x) => parseFloat(x.total)).reduce((a, b) => a + b, 0)
//   return total
// }
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
