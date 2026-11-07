<template>
  <q-dialog v-model="storeform.basic" transition-show="rotate" transition-hide="rotate">
    <q-card style="width: 100vw">
      <q-card-section>
        <div class="text-h6 q-mb-sm">
          <span class="text-weight-bold text-yellow-8">
            {{ pelanggans?.nama }}
            <span class="text-weight-bold text-red"> {{ formatRpDouble(totalall) }}</span>
          </span>
          <br />
          <div class="row q-col-gutter-sm items-center q-mt-xs">
            <div class="col">
              <app-input
                v-model="storeform.carinota"
                outlined
                dense
                label="Cari Nota...."
                @keyup="cariNota()"
              />
            </div>
            <div class="col-auto" v-if="storeform.carinota">
              <q-btn
                outline
                color="primary"
                icon="search"
                label="Cek Riwayat Nota"
                @click="bukaHistoriPembayaran(storeform.carinota.trim())"
              >
                <q-tooltip>Telusuri riwayat piutang & pelunasan nota ini (termasuk nota lunas)</q-tooltip>
              </q-btn>
            </div>
          </div>
        </div>
        <q-separator />
      </q-card-section>

      <q-card-section style="max-height: 80vh" class="scroll">
        <div align="center" v-if="storeform.loadingcaripiutang === true">
          <q-spinner-radio color="yellow-9" size="2em" />
        </div>
        <div
          align="center"
          v-if="storeform.loadingcaripiutang === false && storeform.loadingcaripiutang.length === 0"
        >
          Belum Ada Data Yang Ditampilkan...!!!
        </div>
        <div v-else>
          <q-list v-for="(item, n) in storeform.items" :key="n" separator>
            <q-form ref="refForm" class="column full-height full-width" @submit="onSubmit(item)">
              <transition-group name="list">
                <q-item class="list-move" :key="item.nopenjualan">
                  <q-item-section class="q-pl-xs q-pr-xs">
                    <div class="row">
                      <div class="col-5">No. Penjualan</div>
                      <div class="col-1">:</div>
                      <div class="col-6">{{ item?.nopenjualan }}</div>
                    </div>
                    <div class="row">
                      <div class="col-5">Pelanggan</div>
                      <div class="col-1">:</div>
                      <div class="col-6">{{ item?.pelanggan }}</div>
                    </div>
                    <div class="row">
                      <div class="col-5">Tgl Penerimaan</div>
                      <div class="col-1">:</div>
                      <div class="col-6 text-weight-bold">
                        {{ humanDate(item?.tglpenjualan) }}
                      </div>
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
                      <div class="col-4 text-green">
                        Total Nota <br />{{ formatRpDouble(item?.totalnota) }}
                      </div>
                      <div class="col-4 text-yellow-8">
                        Sudah Dibayar <br />
                        {{ formatRpDouble(item?.totalterbayang) }}
                      </div>
                      <div class="col-4 text-red">
                        Sisa Piutang <br />
                        {{ formatRpDouble(item?.totalpiutang) }}
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
                        aria-label="Buka histori pembayaran nota"
                        @click="bukaHistoriPembayaran(item.nopenjualan)"
                      >
                        <q-tooltip>Histori pembayaran nota ini</q-tooltip>
                      </q-btn>
                      <q-btn
                        :loading="
                          storeform.loadingsimpan &&
                          storeform.form.nopenjualan === item?.nopenjualan
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
                <q-separator />
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
          <div class="text-h6">Rincian Pembayaran Piutang</div>
          <div class="text-caption">Histori pembayaran per No. Penjualan</div>
        </div>
        <q-btn flat round dense icon="close" v-close-popup aria-label="Tutup dialog" />
      </q-card-section>
      <q-separator />
      <q-card-section v-if="storeform.loadingRiwayat" class="text-center q-py-xl">
        <q-spinner-dots color="primary" size="36px" />
      </q-card-section>
      <q-card-section v-else-if="!storeform.riwayatNota" class="text-center text-grey q-py-xl">
        Belum ada pembayaran untuk nota ini.
      </q-card-section>
      <template v-else>
        <q-card-section class="q-pa-md">
          <div class="row q-col-gutter-md">
            <div class="col-12 col-sm-8">
              <q-card flat bordered class="history-info-card full-height">
                <q-card-section class="q-pa-sm">
                  <div class="row q-col-gutter-sm items-center">
                    <div class="col-12 col-sm-6">
                      <div class="text-caption text-grey-6">No. Penjualan</div>
                      <div class="text-subtitle1 text-weight-bold">
                        {{ storeform.riwayatNota.no_penjualan }}
                        <q-badge
                          v-if="storeform.riwayatNota.is_lunas"
                          color="positive"
                          class="q-ml-xs text-weight-bold"
                        >
                          LUNAS
                        </q-badge>
                        <q-badge
                          v-else
                          color="negative"
                          class="q-ml-xs text-weight-bold"
                        >
                          BELUM LUNAS
                        </q-badge>
                      </div>
                    </div>
                    <div class="col-12 col-sm-6">
                      <div class="text-caption text-grey-6">Pelanggan</div>
                      <div class="text-subtitle1 text-weight-bold">{{ storeform.riwayatNota.nama_pelanggan || '-' }}</div>
                    </div>
                  </div>
                </q-card-section>
              </q-card>
            </div>
            <div class="col-12 col-sm-4">
              <q-card flat bordered class="history-info-card full-height">
                <q-card-section class="q-pa-sm">
                  <div class="text-caption text-grey-6">Tanggal Hutang</div>
                  <div class="text-subtitle1 text-weight-bold">{{ humanDate(storeform.riwayatNota.tgl_hutang) }}</div>
                  <div v-if="storeform.riwayatNota.is_lunas && storeform.riwayatNota.tgl_lunas" class="text-caption text-positive">
                    Lunas: {{ humanDate(storeform.riwayatNota.tgl_lunas) }}
                  </div>
                </q-card-section>
              </q-card>
            </div>
            <div class="col-12 col-sm-4">
              <q-card flat bordered class="history-money-card full-height">
                <q-card-section class="q-pa-sm">
                  <div class="text-caption text-grey-6">Total Nota</div>
                  <div class="text-subtitle1 text-weight-bold">{{ formatRpDouble(storeform.riwayatNota.total_nota) }}</div>
                </q-card-section>
              </q-card>
            </div>
            <div class="col-12 col-sm-4">
              <q-card flat bordered class="history-money-card full-height">
                <q-card-section class="q-pa-sm">
                  <div class="text-caption text-grey-6">Total Dibayar</div>
                  <div class="text-subtitle1 text-weight-bold text-positive">{{ formatRpDouble(storeform.riwayatNota.total_dibayar_nota) }}</div>
                </q-card-section>
              </q-card>
            </div>
            <div class="col-12 col-sm-4" v-if="Number(storeform.riwayatNota.total_retur_nota) > 0">
              <q-card flat bordered class="history-money-card full-height">
                <q-card-section class="q-pa-sm">
                  <div class="text-caption text-grey-6">Total Retur Selesai</div>
                  <div class="text-subtitle1 text-weight-bold text-orange-9">{{ formatRpDouble(storeform.riwayatNota.total_retur_nota) }}</div>
                </q-card-section>
              </q-card>
            </div>
            <div class="col-12 col-sm-4">
              <q-card flat bordered class="history-money-card full-height">
                <q-card-section class="q-pa-sm">
                  <div class="text-caption text-grey-6">Sisa Piutang</div>
                  <div class="text-subtitle1 text-weight-bold" :class="Number(storeform.riwayatNota.sisa_piutang_nota) > 0 ? 'text-negative' : 'text-positive'">
                    {{ formatRpDouble(storeform.riwayatNota.sisa_piutang_nota) }}
                  </div>
                </q-card-section>
              </q-card>
            </div>
            <div class="col-12 col-sm-4" v-if="Number(storeform.riwayatNota.hak_pengembalian) > 0">
              <q-card flat bordered class="history-money-card full-height bg-amber-1">
                <q-card-section class="q-pa-sm">
                  <div class="text-caption text-warning text-weight-bold">Hak Pengembalian Dana</div>
                  <div class="text-subtitle1 text-weight-bold text-deep-orange-9">{{ formatRpDouble(storeform.riwayatNota.hak_pengembalian) }}</div>
                </q-card-section>
              </q-card>
            </div>
          </div>
        </q-card-section>
        <template v-if="storeform.riwayatNota.daftar_retur && storeform.riwayatNota.daftar_retur.length > 0">
          <q-separator />
          <q-card-section class="q-py-sm">
            <div class="text-subtitle2 text-weight-bold">Rincian Retur Penjualan ({{ storeform.riwayatNota.daftar_retur.length }})</div>
            <div class="text-caption text-grey-6">Daftar transaksi retur yang mengurangi piutang nota ini</div>
          </q-card-section>
          <q-markup-table flat dense wrap-cells>
            <thead>
              <tr>
                <th class="text-left">Tanggal Retur</th>
                <th class="text-left">No. Retur</th>
                <th class="text-left">Status</th>
                <th class="text-right">Subtotal</th>
                <th class="text-right">Diskon Nota</th>
                <th class="text-right">PPN</th>
                <th class="text-right">Total Retur</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="retur in storeform.riwayatNota.daftar_retur" :key="retur.id">
                <td>{{ humanDate(retur.tgl) }}</td>
                <td class="text-weight-bold">{{ retur.no_retur }}</td>
                <td>
                  <q-badge :color="retur.status === '1' ? 'positive' : 'grey-7'">
                    {{ retur.status === '1' ? 'Selesai' : 'Draft' }}
                  </q-badge>
                </td>
                <td class="text-right">{{ formatRpDouble(retur.subtotal) }}</td>
                <td class="text-right">{{ Number(retur.diskon_kuitansi) > 0 ? '- ' + formatRpDouble(retur.diskon_kuitansi) : 'Rp 0' }}</td>
                <td class="text-right">{{ Number(retur.ppn_nominal) > 0 ? formatRpDouble(retur.ppn_nominal) : 'Rp 0' }}</td>
                <td class="text-right text-weight-bold text-orange-9">{{ formatRpDouble(retur.total) }}</td>
              </tr>
            </tbody>
          </q-markup-table>
        </template>
        <q-separator />
        <q-card-section class="q-py-sm">
          <div class="text-subtitle2 text-weight-bold">Detail Pembayaran ({{ storeform.riwayatNota.rincian.length }})</div>
          <div class="text-caption text-grey-6">Daftar pembayaran yang telah tercatat untuk nota ini</div>
        </q-card-section>
        <q-markup-table flat dense wrap-cells>
          <thead>
            <tr>
              <th class="text-left">Tanggal Bayar</th><th class="text-left">No. Pembayaran</th><th class="text-left">Cara Bayar</th><th class="text-left">Keterangan</th><th class="text-right">Nominal Bayar</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="rincian in storeform.riwayatNota.rincian" :key="rincian.id">
              <td>{{ humanDate(rincian.tgl_bayar) }}</td><td>{{ rincian.nopembayaran || '-' }}</td><td>{{ rincian.cara_bayar || '-' }}</td><td>{{ rincian.keterangan || '-' }}</td><td class="text-right text-weight-bold">{{ formatRpDouble(rincian.jumlah) }}</td>
            </tr>
          </tbody>
        </q-markup-table>
      </template>
    </q-card>
  </q-dialog>
