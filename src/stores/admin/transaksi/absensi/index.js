import { acceptHMRUpdate, defineStore } from 'pinia'
import { date } from 'quasar'
import { api } from 'src/boot/axios'
import { notifError, notifSuccess } from 'src/modules/notifs'

const formKosong = () => ({
  id: null,
  user_id: null,
  jenis: 'izin',
  tanggal_mulai: date.formatDate(Date.now(), 'YYYY-MM-DD'),
  tanggal_selesai: date.formatDate(Date.now(), 'YYYY-MM-DD'),
  keterangan: '',
})

export const useTransaksiAbsensiStore = defineStore('transaksi-absensi-store', {
  state: () => ({
    items: [],
    pegawai: [],
    form: formKosong(),
    filter: { q: '', jenis: null },
    loading: false,
    saving: false,
    deletingId: null,
  }),
  actions: {
    resetForm() {
      this.form = formKosong()
    },
    edit(item) {
      this.form = {
        id: item.id,
        user_id: item.user_id,
        jenis: item.jenis,
        tanggal_mulai: item.tanggal_mulai,
        tanggal_selesai: item.tanggal_selesai,
        keterangan: item.keterangan || '',
      }
    },
    async getPegawai() {
      const { data } = await api.get('/v1/master/users/getdata', {
        params: { page: 1, per_page: 200 },
      })
      this.pegawai = (data?.data || []).map((item) => ({
        label: item.nama || item.username || `Pegawai #${item.id}`,
        value: item.id,
        jabatan: item.jabatan,
      }))
    },
    async getData() {
      this.loading = true
      try {
        const { data } = await api.get('/v1/transaksi/absensi', { params: this.filter })
        this.items = data?.data || []
      } catch (error) {
        notifError(error.response?.data?.message || 'Data absensi gagal dimuat')
      } finally {
        this.loading = false
      }
    },
    async simpan() {
      this.saving = true
      try {
        const { data } = await api.post('/v1/transaksi/absensi', this.form)
        notifSuccess(data.message)
        this.resetForm()
        await this.getData()
        return true
      } catch (error) {
        const errors = error.response?.data?.errors
        const message = errors ? Object.values(errors).flat()[0] : error.response?.data?.message
        notifError(message || 'Permohonan tidak dapat disimpan')
        return false
      } finally {
        this.saving = false
      }
    },
    async hapus(id) {
      this.deletingId = id
      try {
        const { data } = await api.delete(`/v1/transaksi/absensi/${id}`)
        notifSuccess(data.message)
        if (this.form.id === id) this.resetForm()
        await this.getData()
      } catch (error) {
        notifError(error.response?.data?.message || 'Data gagal dihapus')
      } finally {
        this.deletingId = null
      }
    },
  },
})

if (import.meta.hot) import.meta.hot.accept(acceptHMRUpdate(useTransaksiAbsensiStore, import.meta.hot))
