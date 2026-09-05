import { defineStore, acceptHMRUpdate } from 'pinia'
import { date } from 'quasar'
import { api } from 'src/boot/axios'
import { notifError, notifSuccess } from 'src/modules/notifs'
import { useAdminListTransaksiPembayaranPiutangStore } from './list'

export const useAdminFormTransaksiPembayaranPiutangStore = defineStore(
  'admin-form-transaksi-pembayaranpiutang-store',
  {
    state: () => ({
      meta: null,
      basic: false,
      loadingcaripiutang: false,
      loadingsimpan: false,
      itemPembayaranpiutang: null,
      dialogRiwayat: false,
      loadingRiwayat: false,
      riwayatNota: null,
      items: [],
      rinci: [],
      form: {
        nopembayaran: '',
        pelanggan_id: '',
        carabayar: '',
        keterangan: '',
        nopenjualan: '',
        total: 0,
        tgl: date.formatDate(Date.now(), 'YYYY-MM-DD'),
      },
      dateDisplay: {
        tgl: date.formatDate(Date.now(), 'DD MMMM YYYY'),
      },
      carinota: '',
    }),

    actions: {
      async listpiutang() {
        this.items = []
        this.loadingcaripiutang = true
        const params = { params: { pelanggan_id: this.form.pelanggan_id } }
        try {
          const { data } = await api.get('/v1/transaksi/pembayaranpiutang/list-piutang', params)
          const hasil = data
          this.olahdatahutang(hasil)
          // console.log('hasil', hasil)
          this.loadingcaripiutang = false
        } catch (error) {
          console.log(error)
          this.loadingcaripiutang = false
        }
      },

      async getRiwayatNota(noPenjualan) {
        this.loadingRiwayat = true
        this.riwayatNota = null
        try {
          const { data } = await api.get(
            `/v1/transaksi/pembayaranpiutang/riwayat-nota/${encodeURIComponent(noPenjualan)}`,
          )
          this.riwayatNota = data.data || null
          this.dialogRiwayat = true
        } finally {
          this.loadingRiwayat = false
        }
      },

      olahdatahutang(val) {
        const hasil = []
        val?.forEach((x) => {
          //console.log('valxsss', x?.detail)
          const totalpiutang = x?.detail.reduce((a, b) => parseFloat(a) + parseFloat(b.subtotal), 0)
          const totalpiutangterbayar = x.cicilan.reduce(
            (a, b) => parseFloat(a) + parseFloat(b.jumlah),
            0,
          )
          // console.log('totalpiutangterbayar', totalpiutangterbayar)
          const tglpenjualan = new Date(x?.tgl).toISOString().split('T')[0]
          const dp = x?.bayar
          const diskon = x?.total_diskon
          const retur = x?.header_retur[0]?.subtotal ?? 0
          const sisaPiutang = Math.max(
            0,
            Math.round((totalpiutang - retur - dp - totalpiutangterbayar) * 100) / 100,
          )
          const datahutang = {
            id: x?.id,
            nopenjualan: x?.no_penjualan,
            pelanggan: x?.pelanggan?.nama ?? x?.keterangan?.nama,
            tglpenjualan: tglpenjualan,
            jumlahharitempo: x?.jml_tempo,
            tgljatuhtempo: x?.tempo,
            dp: dp,
            diskon: diskon,
            totalnota: totalpiutang - retur,
            totalpiutang: sisaPiutang,
            totalterbayang: totalpiutangterbayar + dp,
            yangakandibayar: sisaPiutang,
            sisajumlahbelumditerimax: sisaPiutang,
          }
          hasil.push(datahutang)
          // console.log('datahutangsa', datahutang)
        })
        const filteryanglunas = hasil.filter((item) => item.yangakandibayar >= 0.01)
        // console.log('totalpiutang', filteryanglunas)
        const urut = filteryanglunas.sort(
          (a, b) => new Date(a.tgljatuhtempo) - new Date(b.tgljatuhtempo),
        )
        this.items = urut
        // console.log('datahutangxx', this.items)
      },

      async simpan() {
        this.loadingsimpan = true
        try {
          const { data } = await api.post('/v1/transaksi/pembayaranpiutang/simpan', this.form)
          this.form.nopembayaran = data?.data[0]?.nopembayaran
          // console.log('this.form.nopembayaran', data?.data[0]?.nopembayaran)
          const nopenjualan = data?.nopenjualan
          // console.log('nopembayaran', data?.nopenjualan)
          const arr = this.items.filter((item) => item.nopenjualan !== nopenjualan)
          this.items = arr
          //  console.log('data', this.items)
          const list = useAdminListTransaksiPembayaranPiutangStore()
          list.olahdata(data?.data)
          list.rinci = data?.data[0]?.cicilan
          //  console.log('list.rinci', list.rinci)
          this.olahdatahutang(data?.newhutang)
          notifSuccess('Data berhasil disimpan')
          this.loadingsimpan = false
        } catch (error) {
          console.log(error)
          notifError(error?.response?.data?.message)
          this.loadingsimpan = false
        }
      },
    },
  },
)

if (import.meta.hot) {
  import.meta.hot.accept(
    acceptHMRUpdate(useAdminFormTransaksiPembayaranPiutangStore, import.meta.hot),
  )
}
