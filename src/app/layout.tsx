import type { Metadata } from 'next';
import './globals.css';
import { CustomCursor } from '@/components/CustomCursor';
import { Footer } from '@/components/Footer';
import { Navbar } from '@/components/Navbar';
import { Providers } from '@/components/Providers';
import { PageTransition } from '@/components/AnimatedComponents';

export const metadata: Metadata = {
  title: 'أفق - المكتبة المتنقلة | Ofoq Mobile Library',
  description: 'Graduation project for a bilingual mobile library website.',
  icons: {
    icon: '/favicon.png',
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ar" dir="rtl" suppressHydrationWarning data-scroll-behavior="smooth">
      <body>
        <Providers>
          <div className="flex min-h-screen flex-col">
            <CustomCursor />
            <Navbar />
            <div className="flex-1">
              <PageTransition>
                {children}
              </PageTransition>
            </div>
            <Footer />
          </div>
        </Providers>
      </body>
    </html>
  );
}
