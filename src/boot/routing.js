import { defineBoot } from '#q-app/wrappers'
import { useAppStore } from 'src/stores/app'

export default defineBoot(({ router, store }) => {
  console.groupCollapsed('[boot routing]')
  console.log('router',router);
  const app = useAppStore(store);
  
  router.beforeEach((to, from, next) => {

    const isAuth = app?.auth
    console.log('auth from store',isAuth);
    const requireAuth = to.matched.some(route => route.meta.requireAuth)
    // Now you need to add your authentication logic here, like calling an API endpoint
    // console.log('beforeEach',to, from, next);
    if (requireAuth && !isAuth) {
      next({ path: '/auth' })
    }
    else if (!requireAuth && isAuth) {
      next({ path: '/' })
    }
    else {
      next()
    }
    
  })

  router.onError((error, to) => {
    if (error.message.includes('Failed to fetch dynamically imported module')) {
      window.location = to.fullPath
    }
  })

  console.groupEnd()
})