</template>
<script setup>
import { notifError } from 'src/modules/notifs'
import { formatRpDouble, humanDate, olahUang } from 'src/modules/utils'
import { useAdminFormTransaksiPembayaranPiutangStore } from 'src/stores/admin/transaksi/pembayaranpiutang/form'
import { computed } from 'vue'

const storeform = useAdminFormTransaksiPembayaranPiutangStore()

const props = defineProps({
  pelanggan: {
    type: Array,
    default: () => [],
  },
})

const pelanggans = computed(() => {
  // console.log('sasa', props.pelanggan)
  const wew = props.pelanggan.find((f) => f?.id === storeform.form.pelanggan_id)
  return wew
})

const totalall = computed(() => {
  const total = storeform.items.reduce((a, b) => a + parseFloat(b?.yangakandibayar ?? 0), 0)
  return total
})

function cariNota() {
  storeform.items = storeform.items.filter((f) => f.nopenjualan.includes(storeform.carinota))
}

async function bukaHistoriPembayaran(noPenjualan) {
  try {
    await storeform.getRiwayatNota(noPenjualan)
  } catch (error) {
    notifError(error?.response?.data?.message || 'Gagal memuat rincian pembayaran nota.')
  }
}

function onSubmit(item) {
  storeform.form.nopenjualan = item?.nopenjualan
  storeform.form.total = olahUang(item?.yangakandibayar)
  const sisahutang = olahUang(item?.sisajumlahbelumditerimax)
  if (storeform.form.total > sisahutang) {
    notifError(
      'Jumlah Pembayaran Tidak Boleh Lebih Dari Sisa Piutang, Sisa Piutang Adalah ' +
        formatRpDouble(sisahutang),
    )
  } else {
    // console.log('sisahutang', sisahutang, storeform.form.total)
    storeform.simpan()
  }
}
</script>

<style scoped>
.history-info-card,
.history-money-card {
  min-height: 76px;
}

.history-money-card .q-card__section {
  text-align: right;
}
</style>
