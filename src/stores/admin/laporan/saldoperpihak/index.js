import { acceptHMRUpdate, defineStore } from 'pinia'
import { api } from 'src/boot/axios'

export const useLaporanSaldoPerPihakStore = defineStore(
  'laporan-saldo-per-pihak-store',
  {
    state: () => ({
      loading: false,
      error: null,
      items: [],
      ringkasan: [],
      totalSisa: 0,
      totalTransaksi: 0,
      params: {
        q: '',
        pihak_id: null
      }
    }),

    actions: {
      reset() {
        this.items = []
        this.ringkasan = []
        this.totalSisa = 0
        this.totalTransaksi = 0
        this.params = { q: '', pihak_id: null }
      },

      async getData(jenis) {
        this.loading = true
        this.error = null

        try {
          const endpoint =
            jenis === 'hutang'
              ? '/v1/laporan/saldo-per-pihak/hutang-per-distributor'
              : '/v1/laporan/saldo-per-pihak/piutang-per-pelanggan'
          const { data } = await api.get(endpoint, { params: this.params })

          this.items = data.data || []
          this.ringkasan = data.ringkasan || []
          this.totalSisa = Number(data.total_sisa || 0)
          this.totalTransaksi = Number(data.total_transaksi || 0)
        } catch (error) {
          console.error('Gagal memuat laporan saldo per pihak:', error)
          this.error = 'Laporan belum dapat dimuat. Silakan coba lagi.'
        } finally {
          this.loading = false
        }
      }
    }
  }
)

if (import.meta.hot) {
  import.meta.hot.accept(
    acceptHMRUpdate(useLaporanSaldoPerPihakStore, import.meta.hot)
  )
}
