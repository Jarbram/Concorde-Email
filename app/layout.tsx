import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Concorde Emails — Subastop Design System',
  description: 'Crea maquetas de correo premium con el design system Concorde. Copia, pega y envía.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body>{children}</body>
    </html>
  );
}
