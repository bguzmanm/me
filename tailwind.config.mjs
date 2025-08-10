/** @type {import('tailwindcss').Config} */
export default {
	content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
	theme: {
		container: {
			center: true,
			padding: '1rem',
			screens: {
				sm: '540px',
				md: '720px',
				lg: '800px',  // Limitado a 800px
				xl: '800px',  // Limitado a 800px
				'2xl': '800px', // Limitado a 800px
			},
		},
		extend: {
			colors: {
				'main-bg': '#354259',
				'main-text': '#CDC2AE',
				'main-link': '#ECE5C7',
				'main-great-text': '#C2DED1',
				'main-great-link': '#144E6B',
				'button-gray': '#6c757d',
			},
			fontFamily: {
				'sans': ['Open Sans', 'sans-serif'],
				'mono': ['Share Tech Mono', 'monospace'],
			}
		},
	},
	plugins: [],
}