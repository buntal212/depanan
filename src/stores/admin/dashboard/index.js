import { acceptHMRUpdate, defineStore } from 'pinia'
import { api } from 'src/boot/axios'

const months = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des']
const colors = [
  '#38bdf8',
  '#34d399',
  '#fbbf24',
  '#fb7185',
  '#a78bfa',
  '#22d3ee',
  '#60a5fa',
  '#4ade80',
  '#f59e0b',
  '#f472b6',
]

export const useAdminDashboardStore = defineStore('admin-dashboard-store', {
  state: () => ({
    loading: false,
    error: null,
    summaryStats: {
      totalPenjualan: 0,
      totalPendapatan: 0,
      totalProduk: 0,
      totalPelanggan: 0,
    },
    salesData: { months, series: [] },
    topProductsData: { products: [], series: [] },
    salesDistributionData: { series: [] },
    salesTrendData: { trendMonths: months, trendSeries: [] },
    recentSales: [],
    recentPurchases: [],
    recentDebtPayments: [],
    recentReceivablePayments: [],
  }),

  getters: {
    formattedTotalPendapatan: (state) =>
      new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
      }).format(state.summaryStats.totalPendapatan),
  },

  actions: {
    async fetchDashboardData() {
      this.loading = true
      this.error = null

      try {
        const { data } = await api.get('/v1/dashboard')
        const currentYearData = Array(12).fill(0)
        const previousYearData = Array(12).fill(0)

        data.monthlySales.forEach((item) => {
          const monthIndex = Number(item.bulan) - 1
          if (Number(item.tahun) === Number(data.tahun)) {
            currentYearData[monthIndex] = Number(item.subtotal)
          } else if (Number(item.tahun) === Number(data.tahunSebelumnya)) {
            previousYearData[monthIndex] = Number(item.subtotal)
          }
        })

        this.summaryStats = data.summary
        this.salesData.series = [
          { name: `Penjualan ${data.tahunSebelumnya}`, type: 'bar', data: previousYearData },
          { name: `Penjualan ${data.tahun}`, type: 'bar', data: currentYearData },
        ]
        this.salesTrendData.trendSeries = [
          {
            name: `Penjualan ${data.tahun}`,
            type: 'line',
            smooth: true,
            data: currentYearData,
          },
        ]

        const topProducts = [...data.topProducts].reverse()
        this.topProductsData.products = topProducts.map((item) => item.namabarang)
        this.topProductsData.series = [
          {
            name: 'Jumlah terjual',
            type: 'bar',
            data: topProducts.map((item, index) => ({
              value: Number(item.jumlahbarang),
              itemStyle: { color: colors[index % colors.length] },
            })),
            label: { show: true, position: 'right' },
          },
        ]

        this.salesDistributionData.series = [
          {
            name: 'Status transaksi',
            type: 'pie',
            radius: ['42%', '68%'],
            data: data.statusDistribution.map((item) => ({
              name: item.status,
              value: Number(item.total),
            })),
          },
        ]
        this.recentSales = data.recentSales
        this.recentPurchases = data.recentPurchases
        this.recentDebtPayments = data.recentDebtPayments
        this.recentReceivablePayments = data.recentReceivablePayments
      } catch (error) {
        console.error('Gagal memuat dashboard:', error)
        this.error = 'Data dashboard belum dapat dimuat dari server.'
      } finally {
        this.loading = false
      }
    },
  },
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useAdminDashboardStore, import.meta.hot))
}
