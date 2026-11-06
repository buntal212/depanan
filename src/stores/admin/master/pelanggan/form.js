import { defineStore, acceptHMRUpdate } from 'pinia'

import { api } from 'src/boot/axios'
import { useAdminMasterPelangganStore } from './list'
import { notifSuccess } from 'src/modules/notifs'

export const useAdminFormMasterPelangganStore = defineStore('admin-form-master-pelanggan-store', {
  state: () => ({
    form: {
      id: null,
      nama: null,
      nama_toko: null,
      nama_owner: null,
      alamat: null,
      telepon: null,
      no_tlp: null,
      no_ktp: null,
      no_npwp: null,
      namabank: null,
      norek: null,
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
            this.form[key] = data[key] ?? null
          }
          // Data lama masih memakai nama dan telepon.
          this.form.nama_toko = data.nama_toko ?? data.nama ?? null
          this.form.no_tlp = data.no_tlp ?? data.telepon ?? null
          this.form.kodeplgn = data?.kodeplgn
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
          .post('/v1/master/pelanggan/simpan', this.form)
          .then(({ data }) => {
            console.log('saved', data)
            this.loading = false

            // inject data
            const arr = useAdminMasterPelangganStore()
            if (!add) {
              arr.items.unshift(data?.result)
            } else {
              if (arr?.items && data?.result?.id) {
                arr.items = arr.items.map((obj) =>
                  obj?.id === data.result.id ? { ...obj, ...data.result } : obj,
                )
              }
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
  },
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useAdminFormMasterPelangganStore, import.meta.hot))
}
