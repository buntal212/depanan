import { defineStore, acceptHMRUpdate } from 'pinia'
import { api } from 'src/boot/axios'
import { notifError, notifSuccess } from 'src/modules/notifs'

export const useAdminMasterShiftKerjaStore = defineStore('admin-master-shift-kerja-store', {
  state: () => ({
    meta: null, items: [], isError: false, loading: false,
    params: { q: null, page: 1, per_page: 15 },
  }),
  actions: {
    async getList() {
      this.params.page = 1; this.loading = true; this.isError = false
      try {
        const { data } = await api.get('/v1/master/shiftkerja/listdata', { params: this.params })
        this.meta = data; this.items = data?.data || data || []
      } catch (error) { this.isError = true; console.log(error) } finally { this.loading = false }
    },
    loadMore(index, done) {
      this.params.page = index
      api.get('/v1/master/shiftkerja/listdata', { params: this.params })
        .then(({ data }) => { this.meta = data; this.items.push(...(data?.data || [])); done() })
        .catch(() => { this.isError = true; done(true) })
    },
    async deleteItem(id) {
      try { await api.post('/v1/master/shiftkerja/deletedata', { id }); this.items = this.items.filter((item) => item.id !== id); notifSuccess('Data berhasil dihapus') }
      catch (error) { console.log(error); notifError('Terjadi kesalahan') }
    },
  },
})
if (import.meta.hot) import.meta.hot.accept(acceptHMRUpdate(useAdminMasterShiftKerjaStore, import.meta.hot))
