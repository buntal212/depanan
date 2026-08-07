import { defineStore, acceptHMRUpdate } from 'pinia'

import { api } from 'src/boot/axios'
import { useAdminMasterSatuanStore } from './list'

export const useAdminFormMasterSatuanStore = defineStore('admin-form-master-satuan-store', {
  state: () => ({
    form: {
      id: null,
      satuan: null,
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
          .post('/v1/master/satuan/satuansimpan', this.form)
          .then(({ data }) => {
            console.log(data)
            this.loading = false

            // inject data
            const arr = useAdminMasterSatuanStore()
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
  import.meta.hot.accept(acceptHMRUpdate(useAdminFormMasterSatuanStore, import.meta.hot))
}
