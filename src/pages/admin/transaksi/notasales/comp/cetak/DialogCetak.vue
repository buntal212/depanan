<template>
  <q-dialog persistent backdrop-filter="blur(4px)">
    <q-card style="min-width: 80vw; max-width: 180vw; height: 600px">
      <q-layout view="lHh Lpr lFf" container class="rounded-borders">
        <q-header>
          <q-bar class="bg-black text-white q-py-sm">
            <div>CETAK NOTA SALES</div>
            <q-space />

            <q-btn dense flat icon="close" v-close-popup>
              <q-tooltip>Close</q-tooltip>
            </q-btn>
          </q-bar>
        </q-header>
        <q-page-container>
          <div id="printReguler">
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
              <div class="col flex-end q-pl-xl q-py-md content-center text-center">
                <span class="text-bold" style="font-size: xx-large">NOTA SALES</span>
              </div>
            </div>
            <div class="full-width justify-center">
              <div style="border-bottom-style: solid; border-width: 1px"></div>
              <div class="row full-width q-px-md q-pt-md">
                <div class="col flex-start content-center">
                  <div class="row full-width">
                    <span class="col-3">Nomor</span>
                    <span>: {{ store.itemCetak?.notrans }}</span>
                  </div>
                  <div class="row full-width">
                    <span class="col-3">Sales yang Membawa</span>
                    <span>: {{ store.itemCetak?.sales }}</span>
                  </div>
                  <div class="row full-width">
                    <span class="col-3">Tanggal</span>
                    <span>: {{ dateFullFormat(store.itemCetak?.tgl) }}</span>
                  </div>
                  <div class="row full-width">
                    <span class="col-3">Keterangan</span>
                    <span>: {{ store.itemCetak?.keterangan }}</span>
                  </div>
                </div>
                <div class="col-4 flex-end q-pl-xl q-py-md text-grey-5 content-center text-center">
                  <div
                    v-if="store.opendialogCetakkedua === true"
                    class="custom-border text-bold q-pa-sm"
                    style="font-size: medium"
                  >
                    COPY PRINT
                  </div>
                  <div v-else class="custom-border text-bold q-pa-sm" style="font-size: medium">
                    ORIGINAL PRINT
                  </div>
                </div>
              </div>
              <div class="q-px-md q-pt-sm">
                <table class="full-width">
                  <thead>
                    <tr class="text-center text-wrap">
                      <th>NO</th>
                      <th>NOTA PENJUALAN</th>
                      <th>PELANGGAN</th>
                      <th style="min-width: 25px; max-width: 30px">ALAMAT</th>
                      <th style="min-width: 10px; max-width: 20px">TGL JATUH TEMPO</th>
                      <th style="min-width: 10px; max-width: 10px">SALES</th>
                      <th>JUMLAH</th>
                      <th style="min-width: 200px; max-width: 280px">KETERANGAN</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="(item, n) in store.itemCetak?.rinci" :key="n">
                      <td class="text-center">{{ n + 1 }}</td>
                      <td>
                        {{ item.notaPenjualan }}
                      </td>
                      <td>{{ item.hederpenjualan?.pelanggan?.nama }}</td>
                      <td>{{ item.hederpenjualan?.pelanggan?.alamat }}</td>
                      <td>{{ dateFullFormat(item.tgljatuhtempo) }}</td>
                      <td>{{ item.hederpenjualan?.sales?.nama }}</td>
                      <td class="text-right">{{ formatDenganRp(item.total) }}</td>
                      <td>{{ item.keteranganrinci }}</td>
                    </tr>
                    <tr>
                      <td colspan="6" class="text-center text-bold">TOTAL</td>
                      <td class="text-right text-bold">
                        {{ formatDenganRp(store.itemCetak?.totalhutang) }}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </q-page-container>
        <q-footer>
          <q-card-section class="q-pa-none bg-black text-white">
            <div class="q-pa-md row justify-end items-end">
              <div class="items-end">
                <q-btn v-print="printReg" unelevated color="dark" round size="sm" icon="print">
                  <q-tooltip :offset="[10, 10]"> Print </q-tooltip>
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
import { dateFullFormat, formatDenganRp } from 'src/modules/utils'
import { useProfilStore } from 'src/stores/admin/profil'
import { useAdminFormTransaksiNotaSalesStore } from 'src/stores/admin/transaksi/notasales/form'
import { computed, onMounted, ref } from 'vue'

const profil = useProfilStore()
const store = useAdminFormTransaksiNotaSalesStore()
const printed = ref(false)
onMounted(async () => {
  if (!profil.profilData) {
    await profil.getProfil()
  }
})

const printReg = computed(() => ({
  id: 'printReguler',
  popTitle: 'by Udumbara Informatika',
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
}))
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

.custom-border {
  border: 1px solid rgb(70, 70, 70); /* Contoh: border 1px solid hitam */
}
</style>
