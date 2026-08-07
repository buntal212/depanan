import { defineBoot } from '#q-app/wrappers'
import axios from 'axios'

const SERV = 'http://localhost:8182'
const base = SERV


// let api = null
let token = null

// console.log('boot', base);
// base = storage.getApp('app-store') ? storage.getApp('app-store').ipserver : ''
// token = storage.getApp('auth-store') ? storage.getApp('auth-store').token : ''

const api = axios.create({ baseURL: base + '/api' })

// function setBase(url) {
//   api = axios.create({ baseURL: url + '/api' })
// }

api.defaults.headers.get.Accepts = 'application/json'
api.defaults.headers.common.Authorization = `Bearer ${token}`

function setToken (tokentok) {
  api.defaults.headers.common.Authorization = `Bearer ${tokentok}`
}

const deleteToken = () => delete api.defaults.headers.common.Authorization


export default defineBoot(({ app }) => {


  app.config.globalProperties.$SERV = SERV
  app.config.globalProperties.$axios = axios

  app.config.globalProperties.$api = api
})

export { api, axios, setToken, deleteToken, SERV }
