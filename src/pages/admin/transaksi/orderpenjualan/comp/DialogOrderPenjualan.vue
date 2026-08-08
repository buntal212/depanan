<template>
  <q-dialog persistent backdrop-filter="blur(4px)">

    <q-card flat round class="q-px-md fit column rounded-borders" style="min-width: 90vw; max-width: 90vw; min-height: 90vh; max-height:90vh;">
      <q-card-section class="col-auto q-pb-sm q-px-sm">
        <div class="flex items-center justify-between">
          <div class="text-weight-bold">Order Penjualan # {{ props.order?.noorder }}</div>
          <q-btn v-close-popup icon="close" flat round size="md" style="margin-right: -10px;"></q-btn>
        </div>
      </q-card-section>
      <q-card-section class="col full-height q-pa-none rounded-borders" :class="`${$q.dark.isActive ? 'bg-black': 'bg-grey-4'}`" style="border-radius: 10px;">
        <div class="column full-height">
          <div class="col-auto">
            <div class="flex justify-between items-center rounded-borders shadow-sm q-px-md q-pb-md q-pt-md">
              <div>
                <app-btn v-if="parseInt(order?.status_order) < 3" color="negative" label="Batalkan Order" @click="batalkanOrder" />
              </div>
              <div class="flex items-center q-gutter-sm">
                <div>
                  <app-btn v-if="parseInt(order?.status_order) < 9" :label="pelabelan" @click="lanjutkanStep"
                    :loading="loading"
                    :disable="loading || parseInt(order?.status_order) === 3"
                  />
                </div>
              </div>
            </div> 
            <q-separator></q-separator>
            <div v-if="order?.status_order !== '9'" class="row full-width overflow-hidden">
              <div class="col-12">
                <q-stepper
                  v-model="step"
                  ref="stepper"
                  alternative-labels
                  animated
                  flat
                  done-color="primary"
                  active-color="teal"
                  inactive-color="gray"
                  :class="`${$q.dark.isActive ? 'bg-black': 'bg-grey-4'}`"
                >
                  <q-step
                    :name="1"
                    title="DRAFT"
                    icon="settings"
                    :done="step > 1"
                  >
                  </q-step>

                  <q-step
                    :name="3"
                    title="DISETUJUI"
                    caption="Menunggu Pembayaran"
                    icon="credit_card"
                    :done="step > 3"
                  >
                  </q-step>
                  <q-step
                    :name="4"
                    title="DIKIRIM"
                    caption="Dan Order Selesai"
                    icon="local_shipping"
                    :done="step > 4"
                  >
                  </q-step>

                  <!-- <template v-slot:navigation>
                    <q-stepper-navigation>
                      <q-btn @click="$refs.stepper.next()" color="primary" :label="step === 4 ? 'Finish' : 'Continue'" />
                      <q-btn v-if="step > 1" flat color="primary" @click="$refs.stepper.previous()" label="Back" class="q-ml-sm" />
                    </q-stepper-navigation>
                  </template> -->
                </q-stepper>
              </div>
            </div>

            <!-- INFO ORDER -->
            <div class="row full-width q-pa-md" style="max-width: 100%;">
              <div class="col-12 row q-col-gutter-sm">
              <div class="col-4 ">
                <q-card flat class="full-height">
                  <q-card-section>
                    <div class="text-body text-weight-bold"> Data Pelanggan</div>
                    <q-separator class="q-my-sm"></q-separator>
                    <div class="flex q-gutter-sm items-center">
                      <q-icon name="person_2" size="16px"> </q-icon>
                      <div>{{ order?.pelanggan?.nama }} </div>
                    </div>
                    <!-- <div class="flex q-gutter-sm items-center">
                      <q-icon name="place" size="16px"> </q-icon>
                      <div>{{ order?.pelanggan?.alamat || '-' }} </div>
                    </div> -->
                    <div class="flex q-gutter-sm items-center">
                      <q-icon name="phone" size="16px"> </q-icon>
                      <div>{{ order?.pelanggan?.telepon || '-' }} </div>
                    </div>
                    <div class="flex q-gutter-sm items-center">
                      <q-icon name="credit_card" size="16px"> </q-icon>
                      <div>{{ order?.pelanggan?.norek }} - {{ order?.pelanggan?.namabank }} </div>
                    </div>
                  </q-card-section>
                </q-card>
              </div>
              <div class="col-4">
                <q-card flat class="full-height column">
                  <q-card-section class="">
                    <div class="flex q-gutter-sm items-center">
                      <q-icon name="add_shopping_cart" size="20px"> </q-icon>
                      <div class="text-body text-weight-bold">Informasi Order </div>
                    </div>
                    <q-separator class="q-my-sm"></q-separator>
                    <div class="flex q-gutter-sm items-center q-mb-sm">
                      <div>Dari Sales : </div>
                      <div>{{ order?.sales?.nama || '-' }} </div>
                    </div>
                    <div class="flex q-gutter-sm items-center q-mb-sm">
                      <q-icon name="watch" size="16px"> </q-icon>
                      <div>{{ order?.tglorder || '-' }} </div>
                    </div>
                    <div class="flex q-gutter-sm items-center">
                      <q-icon name="credit_card" size="16px"> </q-icon>
                      <div>{{ order?.metode_bayar }}  </div>
                    </div>
                  </q-card-section>
                </q-card>
              </div>
              <div class="col-4">
                <q-card flat class="full-height">
                  <q-card-section>
                    <div class="flex q-gutter-sm items-center">
                      <q-icon name="paid" size="22px"> </q-icon>
                      <div class="text-body text-weight-bold">Summary Order </div>
                    </div>
                    
                  <q-separator class="q-my-sm"></q-separator>
                  </q-card-section>
                  <q-card-section class="" :class="`${$q.dark.isActive ? 'bg-black': 'bg-grey-4'} q-ma-md`" style="margin-top: -10px;">
                    <div class="text-center text-h5 text-weight-bold">
                      {{ formatRp(order?.total_harga) }}
                    </div>
                  </q-card-section>
                </q-card>
              </div>
            </div>
            </div>

          </div>
          <q-card flat class="col full-height q-pa-md" >
            <q-list bordered padding class="column full-height">
              <q-item class="col-auto">
                <q-item-section>
                  <q-item-label overline>DAFTAR ITEM</q-item-label>
                  <q-item-label caption>Item dapat di batalkan jika Status Order masih dalam status <b>DRAFT</b></q-item-label>
                </q-item-section>

                <q-item-section side top>
                  <q-item-label caption>
                    {{ order.rincians?.length }} ITEM
                  </q-item-label>
                </q-item-section>
              </q-item>
              <q-separator spaced />
              <div class="col full-height scroll">
                <template v-for="(item, n) in order?.rincians" :key="n">
                  <q-item clickable
                    @mouseover="hoveredId = n"
                    @mouseleave="hoveredId = null"
                    :class="{ 'bg-grey-8 text-white': hoveredId === n }"
                  >
                    <q-item-section avatar>
                      <q-avatar>
                        <q-img src="/images/No-Image.svg" />
                      </q-avatar>
                    </q-item-section>
                    <q-item-section>
                      <q-item-label overline class="text-weight-bold">{{ item?.barang?.namabarang }}</q-item-label>
                      <q-item-label >{{ formatRp(item?.harga) }} x {{ item?.jumlah }} 
                        <span class="text-grey">( {{ item?.barang?.satuan_k || 'Satuan Kecil' }} )</span>

                      </q-item-label>
                      <q-item-label >
                        <span class="text-grey">
                          Pemesanan Aktual Dalam Satuan {{ item.satuan || '-'}}
                        </span>
                        <span v-if="item?.satuan === item?.barang?.satuan_b"> ( {{ parseInt(item.jumlah) / parseInt(item.barang?.isi) }} {{ item?.satuan }}) </span>

                      </q-item-label>
                    </q-item-section>
                    <q-item-section v-if="hoveredId === n" side>
                      <div class="flex q-gutter-sm">
                        <app-btn-edit-list @click="edit(n, item)" />
                        <app-btn-delete-list @click="hapus(item)" />
                      </div>
                    </q-item-section>
                    <q-item-section v-else side>
                      <q-item-label>
                        <div class="text-weight-bold text-body1">
                          Rp {{ formatRp(parseInt(item?.harga || 0) * parseInt(item?.jumlah || 0) || 0) }}
                        </div>
                      </q-item-label>
                    </q-item-section>
                  </q-item>
                  <q-separator></q-separator>
                </template>
                  <!-- <div style="padding-bottom: 100px;"></div> -->
              </div>
            </q-list>
            <!-- <div style="margin-bottom: 200px;"></div> -->
          </q-card>
        </div>
      </q-card-section>

      

      <q-dialog v-model="openEdit" persistent transition-show="flip-down" transition-hide="flip-up"
        backdrop-filter="blur(4px)"

      >
        <q-card flat>
          <q-bar>
            <q-icon name="shopping_cart" />
            <div>{{ edittedItem?.barang?.namabarang }}</div>

            <q-space />

            <q-btn dense flat icon="close" @click="()=>{
              openEdit = false
              edittedItem = null
            }">
              <q-tooltip class="bg-white text-primary">Close</q-tooltip>
            </q-btn>
          </q-bar>


          <q-separator class="q-my-mb"></q-separator>
          <q-card-section>
            <quantity-selector 
              v-model="edittedItem.jumlah"
              :maxPcs="50"
              :isiPerDus="edittedItem.barang.isi"
              :satuanBesar="edittedItem.barang.satuan_b"
              :satuanKecil="edittedItem.barang.satuan_k"
              :defaultUnit="edittedItem.satuan"
              @update:inputMode="(val) => edittedItem.satuan = val"
            />
          </q-card-section>
          <q-separator class="q-my-sm"></q-separator>
          <q-card-actions align="right" class="q-pa-md">
            <app-btn label="Simpan" @click="simpanEdit" />
          </q-card-actions>
        </q-card>
      </q-dialog>

    </q-card>
  </q-dialog>
