import Footer from '@/components/footer';
import './globals.css';
import type { Metadata } from 'next';
import { Roboto } from 'next/font/google';
import Header from '@/components/header';
import BackdropGradient from '@/components/backdrop-gradient';

const roboto = Roboto({
  weight: ['400', '500', '700'],
  style: ['normal', 'italic'],
  subsets: ['latin'],
  display: 'swap',
});

export const metadata = {
  title: 'Vercel Batch',
  description: 'Vercel Cron Jobs',
} as Metadata;

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}): JSX.Element {
  return (
    <html lang="kr">
      <body
        className={`${roboto.className} bg-black text-default relative flex items-center h-full w-full flex-col`}
      >
        <BackdropGradient />
        <div className="fixed inset-0 h-full flex justify-center px-4 md:px-8 -z-10">
          <div className="flex w-full bg-black/80 max-w-[1002px] border-x" />
        </div>

        <main className="relative w-full flex flex-col justify-center px-4 md:px-8">
          <div className="relativeflex flex-col mx-auto relative w-full max-w-[1000px]">
            <Header />
            {children}
            <div className="h-16 border-b relative hover:bg-white/5 transition-colors"></div>
            <Footer />
          </div>
        </main>
      </body>
    </html>
  );
}
