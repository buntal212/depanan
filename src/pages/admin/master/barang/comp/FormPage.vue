<template>
  <div class="fit column">
    <div class="col-auto">
      <div class="row items-center q-pa-lg">
        <div class="col-grow">
          <app-btn-back @click="emits('back')" />
        </div>
        <div class="col-auto">
          <!-- <app-btn :dense="false" label="Simpan" color="primary" /> -->
        </div>
      </div>
    </div>
    <div class="col full-height q-px-lg q-pb-lg">
      <q-card flat class="col full-height">
        <q-form class="full-height" @submit="onSubmit">
          <q-card-section class="full-height q-pa-lg scroll">
            <div class="row q-col-gutter-md justify-around">
              <div :class="`col-${isMobile ? 12 : 6}`" class="row q-col-gutter-md">
                <div class="full-width">
                  Pilih Kategori :
                  <q-radio
                    color="yellow-9"
                    v-model="store.form.kategori"
                    class="q-pl-sm q-pr-lg"
                    v-for="item in store.pilihkategori"
                    :key="item.keterangan"
                    :label="item.keterangan"
                    :val="item.keterangan"
                    dense
                    size="sm"
                  />
                </div>

                <template v-if="store.form.kategori">
                  <div class="col-12">
                    <div class="row items-center q-gutter-sm">
                      <app-btn
                        color="grey-10"
                        class="text-yellow-9"
                        icon="photo"
                        label="Pilih Foto"
                        @click="imgClick"
                      />
                      <q-file
                        ref="fileRef"
                        v-model="newImages"
                        filled
                        dense
                        multiple
                        style="display: none"
                        accept="image/*"
                        @update:model-value="tambahGambar"
                      />
                    </div>
                    <div
                      class="row q-mt-md q-gutter-sm custom-scrollbar"
                      style="height: 105px; overflow-y: auto; white-space: nowrap"
                    >
                      <div
                        v-for="(image, index) in store.form.rincians"
                        :key="index"
                        class="relative-position"
                      >
                        <q-img
                          :src="getImageUrl(image.gambar)"
                          class="cursor-pointer"
                          style="width: 100px; height: 100px; object-fit: cover; border-radius: 5px"
                        />
                        <q-btn
                          round
                          dense
                          color="red"
                          icon="close"
                          class="absolute-top-right"
                          size="sm"
                          @click="hapusGambar(index, image.id)"
                        />
                        <q-btn
                          round
                          dense
                          :color="image.flag_thumbnail === '1' ? 'green' : 'grey-5'"
                          icon="task_alt"
                          class="absolute-center"
                          size="sm"
                          @click="setThumbnail(image.tempId || image.id, !!image.tempId)"
                        />
                      </div>
                    </div>
                  </div>

                  <app-input
                    class="col-12"
                    v-model="store.form.namagabung"
                    label="Nama Barang"
                    :valid="{ required: false }"
                    @update:model-value="
                      (val) => {
                        store.form.namabarang = val
                      }
                    "
                  />

                  <app-select
                    class="col-6"
                    v-model="store.form.brand"
                    label="Brand/Merek"
                    :options="selectBrand?.items"
                    option-label="brand"
                    option-value="brand"
                    :valid="store.form.kategori !== 'Keramik'"
                  />
                  <app-input
                    class="col-6"
                    v-model="store.form.kualitas"
                    label="Kualitas"
                    :valid="{ required: store.form.kategori !== 'Keramik' }"
                  />
                  <app-input
                    class="col-6"
                    v-model="store.form.ukuran"
                    label="Ukuran"
                    :valid="{ required: store.form.kategori !== 'Keramik' }"
                  />
                  <app-input
                    class="col-6"
                    v-model="store.form.minim_stok"
                    label="Batas Low Stock (Satuan Kecil)"
                    :valid="{ required: store.form.kategori !== 'Keramik' }"
                  />

                  <app-select
                    class="col-4"
                    v-model="store.form.satuan_b"
                    label="Satuan Besar"
                    :options="selectSatuan.items"
                    option-label="satuan"
                    option-value="satuan"
                    :valid="store.form.kategori !== 'Keramik'"
                  />

                  <app-input
                    class="col-4"
                    v-model="store.form.isi"
                    label="Isi Barang"
                    :valid="{ number: true }"
                    @update:model-value="
                      (val) => {
                        //untuk hapus o dipean angka pake ini yaa
                        const _removedZeros = val?.replace(/^0+/, '')
                        if (val > 1) store.form.isi = _removedZeros
                        const isix = val
                        store.form.hargajual1 = olahUang(store.form.hargajual1besar) / isix
                        store.form.hargajual2 = olahUang(store.form.hargajual2besar) / isix
                      }
                    "
                  />
                  <app-select
                    class="col-4"
                    v-model="store.form.satuan_k"
                    label="Satuan Kecil"
                    :options="selectSatuan.items"
                    option-label="satuan"
                    option-value="satuan"
                    :valid="store.form.kategori !== 'Keramik'"
                  />
                  <app-select
                    v-if="store.form.kategori === 'Keramik'"
                    class="col-12"
                    v-model="store.form.kodejenis"
                    label="Pilih Jenis Keramik"
                    :options="selectJenis?.items"
                    option-label="nama"
                    option-value="kodejenis"
                    :valid="store.form.kategori !== 'Keramik'"
                  />

                  <!-- <app-input
                    class="col-6"
                    v-model="store.form.hargajual1"
                    label="Harga Pengguna"
                    :valid="{ number: true }"
                    @update:model-value="
                      (val) => {
                        //untuk hapus o dipean angka pake ini yaa
                        const _removedZeros = val?.replace(/^0+/, '')
                        if (val > 1) store.form.hargajual1 = _removedZeros
                      }
                    "
                  /> -->

                  <app-input-rp
                    class="col-6"
                    currency
                    v-model="store.form.hargajual1besar"
                    :label="HargaPengguna"
                    outlined
                    :autofocus="false"
                    @update:model-value="
                      (val) => {
                        const _removedZeros = val?.replace(/^0+/, '')
                        if (val > 1) store.form.hargajual1besar = _removedZeros
                        const jual = olahUang(val)
                        store.setForm('hargajual1', jual / store.form.isi)
                      }
                    "
                  />

                  <!-- <app-input
                    class="col-6"
                    v-model="store.form.hargajual2"
                    label="Harga untuk Toko"
                    :valid="{ number: true }"
                    @update:model-value="
                      (val) => {
                        //untuk hapus o dipean angka pake ini yaa
                        const _removedZeros = val?.replace(/^0+/, '')
                        if (val > 1) store.form.hargajual2 = _removedZeros
                      }
                    "
                  /> -->

                  <app-input-rp
                    class="col-6"
                    currency
                    v-model="store.form.hargajual2besar"
                    :label="HargaToko"
                    outlined
                    :autofocus="false"
                    @update:model-value="
                      (val) => {
                        const _removedZeros = val?.replace(/^0+/, '')
                        if (val > 1) store.form.hargajual2besar = _removedZeros
                        const jual = olahUang(val)
                        store.setForm('hargajual2', jual / store.form.isi)
                      }
                    "
                  />
                  <app-input
                    class="col-6"
                    v-model="store.form.hargabeli"
                    label="Harga Beli Barang"
                    :valid="{ number: true }"
                    @update:model-value="
                      (val) => {
                        //untuk hapus o dipean angka pake ini yaa
                        const _removedZeros = val?.replace(/^0+/, '')
                        if (val > 1) store.form.hargabeli = _removedZeros
                      }
                    "
                  />
                  <app-input
                    class="col-3"
                    v-model="store.form.bonus_cash"
                    label="Bonus Cash per satuan kecil"
                    :valid="{ number: true }"
                    @update:model-value="
                      (val) => {
                        //untuk hapus o dipean angka pake ini yaa
                        const _removedZeros = val?.replace(/^0+/, '')
                        if (val > 1) store.form.bonus_cash = _removedZeros
                      }
                    "
                  />
                  <app-input
                    class="col-3"
                    v-model="store.form.bonus_hutang"
                    label="Bonus Hutang per satuan kecil"
                    :valid="{ number: true }"
                    @update:model-value="
                      (val) => {
                        //untuk hapus o dipean angka pake ini yaa
                        const _removedZeros = val?.replace(/^0+/, '')
                        if (val > 1) store.form.bonus_hutang = _removedZeros
                      }
                    "
                  />
                  <div class="col-12">
                    <q-separator class="q-my-md" />
                    <app-btn
                      :loading="store.loading"
                      type="submit"
                      :dense="false"
                      label="Simpan"
                      color="grey-10"
                      class="text-yellow-9"
                    />
                  </div>
                </template>
                <template v-else>
                  <div class="col-12">
                    <q-separator></q-separator>
                    <div class="text-center q-pt-md" style="font-size: x-large">
                      Silahkan Pilih Kategori Dulu
                    </div>
                  </div>
                </template>
              </div>
            </div>
          </q-card-section>
        </q-form>
      </q-card>
    </div>
  </div>
