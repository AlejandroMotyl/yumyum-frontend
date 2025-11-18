import { OG_IMAGE, SITE_DOMAIN } from '@/config/metadata';
import { Metadata } from 'next';
import 'modern-normalize/modern-normalize.css';
import { Montserrat } from 'next/font/google';
import './globals.css';
import { ReactNode } from 'react';
import Header from '@/components/Header/Header';
import AuthProvider from '@/components/AuthProvider/AuthProvider';
import TanStackProvider from '@/components/TanStackProvider/TanStackProvider';
import css from './layout.module.css';
import Footer from '@/components/Footer/Footer';

export const metadata: Metadata = {
  metadataBase: new URL(SITE_DOMAIN),
  title: '',
  description: '',
  openGraph: {
    title: '',
    description: '',
    url: SITE_DOMAIN,
    images: [OG_IMAGE],
    type: 'website',
  },
};

export const montserrat = Montserrat({
  subsets: ['latin'],
  weight: ['300', '400', '500', '700'],
  display: 'swap',
  variable: '--font-montserrat',
});

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${montserrat.variable}`}>
        <TanStackProvider>
          <AuthProvider>
            <Header />

            <main className={css.main}> {children}</main>
            <Footer />
          </AuthProvider>
        </TanStackProvider>
      </body>
    </html>
  );
}
