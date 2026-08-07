import { defineStore, acceptHMRUpdate } from 'pinia'

import { api } from 'src/boot/axios'
import { useAdminMasterPegawaiStore } from './list'

export const useAdminFormMasterPegawaiStore = defineStore('admin-form-master-pegawai-store', {
  state: () => ({
    form: {
      id: null,
      nama: null,
      username: null,
      email: null,
      password: null,
      jabatan: null,
      nohp: null,
      alamat: null,
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
          .post('/v1/master/users/save', this.form)
          .then(({ data }) => {
            console.log(data)
            this.loading = false

            // inject data
            const arr = useAdminMasterPegawaiStore()
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
  import.meta.hot.accept(acceptHMRUpdate(useAdminFormMasterPegawaiStore, import.meta.hot))
}
