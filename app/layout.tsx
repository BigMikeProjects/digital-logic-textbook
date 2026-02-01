import type { Metadata } from 'next';
import { Crimson_Pro, JetBrains_Mono } from 'next/font/google';
import 'katex/dist/katex.min.css';
import 'highlight.js/styles/github.css';
import './globals.css';

const crimsonPro = Crimson_Pro({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-crimson-pro',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-jetbrains-mono',
});

export const metadata: Metadata = {
  title: 'Digital Logic Textbook',
  description: 'Interactive Digital Logic Textbook',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${crimsonPro.variable} ${jetbrainsMono.variable}`}>
      <body className="min-h-screen bg-white font-serif text-gray-900">
        {children}
      </body>
    </html>
  );
}
