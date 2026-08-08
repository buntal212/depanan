import { acceptHMRUpdate, defineStore } from "pinia"
import { api } from "src/boot/axios"
import { notifError, notifSuccess } from "src/modules/notifs"
import { useListReturPenjualanStore } from "./list"
import { useListTransaksiReturPenjualanStore } from "./retur"

export const useFormReturPenjualanStore = defineStore('form_retur-penjualan-store',{
  state: () => ({
    loading: false,
    list: useListReturPenjualanStore(),
    retur: useListTransaksiReturPenjualanStore(),
    form:{},
    noRetur:'',
    item:null
  }),
  actions: {
    resetForm(){
      console.log('reset Form');
      this.form={}
    },
    initForm(key,val){
      this.form[key]=val
    },
    setForm(item){
      console.log('set Form', item);
      this.item={...item}
      this.item?.detail?.forEach(d=>{


          d.retur=item?.detail_retur.filter(f=>f.kodebarang===d.kodebarang && f.detail_penjualan_id===d.id && f.status === '')?.reduce((acc,cur)=>acc+cur.jumlah,0)

          const sudahRetur=item?.detail_retur.filter(f=>f.kodebarang===d.kodebarang && f.detail_penjualan_id===d.id && f.status !== '')?.reduce((acc,cur)=>acc+cur.jumlah,0)

          d.sisa=d.jumlah-sudahRetur-d.retur
          // console.log('d',d);

        })
        this.noRetur=item?.draft_retur?.no_retur??''

    },
    async submit(item) {
      item.loading = true

      try {
        const resp = await api.post('/v1/transaksi/retur/simpan', this.form)
        item.loading = false
        const pj=resp?.data?.pj
        const ret=resp?.data?.data
        console.log('submit retur penjualan', pj)
        const index=this.list.items.findIndex(i=>i.id==pj.id)
        if(index>=0){
          this.list.items[index]=pj
        }
        const indexRetur=this.retur.items.findIndex(i=>i.id==ret.id)
        if(indexRetur>=0){
          this.retur.items[indexRetur]=ret
        }else this.retur.items.unshift(ret)
        this.resetForm()
        this.setForm(pj)
        this.noRetur=resp?.data?.noretur
        notifSuccess(resp?.data?.message)
        return resp
      } catch (error) {
        item.loading = false
        this.isError = true
        this.message = error?.response?.data?.message
        notifError(error?.response?.data?.message)
        console.log('error submit retur penjualan', error)
        throw error
      }
    },
    selesai(form){
      return new Promise((resolve,reject) => {
        api.post('/v1/transaksi/retur/selesai', form)
        .then(({data}) => {

          resolve(data)
        })
        .catch((err)=>{
          reject(err)
        })

      })
    }
  }
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useFormReturPenjualanStore, import.meta.hot))
}
