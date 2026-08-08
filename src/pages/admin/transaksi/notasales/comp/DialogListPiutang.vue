<template>
  <q-dialog v-model="storeform.basicpiutang" transition-show="rotate" transition-hide="rotate">
    <q-card style="width: 200vw">
      <q-card-section>
        <div class="text-h6 q-mb-sm">
          <span class="text-weight-bold text-yellow-8">
            Piutang
            <span class="text-weight-bold text-red"> {{ formatRpDouble(totalall) }}</span></span
          >
          <div class="row q-gutter-xs">
            <div class="col-6">
              <app-select
                v-model="storeform.kdpelanggan"
                dense
                outlined
                label="Pilih Pelanggan"
                option-label="nama"
                option-value="kodeplgn"
                clearable
                :options="[{ nama: 'Semua Pelanggan', kodeplgn: null }, ...props.pelanggan]"
                @update:model-value="
                  (e) => {
                    setkodepelanggan(e)
                  }
                "
              />
            </div>
            <div class="col">
              <q-input
                v-model="storeform.nonota"
                dense
                outlined
                label="Cari No. Nota..."
                @update:model-value="(e) => setnonota(e)"
              />
            </div>
          </div>
        </div>
        <q-separator />
      </q-card-section>

      <q-card-section style="max-height: 80vh" class="scroll">
        <div align="center" v-if="storeform.loadingcarinota === true">
          <q-spinner-radio color="yellow-9" size="2em" />
        </div>
        <div
          align="center"
          v-if="storeform.loadingcarinota === false && storeform.itemspiutang.length === 0"
        >
          Belum Ada Data Yang Ditampilkan...!!!
        </div>
        <div v-else>
          <q-list v-for="(item, n) in storeform.itemspiutang" :key="n" separator>
            <q-form ref="refForm" class="column full-height full-width" @submit="onSubmit(item)">
              <transition-group name="list">
                <q-item class="list-move" :key="item.no_penjualan">
                  <q-item-section class="q-pl-sm">
                    <div class="row">
                      <div class="col-5">No. Nota</div>
                      <div class="col-1">:</div>
                      <div class="col-6">{{ item?.no_penjualan }}</div>
                    </div>
                    <div class="row">
                      <div class="col-5">Tgl Kirim</div>
                      <div class="col-1">:</div>
                      <div class="col-6 text-weight-bold">
                        {{ humanDate(item?.tgl_kirim) }}
                      </div>
                    </div>
                    <div class="row">
                      <div class="col-5">Pelanggan</div>
                      <div class="col-1">:</div>
                      <div class="col-6 text-weight-bold">{{ item?.pelanggan?.nama }}</div>
                    </div>
                    <div class="row">
                      <div class="col-5">Alamat</div>
                      <div class="col-1">:</div>
                      <div class="col-6 text-weight-bold">{{ item?.pelanggan?.alamat }}</div>
                    </div>
                    <div class="row">
                      <div class="col-5">Sales</div>
                      <div class="col-1">:</div>
                      <div class="col-6 text-weight-bold">{{ item?.sales?.nama }}</div>
                    </div>
                    <div class="row">
                      <div class="col-5">Tgl Jatuh Tempo</div>
                      <div class="col-1">:</div>
                      <div class="col-6 text-bold">
                        <span class="text-red">
                          {{ humanDate(item?.tempo) ?? '-' }} ({{
                            item?.jumlahtempo ?? 0
                          }}
                          hari)</span
                        >
                      </div>
                    </div>

                    <div class="row q-pr-sm text-weight-bold">
                      <div class="col-3 text-red text-center">
                        Total Nota <br />
                        {{ formatRpDouble(item?.total) }}
                      </div>
                      <div class="col-3 text-yellow text-center">
                        Terbayar <br />
                        {{
                          Number(item?.terbayarx || 0) + Number(item?.dp || 0) === 0
                            ? formatRpDouble(0)
                            : formatRpDouble(Number(item?.terbayarx || 0) + Number(item?.dp || 0))
                        }}
                        <!-- {{
                          item?.terbayarx + item?.dp === '' ||
                          item?.terbayarx + item?.dp === null ||
                          item?.terbayarx + item?.dp === 0
                            ? 0
                            : formatRpDouble(item?.terbayarx + item?.dp)
                        }} -->
                      </div>
                      <div class="col-3 text-green text-center">
                        Sisa <br />
                        {{ formatRpDouble(item?.sisax) }}
                        <!-- {{
                          formatRpDouble(
                            item?.total -
                              (item?.cicilan.length > 0 ? item?.cicilan[0]?.jumlah : 0) -
                              item?.nilairetur -
                              item?.bayar -
                              item?.total_diskon,
                          )
                        }} -->
                      </div>
                    </div>
                    <div
                      class="row q-pr-sm text-weight-bold"
                      v-if="storeform.form.keterangan === 'Dikembalikan'"
                    >
                      <div class="col-12 text-red">
                        <div class="row q-gutter-sm">
                          <!-- <div class="col-4">
                            <q-toggle v-model="item.bayar" label="Bayar" />
                          </div> -->
                          <div class="col-3">
                            <AppInputRp
                              label="Piutang Yang Akan Dibayar"
                              dense
                              outlined
                              v-model="item.yangakandibayar"
                              currency
                              v-if="item.bayarx"
                            />
                          </div>
                          <div class="col-3">
                            <q-select
                              label="Cara Bayar"
                              dense
                              outlined
                              v-model="item.carabayarrinci"
                              :options="['', 'Cash', 'Transfer']"
                              v-if="item.bayarx"
                            />
                          </div>
                          <div class="col-4">
                            <q-input
                              label="Keterangan"
                              dense
                              outlined
                              v-model="item.keteranganrinci"
                              v-if="item.bayarx"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </q-item-section>
                  <q-separator vertical />
                  <q-item-section side>
                    <div v-if="storeform.form.keterangan === 'Dikembalikan'">
                      <q-toggle
                        v-model="item.bayarx"
                        @update:model-value="(val) => reset(val, item)"
                      />
                    </div>
                    <div class="q-gutter-sm">
                      <q-btn
                        :loading="
                          storeform.loadingsimpan &&
                          storeform.form.notaPenjualan === item?.no_penjualan
                        "
                        flat
                        round
                        size="lg"
                        color="lime"
                        icon="fact_check"
                        type="submit"
                      />
                    </div>
                  </q-item-section>
                </q-item>
              </transition-group>
            </q-form>
            <q-separator />
          </q-list>
        </div>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>
