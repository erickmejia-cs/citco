import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { cookies } from 'next/headers';
import './globals.css';
import CSLivePreview from '@/components/CSLivePreview';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { getNavigation, getGeneralSettings } from '@/lib/contentstack';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Citco | Your foundation for growth',
  description:
    'Citco is a leading provider of fund administration, banking, and related services to the global alternative investment industry.',
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = cookies();
  const isPreview = Boolean(
    cookieStore.get('__next_preview_data') || cookieStore.get('cs_preview')
  );

  const [navigation, settings] = await Promise.all([
    getNavigation(),
    getGeneralSettings(),
  ]);

  return (
    <html lang="en" className={inter.variable}>
      <body className="font-sans antialiased">
        <CSLivePreview />
        <Header navigation={navigation} />
        {isPreview && (
          <div className="fixed top-16 lg:top-20 left-0 right-0 z-40 bg-[#005B30] text-white text-xs font-semibold text-center py-1.5 tracking-widest uppercase">
            Preview Mode
          </div>
        )}
        <main>{children}</main>
        <Footer settings={settings} navigation={navigation} />
      </body>
    </html>
  );
}
