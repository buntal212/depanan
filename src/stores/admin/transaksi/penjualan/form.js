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
      diskon_kuitansi: 0,
      kena_ppn: true,
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
    dariOrder: false,
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
      this.dariOrder = false
      this.resetForm()
      this.form.sales_id = null
      this.formPembayaran = {
        no_penjualan: null,
        flag: '5',
        cara_bayar: 'cash',
        bayar: 0,
        total: 0,
        kembali: 0,
        diskon_kuitansi: 0,
        kena_ppn: true,
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
    pastikanSalesTersedia(sales) {
      if (!sales?.id || this.sales.some((item) => String(item.id) === String(sales.id))) return
      this.sales = [sales, ...this.sales]
    },
    gunakanOrderPenjualan(penjualan) {
      this.resetPembayaran()
      this.dariOrder = true
      this.noNota = penjualan?.no_penjualan || null
      this.item = penjualan || null
      this.form.sales_id = penjualan?.sales_id || null
      this.form.pelanggan_id = penjualan?.pelanggan_id || null
      this.formPembayaran.pelanggan_id = penjualan?.pelanggan_id || null
      this.formPembayaran.dataPelanggan = {
        nama: penjualan?.pelanggan?.nama || '',
        tlp: penjualan?.pelanggan?.telepon || '',
        alamat: penjualan?.pelanggan?.alamat || '',
      }
      this.pastikanSalesTersedia(penjualan?.sales)
      this.siapkanPembayaran(penjualan)
    },
    siapkanPembayaran(penjualan) {
      const order = penjualan?.order_sumber
      const sistemBayar = order?.sistem_bayar
      const flag = sistemBayar === 'tempo' ? '2' : sistemBayar === 'dp' ? '7' : '5'
      const total = Number(penjualan?.total || 0)
      const diskonKuitansi = Number(penjualan?.diskon_kuitansi || 0)
      const kenaPpn =
        penjualan?.ppn_persen !== undefined && penjualan?.ppn_persen !== null
          ? Number(penjualan?.ppn_persen) > 0 || Number(penjualan?.ppn_nominal || 0) > 0
          : true

      this.item = penjualan || null
      this.noNota = penjualan?.no_penjualan || null
      this.formPembayaran = {
        no_penjualan: penjualan?.no_penjualan || null,
        pelanggan_id: penjualan?.pelanggan_id || null,
        flag,
        cara_bayar: sistemBayar === 'tempo' ? '' : (order?.cara_bayar || 'cash'),
        bayar: sistemBayar === 'dp' ? Number(order?.down_payment || 0) : sistemBayar === 'tempo' ? 0 : total,
        total,
        kembali: 0,
        diskon_kuitansi: diskonKuitansi,
        kena_ppn: kenaPpn,
        dataPelanggan: {
          nama: penjualan?.pelanggan?.nama || '',
          tlp: penjualan?.pelanggan?.telepon || '',
          alamat: penjualan?.pelanggan?.alamat || '',
        },
      }
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
        else if (key == 'jumlahB') form[key] = olahUang(this.form[key])
        else if (key == 'jumlahK') form[key] = olahUang(this.form[key])
        else if (key == 'hargaJualB') form[key] = olahUang(this.form[key])
        else form[key] = this.form[key]
      })

      const jB = parseFloat(form['jumlahB']) || 0
      const jK = parseFloat(form['jumlahK']) || 0
      form['satuan'] = jB > 0 ? 'SB' : 'SK'
      form['jumlah_b'] = jB
      form['jumlah_k'] = jK
      form['harga_jual_b'] = form['hargaJualB']

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
        this.sales = Array.isArray(resp?.data) ? resp.data : []
        this.pastikanSalesTersedia(this.item?.sales)
      })
    },
    simpanPembayaran() {
      this.loadingPembayaran = true
      const keys = Object.keys(this.formPembayaran)
      const form = {}
      keys.forEach((key) => {
        if (key == 'bayar') form[key] = Number(olahUang(this.formPembayaran[key])) || 0
        else if (key == 'total') form[key] = olahUang(this.formPembayaran[key])
        else if (key == 'kembali') form[key] = olahUang(this.formPembayaran[key])
        else if (key == 'diskon_kuitansi') form[key] = olahUang(this.formPembayaran[key])
        else form[key] = this.formPembayaran[key]
      })
      form['kena_ppn'] = Boolean(this.formPembayaran.kena_ppn)
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
