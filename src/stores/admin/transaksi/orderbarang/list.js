import { defineStore, acceptHMRUpdate } from 'pinia'
import { date } from 'quasar'
import { api } from 'src/boot/axios'

export const useAdminListTransaksiOrderBarangStore = defineStore(
  'admin-list-transaksi-orderbarang-store',
  {
    state: () => ({
      meta: null,
      loadingdialogorder: false,
      items: [],
      itemsdialog: [],
      isError: false,
      loading: false,
      fixed: false,
      itemorderan: [],
      cariorderan: {
        noorder: null,
      },
      params: {
        q: null,
        page: 0,
        per_page: 15,
        from: date.formatDate(Date.now(), 'YYYY-MM-01'),
        to: date.formatDate(Date.now(), 'YYYY-MM-DD'),
      },
      getorderan: {
        noorder: null,
      },
      getorderhasil: [],
      opendialogCetak: false,
      dateDisplay: {
        from: date.formatDate(Date.now(), '01 MMMM YYYY'),
        to: date.formatDate(Date.now(), 'DD MMMM YYYY'),
      },
    }),
    // persist: true,
    // getters: {
    //   doubleCount: (state) => state.counter * 2
    // },

    actions: {
      async getList() {
        this.items = []
        // console.log('get master barang page', this.params.page);
        this.params.page = 1
        this.isError = false
        this.loading = true
        const params = {
          params: this.params,
        }
        try {
          const { data } = await api.get('/v1/transaksi/orderpembelian/getlistorder', params)
          // console.log('get master barang', data)
          this.meta = data
          this.olahdata(data?.data, 1)
          this.loading = false
          // this.items = data
        } catch (error) {
          console.log(error)
          this.isError = true
          this.loading = false
        }
      },

      loadMore(index, done) {
        this.isError = false
        this.params.page = index
        const params = {
          params: this.params,
        }

        // console.log('load more', index)

        return new Promise((resolve) => {
          api
            .get('/v1/transaksi/orderpembelian/getlistorder', params)
            .then(({ data }) => {
              // console.log('heder order barang', data)
              this.meta = data
              this.olahdata(data?.data, 1)
              //this.items.push(...data.data)
              done()
              resolve()
            })
            .catch(() => {
              this.isError = true
              done(true)
              resolve()
            })
        })
      },
      getallbynoorder(val) {
        this.getorderan.noorder = val

        const params = {
          params: this.getorderan,
        }
        return new Promise((resolve) => {
          api
            .get('/v1/transaksi/orderpembelian/getallbynoorder', params)
            .then(({ data }) => {
              // console.log('wewewewe', data)
              this.getorderhasil = data
              this.items.push(...data.data)

              resolve()
            })
            .catch(() => {
              this.isError = true

              resolve()
            })
        })
      },
      olahdata(val, flaging) {
        console.log('asli', val)
        val?.forEach((x) => {
          const total = x.rinci.reduce((a, b) => parseFloat(a) + parseFloat(b.subtotal), 0)
          const hasil = {
            id: x?.id,
            noorder: x?.noorder,
            tglorder: x?.tglorder,
            kdsuplier: x?.kdsuplier,
            flaging: x?.flaging,
            suplier: x?.suplier,
            total: total,
            rinci: x?.rinci,
          }
          const index = this.items.findIndex((q) => q.id === x?.id)
          console.log('index', index)
          console.log('hasil', hasil)
          // this.items[index] = hasil

          if (index >= 0) {
            if (flaging === 1) {
              this.items[index] = hasil
            } else {
              this.items = this.items.filter((item) => val.some((x) => x.id === item.id))
            }
          } else {
            this.items.unshift(hasil)
          }
        })
        // Ubah sorting berdasarkan noorder (dari besar ke kecil)
        this.items.sort((a, b) => {
          // Pastikan noorder adalah string dan hapus karakter non-numerik jika ada
          const noOrderA = String(a.noorder).replace(/\D/g, '')
          const noOrderB = String(b.noorder).replace(/\D/g, '')

          // Konversi ke number untuk perbandingan numerik
          return parseInt(noOrderB, 10) - parseInt(noOrderA, 10)
        })
      },
      // async getbyhedernoorder() {
      //   console.log('sasa')
      //   const params = { params: this.cariorderan }
      //   await api
      //     .get('/v1/transaksi/orderpembelian/gethederbynoorder', params)
      //     .then((resp) => {
      //       this.loading = false
      //       if (resp.status === 200) {
      //         this.meta = resp?.data
      //         this.items = resp?.data?.data
      //         this.meta.total = resp?.data?.total
      //         console.log('wew', this.items)
      //       }
      //     })
      //     .catch((err) => {
      //       console.log(err)
      //       this.loading = false
      //     })
      // },
      async getorderanfix() {
        this.itemorderan = []

        try {
          this.loadingdialogorder = true
          const { data } = await api.get('/v1/transaksi/orderpembelian/getlistorderfixheder')
          if (data.length === 0) {
            this.itemorderan = []
          } else {
            const hasilglobal = []
            data?.forEach((x) => {
              const total = x.rinci.reduce((a, b) => parseFloat(a) + parseFloat(b.subtotal), 0)
              const hasil = {
                id: x?.id,
                noorder: x?.noorder,
                tglorder: x?.tglorder,
                kdsuplier: x?.kdsuplier,
                flaging: x?.flaging,
                suplier: x?.suplier,
                total: total,
                rinci: x?.rinci,
              }
              hasilglobal.push(hasil)
              this.itemorderan = hasilglobal
            })
            this.itemorderan.forEach((y) => {
              console.log('rincian', y)
            })
            this.loadingdialogorder = false
          }
          this.loadingdialogorder = false
        } catch (error) {
          console.log(error)
          this.isError = true
          this.loadingdialogorder = false
        }
      },
    },
  },
)

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useAdminListTransaksiOrderBarangStore, import.meta.hot))
}
