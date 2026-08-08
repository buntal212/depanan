<template>
  <div class="fit column absolute">
    <div class="col full-height">
      <q-card flat bordered square class="full-height" style="overflow: hidden">
        <!-- <q-avatar size="33px" color="dark" text-color="white">-</q-avatar> -->

        <q-card-section class="q-px-md q-py-xs bg-yellow-8 text-black col-auto full-width">
          <div class="row items-center justify-between">
            <div class="f-12 text-weight-bold" style="height: 23px">
              <span> Data Penerimaan || No. Penerimaan : {{ props?.data?.nopenerimaan }} || </span>
              <span
                ><q-toggle
                  v-model="value"
                  label="Lihat Harga Asli"
                  color="red"
                  size="25px"
                  right-label
              /></span>
            </div>
            <div>
              <q-badge color="blue-10" outline class="text-bold"
                >Total :
                {{
                  value === true
                    ? formatRpDouble(props?.data?.totalfix)
                    : formatRpDouble(props?.data?.total)
                }}</q-badge
              >
            </div>
          </div>
        </q-card-section>
        <q-card-section style="padding: 0" class="full-height">
          <q-scroll-area style="height: calc(100% - 32px)">
            <q-list separator>
              <transition-group name="list">
                <q-item v-for="(item, n) in lists" :key="n" class="list-move">
                  <q-item-section>
                    <!-- <div class="row full-width">{{ n + 1 }}.</div> -->
                    <div class="row full-width">
                      <div class="col-11">
                        <span class="text-grey-8">{{ n + 1 }}. </span>
                        <span class="text-weight-medium"
                          >{{ item?.mbarang?.namabarang }} Seri {{ item?.motif }}</span
                        >
                        <span class="text-grey-8"> ({{ item?.kdbarang }})</span>
                      </div>
                      <div class="col-2">
                        <span class="q-mr-md"> </span>
                        <span class="text-weight-medium">
                          {{ item?.jumlah_b }} {{ item?.satuan_b }}</span
                        >
                        <span class="text-grey-7" v-if="item?.isi !== '1'">
                          ({{ item?.jumlah_k }} {{ item?.satuan_k }})</span
                        >
                      </div>
                      <div class="col-1">
                        <span> X </span>
                      </div>
                      <div class="col-3">
                        <span class="text-weight-medium">
                          {{
                            value === true
                              ? formatRpDouble(item?.harga_beli_b)
                              : formatRpDouble(item?.hargafaktur)
                          }}</span
                        >
                      </div>
                      <div class="col-1">
                        <span class="text-weight-medium"> = </span>
                      </div>
                      <div class="col-5">
                        <span class="text-weight-medium">
                          {{
                            value === true
                              ? formatRpDouble(item?.subtotalfix)
                              : formatRpDouble(item?.subtotal)
                          }}</span
                        >
                      </div>
                    </div>
                  </q-item-section>
                  <q-item-section top side v-if="props?.data?.kunci != '1'">
                    <div class="text-grey-8">
                      <q-btn
                        class="gt-xs"
                        size="12px"
                        flat
                        dense
                        round
                        icon="delete"
                        @click="
                          hapusrincian(
                            item?.id,
                            storeform.form.nopenerimaan,
                            item?.noorder,
                            item?.kdbarang,
                          )
                        "
                      />
                    </div>
                  </q-item-section>
                </q-item>
              </transition-group>
            </q-list>
          </q-scroll-area>
        </q-card-section>
      </q-card>
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'

// import { useQuasar } from 'quasar'
import { formatRpDouble } from 'src/modules/formatter'
import { useQuasar } from 'quasar'
import { useAdminFormTransaksiPenerimaanBarangStore } from 'src/stores/admin/transaksi/penerimaan/form'
// import { useAdminFormTransaksiOrderBarangStore } from 'src/stores/admin/transaksi/orderbarang/form'
// import { computed } from 'vue'

const $q = useQuasar()
const storeform = useAdminFormTransaksiPenerimaanBarangStore()
const props = defineProps({
  data: {
    type: Object,
    default: null,
  },
})
const value = ref(false)
function hapusrincian(id, nopenerimaan, noorder, kdbarang) {
  $q.dialog({
    dark: true,
    title: 'Peringatan',
    message: 'Apakah Data ini akan dihapus?',
    cancel: true,
    persistent: true,
  })
    .onOk(() => {
      // console.log('OK')
      storeform.deleteData(id, nopenerimaan, noorder, kdbarang)
    })
    .onCancel(() => {
      // console.log('Cancel')
    })
    .onDismiss(() => {
      // console.log('I am triggered on both OK and Cancel')
    })
}

const lists = computed(() => {
  const arr = props.data?.rinci
  //console.log('arr', arr)
  return arr?.sort((a, b) => {
    return b.id - a.id
  })
})
</script>
