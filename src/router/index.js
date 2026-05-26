import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('../views/LoginView.vue'),
    meta: { public: true },
  },
  {
    path: '/register',
    name: 'Register',
    component: () => import('../views/RegisterView.vue'),
    meta: { public: true },
  },
  {
    path: '/',
    component: () => import('../components/AppLayout.vue'),
    redirect: '/dashboard',
    children: [
      { path: 'dashboard', name: 'Dashboard', component: () => import('../views/DashboardView.vue') },
      { path: 'lists', name: 'Lists', component: () => import('../views/ListsView.vue') },
      { path: 'lists/:id', name: 'ListDetail', component: () => import('../views/ListDetailView.vue') },
      { path: 'domains', name: 'Domains', component: () => import('../views/DomainsView.vue') },
      { path: 'moderation', name: 'Moderation', component: () => import('../views/ModerationView.vue') },
      { path: 'templates', name: 'Templates', component: () => import('../views/TemplatesView.vue') },
      { path: 'users', name: 'Users', component: () => import('../views/UsersView.vue') },
      { path: 'profile', name: 'Profile', component: () => import('../views/ProfileView.vue') },
      { path: 'settings', name: 'Settings', component: () => import('../views/SettingsView.vue') },
    ],
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('access_token')
  if (!to.meta.public && !token) {
    next('/login')
  } else {
    next()
  }
})

export default router
