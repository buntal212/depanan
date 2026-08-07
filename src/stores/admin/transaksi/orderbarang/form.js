import { defineStore, acceptHMRUpdate } from 'pinia'
import { api } from 'src/boot/axios'
import { useAdminListTransaksiOrderBarangStore } from './list'

export const useAdminFormTransaksiOrderBarangStore = defineStore(
  'admin-form-transaksi-orderbarang-store',
  {
    state: () => ({
      fixed: false,
      form: {
        id: null,
        noorder: null,
        kdsuplier: null,
        tglorder: null,
        kdbarang: null,
        namabarang: null,
        brand: null,
        merk: null,
        seri: null,
        satuan_b: null,
        satuan_k: null,
        isi: null,
        kategori: null,
        hargajual1: null,
        hargajual2: null,
        ukuran: null,
        jumlah: 1,
      },
      loading: false,
    }),
    // persist: true,
    // getters: {
    //   doubleCount: (state) => state.counter * 2
    // },

    actions: {
      initResetRinci() {
        this.form.kdbarang = null
        this.form.namabarang = null
        this.form.brand = null
        this.form.merk = null
        this.form.seri = null
        this.form.satuan_b = null
        this.form.satuan_k = null
        this.form.isi = null
        this.form.harga = null
        this.form.ukuran = null
        this.form.jumlah = null
      },

      async save() {
        this.loading = true
        return new Promise((resolve, reject) => {
          api
            .post('/v1/transaksi/orderpembelian/simpan', this.form)
            .then(({ data }) => {
              console.log(data)
              this.loading = false
              if (this.form.noorder === null) {
                this.form.noorder = data?.notrans
              }
              this.initResetRinci()
              // inject data
              const arr = useAdminListTransaksiOrderBarangStore()
              arr.items.unshift(data?.result)

              resolve(data)
            })
            .catch((err) => {
              this.loading = false
              reject(err)
            })
        })
      },

      initReset(data) {
        if (data) {
          console.log('fafafa', data)
          return new Promise((resolve) => {
            for (const key in this.form) {
              // console.log(`${key}: ${this.form[key]}`);
              // console.log(`${key}`);
              this.form[key] = data[key]
            }
            // this.form.kodebarang = data?.kodebarang
            console.log(this.form)

            resolve()
          })
        } else {
          for (const key in this.form) {
            // console.log(`${key}: ${this.form[key]}`);
            this.form[key] = null
          }
          // this.form.isi = 1
          // this.form.hargajual1 = 0
          // this.form.hargajual2 = 0
        }
      },
    },
  },
)

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useAdminFormTransaksiOrderBarangStore, import.meta.hot))
}
