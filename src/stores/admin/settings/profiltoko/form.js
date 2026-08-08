import { defineStore, acceptHMRUpdate } from 'pinia'
import { api } from 'src/boot/axios'
import { notifSuccess, notifError } from 'src/modules/notifs'

export const useAdminSettingProfilTokoStore = defineStore('admin-setting-profil-toko-store', {
  state: () => ({
    form: {
      id: null,
      namatoko: null,
      pemilik: null,
      email: null,
      alamat: null,
      telepon: null,
      bio: null,
      foto: null, // Untuk menyimpan file atau path foto
    },
    loading: false,
  }),

  actions: {
    // Simpan data
    async save() {
      this.loading = true
      const formData = new FormData()

      // Append semua field kecuali foto
      Object.entries(this.form).forEach(([key, value]) => {
        if (key !== 'foto' && value !== null) {
          formData.append(key, value)
        }
      })

      // Handle foto dengan sangat eksplisit
      if (this.form.foto instanceof File) {
        formData.append('foto', this.form.foto)
        formData.append('is_new_foto', '1')
      } else if (this.form.foto) {
        // Pastikan tidak ada /storage/ yang dikirim ke backend
        const cleanPath = this.form.foto.replace(/^\/?storage\//, '')
        formData.append('foto_path', cleanPath)
        formData.append('is_new_foto', '0')
      }

      try {
        const { data } = await api.post('/v1/settings/profiltoko/save', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        })
        const cleanFotoPath = data.result.foto ? data.result.foto.replace('/storage/', '') : null
        this.form.foto = cleanFotoPath
        notifSuccess('Data berhasil disimpan')
        return data
      } catch (error) {
        // Error handling khusus
        if (error.response?.status === 422) {
          const errors = error.response.data.errors
          for (const key in errors) {
            notifError(errors[key][0])
          }
        } else {
          notifError(error.message || 'Gagal menyimpan data')
        }
        throw error
      } finally {
        this.loading = false
      }
    },

    // Ambil data
    async loadData() {
      this.loading = true
      try {
        const { data } = await api.get('/v1/settings/profiltoko/getprofil')
        this.form = {
          id: data.result.id || null,
          namatoko: data.result.namatoko || null,
          pemilik: data.result.pemilik || null,
          alamat: data.result.alamat || null,
          telepon: data.result.telepon || null,
          bio: data.result.bio || null,
          email: data.result.email || null, // Tambahkan field baru
        }
        this.form = {
          ...data.result,
          // Pastikan foto disimpan dalam format relatif
          foto: data.result.foto ? data.result.foto.replace('/storage/', '') : null,
        }
      } catch (err) {
        console.error('Gagal memuat data:', err)
        notifError('Gagal memuat data')
        throw err
      } finally {
        this.loading = false
      }
    },
  },
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useAdminSettingProfilTokoStore, import.meta.hot))
}
