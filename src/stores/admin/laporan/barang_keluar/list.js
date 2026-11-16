import { defineStore, acceptHMRUpdate } from 'pinia'
import { api } from 'src/boot/axios'
import { date } from 'quasar'

export const useLaporanBarangKeluarStore = defineStore(
  'laporan-barang-keluar-store',
  {
    state: () => ({
      params: {
        q: '',
        merk: null,
        tglawal: date.formatDate(Date.now(), 'YYYY-MM-01'),
        tglakhir: date.formatDate(Date.now(), 'YYYY-MM-DD')
      },
      items: [],
      loading: false,
      merks: []
    }),

    actions: {
      async getData() {
        this.loading = true
        try {
          const { data } = await api.get('/v1/laporan/barang-keluar/getdata', {
            params: this.params
          })
          this.items = data?.data ?? []
          return this.items
        } finally {
          this.loading = false
        }
      },

      async getMerks() {
        const { data } = await api.get('/v1/master/select/master-get-brand')
        this.merks = (data ?? [])
          .map(item => item.brand)
          .filter(Boolean)
      }
    }
  }
)

if (import.meta.hot) {
  import.meta.hot.accept(
    acceptHMRUpdate(useLaporanBarangKeluarStore, import.meta.hot)
  )
}
