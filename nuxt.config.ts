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
    bindings: {
      compatibilityDate: "2025-10-08",
      compatibilityFlags: ['nodejs_compat_v2']
    },
    database: true,
    workers: true,
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
    cloudflare: {
      deployConfig: true,
      nodeCompat: true
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
  compatibilityDate: "2025-10-08",
  devtools: { enabled: true },

})
