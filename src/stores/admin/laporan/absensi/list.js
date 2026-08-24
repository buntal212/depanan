import { defineStore, acceptHMRUpdate } from 'pinia'
import { date } from 'quasar'
import { api } from 'src/boot/axios'

export const useLaporanAbsensiStore = defineStore('laporan-absensi-store', {
  state: () => ({
    params: {
      tglawal: date.formatDate(Date.now(), 'YYYY-MM-01'),
      tglakhir: date.formatDate(Date.now(), 'YYYY-MM-DD'),
      pegawai_id: null,
      status: null,
    },
    items: [],
    meta: null,
    loading: false,
  }),
  getters: {
    summary: (state) => state.items.reduce((result, item) => {
      const status = String(item.status || '').toLowerCase()
      if (status === 'hadir') result.hadir += 1
      else if (status === 'terlambat') result.terlambat += 1
      else if (status === 'izin') result.izin += 1
      else if (status === 'sakit') result.sakit += 1
      else if (status === 'alpa' || status === 'alpha') result.alpa += 1
      return result
    }, { hadir: 0, terlambat: 0, izin: 0, sakit: 0, alpa: 0 }),
  },
  actions: {
    async getdata() {
      this.loading = true
      try {
        const { data } = await api.get('/v1/laporan/absensi/getdata', { params: this.params })
        this.items = data?.data || data?.result || data || []
        this.meta = data?.meta || null
        return data
      } finally {
        this.loading = false
      }
    },
  },
})

if (import.meta.hot) import.meta.hot.accept(acceptHMRUpdate(useLaporanAbsensiStore, import.meta.hot))
