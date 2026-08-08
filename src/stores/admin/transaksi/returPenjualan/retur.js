import { acceptHMRUpdate, defineStore } from "pinia"
import { date } from "quasar"
import { api } from "src/boot/axios"

export const useListTransaksiReturPenjualanStore = defineStore('list-transaksi-retur-penjualan-store',{
  state: () => ({
    isError: false,
    loading: false,
    items:[],
    meta:{},
    params: {
      q:null,
      page: 0,
      per_page: 15,
      from:date.formatDate(Date.now(), 'YYYY-MM-01'),
      to:date.formatDate(Date.now(), 'YYYY-MM-DD')
    },
    dateDisplay: {
      from: date.formatDate(Date.now(), '01 MMMM YYYY'),
      to: date.formatDate(Date.now(), 'DD MMMM YYYY'),
    },
  }),
  actions: {
    async getList() {
      this.params.page = 1
      this.isError = false
      this.loading = true
      const params = {
        params: this.params
      }
      this.loading = true
      try {
        const { data } = await api.get('/v1/transaksi/retur/list-retur',params)
        console.log('list retur penjualan', data);

        this.meta = data?.meta
        this.items = data?.data
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
      this.isError = false
      this.params.page = index
      const params = {
        params: this.params
      }

      console.log('load more rtr', index);

      return new Promise((resolve) => {
        api.get('/v1/transaksi/retur/list-retur', params)
          .then(({data}) => {
            // console.log('list retur penjualan, more',data);
            if(data?.data?.length){
              this.meta = data?.meta
              this.items.push(...data.data)
            }
            done()
            resolve()
          })
          .catch((error) => {
            console.log(error)
            done()
          })
      })
    }
  }
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useListTransaksiReturPenjualanStore, import.meta.hot))
}

