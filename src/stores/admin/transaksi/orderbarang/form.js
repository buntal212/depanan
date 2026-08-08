import { defineStore, acceptHMRUpdate } from 'pinia'
import { api } from 'src/boot/axios'
import { useAdminListTransaksiOrderBarangStore } from './list'
import { notifError, notifSuccess } from 'src/modules/notifs'
import { olahUang } from 'src/modules/formatter'

export const useAdminFormTransaksiOrderBarangStore = defineStore(
  'admin-form-transaksi-orderbarang-store',
  {
    state: () => ({
      fixed: false,
      item: null,
      form: {
        id: null,
        noorder: null,
        kdsuplier: '',
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
        jumlahx: 1,
        harga: null,
        hargax: null,
      },
      loading: false,
      lock: false,
      loadingdeleteall: false,
      dialogCetak: false,
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
        this.form.hargax = null
        this.form.ukuran = null
        this.form.jumlah = null
        this.form.jumlahx = 1
      },

      async save() {
        this.loading = true
        this.form.harga = olahUang(this.form.hargax)
        this.form.jumlah = olahUang(this.form.jumlahx)
        return new Promise((resolve, reject) => {
          api
            .post('/v1/transaksi/orderpembelian/simpan', this.form)
            .then(({ data }) => {
              //console.log('sasa', data?.result)
              this.loading = false
              const arr = useAdminListTransaksiOrderBarangStore()
              // const itemnya = [...arr.items]
              //arr.items.unshift(data?.result?.original[0])
              // if (!add) {
              //   itemnya.unshift(data?.result?.original[0])
              // } else {
              //   // arr?.items?.map((obj) =>
              //   //   obj?.id === data?.result?.original[0]?.id
              //   //     ? { ...obj, ...data?.result?.original[0] }
              //   //     : obj,
              //   // )
              //   const desah = itemnya.findIndex((f) => f.id === add.id)
              //   if (desah >= 0) itemnya[desah] = data?.result?.original[0]
              //   // desah = data?.result?.original[0]
              //   console.log('sasasasasasasasa', itemnya)
              // }
              if (!this.form.noorder) {
                //console.log('weweweweww', data?.notrans)
                this.form.noorder = data?.notrans
              }
              arr.olahdata(data?.result, 1)

              const hasil = data?.result[0]
              const total = hasil?.rinci.reduce((a, b) => parseFloat(a) + parseFloat(b.subtotal), 0)
              hasil.total = total

              this.item = hasil
              //console.log('addd', this.item)
              notifSuccess('Data berhasil disimpan')
              this.initResetRinci()
              // inject data

              // arr.items.unshift(data?.result?.original[0])
              //this.initReset(null)
              resolve(data)
            })
            .catch((err) => {
              console.log('sasasx', err)
              notifError(err?.response?.data?.message)
              this.loading = false
              reject(err?.data)
            })
        })
      },

      initReset(data) {
        if (data) {
          // console.log('fafafa', data)
          return new Promise((resolve) => {
            for (const key in this.form) {
              // console.log(`${key}: ${this.form[key]}`);
              // console.log(`${key}`);
              this.form[key] = data[key]
            }
            // this.form.noorder = data?.noorder
            // console.log('aaaaaaaaaaaa', this.form)
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
      async deleteData(id, noorder) {
        const payload = { id, noorder }
        try {
          const resp = await api.post('v1/transaksi/orderpembelian/hapusrincian', payload)
          // console.log(resp)
          if (resp.status === 200) {
            // console.log('sasasa', resp?.data?.result)
            const arr = useAdminListTransaksiOrderBarangStore()
            arr.olahdata(resp?.data?.result, 1)

            const hasil = resp?.data?.result[0]
            // console.log('ccc', hasil)
            const total = hasil?.rinci.reduce((a, b) => parseFloat(a) + parseFloat(b.subtotal), 0)
            hasil.total = total

            this.item = hasil
            notifSuccess('Data berhasil dihapus')
          }
        } catch (error) {
          notifError(error)
        }
      },
      async kunci(val, noorder) {
        this.lock = true
        const payload = { val, noorder }
        return new Promise((resolve, reject) => {
          api
            .post('/v1/transaksi/orderpembelian/kunci', payload)
            .then(({ data }) => {
              this.lock = false

              const arr = useAdminListTransaksiOrderBarangStore()
              arr.olahdata(data?.result, 1)

              const hasil = data?.result[0]
              // console.log('ccc', hasil)
              const total = hasil?.rinci.reduce((a, b) => parseFloat(a) + parseFloat(b.subtotal), 0)
              hasil.total = total

              this.item = hasil
              notifSuccess(data?.message)
              resolve(data)
            })
            .catch((err) => {
              this.lock = false
              reject(err)
            })
        })
      },

      async hapusall(id, noorder) {
        this.loadingdeleteall = true
        const arr = useAdminListTransaksiOrderBarangStore()
        const payload = {
          id,
          noorder,
          from: arr.params.from,
          to: arr.params.to,
          q: arr.params.q,
          per_page: parseInt(arr.params.per_page),
        }
        try {
          const resp = await api.post('/v1/transaksi/orderpembelian/hapusall', payload)
          console.log(resp)
          if (resp.status === 200) {
            console.log('sasa', arr.this)

            // arr.olahdata(resp?.data?.data, 2)
            arr.getList()
            notifSuccess('Data berhasil dihapus')
            this.loadingdeleteall = false
          }
        } catch (err) {
          console.log('sasasx', err)
          notifError(err?.response?.data?.message)
          this.loadingdeleteall = false
        }
      },
    },
  },
)

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useAdminFormTransaksiOrderBarangStore, import.meta.hot))
}
