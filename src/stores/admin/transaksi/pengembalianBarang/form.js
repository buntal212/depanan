import { defineStore } from 'pinia'
import { api } from 'src/boot/axios'
import { acceptHMRUpdate } from 'pinia'
import { notifSuccess, notifError } from 'src/modules/notifs'
import { useListPengembalianStore } from './list'

export const useFormPengembalianStore = defineStore('pengembalian-form-store', {
  state: () => ({
    item: null,
    loading: false,
    keterangan: '',
    details: []
  }),

  actions: {
    setForm(penjualan) {
      this.item = penjualan
      this.keterangan = ''
      this.details = penjualan?.detail?.map(d => ({
        id: d.id,
        barang_id: d.master_barang.id,
        kodebarang: d.kodebarang,
        motif: d.motif,
        master_barang: d.master_barang,
        jumlah: d.jumlah,
        qty_retur: 0,
        keterangan: ''
      })) || []
    },

    resetForm() {
      this.item = null
      this.keterangan = ''
      this.details = []
    },

    async simpan() {
      this.loading = true
      try {
        // Filter hanya barang yang diretur
        const validDetails = this.details.filter(d => d.qty_retur > 0)
        if (!validDetails.length) {
          throw new Error('Minimal satu barang harus diretur')
        }

        const payload = {
          penjualan_id: this.item.id,
          no_penjualan: this.item.no_penjualan,
          keterangan: this.keterangan,
          details: validDetails.map(d => ({
            barang_id: d.barang_id,
            kodebarang: d.kodebarang,
            motif: d.motif,
            qty: d.qty_retur,
            keterangan_rusak: d.keterangan
          }))
        }

        const { data } = await api.post('/v1/transaksi/pengembalianbarang/store', payload)
        return data
      } catch (error) {
        console.error('Error saving pengembalian:', error)
        throw error
      } finally {
        this.loading = false
      }
    },

    async approve(id) {
      this.loading = true
      try {
        const { data } = await api.post(`/v1/transaksi/pengembalianbarang/approve/${id}`)

        // Update list
        const list = useListPengembalianStore()
        const index = list.items.findIndex(item => item.id === id)
        if (index >= 0) {
          list.items[index] = data.data
        }

        notifSuccess(data.message)
        return data
      } catch (error) {
        console.error('Error approving pengembalian:', error)
        notifError(error?.response?.data?.message || 'Gagal menyetujui pengembalian')
        throw error
      } finally {
        this.loading = false
      }
    },

    async reject(id) {
      this.loading = true
      try {
        const { data } = await api.post(`/v1/transaksi/pengembalianbarang/reject/${id}`)

        // Update list
        const list = useListPengembalianStore()
        const index = list.items.findIndex(item => item.id === id)
        if (index >= 0) {
          list.items[index] = data.data
        }

        notifSuccess(data.message)
        return data
      } catch (error) {
        console.error('Error rejecting pengembalian:', error)
        notifError(error?.response?.data?.message || 'Gagal menolak pengembalian')
        throw error
      } finally {
        this.loading = false
      }
    }
  }
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useFormPengembalianStore, import.meta.hot))
}
