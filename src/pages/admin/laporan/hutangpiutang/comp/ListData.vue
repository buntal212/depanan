<template>
  <div class="row full-width justify-center q-pt-md q-pb-md">
    <template v-if="store.items">
      <div class="items-center" style="width: 50%">
        <div class="col-12 q-pb-md">
          <div class="text-bold">1. LAPORAN REKAP HUTANG</div>
          <div class="text-bold">
            Periode {{ monthOnly(store.params.bulan) }} {{ store.params.tahun }}
          </div>
        </div>
        <q-markup-table class="" wrap-cells>
          <thead></thead>

          <tbody>
            <tr class="bg-yellow-9">
              <td class="text-bold">Keterangan</td>
              <td class="text-bold text-right">Jumlah (Rp)</td>
            </tr>
            <tr v-for="item in store.items?.datahutang" :key="item">
              <td v-if="item.totalkredit > 0 || item.totaldebit > 0">
                <div class="row q-pl-sm">- {{ item.keterangan }}</div>
              </td>
              <td v-if="item.totalkredit || item.totaldebit" class="text-right">
                <div class="q-pr-xl">
                  {{ formattanpaRp(item.totaldebit ? item.totaldebit : '') }}
                </div>
                <div class="q-pr-md">
                  {{ formattanpaRp(item.totalkredit ? item.totalkredit : '') }}
                </div>
              </td>
            </tr>
            <tr class="bg-grey-9">
              <td class="text-bold text-center">Sisa Hutang</td>
              <td class="text-bold text-right">
                {{ formattanpaRp(store.items?.sisahutang) }}
              </td>
            </tr>
          </tbody>
        </q-markup-table>

        <div class="col-12 q-pb-md q-pt-xl">
          <div class="text-bold">2. LAPORAN REKAP PIUTANG</div>
          <div class="text-bold">
            Periode {{ monthOnly(store.params.bulan) }} {{ store.params.tahun }}
          </div>
        </div>
        <q-markup-table class="" wrap-cells>
          <thead></thead>

          <tbody>
            <tr class="bg-yellow-9">
              <td class="text-bold">Keterangan</td>
              <td class="text-bold text-right">Jumlah (Rp)</td>
            </tr>
            <tr v-for="item in store.items?.datapiutang" :key="item">
              <td v-if="item.totalkredit > 0 || item.totaldebit > 0">
                <div class="row q-pl-sm">- {{ item.keterangan }}</div>
              </td>
              <td v-if="item.totalkredit || item.totaldebit" class="text-right">
                <div class="q-pr-xl">
                  {{ formattanpaRp(item.totaldebit ? item.totaldebit : '') }}
                </div>
                <div class="q-pr-md">
                  {{ formattanpaRp(item.totalkredit ? item.totalkredit : '') }}
                </div>
              </td>
            </tr>
            <tr class="bg-grey-9">
              <td class="text-bold text-center">Sisa Piutang</td>
              <td class="text-bold text-right">
                {{ formattanpaRp(store.items?.sisapiutang) }}
              </td>
            </tr>
          </tbody>
        </q-markup-table>
      </div>
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
import { useLaporanHutangPiutang } from 'src/stores/admin/laporan/hutangpiutang/storedata'

const store = useLaporanHutangPiutang()

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
