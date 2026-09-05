import { defineStore, acceptHMRUpdate } from 'pinia'
import { date } from 'quasar'
import { api } from 'src/boot/axios'

export const useLaporanPembayaranPiutangStore = defineStore('laporan-pembayaran-piutang-store', {
  state: () => ({
    params: {
      q: '',
      tglawal: date.formatDate(Date.now(), 'YYYY-MM-01'),
      tglakhir: date.formatDate(Date.now(), 'YYYY-MM-DD'),
      jenis_tanggal: 'hutang',
      pelanggan_id: null,
    },
    dateDisplay: {
      from: date.formatDate(Date.now(), '01 MMMM YYYY'),
      to: date.formatDate(Date.now(), 'DD MMMM YYYY'),
    },
    items: [],
    meta: { total: 0, total_pembayaran: 0 },
    loading: false,
    loadingPdf: false,
  }),

  actions: {
    async getData() {
      this.loading = true
      try {
        const { data } = await api.get('/v1/laporan/pembayaranpiutang/getdata', {
          params: this.params,
        })
        this.items = data.data
        this.meta = data.meta
      } finally {
        this.loading = false
      }
    },

    async downloadPdf() {
      this.loadingPdf = true
      try {
        const { data } = await api.get('/v1/laporan/pembayaranpiutang/pdf', {
          params: this.params,
          responseType: 'blob',
          timeout: 120000,
        })
        return data
      } catch (error) {
        console.error('PDF ERROR', {
          message: error.message,
          code: error.code,
          status: error.response?.status,
        })
        throw error
      } finally {
        this.loadingPdf = false
      }
    },
  },
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useLaporanPembayaranPiutangStore, import.meta.hot))
}
