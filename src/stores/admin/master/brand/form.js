import { defineStore, acceptHMRUpdate } from 'pinia'

import { api } from 'src/boot/axios'
import { useAdminMasterBrandStore } from './list'
import { notifSuccess } from 'src/modules/notifs'

export const useAdminFormMasterBrandStore = defineStore('admin-form-master-bran-store', {
  state: () => ({
    form: {
      id: null,
      brand: null,
      flaging: null,
    },
    loading: false,
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
          this.form.kodebrand = data?.kodebrand
          console.log(this.form)

          resolve()
        })
      } else {
        for (const key in this.form) {
          // console.log(`${key}: ${this.form[key]}`);
          this.form[key] = null
        }
      }
    },

    async save(add) {
      this.loading = true
      return new Promise((resolve, reject) => {
        api
          .post('/v1/master/brand/savedata', this.form)
          .then(({ data }) => {
            console.log('saved', data)
            this.loading = false

            // inject data
            const arr = useAdminMasterBrandStore()
            if (!add) {
              arr.items.unshift(data?.result)
            } else {
              if (arr?.items && data?.result?.id) {
                arr.items = arr.items.map((obj) =>
                  obj?.id === data.result.id ? { ...obj, ...data.result } : obj,
                )
              }
            }
            // arr.items.unshift(data?.result)
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
  },
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useAdminFormMasterBrandStore, import.meta.hot))
}
