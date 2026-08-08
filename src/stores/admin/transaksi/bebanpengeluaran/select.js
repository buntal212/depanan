import { defineStore, acceptHMRUpdate } from 'pinia'
import { api } from 'src/boot/axios'

export const useSelectBebanStore = defineStore('admin-select-beban-store', {
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
    expand: false,
    dialog: false,
  }),
  // persist: true,
  // getters: {
  //   doubleCount: (state) => state.counter * 2
  // },

  actions: {
    setExpand() {
      this.expand = !this.expand
    },
    async getList() {
      // console.log('get master barang page', this.params.page);
      this.params.page = 1
      this.isError = false
      this.loading = true
      const params = {
        params: this.params,
      }
      try {
        const { data } = await api.get('/v1/master/select/master-beban', params)
        // console.log('get master beban', data)
        this.meta = data
        this.items = data
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
          .get('/v1/master/select/master-beban', params)
          .then(({ data }) => {
            console.log('get Data Beban', data)
            this.meta = data
            this.items.push(...data)

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
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useSelectBebanStore, import.meta.hot))
}
