/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#7C3AED',
        secondary: '#A78BFA', 
        accent: '#8B5CF6',
        surface: {
          50: '#F9FAFB',
          100: '#F3F4F6',
          200: '#E5E7EB',
          300: '#D1D5DB',
          400: '#9CA3AF',
          500: '#6B7280',
          600: '#4B5563',
          700: '#374151',
          800: '#1F2937',
          900: '#111827'
        }
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui'],
        display: ['Plus Jakarta Sans', 'ui-sans-serif', 'system-ui'],
        heading: ['Plus Jakarta Sans', 'ui-sans-serif', 'system-ui']
      },
gridTemplateColumns: {
        'feed': '280px 1fr',
        'feed-mobile': '1fr',
        'feed-3col': '280px 1fr 320px',
        'feed-3col-lg': '300px 1fr 340px',
        'layout': 'minmax(0, 1fr)',
        'sidebar-main': '280px minmax(0, 1fr)',
        'responsive': 'repeat(auto-fit, minmax(300px, 1fr))'
      },
      spacing: {
        '18': '4.5rem',
        '72': '18rem',
        '84': '21rem',
        '96': '24rem',
        '280': '280px'
      },
      maxWidth: {
        'container': '1280px',
        'content': '800px',
        'feed': '600px'
      },
screens: {
        'xs': '475px'
      },
      backgroundImage: {
        'gradient-soft': 'linear-gradient(135deg, #fafafa 0%, #f4f4f5 100%)',
        'gradient-card': 'linear-gradient(135deg, #ffffff 0%, #fefefe 100%)',
        'gradient-divider': 'linear-gradient(90deg, transparent 0%, #e5e7eb 50%, transparent 100%)'
      },
      backdropBlur: {
        'xs': '2px'
      }
    },
  },
  plugins: [],
}