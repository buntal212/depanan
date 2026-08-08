<template>
  <q-dialog persistent backdrop-filter="blur(4px)">
    <q-card style="min-width: 80vw; max-width: 180vw; height: 600px">
      <q-layout view="lHh Lpr lFf" container class="rounded-borders">
        <q-header>
          <q-bar class="bg-black text-white">
            <div>CETAK DATA PENERIMAAN BARANG</div>
            <q-space />

            <q-btn dense flat icon="close" v-close-popup>
              <q-tooltip>Close</q-tooltip>
            </q-btn>
          </q-bar>
        </q-header>
        <q-page-container>
          <div id="printMe">
            <div class="row full-width justify-between">
              <div class="flex-start content-center" style="width: 60%">
                <div class="row q-px-md q-py-md">
                  <div class="q-pr-md" v-if="profil.fotoProfil">
                    <q-img
                      :src="profil.fotoProfil"
                      style="width: 100px; height: 100px; border-radius: 50%; object-fit: cover"
                      spinner-color="primary"
                    />
                  </div>
                  <div class="col content-center">
                    <div class="text-bold" style="font-size: x-large">
                      {{ profil.profilData.namatoko }}
                    </div>
                    <div>
                      {{ profil.profilData.alamat }}
                    </div>
                    <div>
                      <span class="q-pr-sm">Telp : {{ profil.profilData.telepon }}</span>
                      <span>Email : {{ profil.profilData.email }} </span>
                    </div>
                  </div>
                </div>
              </div>
              <div class="col flex-end q-pl-xl q-py-sm content-center">
                <div class="col full-width">
                  <div class="col">Penerimaan dari</div>
                  <div class="col text-bold">{{ store.dataprops?.suplier }}</div>
                </div>

                <div class="row full-width">
                  <span class="col-3">Nomor</span>
                  <span>: {{ store.dataprops?.nopenerimaan }}</span>
                </div>
                <div class="row full-width">
                  <span class="col-3">Tanggal</span>
                  <span>: {{ dateDbFormat(store.dataprops?.tanggal) }}</span>
                </div>
                <div class="col full-width">
                  <span class="col">atas Nota </span>
                  <span class="text-bold"> {{ store.dataprops?.noorder }}</span>
                </div>
              </div>
            </div>
            <div class="full-width justify-center">
              <q-separator />
              <div class="text-center text-bold q-pt-sm" style="font-size: medium">
                NOTA ORDER BARANG
              </div>
              <div class="q-px-md q-pt-sm">
                <table class="full-width">
                  <thead>
                    <tr class="text-center">
                      <th>NO</th>
                      <th>NAMA BARANG</th>
                      <th>QTY ORDER</th>
                      <th>QTY PENERIMAAN</th>
                      <th>HARGA BELI</th>
                      <th>JUMLAH</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="(item, n) in store.dataprops?.rincians" :key="n">
                      <td class="text-center">{{ n + 1 }}</td>
                      <td>{{ item.namabarang }}</td>
                      <td class="text-center">{{ item.jumlahorder }}</td>
                      <td class="text-center">{{ item.jumlahterima }}</td>
                      <td class="text-right">{{ formatRpDouble(item.hargafaktur) }}</td>
                      <td class="text-right">{{ formatRpDouble(item.subtotalfix) }}</td>
                    </tr>
                    <tr>
                      <td colspan="5">
                        <div class="row justify-between">
                          <div class="flex-start">
                            Terbilang : {{ terbilangRupiah(store.dataprops?.total) }} Rupiah,
                          </div>
                          <div class="text-bold flex-end q-pl-sm">TOTAL</div>
                        </div>
                      </td>
                      <td class="text-bold text-right">
                        {{ formatRpDouble(store.dataprops?.total) }}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
            <div class="row justify-between full-width q-pt-md">
              <div class="col flex-start content-center text-center">
                <div class="invisible">.</div>
                <div>Supplier</div>
                <div style="height: 50px"></div>
                <div>{{ store.dataprops?.suplier?.nama }}</div>
              </div>
              <div class="col flex-end content-center text-center">
                <div>Probolinggo, {{ dateFullFormat(store.dataprops?.tglorder) }}</div>
                <div>{{ profil.profilData.namatoko }}</div>
                <div style="height: 50px"></div>
                <div>{{ profil.profilData.pemilik }}</div>
              </div>
            </div>
          </div>
        </q-page-container>

        <q-footer>
          <q-card-section class="q-pa-none bg-black text-white">
            <div class="q-pa-md row justify-end items-end">
              <div class="items-end">
                <q-btn v-print="printObj" unelevated color="dark" round size="sm" icon="print">
                  <q-tooltip class="primary" :offset="[10, 10]"> Print </q-tooltip>
                </q-btn>
              </div>
            </div>
          </q-card-section>
        </q-footer>
      </q-layout>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { dateDbFormat, dateFullFormat, formatRpDouble } from 'src/modules/formatter'
