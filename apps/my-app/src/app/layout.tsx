import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import '../styles/globals.css';
import { poppins } from '@/styles/font';
import Provider from './provider';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Create Next App',
  description: 'Generated by create next app',
};

const RootLayout = ({
  children,
  params: { locale },
}: {
  children: React.ReactNode;
  params: { locale: string };
}) => (
  <html lang={locale || 'en'} className={`${poppins.variable}`}>
    <body className={inter.className}>
      <Provider>{children}</Provider>
    </body>
  </html>
);

export default RootLayout;
