import { Poppins } from 'next/font/google';

export const poppins = Poppins({
  subsets: ['latin', 'devanagari'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-poppins',
});
