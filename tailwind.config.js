const defaultTheme = require('tailwindcss/defaultTheme');

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-inter)', ...defaultTheme.fontFamily.sans],
        mono: ['var(--font-jetbrains-mono)', ...defaultTheme.fontFamily.mono],
      },
      typography: {
        DEFAULT: {
          css: {
            maxWidth: '75ch',
            lineHeight: '1.75',
            color: 'rgb(55 65 81)', // gray-700
            // Headings
            'h1, h2, h3, h4': {
              color: 'rgb(17 24 39)', // gray-900
              fontWeight: '600',
            },
            h1: {
              fontSize: '1.875rem', // 3xl
              lineHeight: '2.25rem',
              marginBottom: '1.5rem',
            },
            h2: {
              fontSize: '1.5rem', // 2xl
              marginTop: '2rem',
              marginBottom: '1rem',
            },
            h3: {
              fontSize: '1.25rem', // xl
              marginTop: '1.5rem',
              marginBottom: '0.75rem',
            },
            // Paragraphs
            p: {
              marginTop: '1.25rem',
              marginBottom: '1.25rem',
            },
            // Links
            a: {
              color: 'rgb(37 99 235)', // blue-600
              textDecoration: 'none',
              '&:hover': {
                textDecoration: 'underline',
              },
            },
            // Strong text
            strong: {
              color: 'rgb(17 24 39)', // gray-900
              fontWeight: '600',
            },
            // Inline code
            code: {
              color: 'rgb(219 39 119)', // pink-600
              backgroundColor: 'rgb(243 244 246)', // gray-100
              padding: '0.125rem 0.375rem',
              borderRadius: '0.25rem',
              fontSize: '0.875em',
              fontWeight: '400',
            },
            'code::before': {
              content: 'none',
            },
            'code::after': {
              content: 'none',
            },
            // Code blocks
            pre: {
              backgroundColor: 'transparent',
              padding: '0',
              marginTop: '1.5rem',
              marginBottom: '1.5rem',
            },
            'pre code': {
              backgroundColor: 'transparent',
              padding: '0',
              fontSize: '0.875rem',
              fontWeight: '400',
              color: 'inherit',
            },
            // Lists
            ul: {
              listStyleType: 'disc',
              paddingLeft: '1.5rem',
            },
            ol: {
              listStyleType: 'decimal',
              paddingLeft: '1.5rem',
            },
            li: {
              marginTop: '0.5rem',
              marginBottom: '0.5rem',
            },
            // Tables
            table: {
              width: '100%',
              borderCollapse: 'collapse',
              marginTop: '1.5rem',
              marginBottom: '1.5rem',
            },
            th: {
              borderWidth: '1px',
              borderColor: 'rgb(209 213 219)', // gray-300
              backgroundColor: 'rgb(243 244 246)', // gray-100
              padding: '0.5rem 1rem',
              textAlign: 'left',
              fontWeight: '600',
            },
            td: {
              borderWidth: '1px',
              borderColor: 'rgb(209 213 219)', // gray-300
              padding: '0.5rem 1rem',
            },
            // Blockquotes
            blockquote: {
              borderLeftWidth: '4px',
              borderLeftColor: 'rgb(59 130 246)', // blue-500
              paddingLeft: '1rem',
              fontStyle: 'italic',
              marginTop: '1.5rem',
              marginBottom: '1.5rem',
            },
          },
        },
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
};
