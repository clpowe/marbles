import { fileURLToPath } from 'url'

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  future: { compatibilityVersion: 4 },
  modules: [
    '@nuxthub/core',
    '@vueuse/nuxt',
    'nuxt-svgo'
  ],

  hub: {
    database: true,
    workers: true
  },
  svgo: {
    autoImportPath: './assets/icons/'
  },

  css: ['@/assets/css/main.css'],
  $development: {
    hub: {
      remote: true
    }
  },

  nitro: {
    routeRules: {
      '/sse': { ssr: false }
    },
    experimental: {
      websocket: true,
      tasks: true
    }
  },

  typescript: {
    tsConfig: {
      compilerOptions: {
        baseUrl: './'
      }
    }
  },

  alias: {
    '@': './app',
    '@server': fileURLToPath(new URL('./server', import.meta.url)),
    '@lib': fileURLToPath(new URL('./lib', import.meta.url))
  },

  devtools: { enabled: true },

})
