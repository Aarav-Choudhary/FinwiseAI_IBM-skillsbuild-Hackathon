/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bg:        "#0B0B0D",
        surface:   "#17171A",
        border:    "#2A2A2E",
        primary:   "#6C63FF",
        accent:    "#00D9A3",
        warning:   "#D4AF37",
        danger:    "#C81E3A",
        textPrimary:   "#ECE7DD",
        textSecondary: "#9B968C",
      },
      fontFamily: {
        sans: ["IBM Plex Sans", "system-ui", "sans-serif"],
        serif: ["IBM Plex Serif", "Georgia", "serif"],
        mono: ["IBM Plex Mono", "Menlo", "monospace"],
      },
      backdropBlur: {
        glass: "20px",
      },
      animation: {
        "fade-in":    "fadeIn 0.4s ease forwards",
        "slide-up":   "slideUp 0.4s ease forwards",
        "pulse-slow": "pulse 3s ease-in-out infinite",
        "spin-slow":  "spin 8s linear infinite",
        typewriter:   "typewriter 3s steps(40) forwards",
      },
      keyframes: {
        fadeIn:  { "0%": { opacity: 0 }, "100%": { opacity: 1 } },
        slideUp: { "0%": { opacity: 0, transform: "translateY(20px)" }, "100%": { opacity: 1, transform: "translateY(0)" } },
        typewriter: { "from": { width: "0" }, "to": { width: "100%" } },
      },
    },
  },
  plugins: [],
};
