import { acceptHMRUpdate, defineStore } from 'pinia'
import { api } from 'src/boot/axios'
import { notifError, notifSuccess } from 'src/modules/notifs'
import { useListPenjualanStore } from './list'
import { olahUang } from 'src/modules/formatter'

export const useFromPenjualanStore = defineStore('from-penjualan-store', {
  state: () => ({
    loading: false,
    loadingPembayaran: false,
    loadingTempo: false,
    openPembayaran: false,
    opendialogCetak: false,
    openDialogTempo: false,
    barang: null,
    barangs: [],
    form: {
      kodebarang: '',
      jumlah: 0,
      jumlahB: 0,
      jumlahK: 0,
      isi: 0,
      harga_beli: 0,
      harga_jual: 0,
      hargaJualB: 0,
      diskon: 0,
      subtotal: 0,
      pelanggan_id: null,
      sales_id: null, //reset ketika nota baru atau setelah bayar atau ambil dari history
    },
    formPembayaran: {
      no_penjualan: null,
      flag: '5', // tunai atau kredit, tunai flag 5, kredit 2
      cara_bayar: 'cash', // tunai atau kredit, tunai flag 5, kredit 2
      bayar: 0,
      total: 0,
      kembali: 0,
      dataPelanggan: {
        nama: '',
        tlp: '',
        alamat: '',
      },
    },
    formTempo: {
      id: null,
      tempo: null,
      tgl_kirim: null,
      jml_tempo: 30,
    },
    dispTempo: null,
    noNota: null,
    item: null,
    sales: [],
    list: useListPenjualanStore(),
  }),
  actions: {
    setForm(key, val) {
      this.form[key] = val
    },
    resetForm() {
      this.barang = null
      const salesId = this.form.sales_id

      this.form = {
        kodebarang: '',
        jumlah: 0,
        jumlahB: 0,
        jumlahK: 0,
        harga_beli: 0,
        harga_jual: 0,
        hargaJualB: 0,
        diskon: 0,
        subtotal: 0,
        sales_id: salesId,
      }
    },
    resetPembayaran() {
      this.openPembayaran = false
      this.item = null
      this.noNota = null
      this.resetForm()
      this.form.sales_id = null
      this.formPembayaran = {
        no_penjualan: null,
        cara_bayar: '5', // tunai atau kredit, tunai flag 5, kredit 2
        bayar: 0,
        total: 0,
        kembali: 0,
        dataPelanggan: {
          nama: '',
          tlp: '',
          alamat: '',
        },
      }
    },
    resetTempo() {
      this.formTempo = {
        id: null,
        tempo: null,
        tgl_kirim: null,
        jml_tempo: 30,
      }
      this.dispTempo = null
      this.item = null
      this.openDialogTempo = false
    },
    async simpanDetail() {
      this.loading = true
      if (this.noNota !== null) this.setForm('nota', this.noNota)
      const keys = Object.keys(this.form)
      const form = {}
      keys.forEach((key) => {
        if (key == 'harga_jual') form[key] = olahUang(this.form[key])
        else if (key == 'diskon') form[key] = olahUang(this.form[key])
        else if (key == 'harga_beli') form[key] = olahUang(this.form[key])
        else if (key == 'bayar') form[key] = olahUang(this.form[key])
        else if (key == 'jumlah') form[key] = olahUang(this.form[key])
        else form[key] = this.form[key]
      })
      await api
        .post('/v1/transaksi/penjualan/simpan-detail', form)
        .then(({ data }) => {
          this.loading = false
          console.log('data', data)
          notifSuccess(data?.message ?? 'Data berhasil disimpan')
          this.noNota = data?.nota
          this.item = data?.header

          // cari di list
          const index = this.list?.items?.findIndex((obj) => obj.id === this.item.id)
          if (index >= 0) this.list.items[index] = this.item
          else this.list.items.unshift(this.item)
          this.resetForm()
        })
        .catch((err) => {
          const msg = err?.response?.data?.message
          console.log('error cak', err?.response, msg)
          notifError(msg)
          this.loading = false
        })
    },
    async deleteDetail(item) {
      item.loading = true
      await api
        .post('/v1/transaksi/penjualan/delete-detail', item)
        .then(({ data }) => {
          item.loading = false
          console.log('data', data)
          notifSuccess(data?.message ?? 'Data berhasil dihapus')
          if (data?.isDeleteHeader == '1') {
            const index = this.list?.items?.findIndex((obj) => obj.id === this.item.id)
            if (index >= 0) this.list.items.splice(index, 1)
            this.item = null
          } else this.item = data?.header
        })
        .catch((err) => {
          const msg = err?.response?.data?.message
          console.log('error cak', err?.response, msg)
          notifError(msg)
          item.loading = false
        })
    },
    async getBarang(val) {
      const param = {
        params: { q: val },
      }
      await api.get('v1/transaksi/penjualan/list-barang', param).then((resp) => {
        console.log('barang', resp?.data)
        this.barangs = resp?.data
      })
    },
    async getSales() {
      // const param={
      //   params:{q:val}
      // }

      await api.get('v1/transaksi/penjualan/list-sales').then((resp) => {
        console.log('sales', resp)
        this.sales = resp?.data
      })
    },
    simpanPembayaran() {
      this.loadingPembayaran = true
      const keys = Object.keys(this.formPembayaran)
      const form = {}
      keys.forEach((key) => {
        if (key == 'bayar') form[key] = olahUang(this.formPembayaran[key])
        else if (key == 'total') form[key] = olahUang(this.formPembayaran[key])
        else if (key == 'kembali') form[key] = olahUang(this.formPembayaran[key])
        else form[key] = this.formPembayaran[key]
      })
      // return

      return new Promise((resolve) => {
        api
          .post('v1/transaksi/penjualan/simpan-pembayaran', form)
          .then((resp) => {
            this.loadingPembayaran = false
            const item = resp?.data?.data
            console.log('item', item)

            const index = this.list?.items?.findIndex((obj) => obj.id === item.id)
            if (index >= 0) this.list.items[index] = item
            else this.list.items.unshift(item)
            // this.resetPembayaran()
            const list = useListPenjualanStore()
            list.getListNull()

            list.itemCetak = item
            notifSuccess(resp?.data?.message)
            resolve(resp)
          })
          .catch((err) => {
            this.loadingPembayaran = false
            const msg = err?.response?.data?.message
            notifError(msg)
          })
      })
    },
    simpanTempo() {
      this.loadingTempo = true
      return new Promise((resolve) => {
        api
          .post('v1/transaksi/penjualan/simpan-tempo', this.formTempo)
          .then((resp) => {
            this.loadingTempo = false
            const data = resp?.data
            notifSuccess(data.message)
            const index = this.list.items.findIndex((i) => i.id == data?.data?.id)
            if (index >= 0) this.list.items[index].tempo = data?.data?.tempo
            this.list.itemCetak.jml_tempo = data?.data?.jml_tempo
            console.log('jadi tempo', this.list.itemCetak)
            this.resetTempo()
            resolve(resp)
          })
          .catch(() => {
            this.loadingTempo = false
          })
      })
    },
  },
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useFromPenjualanStore, import.meta.hot))
}
