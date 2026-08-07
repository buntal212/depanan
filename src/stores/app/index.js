import { defineStore, acceptHMRUpdate } from 'pinia'

export const useAppStore = defineStore('app-store', {
  state: () => ({
    dark: true,
    auth: false
  }),
  persist: true,
  // getters: {
  //   doubleCount: (state) => state.counter * 2
  // },

  actions: {

    login(){
      return new Promise((resolve) => {
        this.auth = true
        resolve()
      })
    },
    logout() {
      return new Promise((resolve) => {
        this.auth = false
        resolve()
      })
    }
  }
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useAppStore, import.meta.hot))
}
