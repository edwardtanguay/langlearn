import env from "./app/lib/env";
import { defineNuxtConfig } from 'nuxt/config';

export default defineNuxtConfig({
	compatibilityDate: '2025-07-15',
	devtools: { enabled: true },

	modules: ['@nuxt/ui', '@nuxtjs/color-mode', '@nuxtjs/kinde'],
	icon: {
		serverBundle: 'remote'
	},
	colorMode: {
		preference: 'dark',
		classSuffix: ''
	},
	devServer: {
		port: 3149
	},
	app: {
		pageTransition: { name: 'page', mode: 'out-in' },
		head: {
			title: 'LangLearn',
			meta: [
				{ name: 'description', content: 'LangLearn is an interactive platform used to learn 10 languages.' }
			],
			link: [
				{ rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' }
			]
		}
	},
	css: ['~/assets/css/main.css'],
	postcss: {
		plugins: {
			'@tailwindcss/postcss': {},
			autoprefixer: {}
		}
	},
	nitro: {
		esbuild: {
			options: {
				target: 'es2022'
			}
		}
	},
	runtimeConfig: {
		public: {
			nodeEnv: env.NODE_ENV,
			showColorModeToggle: process.env.NUXT_PUBLIC_SHOW_COLOR_MODE_TOGGLE === 'true',
			showDevPanel: process.env.NUXT_PUBLIC_SHOW_DEV_PANEL === 'true',
			showDevPage: process.env.NUXT_PUBLIC_SHOW_DEV_PAGE === 'true'
		}
	}
})

