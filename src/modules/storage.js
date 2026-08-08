import { deleteToken, setToken } from 'src/boot/axios'

export const setHeaderToken = (token) => {
  return new Promise((resolve, reject) => {
    try {
      setToken(token)
      resolve(token)
    } catch (error) {
      reject(error)
    }
  })
}

export const setLocalToken = (token) => localStorage.setItem('token', JSON.stringify(token))
export const getLocalToken = () => JSON.parse(localStorage.getItem('token'))

export const setUser = (user) => {
  return new Promise((resolve, reject) => {
    try {
      localStorage.setItem('user', JSON.stringify(user))
      resolve(user)
    } catch (error) {
      reject(error)
    }
  })
}

export const getUser = () => JSON.parse(localStorage.getItem('user'))
export const deleteHeaderToken = () => deleteToken()
export const deleteLocalToken = () => localStorage.removeItem('token')
export const isBlocked = () => localStorage.getItem('blocked') === 'true'
export const setBlocked = (value) => localStorage.setItem('blocked', JSON.stringify(value))
export const deleteUser = () => localStorage.removeItem('user')
