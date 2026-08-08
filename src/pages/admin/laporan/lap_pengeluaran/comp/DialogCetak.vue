<template>
  <q-dialog persistent backdrop-filter="blur(4px)">
    <q-card style="min-width: 80vw; max-width: 180vw; height: 600px">
      <q-layout view="lHh Lpr lFf" container class="rounded-borders">
        <q-header>
          <q-bar class="bg-black text-white">
            <div>LAPORAN PENGELUARAN</div>
            <q-space />
            <q-btn dense flat icon="close" v-close-popup>
              <q-tooltip>Close</q-tooltip>
            </q-btn>
          </q-bar>
        </q-header>
        <q-page-container>
          <div id="printMe">
            <div class="row full-width justify-center q-px-sm">
              <kop-cetak />
            </div>
            <div class="row full-width justify-center q-px-sm">
              <data-cetak />
            </div>
            <div class="row full-width q-pt-xl justify-center q-px-sm">
              <span>created by CV. UDUMBARAINFORMATIKA</span>
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
import { useProfilStore } from 'src/stores/admin/profil'
import { onMounted, ref } from 'vue'
import KopCetak from './KopCetak.vue'
import DataCetak from './ListData.vue'

const profil = useProfilStore()
onMounted(async () => {})

const printed = ref(false)
const printObj = {
  id: 'printMe',
  popTitle:
    'Printed from ' + profil.profilData?.namatoko + ' app' + ' ----- by CV.Udumbara Informatika',
  beforeOpenCallback() {
    printed.value = true
    const style = document.createElement('style')
    style.type = 'text/css'
    style.innerHTML = `
      @media print {
        .q-markup-table table {
          border: 1px solid #000 !important;
          border-collapse: collapse !important;
        }
        .q-markup-table th,
        .q-markup-table td {
          border: 1px solid #000 !important;
          padding: 8px !important;
        }
        #printMe {
          margin: 10px;
          padding: 10px;
        }
      }
    `
    document.head.appendChild(style)
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