<script setup>
import { formatRpDouble, humanDate, olahUang } from 'src/modules/utils'
import { useAdminFormTransaksiNotaSalesStore } from 'src/stores/admin/transaksi/notasales/form'
import { computed } from 'vue'

const storeform = useAdminFormTransaksiNotaSalesStore()

const props = defineProps({
  pelanggan: {
    type: Array,
    default: () => [],
  },
})

const totalall = computed(() => {
  const total = storeform.itemspiutang.reduce((a, b) => a + parseFloat(b?.sisax ?? 0), 0)
  return total
})

function onSubmit(item) {
  console.log('item', item)
  // storeform.form.notrans = item?.notrans
  // storeform.form.kdsales = item?.sales_id
  storeform.form.notaPenjualan = item?.no_penjualan
  storeform.form.tgljatuhtempo = item?.tempo
  storeform.form.total = olahUang(item?.total)
  storeform.form.lamatempo = item?.jml_tempo
  storeform.form.yangakandibayar = olahUang(item?.yangakandibayar)
  storeform.form.pelanggan_id = item?.pelanggan?.id
  storeform.form.cicilan = olahUang(item?.cicilan)
  storeform.form.bayar = item?.bayarx
  storeform.form.terbayar = olahUang(item?.cicilan[0]?.jumlah)
  storeform.form.carabayarrinci = item?.carabayarrinci
  storeform.form.keteranganrinci = item?.keteranganrinci

  //storeform.form.terbayar = olahUang(item?.terbayar)
  // const sisahutang = olahUang(item?.sisajumlahbelumditerimax)
  // if (storeform.form.total > sisahutang) {
  //   notifError(
  //     'Jumlah Pembayaran Tidak Boleh Lebih Dari Sisa Hutang, Sisa Hutang Adalah ' +
  //       formatRpDouble(sisahutang),
  //   )
  // } else {
  storeform.simpan()
  // }
}

function setkodepelanggan(val) {
  storeform.kdpelanggan = val
  storeform.nonota = ''
  caribypelanggan()
}

function setnonota(val) {
  storeform.nonota = val
  caribypelanggan()
}

function caribypelanggan() {
  //console.log('storeform.kdpelanggan', storeform.kdpelanggan, storeform.nonota)
  if (storeform.kdpelanggan === null) {
    //console.log('pertama')
    storeform.itemspiutang = storeform.allItemspiutang.filter((f) =>
      f.no_penjualan.includes(storeform.nonota),
    )
    return
  } else if (storeform.kdpelanggan === '0') {
    //console.log('kedua')
    storeform.itemspiutang = storeform.allItemspiutang.filter(
      (f) =>
        (f.pelanggan_id === null || f.pelanggan_id === '') &&
        f.no_penjualan.includes(storeform.nonota),
    )
    return
  } else if (storeform.kdpelanggan !== null || storeform.kdpelanggan !== '0') {
    //console.log('valasdasdasd')
    const hasil = storeform.allItemspiutang.filter(
      (f) =>
        f.pelanggan?.kodeplgn === storeform.kdpelanggan &&
        f.no_penjualan.includes(storeform.nonota),
    )
    storeform.itemspiutang = hasil
  }
}

function reset(val, item) {
  if (val === false) {
    item.yangakandibayar = 0
    item.carabayarrinci = ''
    item.keteranganrinci = ''
  }
}
</script>
