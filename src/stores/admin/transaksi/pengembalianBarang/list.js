import { defineStore } from 'pinia'
import { api } from 'src/boot/axios'
import { acceptHMRUpdate } from 'pinia'

export const useListPengembalianStore = defineStore('pengembalian-list-store', {
  state: () => ({
    items: [],
    loading: false,
    total: 0,
    params: {
      page: 1,
      perPage: 10,
      sortBy: 'tanggal',
      sortDesc: true,
      search: '',
      status: ''
    }
  }),

  actions: {
    async getList() {
      this.loading = true
      try {
        const { data } = await api.get('/v1/transaksi/pengembalianbarang/get', {
          params: this.params
        })
        this.items = data.data?.data ?? []
        this.total = data.total
      } catch (error) {
        console.error('Error fetching pengembalian:', error)
        throw error
      } finally {
        this.loading = false
      }
    },

    async getById(id) {
      try {
        const { data } = await api.get(`/v1/transaksi/pengembalianbarang/getbyid/${id}`)
        return data
      } catch (error) {
        console.error('Error fetching pengembalian detail:', error)
        throw error
      }
    },

    setParams(params) {
      this.params = {
        ...this.params,
        ...params
      }
    },

    resetParams() {
      this.params = {
        page: 1,
        perPage: 10,
        sortBy: 'tanggal',
        sortDesc: true,
        search: '',
        status: ''
      }
    }
  }
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useListPengembalianStore, import.meta.hot))
}
