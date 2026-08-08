import { defineBoot } from '#q-app/wrappers'
import axios from 'axios'
import { useAppStore } from 'src/stores/app'

// const SERV = 'http://localhost:8182'
const SERV = process.env.API
const base = SERV

// console.log('boot', base);
// base = storage.getApp('app-store') ? storage.getApp('app-store').ipserver : ''
const token = JSON.parse(localStorage.getItem('token')) ?? null
const api = axios.create({ baseURL: base + '/api' })

// function setBase(url) {
//   api = axios.create({ baseURL: url + '/api' })
// }

api.defaults.headers.get.Accepts = 'application/json'
api.defaults.headers.common.Authorization = `Bearer ${token}`
//......................asli....//
// function setToken(tokentok) {
//   api.defaults.headers.common.Authorization = `Bearer ${tokentok}`
// }

api.interceptors.response.use(
  (response) => {
    // Update last active time on successful requests
    localStorage.setItem('activeTime', new Date().toString())
    return response
  },
  async (error) => {
    // Handle 401 Unauthorized errors
    if (error.response?.status === 401) {
      const app = useAppStore()
      console.log('error 401', error)
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      localStorage.removeItem('activeTime')

      // Cek apakah user sudah logout untuk mencegah logout berulang
      if (app.auth) {
        // Tandai bahwa proses logout sedang berlangsung
        if (!app.isLoggingOut) {
          app.isLoggingOut = true
          await app.logout()
          app.isLoggingOut = false
        }
      }

      return Promise.reject(new Error('Session expired. Please login again.'))
    }
    return Promise.reject(error)
  },
)

const setToken = (token) => {
  api.defaults.headers.common['Authorization'] = `Bearer ${token}`
}
const deleteToken = () => delete api.defaults.headers.common['Authorization']

const pathImg = SERV + '/storage/'
export default defineBoot(({ app }) => {
  app.config.globalProperties.$SERV = SERV
  app.config.globalProperties.$axios = axios
  app.config.globalProperties.$pathImg = pathImg
  app.config.globalProperties.$api = api
})

export { api, pathImg, axios, setToken, deleteToken, SERV }
