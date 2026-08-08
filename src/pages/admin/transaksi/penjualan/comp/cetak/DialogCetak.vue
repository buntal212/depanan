<template>
  <q-dialog persistent backdrop-filter="blur(4px)">
    <q-card style="min-width: 80vw; max-width: 180vw; height: 600px">
      <q-layout view="lHh Lpr lFf" container class="rounded-borders">
        <q-header>
          <q-bar class="bg-black text-white q-py-sm">
            <div>CETAK DATA PENJUALAN BARANG</div>
            <q-space />

            <q-btn dense flat icon="close" v-close-popup>
              <q-tooltip>Close</q-tooltip>
            </q-btn>
          </q-bar>
        </q-header>
        <q-page-container>
          <q-card class="row flex-center content-center q-px-md q-py-md">
            <div class="q-pr-md">Pilih Printer</div>
            <div>
              <q-btn-toggle
                v-model="opsiprint"
                no-caps
                rounded
                unelevated
                toggle-color="yellow-9"
                color="white"
                text-color="brown-8"
                :options="[
                  { label: 'Thermal', value: 'one' },
                  { label: 'Matrix', value: 'two' },
                ]"
              />
            </div>
          </q-card>

          <div id="printThermal" v-show="opsiprint === 'one'" class="row flex-center q-py-md">
            <div v-if="profil.fotoProfil" class="col" style="min-width: 50mm; max-width: 100mm">
              <div class="row justify-center">
                <q-img
                  :src="profil.fotoProfil"
                  style="width: 60px; height: 60px; border-radius: 50%; object-fit: cover"
                  spinner-color="primary"
                />
              </div>
              <div
                class="row full-width text-center text-bold flex-center"
                style="font-size: medium"
              >
                {{ profil.profilData.namatoko }}
              </div>
              <div class="row full-width text-center flex-center" style="">
                {{ profil.profilData.alamat }}
              </div>
              <div class="row full-width text-center flex-center" style="">
                Telp : {{ profil.profilData.telepon }}
              </div>
              <div class="row q-pb-xs full-width text-center flex-center" style="">
                Email : {{ profil.profilData.email }}
              </div>
              <div class="q-pt-xs" style="border-top-style: solid; border-width: 1px"></div>
              <div class="row text-bold full-width" style="">
                <span
                  >No: {{ store.itemCetak?.no_penjualan }},
                  {{ dateFullFormat(store.itemCetak?.tgl) }}</span
                >
              </div>
              <div class="row full-width" style="">
                <span style="">Sales </span>
                <span style="">: {{ store.itemCetak?.sales?.nama }}</span>
              </div>
              <!-- <div class="row full-width">
                <span class="col-auto">Tanggal </span>
                <span>: {{ dateDbFormat(store.itemCetak?.tgl) }}</span>
              </div> -->
              <div class="row full-width">
                <span class="col-auto">Pelanggan </span>
                <span
                  >:
                  {{
                    !store.itemCetak?.pelanggan
                      ? store.itemCetak?.keterangan?.nama
                      : store.itemCetak?.pelanggan?.nama
                  }}</span
                >
                <span
                  >, telp
                  {{
                    !store.itemCetak?.pelanggan
                      ? store.itemCetak?.keterangan?.tlp
                      : store.itemCetak?.pelanggan?.telepon
                  }}</span
                >
              </div>
              <!-- <div class="row full-width">
                <span class="col-3">Telepon</span>
                <span
                  >:
                  {{
                    !store.itemCetak?.pelanggan
                      ? store.itemCetak?.keterangan?.tlp
                      : store.itemCetak?.pelanggan?.telepon
                  }}</span
                >
              </div> -->
              <div class="row q-pb-xs full-width">
                <span style="" class="col-auto">Alamat</span>
                <span style=""
                  >:
                  {{
                    !store.itemCetak?.pelanggan
                      ? store.itemCetak?.keterangan?.alamat
                      : store.itemCetak?.pelanggan?.alamat
                  }}</span
                >
              </div>

              <div class="q-pt-xs" style="border-top-style: dashed; border-width: 1px"></div>
              <div v-for="(item, n) in store.itemCetak?.detail" :key="n">
                <div class="row full-width text-bold">
                  <span class="col"
                    >{{ item.master_barang?.namabarang }}
                    <template v-if="item?.motif"> Seri {{ item?.motif }}</template></span
                  >
                </div>
                <div class="row full-width" style="">
                  <template v-if="parseFloat(item.jumlah) % parseFloat(item?.isi) == 0">
                    <span>
                      *
                      {{
                        formatDouble(Math.floor(parseFloat(item?.jumlah) / parseFloat(item.isi)))
                      }}
                      {{ item?.master_barang?.satuan_b }}
                    </span>
                    <span class="q-px-xs"> X </span>
                    <span v-if="parseFloat(item.jumlah) % parseFloat(item?.isi) == 0">
                      {{ formatDouble(parseFloat(item?.harga_jual) * parseFloat(item?.isi)) }}
                      <template v-if="item?.diskon !== 0">
                        - disc {{ formatDouble(item.diskon) }}</template
                      >
                    </span>
                    <q-space />
                    <span> = {{ formatRpDouble(item.subtotal) }} </span>
                  </template>
                  <template v-else>
                    <span>
                      * {{ formatDouble(item?.jumlah) }} {{ item?.master_barang?.satuan_k }}
                    </span>
                    <span class="q-px-xs"> X </span>
                    <span v-if="parseFloat(item.jumlah) % parseFloat(item?.isi) !== 0">
                      {{ formatDouble(item?.harga_jual) }}
                      <template v-if="item?.diskon !== 0">
                        - disc {{ formatDouble(item.diskon) }}</template
                      >
                    </span>
                    <q-space />
                    <span> = {{ formatRpDouble(item.subtotal) }}</span>
                  </template>
                </div>
              </div>
              <div class="q-pt-xs" style="border-top-style: dashed; border-width: 1px"></div>
              <div class="row full-width">
                <span class="col-auto">Total </span>
                <q-space />
                <span> {{ formatRpDouble(store.itemCetak?.total) }}</span>
              </div>
              <div class="row full-width">
                <span class="col-auto">Bayar </span>
                <q-space />
                <span> {{ formatRpDouble(hitungBayar()) }}</span>
              </div>
              <div class="row full-width">
                <span v-if="store.itemCetak?.flag === '5'" class="col-auto">Kembalian </span>
                <span v-else class="col-auto">Kekurangan </span>
                <q-space />
                <span> {{ formatRpDouble(hitungSisa()) }}</span>
              </div>
              <div class="row flex-center full-width">
                <template v-if="store.itemCetak?.flag === '5'">
                  <span class="text-bold" style="font-size: medium">
                    LUNAS
                    <template v-if="store.itemCetak?.cara_bayar"
                      >({{ store.itemCetak?.cara_bayar }})</template
                    >
                  </span>
                </template>
                <template
                  v-else-if="
                    store.itemCetak?.flag === '2' ||
                    store.itemCetak?.flag === '3' ||
                    store.itemCetak?.flag === '4'
                  "
                >
                  <span class="text-bold" style="">
                    TEMPO
                    <template v-if="store.itemCetak?.tempo">
                      <span style=""
                        >{{ store.itemCetak?.jml_tempo }} hari, sampai
                        {{ dateFullFormat(store.itemCetak?.tempo) }}</span
                      >
                    </template></span
                  >
                </template>
                <template v-else-if="store.itemCetak?.flag === '7'">
                  <span class="text-bold" style="">
                    PEMBAYARAN DP
                    <template v-if="store.itemCetak?.cara_bayar"
                      >({{ store.itemCetak?.cara_bayar }})</template
                    ></span
                  >
                </template>
                <!-- <template v-else-if="store.itemCetak?.flag === '8'">
                  <span class="text-bold" style="font-size: medium">
                    TEMPO
                    <template v-if="store.itemCetak?.tempo">
                      <span style="font-size: medium"
                        >{{ store.itemCetak?.jml_tempo }} hari, sampai
                        {{ dateFullFormat(store.itemCetak?.tempo) }}</span
                      >
                    </template></span
                  >
                </template> -->
              </div>
              <div class="row full-width text-center flex-center" style="">
                Terima Kasih Atas Pembelian Anda
              </div>
              <div class="col-12 text-center text-bold q-pb-sm">
                <span
                  v-if="store.opendialogCetakkedua === true"
                  class="text-bold"
                  style="font-size: medium"
                >
                  COPY PRINT</span
                >
                <span v-else class="text-bold" style="font-size: large"> ORIGINAL PRINT</span>
              </div>
              <div style="border-bottom-style: solid; border-width: 1px"></div>
              <div class="row full-width text-center flex-start" style="font-size: small">
                <span class="text-center">
                  created by CV UdumbaraInformatika cvudumbarainformatika@gmail.com</span
                >
              </div>
            </div>
          </div>

          <div id="printReguler" v-show="opsiprint === 'two'" class="print-container">
            <div class="print-header">
              <div class="row full-width justify-between">
                <div class="flex-start content-center" style="width: 60%">
                  <div class="row q-px-md q-py-xs">
                    <div class="q-pr-md" v-if="profil.fotoProfil">
                      <q-img
                        :src="profil.fotoProfil"
                        style="width: 100px; height: 100px; border-radius: 50%; object-fit: cover"
                        spinner-color="primary"
                      />
                    </div>
                    <div class="col content-center">
                      <div class="text-bold" style="font-size: large">
                        {{ profil.profilData.namatoko }}
                      </div>
                      <div>
                        {{ profil.profilData.alamat }}
                      </div>
                      <div>
                        <span class="q-pr-sm">Telp : {{ profil.profilData.telepon }}</span>
                      </div>
                      <div>
                        <span>Email : {{ profil.profilData.email }} </span>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="col flex-end q-pl-xl q-py-xs content-center text-center">
                  <span class="text-bold" style="font-size: large">FAKTUR</span>
                </div>
              </div>
            </div>
            <div class="justify-center">
              <div style="border-bottom-style: solid; border-width: 1px" />
              <div class="row justify-between q-px-md">
                <div class="col flex-start content-center">
                  <div class="row" style="">
                    <span class="col-3">Pelanggan</span>
                    <span
                      >:
                      {{
                        !store.itemCetak?.pelanggan
                          ? store.itemCetak?.keterangan?.nama
                          : store.itemCetak?.pelanggan?.nama
                      }}</span
                    >
                  </div>
                  <div class="row full-width" style="">
                    <span class="col-3">Telepon</span>
                    <span
                      >:
                      {{
                        !store.itemCetak?.pelanggan
                          ? store.itemCetak?.keterangan?.tlp
                          : store.itemCetak?.pelanggan?.telepon
                      }}</span
                    >
                  </div>
                  <div class="row full-width" style="">
                    <span class="col-3">Alamat</span>
                    <span
                      >:
                      {{
                        !store.itemCetak?.pelanggan
                          ? store.itemCetak?.keterangan?.alamat
                          : store.itemCetak?.pelanggan?.alamat
                      }}</span
                    >
                  </div>
                </div>
                <div class="col flex-end q-pl-xl q-py-xs" style="">
                  <div class="row full-width">
                    <span class="col-4">Nomor Penjualan</span>
                    <span>: {{ store.itemCetak?.no_penjualan }}</span>
                  </div>
                  <div class="row full-width">
                    <span class="col-4">Sales</span>
                    <span>: {{ store.itemCetak?.sales?.nama }}</span>
                  </div>
                  <div class="row full-width">
                    <span class="col-4">Tanggal</span>
                    <span>: {{ dateFullFormat(store.itemCetak?.tgl) }}</span>
                  </div>
                  <div class="row full-width">
                    <span class="col-4">Pembayaran</span>
                    <span
                      >:
                      <template v-if="store.itemCetak?.flag === '5'">
                        <span class="text-bold" style="">
                          LUNAS
                          <template v-if="store.itemCetak?.cara_bayar"
                            >({{ store.itemCetak?.cara_bayar }})</template
                          ></span
                        >
                      </template>
                      <template
                        v-else-if="
                          store.itemCetak?.flag === '2' ||
                          store.itemCetak?.flag === '3' ||
                          store.itemCetak?.flag === '4'
                        "
                      >
                        <span class="text-bold" style="">
                          TEMPO
                          <template v-if="store.itemCetak?.tempo">
                            <span style=""
                              >{{ store.itemCetak?.jml_tempo }} hari, sampai
                              {{ dateFullFormat(store.itemCetak?.tempo) }}</span
                            >
                          </template>
                        </span>
                      </template>
                      <template v-else-if="store.itemCetak?.flag === '7'">
                        <span class="text-bold" style="">
                          PEMBAYARAN DP
                          <template v-if="store.itemCetak?.cara_bayar"
                            >({{ store.itemCetak?.cara_bayar }})
                          </template>

                          <template v-if="store.itemCetak?.tempo">
                            <span class="row" style=""
                              >{{ store.itemCetak?.jml_tempo }} hari, sampai
                              {{ dateFullFormat(store.itemCetak?.tempo) }}
                            </span>
                          </template>
                        </span>
                      </template>
                      <!-- <template v-else-if="store.itemCetak?.flag === '8'">
                        <span class="text-bold" style="font-size: large">
                          CASH TEMPO
                          <template v-if="store.itemCetak?.tempo">
                            <span style="font-size: medium"
                              >{{ store.itemCetak?.jml_tempo }} hari, sampai
                              {{ dateFullFormat(store.itemCetak?.tempo) }}</span
                            >
                          </template></span
                        >
                      </template> -->
                    </span>
                  </div>
                </div>
              </div>
              <!-- <div class="text-center text-bold q-pt-sm" style="font-size: medium">
                NOTA PENJUALAN
              </div> -->

              <div class="q-px-md">
                <table class="full-width" style="">
                  <thead>
                    <tr class="text-center" style="height: min-content">
                      <th>NO</th>
                      <th>NAMA BARANG</th>
                      <th>QTY</th>
                      <th>HARGA</th>
                      <th>DISKON</th>
                      <th>JUMLAH</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="(item, n) in store.itemCetak?.detail" :key="n">
                      <td class="text-center">{{ n + 1 }}</td>
                      <td>
                        {{ item.master_barang?.namabarang }}
                        <template v-if="item?.motif"> Seri {{ item?.motif }}</template>
                      </td>
                      <td class="text-center">
                        <template v-if="parseFloat(item.jumlah) % parseFloat(item?.isi) == 0">
                          <div class="col-1 text-right">
                            {{
                              formatDouble(
                                Math.floor(parseFloat(item?.jumlah) / parseFloat(item.isi)),
                              )
                            }}
                            {{ item?.master_barang?.satuan_b }}
                          </div>
                        </template>
                        <template v-else>
                          <div class="col-1 text-right">
                            {{ formatDouble(item?.jumlah) }} {{ item?.master_barang?.satuan_k }}
                          </div>
                        </template>
                      </td>
                      <td class="text-right">
                        <template v-if="parseFloat(item.jumlah) % parseFloat(item?.isi) == 0">
                          <div class="col-2 text-right">
                            {{
                              formatRpDouble(parseFloat(item?.harga_jual) * parseFloat(item?.isi))
                            }}
                          </div>
                        </template>
                        <template v-else>
                          <div class="col-2 text-right">
                            {{ formatRpDouble(item?.harga_jual) }}
                          </div>
                        </template>
                      </td>
                      <td class="text-right">{{ formatRpDouble(item.diskon) }}</td>
                      <td class="text-right">{{ formatRpDouble(item.subtotal) }}</td>
                    </tr>
                    <tr>
                      <td colspan="5">
                        <div class="row justify-between">
                          <div class="flex-start">
                            Terbilang : {{ terbilangRupiah(store.itemCetak?.total) }} Rupiah,
                          </div>
                          <div class="text-bold flex-end q-pl-sm">TOTAL</div>
                        </div>
                      </td>
                      <td class="text-bold text-right">
                        {{ formatRpDouble(store.itemCetak?.total) }}
                      </td>
                    </tr>
                    <!-- <tr>
                      <td colspan="5">
                        <div class="row justify-between">
                          <div class="flex-start">
                            <span hidden></span>
                          </div>
                          <div class="text-bold flex-end q-pl-sm">DISC</div>
                        </div>
                      </td>
                      <td class="text-bold text-right">
                        - {{ formatRpDouble(store.itemCetak?.total_diskon) }}
                      </td>
                    </tr> -->
                    <tr>
                      <td colspan="5">
                        <div class="row justify-between">
                          <div class="flex-start">
                            <span hidden></span>
                          </div>
                          <div class="text-bold flex-end q-pl-sm">BAYAR</div>
                        </div>
                      </td>
                      <td class="text-bold text-right">
                        {{ formatRpDouble(hitungBayar()) }}
                      </td>
                    </tr>
                    <tr>
                      <td colspan="5">
                        <div class="row justify-between">
                          <div class="flex-start">
                            <span hidden></span>
                          </div>
                          <template v-if="store.itemCetak?.flag === '5'">
                            <div class="text-bold flex-end q-pl-sm">KEMBALIAN</div>
                          </template>
                          <template v-else>
                            <div class="text-bold flex-end q-pl-sm">KEKURANGAN</div>
                          </template>
                        </div>
                      </td>
                      <td class="text-bold text-right">
                        {{ formatRpDouble(hitungSisa()) }}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <!-- <div class="row justify-between full-width"> -->
              <div class="col flex-start text-left q-pl-md">
                <div class="content-center" style="font-size: small">
                  <span>Terimakasih Telah Berkunjung, Semoga Sehat Selalu.</span>
                </div>
              </div>
              <!-- <div class="col flex-end content-center text-center">
                  <span
                    v-if="store.opendialogCetakkedua === true"
                    class="custom-border text-bold q-pa-sm"
                    style="font-size: large"
                  >
                    COPY PRINT</span
                  >
                  <span v-else class="custom-border text-bold q-pa-sm" style="font-size: large">
                    ORIGINAL PRINT</span
                  >
                </div> -->
              <!-- </div> -->
              <div class="row justify-between full-width q-pt-xs q-pb-sm" style="">
                <div class="col flex-start content-center text-center">
                  <div class="invisible">.</div>
                  <div>Penerima/Pembeli</div>
                  <div style="height: 30px"></div>
                  <div>
                    {{
                      !store.itemCetak?.pelanggan
                        ? store.itemCetak?.keterangan?.nama
                        : store.itemCetak?.pelanggan?.nama
                    }}
                  </div>
                </div>
                <div class="col flex-end content-center text-center">
                  <div>Probolinggo, {{ dateFullFormat(store.itemCetak?.tgl) }}</div>
                  <div>{{ profil.profilData.namatoko }}</div>
                  <div style="height: 30px"></div>
                  <div>{{ profil.profilData.pemilik }}</div>
                </div>
              </div>
              <div style="border-bottom-style: solid; border-width: 1px" />
              <div class="row full-width text-center flex-start" style="font-size: x-small">
                <span class="q-pl-sm">
                  created by CV UdumbaraInformatika | cvudumbarainformatika@gmail.com</span
                >
              </div>
            </div>
          </div>
        </q-page-container>

        <q-footer>
          <q-card-section class="q-pa-none bg-black text-white">
            <div class="q-pa-md row justify-end items-end">
              <div class="items-end">
                <q-btn
                  v-if="opsiprint === 'one'"
                  v-print="printObj"
                  unelevated
                  color="dark"
                  round
                  size="sm"
                  icon="print"
                >
                  <q-tooltip :offset="[10, 10]"> Print </q-tooltip>
                </q-btn>
                <q-btn
                  v-else
                  v-print="printReg"
                  unelevated
                  color="dark"
                  round
                  size="sm"
                  icon="print"
                >
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
// import { useQuasar } from 'quasar'
import { dateFullFormat, formatRpDouble } from 'src/modules/formatter'
import { formatDouble, terbilangRupiah } from 'src/modules/utils'
import { useProfilStore } from 'src/stores/admin/profil'
import { useListPenjualanStore } from 'src/stores/admin/transaksi/penjualan/list'
import { computed, onMounted, ref } from 'vue'
// import { usePrint } from 'vue3-print-nb'

