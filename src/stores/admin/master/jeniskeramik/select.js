import { defineStore, acceptHMRUpdate } from 'pinia'
import { api } from 'src/boot/axios'

export const useAdminMasterJenisSelectStore = defineStore('admin-master-jenis-select-store', {
  state: () => ({
    items: [],
    isError: false,
    loading: false,
    params: {
      q: null,
      limit: 0,
    },
  }),

  actions: {
    async getDataAll() {
      this.loading = true
      try {
        const { data } = await api.get('/v1/master/select/master-get-jenis')
        if (data) {
          this.items = data
        }
        console.log('get Jenis Keramik', this.items)
        this.loading = false
      } catch (error) {
        console.log(error)
        this.isError = true
        this.loading = false
      }
    },
  },
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useAdminMasterJenisSelectStore, import.meta.hot))
}
