import { defineStore } from 'pinia'
import { api } from 'src/boot/axios'

export const useAdminMasterListHariLibur = defineStore('admin-master-list-harilibur', {
  state: () => ({
    items: [],
    params: {
      q: null,
      page: 0,
      per_page: 15,
    },
  }),
  actions: {
    async getList() {
      this.params.page = 1
      this.isError = false
      this.loading = true
      const params = {
        params: this.params,
      }
      try {
        const { data } = await api.get('/v1/master/harilibur/listdata', params)
        //this.meta = data
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

      return new Promise((resolve) => {
        api
          .get('/v1/master/harilibur/listdata', params)
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
})
