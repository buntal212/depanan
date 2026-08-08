import { defineStore, acceptHMRUpdate } from 'pinia'
import { api } from 'src/boot/axios'
import { notifError, notifSuccess } from 'src/modules/notifs'

export const useAdminMasterPegawaiStore = defineStore('admin-master-pegawai-store', {
  state: () => ({
    meta: null,
    items: [],
    itemsset: [],
    isError: false,
    loading: false,
    loadingsetting: false,
    params: {
      q: null,
      page: 0,
      per_page: 15,
    },
    payload: {
      q: '',
    },
    hakakses: [],
    itemssubmenu: [],
  }),
  // persist: true,
  // getters: {
  //   doubleCount: (state) => state.counter * 2
  // },

  actions: {
    async getList() {
      // console.log('get master barang page', this.params.page);
      this.params.page = 1
      this.isError = false
      this.loading = true
      const params = {
        params: this.params,
      }
      try {
        const { data } = await api.get('/v1/master/users/getdata', params)
        console.log('get Pegawai', data)
        this.meta = data
        this.items = data?.data
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
          .get('/v1/master/users/getdata', params)
          .then(({ data }) => {
            console.log('get master pegawai', data)
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
    async deleteItem(id) {
      this.items = this.items.filter((item) => item.id !== id)
      const params = { id }
      try {
        const resp = await api.post(`/v1/master/users/delete`, params)
        console.log('delete', resp)
        if (resp.status === 200) {
          const newArr = this.items?.filter((item) => item?.id !== id)
          this.items = newArr

          notifSuccess('Data berhasil dihapus')
        }
      } catch (error) {
        console.log('del Pegawai error', error)
        notifError('Terjadi Kesalahan')
      }
    },

    async getListsetting() {
      this.loadingsetting = true
      // const params = {
      //   params: this.payload,
      // }
      try {
        const { data } = await api.get('/v1/master/users/getdatasetiing')
        this.itemsset = data
        this.loadingsetting = false
      } catch (error) {
        console.log(error)
        this.isError = true
        this.loadingsetting = false
      }
    },

    async olah(val) {
      console.log('val', val)
      this.hakakses = []
      const rowmenu = val.hakakses.map((menu) => menu.menu_id)
      console.log('rowmenu', rowmenu)
      const menu = [...new Set(rowmenu)]
        .map((x) => val.hakakses.find((f) => f.menu_id === x)?.menus)
        .sort((a, b) => a.urut - b.urut)
      console.log('menu', menu)
      if (menu.length > 0) {
        menu.forEach((x) => {
          const subs = val.hakakses.filter((f) => f.menu_id === x.id).flatMap((menu) => menu.subs)

          if (subs.length > 0 && subs[0] !== null) {
            x.subs = subs
          } else {
            x.subs = []
          }
        })
      }

      this.hakakses = menu
      console.log('hakakses', this.hakakses)
    },

    async submenu() {
      try {
        const { data } = await api.get('/v1/master/users/getmenu')
        this.itemssubmenu = data
      } catch (error) {
        console.log(error)
        this.isError = true
      }
    },
  },
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useAdminMasterPegawaiStore, import.meta.hot))
}
