import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'url'
import VueI18nPlugin from '@intlify/vite-plugin-vue-i18n'

export default ({ mode }: any) => {
  process.env = { ...process.env, ...loadEnv(mode, process.cwd()) }
  const GRAPHQL_URL = process.env.VITE_GRAPHQL_URL
  const KEYCLOAK_URL = process.env.VITE_KEYCLOAK_URL

  return defineConfig({
    plugins: [
      vue(),
      VueI18nPlugin({
        include: resolve(dirname(fileURLToPath(import.meta.url)), './src/i18n/locales/**'),
      }),
    ],
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
      },
    },
    server: {
      host: true,
      proxy: {
        '/graphql': {
          target: GRAPHQL_URL,
          changeOrigin: true,
          secure: false,
        },
        '/auth': {
          target: KEYCLOAK_URL,
          changeOrigin: true,
          secure: false,
        },
      },
    },
  })
}
