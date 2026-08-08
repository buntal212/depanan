import { defineStore } from 'pinia'
import { date } from 'quasar'
import { api } from 'src/boot/axios'
import { notifError, notifSuccess } from 'src/modules/notifs'
import { useAdminListTransaksiNotaSalesstore } from './list'

export const useAdminFormTransaksiNotaSalesStore = defineStore(
  'admin-form-transaksi-notasales-store',
  {
    state: () => ({
      meta: null,
      metapiutang: null,
      basicpiutang: false,
      loadingcarinota: false,
      loadingsimpan: false,
      loadingkunci: false,
      opendialogCetak: false,
      opendialogCetakkedua: false,
      items: [],
      itemspiutang: [],
      allItemspiutang: [],
      rinci: [],
      itemCetak: [],
      form: {
        notrans: '',
        kdsales: '',
        keterangan: '',
        notaPenjualan: '',
        tgljatuhtempo: '',
        lamatempo: 0,
        total: 0,
        yangakandibayar: 0,
        pelanggan_id: '',
        tgl: date.formatDate(Date.now(), 'YYYY-MM-DD'),
        cicilan: 0,
        kunci: '',
        bayar: false,
        terbayar: 0,
        carabayarrinci: '',
        keteranganrinci: '',
      },
      dateDisplay: {
        tgl: date.formatDate(Date.now(), 'DD MMMM YYYY'),
      },
      nonota: '',
    }),
    actions: {
      async listnotapiutang() {
        this.loadingcarinota = true
        try {
          const res = await api.get('/v1/transaksi/notasales/list', {
            params: this.params,
          })
          this.items = res.data.data
          this.meta = res.data.meta
          this.loadingcarinota = false
        } catch (error) {
          console.log(error)
          this.loadingcarinota = false
        }
      },
      async getList() {
        this.items = []
        // console.log('ini list pembayaran hutang')
        this.params.page = 1
        this.isError = false
        this.loading = true
        const params = {
          params: this.params,
        }
        try {
          const { data } = await api.get('/v1/transaksi/pembayaranhutang/list', params)
          console.log('get master barang', data)
          this.meta = data
          this.olahdata(data?.data)
          this.loading = false
          // this.items = data
        } catch (error) {
          console.log(error)
          this.isError = true
          this.loading = false
        }
      },
      async caripiutang(val) {
        this.itemspiutang = []
        this.allItemspiutang = []
        this.loadingcarinota = true
        const params = {
          params: {
            kdsales: this.form.kdsales,
            keterangan: val,
          },
        }
        try {
          const { data } = await api.get('/v1/transaksi/notasales/caripiutang', params)
          console.log('asdasdasdasd', data)
          const itemspiutang = data.map((item) => ({
            ...item,
            bayarx: false, // toggle bayar
            yangakandibayar: 0, // nilai input bayar
            carabayarrinci: 'Cash',
            keteranganrinci: '',
            terbayarx: item?.cicilan[0]?.jumlah,
            dp: item?.bayar,
            subtotal: item?.detail.reduce((a, b) => parseFloat(a) + parseFloat(b.subtotal), 0),
            sisax: Number(
              (item?.detail.reduce((a, b) => parseFloat(a) + parseFloat(b.subtotal), 0) ?? 0) -
                (item?.cicilan[0]?.jumlah ?? 0) -
                (item?.bayar ?? 0) -
                (item?.nilairetur ?? 0),
            ),
          }))
          const hasil = itemspiutang.filter((item) => item.sisax > 0)
          this.itemspiutang = hasil
          console.log('this.itemspiutang', this.itemspiutang)
          this.allItemspiutang = hasil
          this.loadingcarinota = false
        } catch (error) {
          console.log(error)
          this.loadingcarinota = false
        }
      },
      async simpan() {
        this.loadingsimpan = true
        console.log('form', this.loadingsimpan)
        try {
          const { data } = await api.post('/v1/transaksi/notasales/simpan', this.form)
          // console.log('data', this.items)
          this.form.notrans = data?.data[0]?.notrans
          // console.log('this.form.notrans', this.form.notrans)
          const notrans = data?.notapenjualan
          const arr = this.itemspiutang.filter((item) => item.no_penjualan !== notrans)
          this.itemspiutang = arr
          const list = useAdminListTransaksiNotaSalesstore()
          list.olahdata(data?.data)
          list.rinci = data?.data[0]?.rinci
          // this.olahdatahutang(data?.newhutang)
          notifSuccess('Data berhasil disimpan')
          this.loadingsimpan = false
        } catch (error) {
          notifError(error?.response?.data?.message)
          this.loadingsimpan = false
        }
      },
      async kunci(value) {
        this.loadingkunci = true
        const param = { notrans: value }
        try {
          const { data } = await api.post('/v1/transaksi/notasales/kunci', param)
          this.form.kunci = data?.result[0]?.kunci
          // const notrans = data?.notapenjualan
          // const arr = this.itemspiutang.filter((item) => item.no_penjualan !== notrans)
          // this.itemspiutang = arr
          // console.log('data kunci', data?.result)
          const list = useAdminListTransaksiNotaSalesstore()
          list.olahdata(data?.result)
          this.itemCetak = data?.result[0]
          this.itemCetak.totalhutang = data?.result[0]?.rinci.reduce(
            (a, b) => parseFloat(a) + parseFloat(b.total),
            0,
          )
          // console.log('data ssssskunci', this.itemCetak)
          notifSuccess('Data berhasil Dikunci')
          this.loadingkunci = false
        } catch (error) {
          console.log(error)
          notifError(error?.response?.data?.message)
          this.loadingkunci = false
        }
      },
    },
  },
)
