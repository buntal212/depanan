import { defineStore, acceptHMRUpdate } from 'pinia'
import { date } from 'quasar'
import { api } from 'src/boot/axios'
import { notifError, notifSuccess } from 'src/modules/notifs'

export const useAdminListTransaksiPenerimaanBarangStore = defineStore(
  'admin-list-transaksi-penerimaanbarang-store',
  {
    state: () => ({
      meta: null,
      items: [],
      isError: false,
      loading: false,
      loadingdeleteall: false,
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
        // console.log('ini penerimaan')
        this.params.page = 1
        this.isError = false
        this.loading = true
        const params = {
          params: this.params,
        }
        try {
          const { data } = await api.get('/v1/transaksi/penerimaan/getpenerimaan', params)
          // console.log('get master barang', data)
          this.meta = data
          this.olahdata(data?.data)
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
            .get('/v1/transaksi/penerimaan/getpenerimaan', params)
            .then(({ data }) => {
              // console.log('heder order barang', data)
              this.meta = data
              this.olahdata(data?.data)
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
      olahdata(val) {
        // console.log('asli', val)
        // const hasilglobal = []
        val?.forEach((x) => {
          const total = x.rinci.reduce((a, b) => parseFloat(a) + parseFloat(b.subtotal), 0)
          const totalfix = x.rinci.reduce((a, b) => parseFloat(a) + parseFloat(b.subtotalfix), 0)
          const hasil = {
            id: x?.id,
            nopenerimaan: x?.nopenerimaan,
            nofaktur: x?.nofaktur,
            noorder: x?.noorder,
            tgl: x?.updated_at,
            kdsuplier: x?.kdsupllier,
            kunci: x?.kunci,
            suplier: x?.nama,
            jumlahharitempo: x?.jumlahharitempo ?? 0,
            tgljatuhtempo: x?.tgljatuhtempo,
            total: total,
            totalfix: totalfix,
            rinci: x?.rinci,
            orderan_h: x?.orderheder,
            jenis_pembayaran: x?.jenis_pembayaran,
          }
          // console.log('hasilccccc', hasil)
          // hasilglobal.push(hasil)
          const index = this.items.findIndex((q) => q.id === x?.id)

          if (index >= 0) this.items[index] = hasil
          else this.items.unshift(hasil)
          // console.log('this.items', this.items)
        })
        // this.items.sort(({ tgl: a }, { tgl: b }) => b - a)
      },
      async hapusall(id, nopenerimaan, noorder) {
        this.loadingdeleteall = true

        const payload = {
          id,
          nopenerimaan,
          noorder,
          from: this.params.from,
          to: this.params.to,
          q: this.params.q,
          per_page: String(this.params.per_page),
        }
        try {
          const resp = await api.post('/v1/transaksi/penerimaan/hapusall', payload)
          console.log(resp)
          if (resp.status === 200) {
            // this.olahdata(resp?.data?.data)
            this.getList()
            notifSuccess('Data berhasil dihapus')
            this.loadingdeleteall = false
          }
        } catch (err) {
          // console.log('sasasx', err)
          notifError(err?.response?.data?.message)
          this.loadingdeleteall = false
        }
      },
    },
  },
)

if (import.meta.hot) {
  import.meta.hot.accept(
    acceptHMRUpdate(useAdminListTransaksiPenerimaanBarangStore, import.meta.hot),
  )
}
