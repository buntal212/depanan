<template>
  <q-dialog persistent backdrop-filter="blur(4px)">
    <q-card style="min-width: 80vw; max-width: 180vw; height: 600px">
      <q-layout view="lHh Lpr lFf" container class="rounded-borders">
        <q-header>
          <q-bar class="bg-black text-white">
            <div>CETAK DATA ORDER BARANG</div>
            <q-space />

            <q-btn dense flat icon="close" v-close-popup>
              <q-tooltip>Close</q-tooltip>
            </q-btn>
          </q-bar>
        </q-header>
        <q-page-container>
          <div id="printMe">
            <div class="row full-width justify-between">
              <div class="flex-start" style="width: 60%">
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
              <div class="col flex-end q-pl-xl q-py-md">
                <div class="row full-width">
                  <span class="col-3">Nomor Order</span>
                  <span>: {{ store.item?.noorder }}</span>
                </div>
                <div class="row full-width">
                  <span class="col-3">Tanggal</span>
                  <span>: {{ dateDbFormat(store.item?.tglorder) }}</span>
                </div>
                <div class="row full-width">
                  <span class="col-3">Supplier</span>
                  <span>: {{ store.item?.suplier?.nama }}</span>
                </div>
                <div class="row full-width">
                  <span class="col-3">Alamat</span>
                  <span>: {{ store.item?.suplier?.alamat }}</span>
                </div>
                <div class="row full-width">
                  <span class="col-3">Telepon</span>
                  <span>: {{ store.item?.suplier?.telepon }}</span>
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
                      <th>QTY</th>
                      <th>HARGA BELI</th>
                      <th>JUMLAH</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="(item, n) in store.item?.rinci" :key="n">
                      <td class="text-center">{{ n + 1 }}</td>
                      <td>{{ item.mbarang?.namabarang }}</td>
                      <td class="text-center">{{ item.jumlahpo }} {{ item.satuan_b }}</td>
                      <td class="text-right">{{ formatRpDouble(item.hargapo) }}</td>
                      <td class="text-right">{{ formatRpDouble(item.total) }}</td>
                    </tr>
                    <tr>
                      <td colspan="4">
                        <div class="row justify-between">
                          <div class="flex-start">
                            Terbilang : {{ terbilangRupiah(store.item?.total) }} Rupiah,
                          </div>
                          <div class="text-bold flex-end q-pl-sm">TOTAL</div>
                        </div>
                      </td>
                      <td class="text-bold text-right">
                        {{ formatRpDouble(store.item?.total) }}
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
                <div>{{ store.item?.suplier?.nama }}</div>
              </div>
              <div class="col flex-end content-center text-center">
                <div>Probolinggo, {{ dateFullFormat(store.item?.tglorder) }}</div>
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
import { useAdminFormTransaksiOrderBarangStore } from 'src/stores/admin/transaksi/orderbarang/form'
import { onMounted, ref } from 'vue'
// import { usePrint } from 'vue3-print-nb'

const profil = useProfilStore()
const store = useAdminFormTransaksiOrderBarangStore()

onMounted(async () => {
  if (!profil.profilData) {
    await profil.getProfil()
  }
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
