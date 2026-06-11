import type { Metadata } from 'next';
import './globals.css';
import { MagicParticlesCanvas } from '../components/MagicParticlesCanvas';

export const metadata: Metadata = {
  title: 'Acchiappasogni - Fiabe della Buonanotte',
  description: 'La dolce voce narrante per fiabe e sogni dorati. Culliamo la fantasia dei più piccini nel buio della cameretta.',
  manifest: '/manifest.json',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="it">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Crimson+Pro:ital,wght@0,200..900;1,200..900&family=Inter:wght@300;400;500;600&family=Playfair+Display:ital,wght@0,700;0,800;0,900;1,700;1,800;1,900&display=swap" rel="stylesheet" />
      </head>
      <body className="bg-stone-50 text-stone-900 min-h-screen">
        <MagicParticlesCanvas />
        {children}
      </body>
    </html>
  );
}
