// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
	future: { compatibilityVersion: 4 },

	modules: [
		'@nuxthub/core',
		'@formkit/nuxt',
		'@pinia/nuxt',
		'nuxt-auth-utils',
		'@nuxt/ui',
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
		experimental: {
			tasks: true
		}
	},

	formkit: {
		autoImport: true
	},

	devtools: { enabled: true },

	compatibilityDate: '2025-01-05'
})
