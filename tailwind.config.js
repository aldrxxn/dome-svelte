import aspectRatio from '@tailwindcss/aspect-ratio';
import typography from '@tailwindcss/typography';

/** @type {import('tailwindcss').Config} */
export default {
	content: ['./src/**/*.{html,js,svelte,ts}'], // Pastikan path ini sesuai dengan proyek Anda
	theme: {
	  extend: {
		fontFamily: {
		  lato: ['Lato', 'sans-serif'], // Tambahkan font Lato
		},
	  },
	},
	plugins: [typography, aspectRatio]
};
