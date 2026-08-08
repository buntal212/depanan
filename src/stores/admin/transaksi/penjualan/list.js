import { acceptHMRUpdate, defineStore } from 'pinia'
import { date } from 'quasar'
import { api } from 'src/boot/axios'

export const useListPenjualanStore = defineStore('list-penjualan-store', {
  state: () => ({
    isError: false,
    loading: false,
    opendialogCetak: false,
    opendialogCetakkedua: false,
    items: [],
    meta: null,
    params: {
      q: null,
      page: 1,
      per_page: 10,
      from: date.formatDate(Date.now(), 'YYYY-MM-01'),
      to: date.formatDate(Date.now(), 'YYYY-MM-DD'),
      flag: 'semua',
    },
    dateDisplay: {
      from: date.formatDate(Date.now(), '01 MMMM YYYY'),
      to: date.formatDate(Date.now(), 'DD MMMM YYYY'),
    },
    itemCetak: [],
    flagOptions: [
      { label: 'Semua', value: 'semua' },
      { label: 'Lunas', value: '5' },
      { label: 'Belum Lunas', value: 'piutang' },
      { label: 'Draft', value: 'draft' },
      { label: 'Tempo', value: '8' },
      { label: 'Down Payment (DP)', value: '7' },
      { label: 'Belum Ada Cicilan', value: '2' },
      { label: 'Proses Cicilan', value: '3' },
      { label: 'Dibawa Sales', value: '4' },
      { label: 'Batal', value: '6' },
    ],
  }),
  actions: {
    async getList() {
      this.params.page = 1
      this.isError = false
      this.loading = true
      const params = {
        params: this.params,
      }
      // console.log('get list',this.params.page);

      try {
        const { data } = await api.get('/v1/transaksi/penjualan/list', params)
        console.log('list penjualan', data)
        this.meta = data?.meta

        // Don't reset items array here, let the component handle it
        if (data?.meta.current_page == 1) {
          console.log('get list if', data?.meta.current_page)
          this.items = data?.data || []
        }

        this.loading = false
        return data
      } catch (error) {
        console.error('Error fetching penjualan:', error)
        this.isError = true
        this.loading = false
        throw error
      }
    },
    async getListNull() {
      this.params.page = 1
      this.isError = false
      this.loading = true
      const params = {
        params: this.params,
      }
      this.loading = true
      try {
        const { data } = await api.get('/v1/transaksi/penjualan/list-null', params)

        console.log('list penjualan null', data)
        data.forEach((item) => {
          const index = this.items?.findIndex((obj) => obj.id === item.id)
          if (index >= 0) this.items.splice(index, 1)
          this.items.unshift(item)
        })

        this.loading = false
      } catch (error) {
        console.log(error)
        this.loading = false
      }
    },
    loadMore(index, done) {
      if (index === 1) {
        done() // Jangan load ulang page 1, karena sudah di-getList()
        return
        }
      console.log('load more', index)

      this.isError = false
      this.params.page = index
      const params = {
        params: this.params,
      }

      return new Promise((resolve) => {
        api
          .get('/v1/transaksi/penjualan/list', params)
          .then(({ data }) => {
            // console.log('list penjualan', data)
            this.meta = data?.meta

            this.items.push(...data.data)
            // if (index > 1) {
            // }
            // this.isError = true
            resolve(data)
            done()
          })
          .catch(() => {
            this.isError = true
            done(true)
            resolve()
          })
      })
    },
  },
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useListPenjualanStore, import.meta.hot))
}
