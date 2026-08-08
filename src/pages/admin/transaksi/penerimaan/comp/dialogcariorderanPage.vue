<template>
  <q-dialog v-model="storeorder.fixed">
    <q-card>
      <q-card-section>
        <div class="text-h6"><q-input outlined label="Cari Orderan" clearable /></div>
      </q-card-section>

      <q-separator />

      <q-card-section style="max-height: 50vh" class="scroll">
        <div align="center" v-if="storeorder.loadingdialogorder === true">
          <q-spinner-radio color="yellow-9" size="2em" />
        </div>
        <div
          align="center"
          v-if="storeorder.loadingdialogorder === false && storeorder.itemorderan.length === 0"
        >
          Belum Ada Data Yang Ditampilkan...!!!
        </div>
        <div v-else>
          <q-list separator>
            <transition-group name="list">
              <q-item v-for="(item, n) in storeorder.itemorderan" :key="n" class="list-move">
                <q-item-section>
                  <q-item-label>
                    <span class="text-weight-bold">No. Order</span> :
                    <span class="text-weight-bold"
                      ><q-badge outline color="yellow-8">{{ item?.noorder }}</q-badge></span
                    >
                  </q-item-label>
                  <!-- <q-separator class="q-my-md" /> -->
                  <q-item-label>
                    <span class="text-weight-bold">Tgl</span> :
                    <span class="text-weight-bold">{{ item?.tglorder }}</span>
                  </q-item-label>
                  <q-item-label>
                    <span class="text-weight-bold">Supplier</span> :
                    <span class="text-weight-bold"
                      ><q-badge color="grey-5" class="text-black">{{
                        item?.suplier?.nama
                      }}</q-badge></span
                    >
                  </q-item-label>
                  <q-item-label>
                    <span class="text-weight-bold">Total</span> :
                    <span class="text-weight-bold"
                      ><q-badge color="lime-7" class="text-black">{{
                        formatRpDouble(item?.total)
                      }}</q-badge></span
                    >
                  </q-item-label>
                </q-item-section>

                <q-item-section side>
                  <div class="q-gutter-sm">
                    <q-btn
                      :loading="storeorder.loadingdialogorder"
                      flat
                      round
                      size="lg"
                      color="lime"
                      icon="fact_check"
                      @click="pilih(item)"
                    />
                  </div>
                </q-item-section>
              </q-item>
            </transition-group>
          </q-list>
        </div>
      </q-card-section>

      <q-separator />

      <q-card-actions align="right">
        <!-- <q-btn flat label="Decline" color="primary" v-close-popup /> -->
        <app-btn label="Keluar" color="grey-10" class="text-yellow-9" v-close-popup />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>
<script setup>
import { formatRpDouble } from 'src/modules/formatter'
import { useAdminListTransaksiOrderBarangStore } from 'src/stores/admin/transaksi/orderbarang/list'
import { useAdminFormTransaksiPenerimaanBarangStore } from 'src/stores/admin/transaksi/penerimaan/form'

const storeorder = useAdminListTransaksiOrderBarangStore()
const storepenerimaan = useAdminFormTransaksiPenerimaanBarangStore()

// storeorder.getorderanfix()

function pilih(item) {
  console.log('item', item)
  // storepenerimaan.form.id = item?.id
  storepenerimaan.form.noorder = item?.noorder
  storepenerimaan.form.suplier = item?.suplier?.nama
  storepenerimaan.form.kdsuplier = item?.kdsuplier
  storepenerimaan.rinci = [...item.rinci]
  // storepenerimaan.form.jumlahpo = item?.rinci?.jumlahpo
  storeorder.fixed = false
  storepenerimaan.hiden = false
}
</script>
