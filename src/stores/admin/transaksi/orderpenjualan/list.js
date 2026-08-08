import { defineStore, acceptHMRUpdate } from 'pinia'
import { date } from 'quasar'
 
import { api } from 'src/boot/axios'
// eslint-disable-next-line no-unused-vars
import { notifError, notifSuccess } from 'src/modules/notifs'

export const useAdminOrderPenjualanStore = defineStore('admin-transaksi-order-penjualan-store', {
  state: () => ({
    meta: null,
    items: [],
    item:null,
    isError: false,
    loading: false,
    dialogFilter: false,
    dialogKartu: false,
    image: '',
    params: {
      q: null,
      page: 0,
      per_page: 15,
      bulan: date.formatDate(Date.now(), 'MM'),
      tahun: date.formatDate(Date.now(), 'YYYY'),
    },
    expand: false,
    loadingStatus:false
    
  }),
  // persist: true,
  // getters: {
  //   doubleCount: (state) => state.counter * 2
  // },

  actions: {
    setExpand() {
      this.expand = !this.expand
    },
    async getList() {
      this.params.page = 1
      this.isError = false
      this.loading = true
      const params = {
        params: this.params,
      }
      try {
        const { data } = await api.get('/v1/orderpenjualan/list', params)
        console.log('get order penjualan', data)
        this.meta = data
        this.items = data?.data
      } catch (error) {
        console.log(error)
        this.isError = true
      } finally {
        this.loading = false
      }
    },

    loadMore(index, done) {
      // console.log(index, done);
      
      this.isError = false
      this.params.page = index
      const params = {
        params: this.params,
      }

      console.log('load more', index)

      return new Promise((resolve) => {
        api
          .get('/v1/orderpenjualan/list', params)
          .then(({ data }) => {
            // console.log('get master barangxxxx', data.data)
            this.meta = data
            this.items.push(...data.data)

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

    async onUpdateRincian(payload){
      // console.log(payload);
      this.loadingStatus=true
      const order_id = payload.order_id
      const rincian_id = payload?.id
      try {
        const resp = await api.post('/v1/orderpenjualan/update-rincian', payload)
        console.log('update rincian', resp);

        const it = this.items?.find(x=>x.id === order_id) || null
        const rincianx = it?.rincians?.find(y=>y.id === rincian_id)


        rincianx['jumlah'] = payload?.jumlah
        rincianx['satuan'] = payload?.satuan
        rincianx['subtotal'] = payload?.subtotal

        it['total_harga'] = payload?.total_harga_order
        
      } catch (error) {
        console.log('update rincian', error);
        
      } finally {
        this.loadingStatus=false
      }
    },

    async onDeleteRincian(payload){
      console.log('from store', payload);

      this.loadingStatus=true
      
      const order_id = payload.order_id
      const rincian_id = payload?.id

      try {
          const resp = await api.post('/v1/orderpenjualan/delete-rincian', payload)
          console.log('delete rincian', resp);

          const it = this.items?.find(x=>x.id === order_id) || null
          const rincianx = it?.rincians?.filter(y=>y.id !== rincian_id)
          it.rincians = rincianx
          it['total_harga'] = payload?.total_harga_order

      } catch (error) {
        console.log('delete rincian', error);
      } finally {
        this.loadingStatus=false
      }
    },

    async onUpdateStatus(payload){
      this.loadingStatus=true
      console.log('from store', payload);
      
      const order_id = payload.order_id
      const status = payload?.status_order

      try {
          const resp = await api.post('/v1/orderpenjualan/update-status', payload)
          console.log('update-status', resp);

          const it = this.items?.find(x=>x.id === order_id) || null
          it['status_order'] = status

      } catch (error) {
        console.log('update-status', error);
      } finally{
        this.loadingStatus=false
      }
    }
  },

  

})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useAdminOrderPenjualanStore, import.meta.hot))
}
