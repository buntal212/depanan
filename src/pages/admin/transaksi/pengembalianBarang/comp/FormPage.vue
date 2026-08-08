<template>
  <div>
    <div class="row q-mb-md">
      <div class="col-12">
        <q-card>
          <q-card-section class="row items-center">
            <div class="text-h6">Form Pengembalian Barang</div>
            <q-space />
            <q-btn label="Kembali" color="primary" @click="$emit('back')" icon="arrow_back" />
          </q-card-section>

          <q-card-section>
            <!-- Info Penjualan -->
            <div class="row q-col-gutter-md q-mb-md">
              <div class="col-12 col-md-6">
                <q-card flat bordered>
                  <q-card-section>
                    <div class="text-subtitle2">Informasi Penjualan</div>
                    <div class="q-gutter-sm">
                      <div class="row">
                        <div class="col-4">No Penjualan</div>
                        <div class="col-8">: {{ form.item?.no_penjualan }}</div>
                      </div>
                      <div class="row">
                        <div class="col-4">Tanggal</div>
                        <div class="col-8">: {{ dateFullFormat(form.item?.tgl) }}</div>
                      </div>
                      <div class="row">
                        <div class="col-4">Pelanggan</div>
                        <div class="col-8">
                          : {{ form.item?.pelanggan?.nama || form.item?.keterangan?.nama }}
                        </div>
                      </div>
                    </div>
                  </q-card-section>
                </q-card>
              </div>
            </div>

            <!-- Form Input -->
            <q-form @submit="onSubmit" class="q-gutter-md">
              <div class="row q-col-gutter-md">
                <div class="col-12 col-md-6">
                  <q-input
                    v-model="form.keterangan"
                    label="Keterangan"
                    type="textarea"
                    :rules="[(val) => !!val || 'Keterangan harus diisi']"
                  />
                </div>
              </div>

              <!-- Detail Barang -->
              <div class="text-subtitle2 q-mt-md">Detail Barang</div>

              <!-- Header -->
              <div class="row q-pa-sm bg-primary text-white text-weight-bold q-col-gutter-x-sm">
                <div class="col-4">Barang</div>
                <div class="col-1">Satuan</div>
                <div class="col-2 text-right">Jumlah Beli</div>
                <div class="col-2 text-right">Jumlah Rusak</div>
                <div class="col-3">Keterangan</div>
              </div>

              <!-- Items -->
              <div
                v-for="item in form.details"
                :key="item.id"
                class="row q-pa-sm items-center q-col-gutter-x-sm"
              >
                <div class="col-4">{{ item.master_barang?.namabarang   }} {{ item?.motif && item?.motif!=='-' ? ' (' + item?.motif + ') ':'' }}</div>
                <div class="col-1">{{ item.master_barang?.satuan_k }}</div>
                <div class="col-2 text-right">{{ item.jumlah }}</div>
                <div class="col-2 text-right">
                  <q-input
                    v-model.number="item.qty_retur"
                    type="number"
                    dense
                    class="text-right"
                    :rules="[
                      (val) => val >= 0 || 'Qty harus lebih dari 0',
                      (val) => val <= item.jumlah || 'Qty melebihi pembelian',
                    ]"
                  />
                </div>
                <div class="col-3">
                  <q-input
                    v-model="item.keterangan"
                    dense
                    :rules="[(val) => !item.qty_retur || !!val || 'Keterangan harus diisi']"
                  />
                </div>
              </div>

              <!-- Buttons -->
              <div class="row justify-end q-gutter-sm">
                <q-btn label="Reset" color="negative" @click="resetForm" :disable="form.loading" />
                <q-btn
                  label="Simpan"
                  type="submit"
                  color="grey-10"
                  class="text-yellow-9"
                  :loading="form.loading"
                  :disable="form.loading"
                />
              </div>
            </q-form>
          </q-card-section>
        </q-card>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useFormPengembalianStore } from 'src/stores/admin/transaksi/pengembalianBarang/form'
import { dateFullFormat } from 'src/modules/utils'
import { notifError } from 'src/modules/notifs'

// Store
const form = useFormPengembalianStore()

// Emits
const emit = defineEmits(['back', 'selesai'])

// Methods
async function onSubmit() {
  try {
    // Filter hanya barang yang di-retur
    const validDetails = form.details.filter((d) => d.qty_retur > 0)
    if (!validDetails.length) {
      notifError('Minimal satu barang harus diretur')
      return
    }

    // Validate keterangan
    if (!form.keterangan) {
      notifError('Keterangan harus diisi')
      return
    }

    // Validate details have keterangan
    const missingKeterangan = validDetails.find((d) => !d.keterangan)
    if (missingKeterangan) {
      notifError('Semua barang yang diretur harus memiliki keterangan')
      return
    }

    const response = await form.simpan()
    emit('selesai', response?.data)
  } catch (error) {
    console.error('Error saving:', error)
    notifError(error?.response?.data?.message || 'Gagal menyimpan pengembalian barang')
  }
}

function resetForm() {
  form.details.forEach((item) => {
    item.qty_retur = 0
    item.keterangan = ''
  })
  form.keterangan = ''
}
</script>