</template>

<script setup>
import { useQuasar } from 'quasar'
import { ref, defineAsyncComponent, computed } from 'vue'
import { formatRp } from 'src/modules/formatter'


const QuantitySelector = defineAsyncComponent(()=> import('./QuantitySelector.vue'))

const props = defineProps({
  order:{
    type:Object,
    default:null
  },
  loading:{
    type:Boolean,
    default:false
  }
})

const emit = defineEmits(['updateRincian', 'deleteRincian', 'updateStatus'])

const $q = useQuasar()
// const step = ref(1)
const stepper = ref(null)
const hoveredId = ref(null)
const edittedItem = ref(null)
const edittedIndex = ref(null)
const openEdit = ref(false)

// const pelabelan = ref('Lanjutkan Status')

// console.log('order', props.order);
function edit(index, item){
  edittedIndex.value = index
  edittedItem.value = item
  openEdit.value = true
  // console.log('edit', index, item);
}


function hapus(item){
  // console.log('delete', item);

  const rincians = props.order?.rincians?.filter(x => x.id !== item?.id) || 0
  let totalRincians = 0
  for (let i = 0; i < rincians.length; i++) {
    const el = rincians[i];

    const qty = parseInt(el.jumlah) || 0
    const harga = parseInt(el.harga) || 0
    const subtotal = (qty * harga) || 0
    totalRincians += subtotal
  }

  const payload = {
    id:item?.id,
    order_id: props.order?.id,
    total_harga_order: totalRincians
  }

  $q.dialog({
    title: 'Pemberitahuan',
    message: `Apakah Item dengan Nama ${item?.barang?.namabarang} Akan dihapus ?`,
    cancel: true,

  }).onOk(() => {
    emit('deleteRincian', payload)
    // console.log('OK', payload)
  }).onCancel(() => {
    // console.log('Cancel')
  }).onDismiss(() => {
    // console.log('I am triggered on both OK and Cancel')
  })
  
}

