<template>
  <q-dialog v-model="storeform.basic" transition-show="rotate" transition-hide="rotate">
    <q-card style="width: 100vw">
      <q-card-section>
        <div class="text-h6 q-mb-sm">
          <span class="text-weight-bold text-yellow-8">
            {{ pelanggans?.nama }}
            <span class="text-weight-bold text-red"> {{ formatRpDouble(totalall) }}</span></span
          >
          <br />
          <span
            ><app-input
              v-model="storeform.carinota"
              outlined
              dense
              label="Cari Nota...."
              @keyup="cariNota()"
          /></span>
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
