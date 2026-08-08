import { defineStore } from 'pinia'
import { date } from 'quasar'
import { api } from 'src/boot/axios'
import { notifSuccess } from 'src/modules/notifs'

export const useAdminMasterFormHariLibur = defineStore('admin-master-form-harilibur', {
  state: () => ({
    items: [],
    loading: false,
    isError: false,
    form: {
      tgl: date.formatDate(Date.now(), 'YYYY-MM-DD'),
      keterangan: '',
    },
    dateDisplay: {
      tgl: date.formatDate(Date.now(), 'DD MMMM YYYY'),
    },
  }),
  actions: {
    save() {
      this.isError = false
      this.loading = true
      return new Promise((resolve, reject) => {
        api
          .post('/v1/master/harilibur/savedata', this.form)
          .then(({ data }) => {
            this.items = data?.data
            this.initReset()
            notifSuccess(data?.message)
            this.loading = false
          })
          .catch((err) => {
            this.loading = false
            reject(err)
          })
      })
    },
    initReset() {
      this.form.keterangan = ''
    },
  },
})
