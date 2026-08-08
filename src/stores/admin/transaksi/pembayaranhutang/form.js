import { defineStore, acceptHMRUpdate } from 'pinia'
import { date } from 'quasar'
import { api } from 'src/boot/axios'
import { notifSuccess } from 'src/modules/notifs'
import { useAdminListTransaksiPembayaranHutangStore } from './list'

export const useAdminFormTransaksiPembayaranHutangStore = defineStore(
  'admin-form-transaksi-pembayaranhutang-store',
  {
    state: () => ({
      meta: null,
      basic: false,
      loadingcarihutang: false,
      loadingsimpan: false,
      itemPembayaranhutang: null,
      items: [],
      rinci: [],
      form: {
        nopembayaran: '',
        kdsuplier: '',
        carabayar: '',
        keterangan: '',
        nopenerimaan: '',
        nofaktur: '',
        noorderan: '',
        total: 0,
        tgl: date.formatDate(Date.now(), 'YYYY-MM-DD'),
      },
      dateDisplay: {
        tgl: date.formatDate(Date.now(), 'DD MMMM YYYY'),
      },
    }),

    actions: {
      async listhutang() {
        this.items = []
        console.log('basic', this.basic)
        this.loadingcarihutang = true
        const params = { params: { kdsupplier: this.form.kdsuplier } }
        try {
          const { data } = await api.get('/v1/transaksi/pembayaranhutang/list-hutang', params)
          const hasil = data
          this.olahdatahutang(hasil)
          console.log('hasil', hasil)
          this.loadingcarihutang = false
        } catch (error) {
          console.log(error)
          this.loadingcarihutang = false
        }
      },

      olahdatahutang(val) {
        console.log('val', val)
        const hasil = []
        val?.forEach((x) => {
          const totalhutang = x.rinci.reduce((a, b) => parseFloat(a) + parseFloat(b.subtotal), 0)
          const totalhutangterbayar = x.rincianpembayaranhutang.reduce(
            (a, b) => parseFloat(a) + parseFloat(b.totalbayar),
            0,
          )
          console.log('totalhutang', totalhutang)
          const tglpenerimaan = new Date(x?.created_at).toISOString().split('T')[0]
          const datahutang = {
            id: x?.id,
            nopenerimaan: x?.nopenerimaan,
            nofaktur: x?.nofaktur,
            noorderan: x?.noorder,
            supllier: x?.suplier?.nama,
            tglpenerimaan: tglpenerimaan,
            tglfaktur: x?.tgl_faktur,
            jumlahharitempo: x?.jumlahharitempo,
            tgljatuhtempo: x?.tgljatuhtempo,
            totalhutang: totalhutang,
            totalterbayang: totalhutangterbayar,
            yangakandibayar: totalhutang - totalhutangterbayar,
            sisajumlahbelumditerimax: totalhutang - totalhutangterbayar,
          }
          hasil.push(datahutang)
        })
        const filteryanglunas = hasil.filter((item) => item.yangakandibayar > 0)
        const urut = filteryanglunas.sort(
          (a, b) => new Date(a.tglpenerimaan) - new Date(b.tglpenerimaan),
        )
        this.items = urut
        console.log('datahutangxx', this.items)
      },
      async simpan() {
        this.loadingsimpan = true
        try {
          const { data } = await api.post('/v1/transaksi/pembayaranhutang/simpan', this.form)
          this.form.nopembayaran = data?.data[0]?.notrans
          const nopenerimaan = data?.nopenerimaan
          const arr = this.items.filter((item) => item.nopenerimaan !== nopenerimaan)
          this.items = arr
          const list = useAdminListTransaksiPembayaranHutangStore()
          list.olahdata(data?.data)
          list.rinci = data?.data[0]?.rinci
          this.olahdatahutang(data?.newhutang)
          notifSuccess('Data berhasil disimpan')
          this.loadingsimpan = false
        } catch (error) {
          console.log(error)
          this.loadingsimpan = false
        }
      },
    },
  },
)

if (import.meta.hot) {
  import.meta.hot.accept(
    acceptHMRUpdate(useAdminFormTransaksiPembayaranHutangStore, import.meta.hot),
  )
}
