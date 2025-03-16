import { fileURLToPath } from 'url'

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
	future: { compatibilityVersion: 4 },
	modules: [
		'@nuxthub/core',
		'@pinia/nuxt',
		[
			'nuxt-auth-utils',
			{
				// Enable CSRF protection
				enableCSRFProtection: true,
				// Cookie settings
				cookie: {
					name: 'marbles_session',
					lifetime: 60 * 60 * 24 * 7, // 1 week
					secure: process.env.NODE_ENV === 'production',
					sameSite: 'lax'
				}
			}
		],
		'@nuxt/ui-pro',
		'@vueuse/nuxt',
		'nuxt-svgo'
	],
	hub: {
		database: true
	},
	svgo: {
		autoImportPath: './assets/icons/'
	},

	css: ['@/assets/css/main.css'],
	uiPro: {
		mdc: true,
		license: process.env.NUXT_UI_PRO_LICENSE
	},
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
			'/sse': { ssr: false },
			'/api/websocket': {
				ssr: false,
				headers: {
					'Access-Control-Allow-Origin': '*',
					'Access-Control-Allow-Methods': 'GET,HEAD,PUT,PATCH,POST,DELETE',
					'Access-Control-Allow-Headers': 'Content-Type, Authorization'
				}
			}
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
