import { defineStore, acceptHMRUpdate } from 'pinia'

import { api } from 'src/boot/axios'
import { date } from 'quasar'

export const useLaporanPenerimaanStore = defineStore('laporan-penerimaan-store', {
  state: () => ({
    params: {
      q: null,
      page: 0,
      per_page: 15,
      tglawal: date.formatDate(Date.now(), 'YYYY-MM-01'),
      tglakhir: date.formatDate(Date.now(), 'YYYY-MM-DD'),
      supplier: null,
      jnsbayar: null,
    },
    dateDisplay: {
      from: date.formatDate(Date.now(), '01 MMMM YYYY'),
      to: date.formatDate(Date.now(), 'DD MMMM YYYY'),
    },
    loading: false,
    dialogCetak: false,
    supplier: null,
    jnsbayar: null,
    items: [],
  }),

  actions: {
    initReset(data) {
      if (data) {
        return new Promise((resolve) => {
          for (const key in this.params) {
            // console.log(`${key}: ${this.form[key]}`);
            // console.log(`${key}`);
            this.params[key] = data[key]
          }
          console.log(this.params)

          resolve()
        })
      } else {
        for (const key in this.params) {
          // console.log(`${key}: ${this.form[key]}`);
          this.params[key] = null
        }
      }
    },

    async getdata() {
      this.loading = true
      const params = {
        params: this.params,
      }
      console.log('params', params)
      return new Promise((resolve, reject) => {
        api
          .get('/v1/laporan/penerimaan/getdata', params)
          .then(({ data }) => {
            console.log('getdata', data)
            this.items = data
            this.loading = false
            this.params.supplier = null
            this.params.jnsbayar = null
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
  import.meta.hot.accept(acceptHMRUpdate(useLaporanPenerimaanStore, import.meta.hot))
}
