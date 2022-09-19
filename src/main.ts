import { createApp, provide, h } from 'vue'
import stores from './stores'
import router from './router'
import i18n from './i18n'
import { createVuestic } from 'vuestic-ui'
import vuesticGlobalConfig from './services/vuestic-ui/global-config'
import { createGtm } from '@gtm-support/vue-gtm'
import App from './App.vue'

// Apollo client setup
import { ApolloClient, createHttpLink, InMemoryCache } from '@apollo/client/core'

// const graphQLServer = 'http://192.168.100.77:1234/192.168.100.77:5000/graphql' // cors-proxy to the GraphQL API
// const graphQLServer = 'http://192.168.100.66:5000/graphql' // directly to the GraphQL API
const graphQLServer = 'http://localhost:4008/graphql' // mock server

// HTTP connection to the API
const httpLink = createHttpLink({
  // You should use an absolute URL here
  uri: graphQLServer,
})

// Cache implementation
const cache = new InMemoryCache()

// Create the apollo client
const apolloClient = new ApolloClient({
  link: httpLink,
  cache,
})

// Mount App
import { DefaultApolloClient } from '@vue/apollo-composable'

const app = createApp({
  setup() {
    provide(DefaultApolloClient, apolloClient)
  },

  render: () => h(App),
})

app.use(stores)
app.use(router)
app.use(i18n)
app.use(createVuestic({ config: vuesticGlobalConfig }))

if (import.meta.env.VITE_APP_GTM_ENABLED) {
  app.use(
    createGtm({
      id: import.meta.env.VITE_APP_GTM_KEY,
      debug: false,
      vueRouter: router,
    }),
  )
}

app.mount('#app')
