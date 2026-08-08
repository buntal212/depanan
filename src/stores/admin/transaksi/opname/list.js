import { defineStore, acceptHMRUpdate } from 'pinia'
import { date } from 'quasar'
import { api } from 'src/boot/axios'

export const useAdminListTransaksiStokOpnameStore = defineStore(
  'admin-list-transaksi-stok-opname-store',
  {
    state: () => ({
      meta: null,
      items: [],
      isError: false,
      loading: false,
      params: {
        q: null,
        page: 0,
        per_page: 15,
        bulan: date.formatDate(Date.now(), 'MM'),
        tahun: date.formatDate(Date.now(), 'YYYY'),
      },
      optionBulan:[
        { label: 'Januari', value: '01' },
        { label: 'Februari', value: '02' },
        { label: 'Maret', value: '03' },
        { label: 'April', value: '04' },
        { label: 'Mei', value: '05' },
        { label: 'Juni', value: '06' },
        { label: 'Juli', value: '07' },
        { label: 'Agustus', value: '08' },
        { label: 'September', value: '09' },
        { label: 'Oktober', value: '10' },
        { label: 'November', value: '11' },
        { label: 'Desember', value: '12' },
      ]

    }),
    // persist: true,
    // getters: {
    //   doubleCount: (state) => state.counter * 2
    // },

    actions: {
      init(){
        const now = new Date();
        const month = now.getMonth(); // getMonth() = 0 untuk Jan, jadi ini sudah otomatis "bulan kemarin"
        const lastMonth = month === 0 ? '01' : (month<10 ? '0' + month : month.toString()) // jika bulan = 0 (Jan), maka bulan kemarin = 11 (Des)
        this.params.bulan = lastMonth

      },
      async getList() {
        console.log('get master barang')
        this.items = []
        this.params.page = 1
        this.isError = false
        this.loading = true
        const params = {
          params: this.params,
        }
        try {
          const { data } = await api.get('/v1/transaksi/opname/list', params)
          console.log('get master barang', data)
          this.meta = data?.meta
          this.items = data?.data
          console.log('items', this.items)
          this.loading = false
          // this.items = data
        } catch (error) {
          console.log(error)
          this.isError = true
          this.loading = false
        }
      },

      loadMore(index, done) {
        this.isError = false
        this.params.page = index
        const params = {
          params: this.params,
        }


        return new Promise((resolve) => {
          api
            .get('/v1/transaksi/opname/list', params)
            .then(({ data }) => {
              this.meta = data
              this.items.push(...data.data)
              done()
              resolve()
            })
            .catch(() => {
              this.isError = true
              done(true)
              resolve()
            })
        })
      },
    },
  },
)

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useAdminListTransaksiStokOpnameStore, import.meta.hot))
}
