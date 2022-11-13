import { createApp, provide, h } from 'vue'
import stores from './stores'
import router from './router'
import i18n from './i18n'
import { createVuestic } from 'vuestic-ui'
import vuesticGlobalConfig from './services/vuestic-ui/global-config'
import { createGtm } from '@gtm-support/vue-gtm'
import { DefaultApolloClient } from '@vue/apollo-composable'
import axios from 'axios'
import App from './App.vue'

// *** Apollo client setup
import { ApolloClient, createHttpLink, InMemoryCache } from '@apollo/client/core'

// HTTP connection to the API
const cache = new InMemoryCache()
const apolloClient = new ApolloClient({
  link: createHttpLink({
    // You should use an absolute URL here
    uri: '/graphql',
  }),
  cache,
})

// *** Mount App
const app = createApp({
  setup() {
    provide(DefaultApolloClient, apolloClient)
  },
  render: () => h(App),
})

// *** Init axios client to auth server
import AuthService from './services/auth-service'
const axiosAuthInstance = axios.create({
  // baseURL: `${KEYCLOAK_URL}/realms/sentrics`, // new keycloak
  baseURL: `/auth/realms/silversphere`, // old keycloak
})
const authService = new AuthService(axiosAuthInstance)

// *** Init router with navigation Guard: Check if user is logged in and token is still valid, redirect to login page if not
router.beforeEach(async (to, from, next) => {
  let isAuthenticated = false

  // If there is no user info, token is invalid
  const userInfo = await authService.getUserInfo()
  if (userInfo) {
    isAuthenticated = true
  } else {
    authService.logout()
  }

  if (!isAuthenticated && to.name !== 'login') {
    next({ name: 'login' })
  } else {
    next()
  }
})

if (import.meta.env.VITE_APP_GTM_ENABLED) {
  app.use(
    createGtm({
      id: import.meta.env.VITE_APP_GTM_KEY,
      debug: false,
      vueRouter: router,
    }),
  )
}

app.provide('auth-service', authService)
app.use(stores)
app.use(i18n)
app.use(createVuestic({ config: vuesticGlobalConfig }))
app.use(router)
app.mount('#app')
