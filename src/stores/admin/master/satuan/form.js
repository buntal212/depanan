import { defineStore, acceptHMRUpdate } from 'pinia'

import { api } from 'src/boot/axios'
import { useAdminMasterSatuanStore } from './list'
import { notifSuccess } from 'src/modules/notifs'

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
    initReset(data) {
      if (data) {
        return new Promise((resolve) => {
          for (const key in this.form) {
            // console.log(`${key}: ${this.form[key]}`);
            // console.log(`${key}`);
            this.form[key] = data[key]
          }
          this.form.kodesatuan = data?.kodesatuan
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
          .post('/v1/master/satuan/satuansimpan', this.form)
          .then(({ data }) => {
            console.log('saved', data)
            this.loading = false

            // inject data
            const arr = useAdminMasterSatuanStore()
            if (!add) {
              arr.items.unshift(data?.result) // Sesuaikan dengan response backend
            } else {
              arr.items = arr.items.map((obj) =>
                obj?.id === data.result.id ? { ...obj, ...data.result } : obj,
              )
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
  import.meta.hot.accept(acceptHMRUpdate(useAdminFormMasterSatuanStore, import.meta.hot))
}
