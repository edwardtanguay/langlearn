import env from "./app/lib/env";
import { defineNuxtConfig } from 'nuxt/config';

const isProd = process.env.NODE_ENV === 'production';

export default defineNuxtConfig({
	compatibilityDate: '2025-07-15',
	devtools: { enabled: true },

	modules: ['@nuxt/ui', '@nuxtjs/color-mode', '@nuxtjs/kinde'],
	kinde: {
		redirectURL: isProd
			? (process.env.NUXT_KINDE_REDIRECT_URL && !process.env.NUXT_KINDE_REDIRECT_URL.includes('localhost') ? process.env.NUXT_KINDE_REDIRECT_URL : 'https://langlearn.tanguay.eu/api/callback')
			: (process.env.NUXT_KINDE_REDIRECT_URL || 'http://localhost:3149/api/callback'),
		logoutRedirectURL: isProd
			? (process.env.NUXT_KINDE_LOGOUT_REDIRECT_URL && !process.env.NUXT_KINDE_LOGOUT_REDIRECT_URL.includes('localhost') ? process.env.NUXT_KINDE_LOGOUT_REDIRECT_URL : 'https://langlearn.tanguay.eu')
			: (process.env.NUXT_KINDE_LOGOUT_REDIRECT_URL || 'http://localhost:3149'),
		postLoginRedirectURL: isProd
			? (process.env.NUXT_KINDE_POST_LOGIN_REDIRECT_URL && !process.env.NUXT_KINDE_POST_LOGIN_REDIRECT_URL.includes('localhost') ? process.env.NUXT_KINDE_POST_LOGIN_REDIRECT_URL : 'https://langlearn.tanguay.eu')
			: (process.env.NUXT_KINDE_POST_LOGIN_REDIRECT_URL || 'http://localhost:3149')
	},
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
				{ name: 'description', content: 'LangLearn is an interactive platform with focused 3D flashcards, smart rank algorithms, pronunciation training, and curated practice in 10 languages.' },
				{ property: 'og:site_name', content: 'LangLearn' },
				{ property: 'og:title', content: 'LangLearn - Practice & Test Language Flashcards' },
				{ property: 'og:description', content: 'Interactive language learning platform with focused 3D flashcards, smart rank algorithms, and curated practice in 10 languages.' },
				{ property: 'og:type', content: 'website' },
				{ property: 'og:url', content: 'https://langlearn.tanguay.eu' },
				{ property: 'og:image', content: 'https://langlearn.tanguay.eu/og-image.jpg' },
				{ property: 'og:image:width', content: '1200' },
				{ property: 'og:image:height', content: '675' },
				{ property: 'og:image:alt', content: 'LangLearn Flashcard Practice Platform' },
				{ name: 'twitter:card', content: 'summary_large_image' },
				{ name: 'twitter:title', content: 'LangLearn - Practice & Test Language Flashcards' },
				{ name: 'twitter:description', content: 'Interactive language learning platform with focused 3D flashcards, smart rank algorithms, and curated practice in 10 languages.' },
				{ name: 'twitter:image', content: 'https://langlearn.tanguay.eu/og-image.jpg' }
			],
			link: [
				{ rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' },
				{ rel: 'canonical', href: 'https://langlearn.tanguay.eu' }
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
			bypassAuth: process.env.NUXT_PUBLIC_BYPASS_AUTH === 'true',
			showColorModeToggle: process.env.NUXT_PUBLIC_SHOW_COLOR_MODE_TOGGLE === 'true',
			showDevPanel: process.env.NUXT_PUBLIC_SHOW_DEV_PANEL === 'true',
			showDevPage: process.env.NUXT_PUBLIC_SHOW_DEV_PAGE === 'true'
		}
	}
})

// Pronunciation route registered