import { terbilangRupiah } from 'src/modules/utils'
import { useProfilStore } from 'src/stores/admin/profil'
import { useAdminFormTransaksiPenerimaanBarangStore } from 'src/stores/admin/transaksi/penerimaan/form'
import { onMounted, ref } from 'vue'
// import { usePrint } from 'vue3-print-nb'

const profil = useProfilStore()
const store = useAdminFormTransaksiPenerimaanBarangStore()

onMounted(async () => {
  if (!profil.profilData) {
    await profil.getProfil()
  }
  console.log('data Dialog', store.itemPenerimaan)
})

const printed = ref(false)
const printObj = {
  id: 'printMe',
  popTitle: 'Printed from ' + profil.profilData?.namatoko + ' app',

  beforeOpenCallback() {
    printed.value = true
    console.log('wait...')
  },

  openCallback() {
    console.log('opened')
  },

  closeCallback() {
    printed.value = false
    console.log('closePrint')
  },
}

// const rinciterima = store.itemPenerimaan?.rinci
// const rinciorder = store.itemPenerimaan?.orderan_h?.rinci
// const kodebarang = rinciorder?.map((x) => x.kdbarang)
// const newset = kodebarang?.length ? [...new Set(kodebarang)] : []
// const rincians = []
// for (let i = 0; i < newset.length; i++) {
//   const el = newset[i]
//   const obterima = rinciterima.filter((x) => x.kdbarang === el)

//   const obj = {
//     kdbarang: rinciorder.filter((x) => x.kdbarang === el)[0].kdbarang,
//     namabarang: rinciorder.filter((x) => x.kdbarang === el)[0].mbarang?.namabarang,
//     jumlahorder: rinciorder.filter((x) => x.kdbarang === el)[0].jumlahpo,
//     jumlahterima: obterima?.map((x) => parseInt(x.jumlah_b)).reduce((a, b) => a + b, 0),
//     hargafaktur: obterima?.map((x) => parseInt(x.hargafaktur)).reduce((a, b) => a + b, 0),
//     subtotalfix: obterima?.map((x) => parseInt(x.subtotalfix)).reduce((a, b) => a + b, 0),
//   }
//   rincians.push(obj)
// }

// const penerimaanx = {
//   nopenerimaan: store.itemPenerimaan?.nopenerimaan,
//   noorder: store.itemPenerimaan?.noorder,
//   suplier: store.itemPenerimaan?.suplier,
//   tanggal: store.itemPenerimaan?.tgl,
//   total: store.itemPenerimaan?.total,
//   totalfix: store.itemPenerimaan?.totalfix,
//   rincians: rincians,
// }
// store.dataprops = penerimaanx
// console.log('penerimaanxxx', store.dataprops)
</script>

<style>
/* Tambahkan border pada setiap td dan th */
table,
th,
td {
  border: 1px solid black;
  border-collapse: collapse;
  padding: 5px;
}
</style>
