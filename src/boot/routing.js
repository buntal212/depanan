import { defineBoot } from '#q-app/wrappers'
import { useAppStore } from 'src/stores/app'
import * as storage from 'src/modules/storage'

export default defineBoot(({ router, store }) => {
  console.groupCollapsed('[boot routing]')
  // console.log('router', router)
  const app = useAppStore(store)

  router.beforeEach((to, from, next) => {
    const token = storage.getLocalToken()
    const user = storage.getUser()
    const requireAuth = to.matched.some((route) => route.meta.requireAuth)

    const isTokenExpired = () => {
      const activeTime = localStorage.getItem('activeTime')
      if (activeTime) {
        const lastActive = new Date(activeTime)
        const now = new Date()
        const hoursDiff = (now - lastActive) / (1000 * 60 * 60)
        return hoursDiff > 24
      }
      return false
    }

    if (token && user && !app.auth) {
      app.restoreSession(token, user)
    }

    if (requireAuth) {
      if (!token || !user) {
        next({ path: '/auth' })
        return
      }

      if (isTokenExpired()) {
        // Bersihkan session terlebih dahulu agar guard tidak berputar:
        // / -> /auth -> / -> /auth ketika request logout backend macet.
        localStorage.removeItem('token')
        localStorage.removeItem('user')
        localStorage.removeItem('activeTime')
        storage.deleteHeaderToken()
        app.auth = false
        app.token = null
        app.user = null
        app.stopInactivityTimer()
        next({ path: '/auth' })
        return
      }
    } else if (token && to.path === '/auth') {
      next({ path: '/' })
      return
    }

    next()
  })
})
