import { acceptHMRUpdate, defineStore } from 'pinia'
import { api } from 'src/boot/axios'
import { pathImg } from 'src/boot/axios'

export const useProfilStore = defineStore('profil-toko-store', {
  state: () => ({
    profilData: null, // Simpan data profil utama di sini
    loading: false,
  }),

  getters: {
    fotoProfil: (state) => {
      if (!state.profilData?.foto) return null

      // Format 1: Jika foto sudah mengandung full URL (http://...)
      if (state.profilData.foto.startsWith('http')) {
        return state.profilData.foto
      }

      // Format 2: Jika foto dimulai dengan /storage/
      if (state.profilData.foto.startsWith('/storage/')) {
        return `${pathImg}${state.profilData.foto.replace('/storage/', '')}`
      }
      console.log('foto', `${pathImg}${state.profilData.foto}`)
      // Format 3: Jika foto hanya berisi path relatif
      return `${pathImg}${state.profilData.foto}`
    },
  },

  actions: {
    async getProfil() {
      //this.loading = true
      try {
        const { data } = await api.get('/v1/settings/profiltoko/getprofil')
        this.profilData = data.result || data

        // Debugging
        // console.log('Data profil:', this.profilData)
        // console.log('Foto path:', this.profilData?.foto)
        // console.log('Foto URL:', this.fotoProfil)
      } catch (error) {
        console.error('Error fetching profil:', error)
      } finally {
        // this.loading = false
      }
    },
  },
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useProfilStore, import.meta.hot))
}
