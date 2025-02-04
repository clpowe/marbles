// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
	future: { compatibilityVersion: 4 },

	modules: [
		'@nuxthub/core',
		'@pinia/nuxt',
		'nuxt-auth-utils',
		'@nuxt/ui-pro',
		'@vueuse/nuxt'
	],

	hub: {
		database: true
	},

	css: ['~/assets/css/main.css'],
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

	nitro: {
		routeRules: {
			'/sse': { ssr: false }
		},
		scanDirs: ['features'],
		experimental: {
			tasks: true
		}
	},
	hooks: {
		'components:dirs': (dirs) => {
			dirs.push({
				path: '@auth/components'
			})
			dirs.push({
				path: '@children/components'
			})
		}
	},

	alias: {
		'@auth': '@@/features/auth',
		'@children': '@@/features/children'
	},

	devtools: { enabled: true },

	compatibilityDate: '2025-01-05'
})
