/** @type {import('tailwindcss').Config} */
import animatePlugin from "tailwindcss-animate";

export default {
  darkMode: ["class"],
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      /* ================================
         RADIUS
      ================================= */
      borderRadius: {
        lg: "var(--radius-lg)",
        md: "var(--radius-md)",
        sm: "var(--radius-sm)",
        xl: "var(--radius-xl)",
        "2xl": "var(--radius-2xl)",
        "3xl": "var(--radius-3xl)",
      },

      /* ================================
         BRAND COLORS (Reflectly Style)
         → koristi var(--color-*) iz globals.css
      ================================= */
      colors: {
        /* Base (shadcn default mappings) */
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",

        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },

        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },

        primary: {
          DEFAULT: "hsl(var(--primary))",
          soft: "hsl(var(--primary-soft))",         // ⭐ NEW
          foreground: "hsl(var(--primary-foreground))",
        },

        accent: {
          DEFAULT: "hsl(var(--accent))",
          soft: "hsl(var(--accent-soft))",           // ⭐ NEW
          foreground: "hsl(var(--accent-foreground))",
        },

        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },

        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },

        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },

        /* NEW Pastels — optional but perfect for Mindset Dashboard */
        pastel: {
          pink: "hsl(var(--pastel-pink))",
          purple: "hsl(var(--pastel-purple))",
          green: "hsl(var(--pastel-green))",
          blue: "hsl(var(--pastel-blue))",
          yellow: "hsl(var(--pastel-yellow))",
        },

        /* Borders, rings, input */
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",

        /* Charts (shadcn default) */
        chart: {
          1: "hsl(var(--chart-1))",
          2: "hsl(var(--chart-2))",
          3: "hsl(var(--chart-3))",
          4: "hsl(var(--chart-4))",
          5: "hsl(var(--chart-5))",
        },
      },

      /* ================================
         Shadows
      ================================= */
      boxShadow: {
        soft: "var(--shadow-soft)",
        card: "var(--shadow-card)",
      },

      /* ================================
         Layout Variables
      ================================= */
      spacing: {
        sidebar: "var(--sidebar-width)",
        "sidebar-collapsed": "var(--sidebar-width-collapsed)",
      },
    },
  },
  plugins: [animatePlugin],
};
