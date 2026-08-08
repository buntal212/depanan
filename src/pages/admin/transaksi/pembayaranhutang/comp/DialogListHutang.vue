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
</script>
