import { defineStore } from 'pinia'
import { date } from 'quasar'
import { api } from 'src/boot/axios'
import { notifError, notifSuccess } from 'src/modules/notifs'

export const useAdminListTransaksiNotaSalesstore = defineStore(
  'admin-list-transaksi-notasales-store',
  {
    state: () => ({
      meta: null,
      items: [],
      rinci: [],
      isError: false,
      loading: false,
      loadinghapus: false,
      itemNotaSales: null,
      params: {
        q: null,
        page: 1,
        per_page: 15,
        from: date.formatDate(Date.now(), 'YYYY-MM-01'),
        to: date.formatDate(Date.now(), 'YYYY-MM-DD'),
      },
      dateDisplay: {
        from: date.formatDate(Date.now(), '01 MMMM YYYY'),
        to: date.formatDate(Date.now(), 'DD MMMM YYYY'),
      },
    }),
    actions: {
      async getNotaSales() {
        this.items = []
        this.params.page = 1
        this.isError = false
        this.loading = true
        const params = {
          params: this.params,
        }
        try {
          const { data } = await api.get('/v1/transaksi/notasales/list', params)
          // console.log('sasasasa', res.data.data)
          this.meta = data
          this.olahdata(data?.data)
          this.loading = false
        } catch (error) {
          console.log(error)
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
            .get('/v1/transaksi/notasales/list', params)
            .then(({ data }) => {
              // console.log('heder order barangxxxxxxxxx', data)
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

      olahdata(val) {
        console.log('aslipembayaran hutang', val)
        // const hasilglobal = []
        val?.forEach((x) => {
          const totalhutang = x.rinci.reduce((a, b) => parseFloat(a) + parseFloat(b.total), 0)
          const hasil = {
            id: x?.id,
            notrans: x?.notrans,
            tgl: x?.tgl,
            kdsales: x?.kdsales,
            sales: x?.nama,
            kunci: x?.kunci,
            totalhutang: totalhutang,
            rinci: x?.rinci,
            lamatempo: x?.lamatempo,
            keterangan: x?.keterangan,
          }
          // console.log('hasilccccc', hasil)
          // hasilglobal.push(hasil)
          // console.log('this.itemsa', this.items)
          const index = this.items.findIndex((q) => q.id === x?.id)
          // console.log('index', index)
          if (index >= 0) {
            console.log('aaaa')
            this.items[index] = hasil
            console.log('this.itemsb', this.items)
          } else {
            console.log('bbbbbbbbb')
            this.items.unshift(hasil)
          }
        })
        // this.items.sort(({ tgl: a }, { tgl: b }) => b - a)
      },
      async deleteData(id, notrans, notaPenjualan, keterangan) {
        // this.loadinghapus = true
        this.items = this.items.filter((item) => item.id !== id)
        const params = { id, notrans, notaPenjualan, keterangan }
        try {
          const resp = await api.post(`/v1/transaksi/notasales/hapusrincian`, params)
          // console.log(resp)
          if (resp.status === 200) {
            const newArr = this.rinci?.filter((item) => item?.id !== id)
            this.rinci = newArr
            this.olahdata(resp?.data?.data)

            notifSuccess('Data berhasil dihapus')
            // this.loadinghapus = false
          }
        } catch (error) {
          console.log('del Pembayaran Hutang error', error)
          // this.loadinghapus = false
          notifError(error?.response?.data?.message)
        }
      },
    },
  },
)