</template>

<script setup>
import { useQuasar } from 'quasar'
import { useAdminFormMasterBarangStore } from 'src/stores/admin/master/barang/form'
import { useAdminMasterBrandSelectStore } from 'src/stores/admin/master/brand/select'
import { useAdminMasterJenisSelectStore } from 'src/stores/admin/master/jeniskeramik/select'
import { useAdminMasterSatuanSelectStore } from 'src/stores/admin/master/satuan/select'
import { computed, onMounted, ref } from 'vue'
import { pathImg } from 'src/boot/axios'
import { notifError } from 'src/modules/notifs'
import { olahUang } from 'src/modules/utils'

const emits = defineEmits(['back'])
const $q = useQuasar()
const isMobile = computed(() => {
  return $q.screen.lt.xl // Quasar screen size helper
})

const store = useAdminFormMasterBarangStore()
const selectSatuan = useAdminMasterSatuanSelectStore()
const selectBrand = useAdminMasterBrandSelectStore()
const selectJenis = useAdminMasterJenisSelectStore()

const props = defineProps({
  data: {
    type: Object,
    default: null,
  },
  valid: { type: Boolean, default: false },
})

onMounted(() => {
  store.initReset(props.data)
  selectJenis.getDataAll()
  selectSatuan.getDataAll()
  selectBrand.getDataAll()
})

