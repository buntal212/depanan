import { acceptHMRUpdate, defineStore } from 'pinia'
import { date } from 'quasar'
import { api } from 'src/boot/axios'
import { notifError, notifSuccess } from 'src/modules/notifs'
import { useListTransaksiBebanStore } from './list'
// import { useListTransaksiBebanStore } from './list'

export const useFormTransaksiBebanStore = defineStore('form-trans-beban-store', {
  state: () => ({
    meta: null,
    form: {
      id: null,
      notrans: null,
      keterangan: null,
      tgl: date.formatDate(Date.now(), 'YYYY-MM-DD'),
      flaging: null,
      kodebeban: null,
      volume: 0,
      satuan: null,
      nominal: 0,
      subtotal: 0,
    },
    rincian: [],
    dateDisplay: {
      tgl: date.formatDate(Date.now(), 'DD MMMM YYYY'),
    },
    lock: false,
    loading: false,
    loadingHapus: false,
    dialogrincis: false,
  }),
  actions: {
    initReset(data) {
      if (data) {
        // console.log('fafafa', data)
        return new Promise((resolve) => {
          for (const key in this.form) {
            this.form[key] = data[key]
          }

          resolve()
        })
      } else {
        for (const key in this.form) {
          this.form[key] = null
        }
      }
    },
    initForm() {
      this.form.notrans = null
      this.form.tgl = date.formatDate(Date.now(), 'YYYY-MM-DD')
      this.form.keterangan = null
      this.form.flaging = null
      this.form.volume = 0
      this.form.satuan = null
      this.form.nominal = 0
      this.form.subtotal = 0
      this.rincian = []
    },
    async saveData() {
      this.loading = true
      return new Promise((resolve, reject) => {
        api
          .post('/v1/transaksi/beban/savedata', this.form)
          .then((resp) => {
            console.log('Resp Api', resp)
            this.form.notrans = resp.data.notrans
            const arr = useListTransaksiBebanStore()
            const data = resp.data?.result[0]
            const idsama = arr.items.findIndex((item) => item?.id === data?.id)
            if (idsama !== -1) {
              arr.items[idsama] = { ...arr.items[idsama], ...data }
            } else {
              arr.items.unshift(data)
            }
            // console.log('nol', data)
            // if (!add) {
            //   arr.items.unshift(data)
            // } else {
            //   if (arr?.items && data?.id) {
            //     arr.items = arr.items.map((obj) =>
            //       obj?.id === data.id ? { ...obj, ...data } : obj,
            //     )
            //     console.log('arritem', arr.items)
            //   }
            // }
            const ambil = arr.items.find((s) => s.notrans === this.form.notrans)
            this.rincian = ambil.rincian
            // console.log('rincians ulalaaaa', this.rincian)
            this.loading = false
            notifSuccess(resp.message)
            // this.resetformrinci()
            // this.listrincians()

            resolve(resp.data)
            // this.form.rincians = {}
          })
          .catch((err) => {
            const errorMessage = err.response?.data?.message || 'Terjadi kesalahan pada server'
            notifError(errorMessage)
            this.loading = false
            reject(err)
            this.form = []
          })
      })
    },
    async kunci(val) {
      this.lock = true
      // const payload = { val, notrans }
      console.log('loooock', val)
      return new Promise((resolve, reject) => {
        api
          .post('/v1/transaksi/beban/kuncidata', val)
          .then(({ data }) => {
            this.lock = false
            if (data.result) {
              this.form.flaging = data.result.flaging
            }
            // console.log('llllll', data)
            // const arr = useListTransaksiBebanStore()
            // const hasil = data?.result[0]
            // const idsama = arr.items.findIndex((item) => item?.id === data?.id)
            // if (idsama !== -1) {
            //   arr.items[idsama] = { ...arr.items[idsama], ...data }
            // } else {
            //   arr.items.unshift(hasil)
            // }

            notifSuccess(data?.message)
            resolve(data)
          })
          .catch((err) => {
            this.lock = false
            reject(err)
          })
      })
    },
    deleteData(row) {
      // console.log('hapus rinci', row)
      this.loadingHapus = true
      return new Promise((resolve, reject) => {
        api
          .post('/v1/transaksi/beban/deletedata', row)
          .then((resp) => {
            console.log('resp delete', resp)
            this.rincian = !resp?.data?.data ? [] : resp.data?.data
            // if (
            //   !resp?.data?.data ||
            //   !Array.isArray(resp?.data?.data) ||
            //   resp?.data?.data.length === 0
            // ) {
            //   return (this.rincian = [])
            // }
            const arr = useListTransaksiBebanStore()
            arr.getList()
            // const data = resp.data?.data[0]
            // const idsama = arr.items.findIndex((item) => item?.id === data?.id)
            // if (idsama !== -1) {
            //   arr.items[idsama] = { ...arr.items[idsama], ...data }
            // } else {
            //   arr.items.unshift(data)
            // }
            console.log('this.form', this.form)
            console.log('this.rincian', this.rincian)
            this.loadingHapus = false
            notifSuccess(resp?.data?.message)
            resolve(resp)
          })
          .catch((err) => {
            const errorMessage = err.response?.data?.message || 'Terjadi kesalahan pada server'
            notifError(errorMessage)
            reject(err)
            this.loadingHapus = false
            row.loading = false
          })
      })
    },
  },
})
if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useFormTransaksiBebanStore, import.meta.hot))
}
