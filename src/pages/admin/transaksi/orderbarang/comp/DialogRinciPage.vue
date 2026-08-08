<template>
  <q-dialog v-model="store.fixed">
    <q-card>
      <q-card-section>
        <div class="row">
          <div class="col-10 text-h6">Masukkan Rincian Barang</div>
          <div class="col-2" align="right">
            <app-btn icon="close" tooltip="Close" color="primary" v-close-popup />
          </div>
        </div>
      </q-card-section>
      <q-separator />
      <q-form class="full-height" @submit="onSubmit">
        <q-card-section style="max-height: 50vh" class="scroll">
          <div class="row q-col-gutter-md justify-around">
            <div class="col-12">
              <AppSelectServer
                class="col-12"
                v-model="store.namabarang"
                label="Nama Barang"
                :valid="{ required: true }"
                emit-value
                option-label="namabarang"
                filter-by="namabarang"
                url="v1/master/select/master-barang-filter"
                :filter-min="1"
                :limit="25"
                @update:model-value="(val) => isiform(val)"
                clearable
              />
            </div>
            <div class="col-12">
              <app-input
                class="col-12"
                v-model="store.form.merk"
                label="Merk"
                :valid="{ required: false }"
                disable
              />
            </div>
            <div class="col-12">
              <app-input
                class="col-12"
                v-model="store.form.brand"
                label="Brand"
                :valid="{ required: false }"
                disable
              />
            </div>
            <div class="col-12">
              <app-input
                class="col-12"
                v-model="store.form.seri"
                label="Seri"
                :valid="{ required: false }"
                disable
              />
            </div>
            <div class="col-4">
              <app-input
                class="col-4"
                v-model="store.form.satuan_b"
                label="Satuan Besar"
                :valid="{ required: false }"
                disable
              />
            </div>
            <div class="col-4">
              <app-input
                class="col-4"
                v-model="store.form.satuan_k"
                label="Satuan Kecil"
                :valid="{ required: false }"
                disable
              />
            </div>
            <div class="col-4">
              <app-input
                class="col-4"
                v-model="store.form.isi"
                label="Isi"
                :valid="{ required: false }"
                disable
              />
            </div>
            <div class="col-6">
              <app-input
                class="col-6"
                v-model="store.form.jumlah"
                label="Jumlah Yang Di Pesan"
                :valid="{ required: false }"
                type="number"
              />
            </div>
            <div class="col-6">
              <app-input
                class="col-6"
                v-model="store.form.harga"
                label="Harga Beli"
                :valid="{ required: false }"
                type="number"
              />
            </div>
          </div>
        </q-card-section>

        <q-separator />

        <q-card-actions align="right">
          <!-- <q-btn label="BATAL" color="primary" v-close-popup /> -->
          <app-btn
            :loading="store.loading"
            type="submit"
            :dense="false"
            label="Simpan"
            color="grey-10"
            class="text-yellow-9"
            icon="save"
          />
        </q-card-actions>
      </q-form>
    </q-card>
  </q-dialog>
</template>
<script setup>
import AppSelectServer from 'src/components/~global/AppSelectServer.vue'
import { useAdminFormTransaksiOrderBarangStore } from 'src/stores/admin/transaksi/orderbarang/form'

const store = useAdminFormTransaksiOrderBarangStore()

function isiform(val) {
  store.form.kdbarang = val?.kodebarang ?? '-'
  store.form.namabarang = val?.namabarang ?? '-'
  store.form.merk = val?.merk ?? '-'
  store.form.brand = val?.brand ?? '-'
  store.form.seri = val?.seri ?? '-'
  store.form.satuan_b = val?.satuan_b ?? '-'
  store.form.satuan_k = val?.satuan_k ?? '-'
  store.form.isi = val?.isi ?? '-'
}

const props = defineProps({
  data: {
    type: Object,
    default: null,
  },
})

function onSubmit() {
  console.log('submit form barang')
  store.save(props.data)
}
</script>
