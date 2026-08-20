import { defineStore, acceptHMRUpdate } from 'pinia'
import { api } from 'src/boot/axios'
import { notifSuccess } from 'src/modules/notifs'
import { useAdminMasterShiftKerjaStore } from './list'

const kosong = () => ({ id: null, kode: '', nama: '', jam_masuk: '08:00', jam_keluar: '17:00', toleransi: 0, aktif: 1 })
export const useAdminFormMasterShiftKerjaStore = defineStore('admin-form-master-shift-kerja-store', {
  state: () => ({ form: kosong(), loading: false }),
  actions: {
    initReset(data) { this.form = data ? { ...kosong(), ...data } : kosong() },
    async save(original) {
      this.loading = true
      try {
        const { data } = await api.post('/v1/master/shiftkerja/savedata', this.form)
        const list = useAdminMasterShiftKerjaStore()
        if (original) list.items = list.items.map((item) => item.id === data?.result?.id ? data.result : item)
        else if (data?.result) list.items.unshift(data.result)
        notifSuccess(data?.message || 'Data berhasil disimpan'); this.initReset(null)
      } finally { this.loading = false }
    },
  },
})
if (import.meta.hot) import.meta.hot.accept(acceptHMRUpdate(useAdminFormMasterShiftKerjaStore, import.meta.hot))
