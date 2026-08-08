<template>
  <q-card flat class="full-width full-height">
    <q-card-section class="q-px-md q-py-xs bg-grey-9 text-white col-auto full-width">
      <div class="row items-center justify-between">
        <div class="text-weight-bold">
          Rincian Pengeluaran || Nomor : {{ store.form?.notrans ?? '-' }}
          <!-- <span class="text-yellow-8"> TOTAL {{ formatRpDouble(totalrinci()) }} </span> -->
        </div>
      </div>
    </q-card-section>
    <div class="row q-col-gutter-md full-width justify-between">
      <q-card-section class="full-height q-px-md" style="min-width: 50%; max-width: 100%">
        <q-list separator>
          <!-- <template v-if="store.listrincian.length > 0"> -->
          <q-item v-for="(item, n) in store.rincian" :key="n" class="list-move">
            <q-item-section>
              <div class="row full-width">
                <div class="full-width">
                  <span class="text-weight-medium">{{ item.beban }}</span>
                  <span class="text-weight-medium q-pl-sm"> ({{ item?.kodebeban }})</span>
                </div>
                <div class="col-3">
                  <span class="text-weight-medium"> {{ item?.volume }} </span>
                  <span class="q-pl-sm text-weight-medium"> {{ item?.satuan }}</span>
                </div>
                <div class="col-1">
                  <span> x </span>
                </div>
                <div class="col-3">
                  <span class="text-weight-medium"> {{ formatDenganRp(item?.nominal) }}</span>
                </div>
                <div class="col-1">
                  <span class="text-weight-medium"> = </span>
                </div>
                <div class="col-4 text-right">
                  <span class="text-weight-medium"> {{ formatDenganRp(item?.subtotal) }}</span>
                </div>
              </div>
            </q-item-section>
            <q-item-section side>
              <div class="content-center">
                <app-btn-delete-list @click="del(item)" />
              </div>
            </q-item-section>
          </q-item>
          <!-- </template> -->
        </q-list>
      </q-card-section>
      <q-card-section
        class="full-height q-px-md justify-around"
        style="min-width: 50%; max-width: 100%"
      >
        <q-list separator class="full-height q-pt-md">
          <!-- <template v-if="store.listrincian.length > 0"> -->
          <q-item class="full-width text-center bg-yellow-9">
            <q-item-section>
              <div class="row full-width flex-center text-bold">
                <div class="q-pr-sm">Total Pengeluaran :</div>
                {{ formatRpDouble(totalrinci()) }}
              </div>
            </q-item-section>
            <q-item-section side>
              <div class="text-grey-8">
                <!-- <btn-print v-print="printObj" /> -->
                <!-- <btn-print @click="viewCetak()" /> -->
              </div>
            </q-item-section>
          </q-item>
          <!-- </template> -->
        </q-list>
      </q-card-section>
    </div>
  </q-card>
</template>
<script setup>
import { useQuasar } from 'quasar'
import { formatRpDouble } from 'src/modules/formatter'
import { formatDenganRp } from 'src/modules/utils'
import { useFormTransaksiBebanStore } from 'src/stores/admin/transaksi/bebanpengeluaran/form'
import { onBeforeMount } from 'vue'

const store = useFormTransaksiBebanStore()
const $q = useQuasar()

console.log('rinci', store.rincian)
onBeforeMount(() => {
  // Promise.all([list.getList()]);
})
function del(item) {
  console.log('hapus id', item)
  $q.dialog({
    dark: true,
    title: 'Peringatan',
    message: 'Apakah Data ini akan dihapus?',
    cancel: true,
    persistent: true,
  })
    .onOk(() => {
      const payload = {
        notrans: item.notrans,
        id: item.id,
        // nopenerimaan: store.form.noserahterima,
      }
      console.log('payload', payload)
      store.deleteData(payload).then(() => {
        if (store.rincian?.length === 0) {
          store.initForm()
          console.log('notrans', store.form.notrans)
        }
      })
    })
    .onCancel(() => {
      // console.log('Cancel')
    })
    .onDismiss(() => {
      // console.log('I am triggered on both OK and Cancel')
    })
}

// const listrincian = computed(() => {
//   // console.log("listrinci", store.listrincian);
//   return store.listrincian;
//   // return store.listrincian.length > 0 ? store.listrincian : store.form.rincians;
// });

// const totalrinci = computed(() => {
//   // console.log("formrinci", store.form);
//   return listrincian.value.reduce((total, item) => {
//     return total + (parseFloat(item.subtotal) || 0);
//   }, 0);
// });

function totalrinci() {
  const arr = store.rincian
  if (!arr || !Array.isArray(arr) || arr.length === 0) {
    return 0
  }
  return arr
    .map((x) => parseFloat(x.subtotal) || 0) // Tambahkan fallback jika subtotal bukan angka
    .reduce((a, b) => a + b, 0)
}

// const listDataitem = ref(null)
// function viewCetak() {
//   store.dialogCetak = true
//   listDataitem.value = store.form
//   store.dataCetak = store.form
//   // console.log("store.form", store.form);
// }
</script>
