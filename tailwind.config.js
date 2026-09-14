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
        serif: ['var(--font-crimson-pro)', ...defaultTheme.fontFamily.serif],
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
              fontFamily: 'var(--font-crimson-pro)',
              fontWeight: '700',
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
              color: 'rgb(30 64 175)', // blue-800
              textDecoration: 'underline',
              textDecorationColor: 'rgb(191 219 254)', // blue-200
              '&:hover': {
                color: 'rgb(37 99 235)', // blue-600
                textDecorationColor: 'rgb(37 99 235)', // blue-600
              },
            },
            // Strong text
            strong: {
              color: 'rgb(17 24 39)', // gray-900
              fontWeight: '600',
            },
            // Inline code
            code: {
              color: 'rgb(17 24 39)', // gray-900
              backgroundColor: 'rgb(243 244 246)', // gray-100
              padding: '0.125rem 0.375rem',
              borderRadius: '0.25rem',
              fontSize: '0.875em',
              fontWeight: '400',
              fontFamily: 'var(--font-jetbrains-mono)',
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
            //
            // Sized to the content, not to the column. A truth table is five narrow columns of
            // single digits; stretching it to width:100% marooned the digits in whitespace.
            // Rules are horizontal only, digits are tabular so columns line up, and the
            // markdown alignment (|:-:|, which remark emits as align="center") is honored
            // rather than overridden.
            table: {
              width: 'auto',
              maxWidth: '100%',
              borderCollapse: 'collapse',
              marginTop: '1.75rem',
              marginBottom: '1.75rem',
              fontSize: '0.9375rem',
              lineHeight: '1.45',
              fontVariantNumeric: 'tabular-nums',
            },
            thead: {
              borderBottomWidth: '2px',
              borderBottomColor: 'rgb(100 116 139)', // slate-500
            },
            'thead th': {
              backgroundColor: 'transparent',
              padding: '0.4rem 1.1rem 0.5rem',
              textAlign: 'left',
              fontWeight: '600',
              color: 'rgb(51 65 85)', // slate-700
              verticalAlign: 'bottom',
              borderWidth: '0',
            },
            'tbody tr': {
              borderBottomWidth: '1px',
              borderBottomColor: 'rgb(226 232 240)', // slate-200
            },
            'tbody tr:last-child': {
              borderBottomWidth: '1px',
              borderBottomColor: 'rgb(148 163 184)', // slate-400 — closes the table
            },
            'tbody tr:nth-child(even)': {
              backgroundColor: 'rgb(248 250 252)', // slate-50
            },
            'tbody td': {
              padding: '0.4rem 1.1rem',
              borderWidth: '0',
            },
            // remark-gfm emits align="center"/"right" from |:-:| and |--:|; a blanket
            // text-align on th/td beats the presentational attribute, so restore it here.
            'th[align="center"], td[align="center"]': { textAlign: 'center' },
            'th[align="right"],  td[align="right"]':  { textAlign: 'right' },
            'th[align="left"],   td[align="left"]':   { textAlign: 'left' },
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