// const $q = useQuasar()
const profil = useProfilStore()
const store = useListPenjualanStore()
const opsiprint = ref('one')

onMounted(async () => {
  if (!profil.profilData) {
    await profil.getProfil()
  }
})

function hitungBayar() {
  return parseInt(store.itemCetak?.bayar)
}
function hitungSisa() {
  if (store.itemCetak?.flag === '5') {
    return parseInt(store.itemCetak?.bayar) - parseInt(store.itemCetak?.total)
  } else {
    return parseInt(store.itemCetak?.total) - parseInt(store.itemCetak?.bayar)
  }
}

const printed = ref(false)

const printObj = computed(() => ({
  id: 'printThermal',
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
  padding: 0px 5px 0px 5px;
}

.custom-border {
  border: 1px solid black; /* Contoh: border 1px solid hitam */
}

@media print {
  #printReguler {
    width: 24cm;
    max-height: 13.8cm;
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  /* Ensure header appears on each page */
  .print-header {
    position: relative;
    top: 0;
    width: 100%;
  }

  /* Hide non-printable elements */
  .q-dialog,
  .q-card,
  .q-bar,
  .q-btn,
  .q-footer {
    display: none !important;
  }

  /* Ensure only printReguler is printed */
  #printReguler {
    display: block !important;
  }
}
</style>