const HargaKecil1 = computed(() => {
  return new Intl.NumberFormat('id-ID', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(store.form.hargajual1)
})
const HargaPengguna = computed(() => {
  return `Harga Pengguna  (Harga Satuan Kecil = ${HargaKecil1.value})`
})

const HargaKecil2 = computed(() => {
  return new Intl.NumberFormat('id-ID', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(store.form.hargajual2)
})
const HargaToko = computed(() => {
  return `Harga untuk Toko  (Harga Satuan Kecil = ${HargaKecil2.value})`
})

const fileRef = ref([])
function imgClick() {
  fileRef.value.pickFiles()
}

const newImages = ref([])

const generateRandomId = () => {
  return Math.random().toString(36).substring(2, 15) // Random string
}
// Fungsi untuk menangani upload gambar
const tambahGambar = (files) => {
  const maxSize = 2 * 1024 * 1024 // 2MB dalam bytes
  const invalidFiles = files.filter((file) => file.size > maxSize)

  if (invalidFiles.length > 0) {
    notifError('Ukuran Foto Tidak Boleh Lebih dari 2MB')
    return
  }
  const newRincians = files.map((file) => ({
    gambar: file,
    tempId: generateRandomId(), // Gunakan timestamp sebagai identifier sementara
    flag_thumbnail: null, // Default thumbnail tidak dipilih
  }))
  store.form.rincians = [...store.form.rincians, ...newRincians]
}

// Fungsi untuk menghapus gambar
const hapusGambar = async (index, id) => {
  console.log('imageId', id)
  try {
    if (id) {
      const success = await store.deleteImage(id)
      if (success) {
        store.form.rincians.splice(index, 1)
      }
    } else {
      store.form.rincians.splice(index, 1)
    }
  } catch (error) {
    console.error('Gagal menghapus gambar:', error)
  }
}
async function setThumbnail(identifier, isTemp = false) {
  console.log(isTemp ? 'tempId image' : 'id image', identifier)

  if (!identifier) return // Hentikan jika tidak ada identifier

  try {
    if (isTemp) {
      // Kasus gambar belum tersimpan di server (menggunakan tempId)
      store.form.rincians = store.form.rincians.map((image) => ({
        ...image,
        flag_thumbnail: image.tempId === identifier ? '1' : null,
      }))
    } else {
      // Kasus gambar sudah tersimpan di server (menggunakan id)
      const success = await store.setthumbnail(identifier)
      if (success) {
        store.form.rincians = store.form.rincians.map((image) => ({
          ...image,
          flag_thumbnail: image.id === identifier ? '1' : null,
        }))
      }
    }
    console.log('store form', store.form.rincians)
  } catch (error) {
    console.error('Gagal memilih thumbnail:', error)
  }
}

// Fungsi untuk mendapatkan URL gambar (preview)
const getImageUrl = (image) => {
  if (image instanceof File || image instanceof Blob) {
    return URL.createObjectURL(image)
  }
  return pathImg + image // Jika gambar sudah ada di server
}

// Fungsi untuk submit form
function onSubmit() {
  // Pastikan kodebarang ada di form
  if (!store.form.kodebarang) {
    store.form.kodebarang = null // Atau '', sesuai backend
  }
  // Periksa apakah rincians tidak kosong dan tidak ada thumbnail yang dipilih
  if (store.form.rincians.length > 0) {
    const hasThumbnail = store.form.rincians.some((image) => image.flag_thumbnail === '1')
    if (!hasThumbnail) {
      notifError('Silakan Centang Gambar untuk Pilih Thumbnail Terlebih Dahulu')
      return // Hentikan proses submit jika tidak ada thumbnail
    }
  }
  // Kirim data ke backend
  store
    .save({
      ...store.form, // Kirim semua data form
      rincians: store.form.rincians.map((image) => ({
        gambar: image.gambar,
        flag_thumbnail: image.flag_thumbnail, // Pastikan flag_thumbnail dikirim
      })),
    })
    .then(() => {
      console.log('Data berhasil disimpan')
    })
    .catch((error) => {
      if (error.response && error.response.status === 422) {
        // Handle validation errors
        const errors = error.response.data.errors
        for (const key in errors) {
          notifError(errors[key][0]) // Tampilkan pesan error ke pengguna
        }
      } else {
        console.error('Error:', error)
      }
    })
}
</script>
<style scoped>
.custom-scrollbar::-webkit-scrollbar {
  height: 10px;
}

.custom-scrollbar::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 3px;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
  background: #888;
  border-radius: 3px;
}

.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: #555;
}
</style>
