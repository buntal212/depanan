const routes = [
  // Admin Routes
  {
    path: '/',
    meta: { requireAuth: true },
    component: () => import('layouts/AdminLayout.vue'),
    children: [
      { path: '', redirect: '/admin/dashboard' },
      { path: '/admin/dashboard', component: () => import('pages/admin/dashboard/IndexPage.vue') },

      // Master
      {
        path: '/admin/master/barang',
        component: () => import('pages/admin/master/barang/IndexPage.vue'),
      },
      {
        path: '/admin/master/pegawai',
        component: () => import('pages/admin/master/pegawai/IndexPage.vue'),
      },
      {
        path: '/admin/master/satuan',
        component: () => import('pages/admin/master/satuan/IndexPage.vue'),
      },
      {
        path: '/admin/master/pelanggan',
        component: () => import('pages/admin/master/pelanggan/IndexPage.vue'),
      },
      {
        path: '/admin/master/supplier',
        component: () => import('pages/admin/master/supplier/IndexPage.vue'),
      },

      //Transaksi
      {
        path: '/admin/transaksi/orderbarang',
        component: () => import('pages/admin/transaksi/orderbarang/IndexPage.vue'),
      },

      // profile
      { path: '/admin/profile', component: () => import('pages/admin/profile/IndexPage.vue') },
    ],
  },

  // Auth Routes
  {
    path: '/auth',
    meta: { requireAuth: false },
    component: () => import('layouts/AuthLayout.vue'),
    children: [{ path: '', component: () => import('pages/auth/IndexPage.vue') }],
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue'),
  },
]

export default routes
