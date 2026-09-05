<template>
  <q-dialog v-model="storeform.basic" transition-show="rotate" transition-hide="rotate">
    <q-card style="width: 100vw">
      <q-card-section>
        <div class="text-h6 q-mb-sm">
          <span class="text-weight-bold text-yellow-8">
            {{ supplierx?.nama }}
            <span class="text-weight-bold text-red"> {{ formatRpDouble(totalall) }}</span></span
          >
        </div>
        <q-separator />
      </q-card-section>

      <q-card-section style="max-height: 80vh" class="scroll">
        <div align="center" v-if="storeform.loadingcarihutang === true">
          <q-spinner-radio color="yellow-9" size="2em" />
        </div>
        <div
          align="center"
          v-if="storeform.loadingcarihutang === false && storeform.loadingcarihutang.length === 0"
        >
          Belum Ada Data Yang Ditampilkan...!!!
        </div>
        <div v-else>
          <q-list v-for="(item, n) in storeform.items" :key="n" separator>
            <q-form ref="refForm" class="column full-height full-width" @submit="onSubmit(item)">
              <transition-group name="list">
                <q-item class="list-move">
                  <q-item-section class="q-pl-sm">
                    <div class="row">
                      <div class="col-5">No. Penerimaan</div>
                      <div class="col-1">:</div>
                      <div class="col-6">{{ item?.nopenerimaan }}</div>
                    </div>
                    <div class="row">
                      <div class="col-5">Tgl Penerimaan</div>
                      <div class="col-1">:</div>
                      <div class="col-6 text-weight-bold">
                        {{ humanDate(item?.tglpenerimaan) }}
                      </div>
                    </div>

                    <div class="row">
                      <div class="col-5">No. Orderan</div>
                      <div class="col-1">:</div>
                      <div class="col-6 text-weight-bold">{{ item?.noorderan }}</div>
                    </div>

                    <div class="row">
                      <div class="col-5">No. Faktur</div>
                      <div class="col-1">:</div>
                      <div class="col-6 text-weight-bold">{{ item?.nofaktur }}</div>
                    </div>
                    <div class="row">
                      <div class="col-5">Tgl Faktur</div>
                      <div class="col-1">:</div>
                      <div class="col-6 text-weight-bold">{{ humanDate(item?.tglfaktur) }}</div>
                    </div>
                    <div class="row">
                      <div class="col-5">Tgl Jatuh Tempo</div>
                      <div class="col-1">:</div>
                      <div class="col-6 text-bold">
                        <span class="text-red">
                          {{ humanDate(item?.tgljatuhtempo) ?? '-' }} ({{
                            item?.jumlahharitempo ?? 0
                          }}
                          hari)</span
                        >
                      </div>
                    </div>

                    <div class="row q-pr-sm text-weight-bold">
                      <div class="col-6 text-red">
                        Total Hutang {{ formatRpDouble(item?.totalhutang) }}
                      </div>
                      <div class="col-6 text-red">
                        Telah Dibayar {{ formatRpDouble(item?.totalterbayang) }}
                      </div>
                    </div>
                    <div class="row q-pr-sm text-weight-bold">
                      <div class="col-12 text-red">
                        <AppInputRp
                          label="Utang Yang Akan Dibayar"
                          dense
                          outlined
                          v-model="item.yangakandibayar"
                          currency
                        />
                      </div>
                    </div>
                  </q-item-section>
                  <q-separator vertical />
                  <q-item-section side>
                    <div class="q-gutter-sm">
                      <q-btn
                        flat
                        round
                        size="md"
                        color="primary"
                        icon="history"
                        aria-label="Buka histori pembayaran hutang"
                        @click="bukaRiwayatHutang(item.nopenerimaan)"
                      >
                        <q-tooltip>Histori pembayaran hutang ini</q-tooltip>
                      </q-btn>
                      <q-btn
                        :loading="
                          storeform.loadingsimpan &&
                          storeform.form.nopenerimaan === item?.nopenerimaan
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
          </q-list>
        </div>
      </q-card-section>
    </q-card>
  </q-dialog>

  <q-dialog v-model="storeform.dialogRiwayat">
    <q-card style="width: 900px; max-width: 96vw">
      <q-card-section class="row items-center justify-between q-pb-sm">
        <div>
          <div class="text-h6">Rincian Pembayaran Hutang</div>
          <div class="text-caption">Histori pembayaran per No. Penerimaan</div>
        </div>
        <q-btn flat round dense icon="close" v-close-popup aria-label="Tutup dialog" />
      </q-card-section>
      <q-separator />
      <q-card-section v-if="storeform.loadingRiwayat" class="text-center q-py-xl">
        <q-spinner-dots color="primary" size="36px" />
      </q-card-section>
      <q-card-section v-else-if="!storeform.riwayatHutang" class="text-center text-grey q-py-xl">
        Belum ada pembayaran untuk hutang ini.
      </q-card-section>
      <template v-else>
        <q-card-section class="q-pa-md">
          <div class="row q-col-gutter-md">
            <div class="col-12 col-sm-8">
              <q-card flat bordered class="history-info-card full-height">
                <q-card-section class="q-pa-sm">
                  <div class="text-caption text-grey-6">Supplier</div>
                  <div class="text-subtitle1 text-weight-bold">{{ storeform.riwayatHutang.nama_supplier || '-' }}</div>
                  <div class="text-caption text-grey-6 q-mt-sm">No. Penerimaan</div>
                  <div class="text-weight-bold">{{ storeform.riwayatHutang.nopenerimaan }}</div>
                </q-card-section>
              </q-card>
            </div>
            <div class="col-12 col-sm-4">
              <q-card flat bordered class="history-info-card full-height">
                <q-card-section class="q-pa-sm">
                  <div class="text-caption text-grey-6">Tanggal Penerimaan</div>
                  <div class="text-subtitle1 text-weight-bold">{{ humanDate(storeform.riwayatHutang.tgl_penerimaan) }}</div>
                  <div class="text-caption text-grey-6 q-mt-sm">No. Faktur</div>
                  <div class="text-weight-bold">{{ storeform.riwayatHutang.nofaktur || '-' }}</div>
                </q-card-section>
              </q-card>
            </div>
            <div class="col-12 col-sm-4"><q-card flat bordered class="history-money-card full-height"><q-card-section class="q-pa-sm"><div class="text-caption text-grey-6">Total Hutang</div><div class="text-subtitle1 text-weight-bold">{{ formatRpDouble(storeform.riwayatHutang.total_hutang) }}</div></q-card-section></q-card></div>
            <div class="col-12 col-sm-4"><q-card flat bordered class="history-money-card full-height"><q-card-section class="q-pa-sm"><div class="text-caption text-grey-6">Total Dibayar</div><div class="text-subtitle1 text-weight-bold text-positive">{{ formatRpDouble(storeform.riwayatHutang.total_dibayar) }}</div></q-card-section></q-card></div>
            <div class="col-12 col-sm-4"><q-card flat bordered class="history-money-card full-height"><q-card-section class="q-pa-sm"><div class="text-caption text-grey-6">Sisa Hutang</div><div class="text-subtitle1 text-weight-bold text-negative">{{ formatRpDouble(storeform.riwayatHutang.sisa_hutang) }}</div></q-card-section></q-card></div>
          </div>
        </q-card-section>
        <q-separator />
        <q-card-section class="q-py-sm"><div class="text-subtitle2 text-weight-bold">Detail Pembayaran ({{ storeform.riwayatHutang.rincian.length }})</div></q-card-section>
        <q-markup-table flat dense wrap-cells>
          <thead><tr><th class="text-left">Tanggal Bayar</th><th class="text-left">No. Pembayaran</th><th class="text-left">Cara Bayar</th><th class="text-left">Keterangan</th><th class="text-right">Nominal Bayar</th></tr></thead>
          <tbody><tr v-for="rincian in storeform.riwayatHutang.rincian" :key="rincian.id"><td>{{ humanDate(rincian.tgl_bayar) }}</td><td>{{ rincian.nopembayaran || '-' }}</td><td>{{ rincian.cara_bayar || '-' }}</td><td>{{ rincian.keterangan || '-' }}</td><td class="text-right text-weight-bold">{{ formatRpDouble(rincian.jumlah) }}</td></tr></tbody>
        </q-markup-table>
      </template>
    </q-card>
  </q-dialog>
