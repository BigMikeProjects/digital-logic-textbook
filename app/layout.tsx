import type { Metadata } from 'next';
import 'katex/dist/katex.min.css';
import 'highlight.js/styles/atom-one-dark.css';
import './globals.css';

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
    <html lang="en">
      <body className="min-h-screen bg-gray-100">
        {children}
      </body>
    </html>
  );
}
