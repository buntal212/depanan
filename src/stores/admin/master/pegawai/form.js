import { defineStore, acceptHMRUpdate } from 'pinia'

import { api } from 'src/boot/axios'
import { useAdminMasterPegawaiStore } from './list'
import { notifError, notifSuccess } from 'src/modules/notifs'

export const useAdminFormMasterPegawaiStore = defineStore('admin-form-master-pegawai-store', {
  state: () => ({
    dialog: false,
    form: {
      id: null,
      nama: null,
      username: null,
      email: null,
      password: null,
      jabatan: 'Pegawai',
      kodejabatan: 2,
      nohp: null,
      alamat: null,
    },
    loading: false,
    jabatan: [
      { keterangan: 'Admin', kode: 1 },
      { keterangan: 'Pegawai', kode: 2 },
      { keterangan: 'Sales', kode: 3 },
    ],
    payload: {
      submenu: '',
      menu: '',
    },
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
            this.form[key] = data[key]
          }
          this.form.username = data?.username
          console.log(this.form)

          resolve()
        })
      } else {
        this.form = {
          id: null,
          nama: null,
          username: null,
          email: null,
          password: null,
          jabatan: 'Pegawai',
          kodejabatan: 2,
          nohp: null,
          alamat: null,
        }
      }
    },

    async save(add) {
      this.loading = true
      return new Promise((resolve, reject) => {
        api
          .post('/v1/master/users/save', this.form)
          .then(({ data }) => {
            console.log('saved', data)
            this.loading = false

            // inject data
            const arr = useAdminMasterPegawaiStore()
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

    async tambahhakakses() {
      this.loading = true
      return new Promise((resolve, reject) => {
        api
          .post('/v1/master/users/savehakakses', this.payload)
          .then(({ data }) => {
            this.loading = false
            console.log('saved', data)
            const datax = data?.result[0]
            const arr = useAdminMasterPegawaiStore()
            arr.olah(datax)
            notifSuccess('Data berhasil disimpan')

            this.initReset(null)
            resolve(data)
          })
          .catch((err) => {
            this.loading = false
            notifError(err?.response?.data?.message)
            reject(err)
          })
      })
    },
  },
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useAdminFormMasterPegawaiStore, import.meta.hot))
}
