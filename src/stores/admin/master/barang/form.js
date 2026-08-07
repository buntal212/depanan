import { defineStore, acceptHMRUpdate } from 'pinia'
 
import { api } from 'src/boot/axios'
import { useAdminMasterBarangStore } from './list'
import { notifSuccess } from 'src/modules/notifs'

export const useAdminFormMasterBarangStore = defineStore('admin-form-master-barang-store', {
  state: () => ({
    form:{
      id: null,
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
    },
    loading: false
  }),
  // persist: true,
  // getters: {
  //   doubleCount: (state) => state.counter * 2
  // },

  actions: {
    initReset(data) {

      if (data) {
        return new Promise((resolve) => {
          for (const key in this.form) {
            // console.log(`${key}: ${this.form[key]}`);
            // console.log(`${key}`);
            this.form[key] = data[key]
          }
            this.form.kodebarang = data?.kodebarang
          console.log(this.form);
          
  
          resolve()
        })
      } else {

        for (const key in this.form) {
          // console.log(`${key}: ${this.form[key]}`);
          this.form[key] = null
        }
        this.form.isi = 1
        this.form.hargajual1 = 0
        this.form.hargajual2 = 0
      }


      
    },

    async save(add) {
      this.loading = true
      return new Promise((resolve, reject) => {
        api.post('/v1/master/barang/simpanbarang', this.form)
          .then(({data}) => {

            console.log('saved',data);
            this.loading = false

            // inject data
            const arr = useAdminMasterBarangStore()
            if (!add) {
              arr.items.unshift(data?.result)
            } else {
              arr?.items?.map(obj => obj?.id === data?.result?.id ? { ...obj, ...data.result } : obj);
            }

            notifSuccess('Data berhasil disimpan')

            this.initReset(null)
            resolve(data)
          })
          .catch((err) => {
            this.loading = false
            reject(err)
          })
      })
    },

   
    
  }
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useAdminFormMasterBarangStore, import.meta.hot))
}
