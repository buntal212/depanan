import { defineStore, acceptHMRUpdate } from 'pinia'

import { api } from 'src/boot/axios'
import { date } from 'quasar'

export const useLaporanHutangPiutang = defineStore('laporan-hutangpiutang-store', {
  state: () => ({
    params: {
      q: null,
      page: 0,
      per_page: 15,
      tahun: date.formatDate(Date.now(), 'YYYY'),
      bulan: date.formatDate(Date.now(), 'MM'),
    },
    dateDisplay: {
      from: date.formatDate(Date.now(), 'DD MMMM YYYY'),
      to: date.formatDate(Date.now(), 'DD MMMM YYYY'),
    },
    bulans: [
      { nama: 'Januari', value: '01' },
      { nama: 'Februari', value: '02' },
      { nama: 'Maret', value: '03' },
      { nama: 'April', value: '04' },
      { nama: 'Mei', value: '05' },
      { nama: 'Juni', value: '06' },
      { nama: 'Juli', value: '07' },
      { nama: 'Agustus', value: '08' },
      { nama: 'September', value: '09' },
      { nama: 'Oktober', value: '10' },
      { nama: 'November', value: '11' },
      { nama: 'Desember', value: '12' },
    ],
    tahuns: [],
    loading: false,
    dialogCetak: false,

    items: [],
  }),

  actions: {
    generateTahuns() {
      const tahunSekarang = parseInt(date.formatDate(Date.now(), 'YYYY'))
      this.tahuns = []
      for (let i = tahunSekarang - 3; i <= tahunSekarang + 3; i++) {
        this.tahuns.push({ value: i.toString() })
      }
    },
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
      // console.log('params', params)
      return new Promise((resolve, reject) => {
        api
          .get('/v1/laporan/hutangpiutang/gethutangpiutang', params)
          .then(({ data }) => {
            console.log('getdata', data)
            this.items = data
            this.loading = false
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
  import.meta.hot.accept(acceptHMRUpdate(useLaporanHutangPiutang, import.meta.hot))
}
