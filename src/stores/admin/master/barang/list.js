import { defineStore, acceptHMRUpdate } from 'pinia'
import { date } from 'quasar'
import { api } from 'src/boot/axios'
import { notifError, notifSuccess } from 'src/modules/notifs'

export const useAdminMasterBarangStore = defineStore('admin-master-barang-store', {
  state: () => ({
    meta: null,
    items: [],
    isError: false,
    loading: false,
    dialogFilter: false,
    dialogKartu: false,
    image: '',
    params: {
      x: null,
      q: null,
      page: 0,
      per_page: 15,
      minim_stok: 0,
      bulan: date.formatDate(Date.now(), 'MM'),
      tahun: date.formatDate(Date.now(), 'YYYY'),
    },
    expand: false,
    filterstok: [
      { label: 'Low Stock', value: 1 },
      { label: 'Safety Stock', value: 2 },
      { label: 'All Stock', value: 0 },
    ],
    pilihbulan: [
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
    ],
    kartuStok: [],
    selectkartuStok: [],
    selectedKodebarang: null,
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
      this.params.page = 1
      this.isError = false
      this.loading = true

      try {
        const { data } = await api.get('/v1/master/barang/listbarang', {
          params: {
            ...this.params,
            kodebarang: this.selectedKodebarang || null,
          },
        })
        console.log('get master barang', data)

        this.meta = data
        this.items = data?.data || []

        this.updateKartuStok()
        this.loading = false
      } catch (error) {
        console.log(error)
        this.isError = true
        this.loading = false
      }
    },

    // loadMore(index, done) {
    //   this.isError = false
    //   this.params.page = index
    //   const params = {
    //     params: this.params,
    //   }

    //   console.log('load more', index)

    //   return new Promise((resolve) => {
    //     api
    //       .get('/v1/master/barang/listbarang', params)
    //       .then(({ data }) => {
    //         console.log('get master barangxxxx', data.data)
    //         this.meta = data
    //         this.items.push(...data.data)

    //         done()
    //         resolve()
    //       })
    //       .catch(() => {
    //         this.isError = true
    //         done(true)
    //         resolve()
    //       })
    //   })
    // },

    loadMore(index, done) {
      this.isError = false
      this.params.page = index

      api
        .get('/v1/master/barang/listbarang', { params: this.params })
        .then(({ data }) => {
          this.meta = data

          if (index === 1) {
            this.items = data.data
          } else {
            this.items = [...this.items, ...data.data]
          }

          this.updateKartuStok()
          done(!data.next_page_url)
        })
        .catch(() => {
          this.isError = true
          done(true)
        })
    },

    updateKartuStok() {
      console.log('select barang', this.selectedKodebarang)

      if (this.selectedKodebarang) {
        const selected = this.items.find((x) => x.kodebarang === this.selectedKodebarang)

        if (selected) {
          this.kartuStok = {
            ...selected,
            transaksi: this.cariTotalArray(selected.transaksi || []),
          }
          console.log('arr kartustok', this.kartuStok)
        } else {
          this.kartuStok = null
          console.log('Tidak ditemukan item dengan kodebarang:', this.selectedKodebarang)
        }
      } else {
        this.kartuStok = null
        console.log('selectedKodebarang belum diatur')
      }
    },
    async deleteItem(id) {
      this.items = this.items.filter((item) => item.id !== id)
      const params = { id }
      try {
        const resp = await api.post(`/v1/master/barang/deletebarang`, params)
        // console.log('delete',resp);
        if (resp.status === 200) {
          const newArr = this.items?.filter((item) => item?.id !== id)
          this.items = newArr

          notifSuccess('Data berhasil dihapus')
        }
      } catch (error) {
        console.log('del brg error', error)
        notifError('Terjadi Kesalahan')
      }
    },
    getKartuStok() {
      const arr = this.items
      // console.log('arr', this.kartuStok?.kodebarang)
      console.log('x', arr)
    },

    cariTotalArray(arr) {
      let total = 0
      if (arr?.length) {
        for (let i = 0; i < arr?.length; i++) {
          if (i === 0) {
            total = arr[0]?.debit - arr[0]?.kredit
            arr[0].total = total
          } else {
            const hinggaKeIndex = i + 1
            const arrBaru = arr.slice(1, hinggaKeIndex)
            const awal = arr[0]?.debit - arr[0]?.kredit
            // const subT = arr[i]?.penerimaan - arr[i]?.pengeluaran;
            const obj = arrBaru.map((x) => x.debit - x.kredit)
            const skrg = obj?.reduce((x, y) => x + y, 0)
            arr[i].total = awal + skrg
          }
        }
      }
      return arr
    },
  },
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useAdminMasterBarangStore, import.meta.hot))
}
