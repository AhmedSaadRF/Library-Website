import type { Metadata } from 'next';
import './globals.css';
import { CustomCursor } from '@/components/CustomCursor';
import { Footer } from '@/components/Footer';
import { Navbar } from '@/components/Navbar';
import { Providers } from '@/components/Providers';

export const metadata: Metadata = {
  title: 'Mobile Library Website',
  description: 'Graduation project for a bilingual mobile library website.'
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ar" dir="rtl" suppressHydrationWarning data-scroll-behavior="smooth">
      <body>
        <Providers>
          <div className="flex min-h-screen flex-col">
            <CustomCursor />
            <Navbar />
            <div className="flex-1">{children}</div>
            <Footer />
          </div>
        </Providers>
      </body>
    </html>
  );
}
