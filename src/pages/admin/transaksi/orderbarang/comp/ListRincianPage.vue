<template>
  <div class="fit column absolute">
    <div class="col full-height">
      <q-card flat bordered square class="full-height" style="overflow: hidden">
        <!-- <q-avatar size="33px" color="dark" text-color="white">-</q-avatar> -->

        <q-card-section class="q-px-md q-py-xs bg-yellow-8 text-black col-auto full-width">
          <div class="row items-center justify-between">
            <div class="f-12 text-weight-bold" style="height: 23px">
              List Order || No.Order : {{ data?.noorder ?? '-' }}
            </div>
            <div class="f-12 text-weight-bold" style="height: 23px">
              Total : {{ formatRpDouble(data?.total ?? 0) }}
            </div>
          </div>
        </q-card-section>
        <q-card-section style="padding: 0" class="full-height">
          <q-scroll-area style="height: calc(100% - 32px)">
            <q-list separator>
              <transition-group name="list">
                <q-item v-for="(item, n) in lists" :key="n" class="list-move">
                  <q-item-section>
                    <div class="row full-width">
                      <div class="col-12">
                        <span class="text-weight-medium">{{ item?.mbarang?.namabarang }}</span>
                        <span class="text-grey-8"> ({{ item?.kdbarang }})</span>
                      </div>
                      <div class="col-2">
                        <span class="text-weight-medium">
                          {{ item?.jumlahpo }} {{ item?.satuan_b }}</span
                        >
                        <span class="text-grey-8" v-if="item?.isi !== '1'">
                          ({{ item?.jumlahpo_k }} {{ item?.satuan_k }})</span
                        >
                      </div>
                      <div class="col-1">
                        <span> X </span>
                      </div>
                      <div class="col-3">
                        <span class="text-weight-medium"> {{ formatRpDouble(item?.hargapo) }}</span>
                      </div>
                      <div class="col-1">
                        <span class="text-weight-medium"> = </span>
                      </div>
                      <div class="col-5">
                        <span class="text-weight-medium">
                          {{ formatRpDouble(item?.subtotal) }}</span
                        >
                      </div>
                    </div>
                  </q-item-section>
                  <q-item-section top side>
                    <div class="text-grey-8" v-if="data?.flaging === null">
                      <q-btn
                        class="gt-xs"
                        size="12px"
                        flat
                        dense
                        round
                        icon="delete"
                        @click="hapusrincian(item?.id, data?.noorder, data?.flaging)"
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
import { useQuasar } from 'quasar'
import { formatRpDouble } from 'src/modules/formatter'
import { notifError } from 'src/modules/notifs'
import { useAdminFormTransaksiOrderBarangStore } from 'src/stores/admin/transaksi/orderbarang/form'
import { computed } from 'vue'

const $q = useQuasar()
const storeform = useAdminFormTransaksiOrderBarangStore()
const props = defineProps({
  data: {
    type: Object,
    default: null,
  },
})

function hapusrincian(id, noorder, kunci) {
  if (kunci === null || kunci === undefined) {
    $q.dialog({
      dark: true,
      title: 'Peringatan',
      message: 'Apakah Data ini akan dihapus?',
      cancel: true,
      persistent: true,
    })
      .onOk(() => {
        // console.log('OK')
        storeform.deleteData(id, noorder)
      })
      .onCancel(() => {
        // console.log('Cancel')
      })
      .onDismiss(() => {
        // console.log('I am triggered on both OK and Cancel')
      })
  } else {
    notifError('Maaf Data Sudah Dikunci...!!')
  }
}

const lists = computed(() => {
  const arr = props.data?.rinci
  return arr?.sort((a, b) => {
    return b.id - a.id
  })
})
</script>
