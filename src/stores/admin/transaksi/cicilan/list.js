import { acceptHMRUpdate, defineStore } from "pinia"
import { api } from "src/boot/axios"
import { notifError, notifSuccess } from "src/modules/notifs"

export const useListCicilanPenjualanStore = defineStore('list-cicilan-penjualan-store', {
  state: () => ({
    isError: false,
    loading: false,
    params: {
      q:null,
      page: 0,
      per_page: 15,
      flag: 'semua',
      sales:null
    },
    flagOptions:[
      {label:'Semua Terhutang',value:'semua'},
      {label:'Down Payment (DP)',value:'7'},
      {label:'Belum ada Cicilan',value:'2'},
      {label:'Proses Cicilan',value:'3'},
      {label:'Dibawa Sales',value:'4'},
      {label:'Lunas',value:'5'},
    ]
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
        const { data } = await api.get('/v1/transaksi/cicilan/list',params)
        console.log('list ciclan', data);

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

      console.log('load more', index);

      return new Promise((resolve) => {
        api.get('/v1/transaksi/cicilan/list', params)
          .then(({data}) => {
            console.log('list ciclan',data);
            this.meta = data?.meta
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
    async BawaNota(item){
      item.loading=true
      const form={
        id:item?.id,
      }
      await api.post('/v1/transaksi/cicilan/bawa-nota',form).then(({data})=>{
        item.loading=false
        console.log('bawa nota', data)
        const index=this.items?.findIndex(obj=>obj.id===data?.data.id)
        if(index>=0) this.items[index]=data?.data
        notifSuccess(data?.message)

      }).catch((err)=>{
        item.loading=false
        const msg=err?.response?.data?.message
        notifError(msg)
      })

    },
    async tidakNyicil(item){
      item.loading=true
      const form={
        id:item?.id,
      }
      await
      api.post('/v1/transaksi/cicilan/tidak-nyicil',form).then(({data})=>{
        item.loading=false
        console.log('tidak nyicil', data)
        const index=this.items?.findIndex(obj=>obj.id===data?.data.id)
        if(index>=0) this.items[index]=data?.data
        notifSuccess(data?.message)

      }).catch((err)=>{
        item.loading=false
        const msg=err?.response?.data?.message
        notifError(msg)
      })

    },
  }
})
if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useListCicilanPenjualanStore, import.meta.hot))
}

