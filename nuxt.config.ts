import { fileURLToPath } from 'url'

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
	future: { compatibilityVersion: 4 },
	modules: [
		'@nuxthub/core',
		'nuxt-auth-utils',
		'@vueuse/nuxt',
		'nuxt-svgo',
		'@nuxt/ui-pro'
	],
	ssr: false,
	hub: {
		database: true
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

	runtimeConfig: {
		public: {
			helloText: 'Hello from the Edge 👋'
		}
	},

	extends: ['app/features/auth', 'app/features/children'],
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
		'@auth': fileURLToPath(new URL('app/features/auth', import.meta.url)),
		'@children': fileURLToPath(
			new URL('app/features/children', import.meta.url)
		),
		'@lib': fileURLToPath(new URL('./lib', import.meta.url))
	},

	devtools: { enabled: true },

	compatibilityDate: '2025-01-05'
})