</template>
<script setup>
import { notifError } from 'src/modules/notifs'
import { formatRpDouble, humanDate, olahUang } from 'src/modules/utils'
import { useAdminFormTransaksiPembayaranHutangStore } from 'src/stores/admin/transaksi/pembayaranhutang/form'
import { computed } from 'vue'

const storeform = useAdminFormTransaksiPembayaranHutangStore()

const props = defineProps({
  msupplier: {
    type: Array,
    default: () => [],
  },
})

const supplierx = computed(() => {
  console.log('props.msupplier', props.supplier)
  const wew = props.msupplier.find((f) => f?.kodesupl === storeform.form.kdsuplier)
  console.log('wew', wew)
  return wew
})

const totalall = computed(() => {
  const total = storeform.items.reduce(
    (a, b) => a + parseFloat(b?.sisajumlahbelumditerimax ?? 0),
    0,
  )
  return total
})

function onSubmit(item) {
  console.log('item', item)
  storeform.form.nopenerimaan = item?.nopenerimaan
  storeform.form.nofaktur = item?.nofaktur
  storeform.form.noorderan = item?.noorderan
  storeform.form.total = olahUang(item?.yangakandibayar)
  const sisahutang = olahUang(item?.sisajumlahbelumditerimax)
  if (storeform.form.total > sisahutang) {
    notifError(
      'Jumlah Pembayaran Tidak Boleh Lebih Dari Sisa Hutang, Sisa Hutang Adalah ' +
        formatRpDouble(sisahutang),
    )
  } else {
    // console.log('sisahutang', sisahutang, storeform.form.total)
    storeform.simpan()
  }
}

async function bukaRiwayatHutang(noPenerimaan) {
  try {
    await storeform.getRiwayatHutang(noPenerimaan)
  } catch (error) {
    notifError(error?.response?.data?.message || 'Gagal memuat rincian pembayaran hutang.')
  }
}
</script>

<style scoped>
.history-info-card,
.history-money-card { min-height: 76px; }
.history-money-card .q-card__section { text-align: right; }
</style>
