/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{astro,html,js,jsx,ts,tsx,vue,svelte}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [require("daisyui")],
  daisyui: {
    themes: [
      {
        tavue: {
          "primary": "#111827",     // noir bleuté
          "secondary": "#A1A1AA",   // gris neutre
          "accent": "#8b5a2b",      // écaille
          "neutral": "#0B1220",
          "base-100": "#FFFFFF",
          "base-200": "#F3F4F6",
          "info": "#3B82F6",
          "success": "#10B981",
          "warning": "#F59E0B",
          "error": "#EF4444",
        },
      },
    ],
  },
};
