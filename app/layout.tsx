import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'BPM DROP — Guess the BPM',
  description: 'An arcade BPM guessing game. Tap tempo or type your guess — score points for accuracy and speed.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body style={{ background: '#0a0a12', minHeight: '100vh' }}>
        {children}
      </body>
    </html>
  );
}
