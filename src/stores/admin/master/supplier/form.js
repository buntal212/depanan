import { defineStore, acceptHMRUpdate } from 'pinia'

import { api } from 'src/boot/axios'
import { useAdminMasterSupplierStore } from './list'

export const useAdminFormMasterSupplierStore = defineStore('admin-form-master-supplier-store', {
  state: () => ({
    form: {
      id: null,
      nama: null,
      alamat: null,
      telepon: null,
      flaging: null,
    },
    loading: false,
  }),
  // persist: true,
  // getters: {
  //   doubleCount: (state) => state.counter * 2
  // },

  actions: {
    initReset() {
      for (const key in this.form) {
        // console.log(`${key}: ${this.form[key]}`);
        this.form[key] = null
      }
    },

    async save() {
      this.loading = true
      return new Promise((resolve, reject) => {
        api
          .post('/v1/master/supplier/simpan', this.form)
          .then(({ data }) => {
            console.log(data)
            this.loading = false

            // inject data
            const arr = useAdminMasterSupplierStore()
            arr.items.unshift(data?.result)

            this.initReset()
            resolve(data)
          })
          .catch((err) => {
            this.loading = false
            reject(err)
          })
      })
    },
  },
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useAdminFormMasterSupplierStore, import.meta.hot))
}
