import { defineStore, acceptHMRUpdate } from 'pinia'
import { api } from 'src/boot/axios'

export const useAdminListTransaksiStokBarangStore = defineStore(
  'admin-list-transaksi-stokbarang-store',
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
      },
      getorderan: {
        noorder: null,
      },
      getorderhasil: [],
    }),
    // persist: true,
    // getters: {
    //   doubleCount: (state) => state.counter * 2
    // },

    actions: {
      async getList() {
        // console.log('get master barang')
        this.items = []
        this.params.page = 1
        this.isError = false
        this.loading = true
        const params = {
          params: this.params,
        }
        try {
          const { data } = await api.get('/v1/transaksi/stok/lihatstok', params)
          console.log('get master barang', data)
          this.meta = data
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

        console.log('load more', index)

        return new Promise((resolve) => {
          api
            .get('/v1/transaksi/stok/lihatstok', params)
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
  import.meta.hot.accept(acceptHMRUpdate(useAdminListTransaksiStokBarangStore, import.meta.hot))
}
