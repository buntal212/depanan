import { defineStore, acceptHMRUpdate } from 'pinia'
import { api } from 'src/boot/axios'
import { useAdminMasterBarangStore } from './list'
import { notifError, notifSuccess } from 'src/modules/notifs'
import { olahUang } from 'src/modules/utils'

export const useAdminFormMasterBarangStore = defineStore('admin-form-master-barang-store', {
  state: () => ({
    form: {
      id: null,
      kodebarang: null,
      namabarang: null,
      namagabung: null,
      brand: null,
      kodejenis: null,
      kualitas: null,
      satuan_b: null,
      satuan_k: null,
      isi: 1,
      kategori: null,
      hargajual1: 0,
      hargajual2: 0,
      hargajual1besar: 0,
      hargajual2besar: 0,
      hargabeli: 0,
      bonus_hutang: 0,
      bonus_cash: 0,
      minim_stok: 20,
      ukuran: null,
      rincians: [], // Array untuk menyimpan file gambar
    },
    loading: false,
    pilihkategori: [{ keterangan: 'Keramik' }, { keterangan: 'Non Keramik' }],
  }),

  actions: {
    initReset(data) {
      if (data) {
        return new Promise((resolve) => {
          for (const key in this.form) {
            if(key=='hargajual1'||key=='hargajual2') this.form[key] = parseFloat(data[key])
              else this.form[key] = data[key]
          }
          this.form.kodebarang = data?.kodebarang
          this.form.rincians = data.rincians || []
          this.form.hargajual1besar = parseFloat(data?.hargajual1) * data?.isi
          this.form.hargajual2besar = parseFloat(data?.hargajual2) * data?.isi
          console.log(this.form)
          resolve()
        })
      } else {
        for (const key in this.form) {
          this.form[key] = null
        }
        this.form.isi = 1
        this.form.hargajual1 = 0
        this.form.hargajual2 = 0
        this.form.hargabeli = 0
        this.form.minim_stok = 20
        this.form.bonus_hutang= 0,
        this.form.bonus_cash= 0,
        this.form.rincians = [] // Reset rincians gambar
      }
    },
    setForm(key, val) {
      this.form[key] = val
    },

    async save(add) {
      this.loading = true

      // Buat FormData untuk mengirim data dan file
      const formData = new FormData()

      // Tambahkan field data barang ke FormData
      for (const key in this.form) {
        if (key !== 'rincians' && this.form[key] !== null) {
          formData.append(key, this.form[key])
        }
        if (key == 'hargajual1besar' || key == 'hargajual2besar') {
          formData.append(key, olahUang(this.form[key]))
        }
      }
      // Jika kodebarang tidak ada, kirim sebagai null
      if (!this.form.kodebarang) {
        formData.append('kodebarang', '') // Atau null, sesuai backend
      }

      // Tambahkan file gambar dan flag_thumbnail ke FormData
      this.form.rincians.forEach((rincian, index) => {
        if (rincian.gambar instanceof File) {
          formData.append(`rincians[${index}][gambar]`, rincian.gambar)
        }
        formData.append(`rincians[${index}][flag_thumbnail]`, rincian.flag_thumbnail || null) // Kirim flag_thumbnail
      })

      console.log('Data yang dikirim:', this.form)

      return new Promise((resolve, reject) => {
        api
          .post('/v1/master/barang/simpanbarang', formData, {
            headers: {
              'Content-Type': 'multipart/form-data', // Penting untuk upload file
            },
          })
          .then(({ data }) => {
            console.log('Data tersimpan:', data)
            this.form.rincians.kodebarang = data.result.kodebarang

            this.loading = false

            // Inject ke store list
            const arr = useAdminMasterBarangStore()
            if (!add) {
              arr.items.unshift(data?.result) // Sesuaikan dengan response backend
            } else {
              arr.items = arr.items.map((obj) =>
                obj?.id === data.result.id ? { ...obj, ...data.result } : obj,
              )
            }

            notifSuccess('Data berhasil disimpan')
            this.initReset(null) // Reset form setelah simpan
            resolve(data)
          })
          .catch((err) => {
            this.loading = false
            reject(err)
          })
      })
    },
    async setthumbnail(id) {
      console.log('id image', id)
      const params = { id }
      try {
        const resp = await api.post(`/v1/master/barang/setthumbnail`, params)
        if (resp.status === 200) {
          this.form.rincians = this.form.rincians.map((image) => ({
            ...image,
            flag_thumbnail: image.id === id ? '1' : '0', // Set flag_thumbnail
          }))
          notifSuccess('Berhasil Memilih Thumbnail')
          return true
        }
      } catch (error) {
        console.log('Gagal Memilih Thumbnail:', error)
        notifError('Terjadi Kesalahan')
      }
    },
    async deleteImage(id) {
      console.log('id image', id)
      const params = { id }
      try {
        const resp = await api.post(`/v1/master/barang/deleteimage`, params)
        if (resp.status === 200) {
          const newArr = this.form.rincians?.filter((item) => item?.id !== id)
          this.form.rincians = newArr
          notifSuccess('Data berhasil dihapus')
        }
      } catch (error) {
        console.log('Gagal menghapus gambar:', error)
        notifError('Terjadi Kesalahan')
      }
    },
  },
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useAdminFormMasterBarangStore, import.meta.hot))
}