function simpanEdit(){
  const ind = edittedIndex.value
  const item = props.order?.rincians[ind]

  const rincians = props.order?.rincians
  let totalRincians = 0
  for (let i = 0; i < rincians.length; i++) {
    const el = rincians[i];

    const qty = parseInt(el.jumlah)
    const harga = parseInt(el.harga)
    const subtotal = qty * harga
    totalRincians += subtotal
  }

  const payload = {
    id: item?.id,
    jumlah:item?.jumlah,
    satuan:item?.satuan,
    subtotal: parseInt(item?.jumlah || 0) * parseInt(item?.harga || 0),
    order_id: props.order?.id,
    total_harga_order: totalRincians
  }
  console.log('simpan Edit', payload);
  
  emit('updateRincian', payload)

  openEdit.value=false

}

const step = computed({
  get: () => parseInt(props.order.status_order),
  set: (value) => parseInt(value),
})

const pelabelan = computed(()=> {
  if (step.value < 3) {
    return 'Setujui Draft'
  } else if(step.value === 3){
    return 'Menunggu Pembayaran'
  } else if (step.value === 4){
    return 'Kirim Pesanan'
  } else if (step.value > 4 && step.value < 9) {
    return 'Compleet'
  } else {
    return 'Di batalkan'
  }
})

// eslint-disable-next-line no-unused-vars
function lihatStep(){
  const tap = parseInt(props.order?.status_order) || 0

  // - 1: draft
  // - 2: menunggu persetujuan
  // - 3: disetujui
  // - 4: diproses
  // - 5: dikirim
  // - 6: diterima
  // - 9: dibatalkan

  if (tap < 3) {
    step.value = 1 // draft disini
  } else if (tap === 3) {
    step.value = 2 // disetujui
  } else if (tap === 4) {
    step.value = 3 // menunggu Pembayaran
  } else if (tap >= 5 && tap < 9) {
    step.value = 4 // dikirim
  } else if (tap === 9) {
    step.value = 5
  }

  step.value = tap
  
}

function lanjutkanStep(){

  console.log('lanjutka step');
  let status = props?.order?.status_order
  if (step.value === 1) {
    step.value = 3
    status = '3'
  } else if (step.value === 3){
    step.value = 3 // gak boleh lanjut nunggu pembayaran
    status = '3'
  } else if (step.value === 4){
    step.value = 5 // dikirim
    status = '5'
  }

  const payload = {
    order_id: props?.order?.id,
    status_order: status
  }

  emit('updateStatus', payload)
  

}
function batalkanOrder(){

  console.log('batalkan order');

  const payload = {
    order_id: props?.order?.id,
    status_order: '9'
  }

  $q.dialog({
    title: 'Pemberitahuan',
    message: `Apakah Order ini Dibatalkan ?`,
    cancel: true,

  }).onOk(() => {
  emit('updateStatus', payload)
    // console.log('OK', payload)
  }).onCancel(() => {
    // console.log('Cancel')
  }).onDismiss(() => {
    // console.log('I am triggered on both OK and Cancel')
  })
  

}



</script>

<style scoped>

.q-stepper__step {
  display: none !important;
}

</style>