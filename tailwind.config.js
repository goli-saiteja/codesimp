/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
      "./src/**/*.{js,jsx,ts,tsx}",
      "./public/index.html",
    ],
    theme: {
      extend: {
        colors: {
          // Primary color palette
          primary: {
            50: '#f0f5ff',
            100: '#e0eaff',
            200: '#c7d8ff',
            300: '#a4bcff',
            400: '#7a96ff',
            500: '#5b6ef8',
            600: '#4149eb',
            700: '#3638d2',
            800: '#2f31a8',
            900: '#2c2f85',
            950: '#1d1d55',
          },
          // Secondary color palette
          secondary: {
            50: '#f5f7fa',
            100: '#ebeff5',
            200: '#d2dde8',
            300: '#acbfd3',
            400: '#809cb8',
            500: '#61809f',
            600: '#4b6683',
            700: '#3d526a',
            800: '#354559',
            900: '#303c4c',
            950: '#1c2331',
          },
          // Accent color palette
          accent: {
            50: '#fdf2ff',
            100: '#fae6ff',
            200: '#f5cdff',
            300: '#eda5ff',
            400: '#e16eff',
            500: '#d43fff',
            600: '#c120eb',
            700: '#a615c6',
            800: '#8816a0',
            900: '#701582',
            950: '#4b0057',
          },
          // Success color palette
          success: {
            50: '#eefff5',
            100: '#d8ffea',
            200: '#b3fad5',
            300: '#7af3b6',
            400: '#3ee393',
            500: '#17c973',
            600: '#0ca15b',
            700: '#0b804a',
            800: '#0d653d',
            900: '#0c5434',
            950: '#022f1d',
          },
          // Warning color palette
          warning: {
            50: '#fffce8',
            100: '#fff8c2',
            200: '#ffef86',
            300: '#ffe04a',
            400: '#ffcb1f',
            500: '#faa700',
            600: '#e17c00',
            700: '#bb5502',
            800: '#984209',
            900: '#7c370d',
            950: '#461b00',
          },
          // Error color palette
          error: {
            50: '#fff1f1',
            100: '#ffe1e1',
            200: '#ffc7c7',
            300: '#ffa0a0',
            400: '#ff6a6a',
            500: '#f83b3b',
            600: '#e51d1d',
            700: '#c11414',
            800: '#a01414',
            900: '#841818',
            950: '#480808',
          },
          // Neutral color palette
          neutral: {
            50: '#f8fafc',
            100: '#f1f5f9',
            200: '#e2e8f0',
            300: '#cbd5e1',
            400: '#94a3b8',
            500: '#64748b',
            600: '#475569',
            700: '#334155',
            800: '#1e293b',
            900: '#0f172a',
            950: '#020617',
          },
          // Code syntax highlighting colors
          syntax: {
            bg: '#282c34',
            text: '#abb2bf',
            comment: '#5c6370',
            keyword: '#c678dd',
            string: '#98c379',
            number: '#d19a66',
            function: '#61afef',
            tag: '#e06c75',
            attribute: '#d19a66',
            property: '#e06c75',
          },
        },
        fontFamily: {
          sans: ['Inter var', 'ui-sans-serif', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'Helvetica Neue', 'Arial', 'sans-serif'],
          serif: ['Merriweather', 'ui-serif', 'Georgia', 'Cambria', 'Times New Roman', 'Times', 'serif'],
          mono: ['JetBrains Mono', 'ui-monospace', 'SFMono-Regular', 'Menlo', 'Monaco', 'Consolas', 'Liberation Mono', 'Courier New', 'monospace'],
          display: ['Plus Jakarta Sans', 'Inter var', 'system-ui', 'sans-serif'],
          heading: ['Plus Jakarta Sans', 'Inter var', 'system-ui', 'sans-serif'],
        },
        fontSize: {
          'xs': ['0.75rem', { lineHeight: '1rem' }],
          'sm': ['0.875rem', { lineHeight: '1.25rem' }],
          'base': ['1rem', { lineHeight: '1.5rem' }],
          'lg': ['1.125rem', { lineHeight: '1.75rem' }],
          'xl': ['1.25rem', { lineHeight: '1.75rem' }],
          '2xl': ['1.5rem', { lineHeight: '2rem' }],
          '3xl': ['1.875rem', { lineHeight: '2.25rem' }],
          '4xl': ['2.25rem', { lineHeight: '2.5rem' }],
          '5xl': ['3rem', { lineHeight: '1' }],
          '6xl': ['3.75rem', { lineHeight: '1' }],
          '7xl': ['4.5rem', { lineHeight: '1' }],
          '8xl': ['6rem', { lineHeight: '1' }],
          '9xl': ['8rem', { lineHeight: '1' }],
        },
        boxShadow: {
          'soft': '0 1px 3px rgba(0, 0, 0, 0.05), 0 1px 2px rgba(0, 0, 0, 0.1)',
          'soft-md': '0 4px 6px rgba(0, 0, 0, 0.05), 0 2px 4px rgba(0, 0, 0, 0.06)',
          'soft-lg': '0 10px 15px rgba(0, 0, 0, 0.04), 0 4px 6px rgba(0, 0, 0, 0.05)',
          'soft-xl': '0 20px 25px rgba(0, 0, 0, 0.03), 0 10px 10px rgba(0, 0, 0, 0.04)',
          'soft-2xl': '0 25px 50px rgba(0, 0, 0, 0.07)',
          'inner-soft': 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.03)',
        },
        borderRadius: {
          '4xl': '2rem',
          '5xl': '2.5rem',
        },
        spacing: {
          '18': '4.5rem',
          '72': '18rem',
          '84': '21rem',
          '96': '24rem',
          '128': '32rem',
        },
        keyframes: {
          shimmer: {
            '100%': { transform: 'translateX(100%)' },
          },
          fadeIn: {
            '0%': { opacity: '0' },
            '100%': { opacity: '1' },
          },
          slideUp: {
            '0%': { transform: 'translateY(10px)', opacity: '0' },
            '100%': { transform: 'translateY(0)', opacity: '1' },
          },
          pulse: {
            '0%, 100%': { opacity: '1' },
            '50%': { opacity: '0.5' },
          },
        },
        animation: {
          shimmer: 'shimmer 1.5s infinite',
          fadeIn: 'fadeIn 0.3s ease-out',
          slideUp: 'slideUp 0.4s ease-out',
          pulse: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        },
        typography: (theme) => ({
          DEFAULT: {
            css: {
              color: theme('colors.neutral.800'),
              a: {
                color: theme('colors.primary.600'),
                '&:hover': {
                  color: theme('colors.primary.700'),
                },
              },
              h1: {
                color: theme('colors.neutral.900'),
                fontWeight: '700',
              },
              h2: {
                color: theme('colors.neutral.900'),
                fontWeight: '600',
              },
              h3: {
                color: theme('colors.neutral.900'),
                fontWeight: '600',
              },
              h4: {
                color: theme('colors.neutral.900'),
                fontWeight: '600',
              },
              code: {
                color: theme('colors.primary.600'),
                backgroundColor: theme('colors.primary.50'),
                paddingLeft: '0.25rem',
                paddingRight: '0.25rem',
                paddingTop: '0.1rem',
                paddingBottom: '0.1rem',
                borderRadius: '0.25rem',
                fontWeight: '500',
              },
              'code::before': {
                content: 'none',
              },
              'code::after': {
                content: 'none',
              },
              pre: {
                backgroundColor: theme('colors.syntax.bg'),
                color: theme('colors.syntax.text'),
                borderRadius: '0.5rem',
              },
              blockquote: {
                borderLeftColor: theme('colors.neutral.200'),
                color: theme('colors.neutral.600'),
              },
            },
          },
          dark: {
            css: {
              color: theme('colors.neutral.300'),
              a: {
                color: theme('colors.primary.400'),
                '&:hover': {
                  color: theme('colors.primary.300'),
                },
              },
              h1: {
                color: theme('colors.neutral.100'),
              },
              h2: {
                color: theme('colors.neutral.100'),
              },
              h3: {
                color: theme('colors.neutral.100'),
              },
              h4: {
                color: theme('colors.neutral.100'),
              },
              blockquote: {
                borderLeftColor: theme('colors.neutral.700'),
                color: theme('colors.neutral.400'),
              },
              code: {
                color: theme('colors.primary.400'),
                backgroundColor: theme('colors.neutral.800'),
              },
            },
          },
        }),
      },
    },
    plugins: [
      require('@tailwindcss/typography'),
      require('@tailwindcss/forms'),
      require('@tailwindcss/aspect-ratio'),
    ],
    darkMode: 'class',
  };