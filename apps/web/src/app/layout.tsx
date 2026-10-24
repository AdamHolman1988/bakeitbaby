import type { Metadata } from 'next';
import { outfit, plusJakartaSans } from './fonts';
import '../styles/globals.css';
import { ThemeProvider } from '@/components/theme-provider';
import { LocaleProvider } from '@/context/locale-context';
import { SettingsProvider } from '@/context/settings-context';
import { Sidebar } from '@/components/sidebar';

export const metadata: Metadata = {
  title: 'BakeItBaby — Pizza Dough & Flour Workbench',
  description: 'Precision pizza dough calculator, fermentation planner & flour strength database',
  icons: {
    icon: '/favicon.svg',
    shortcut: '/pizza-icon.svg',
    apple: '/pizza-icon.svg',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="cs"
      suppressHydrationWarning
      className={`${outfit.variable} ${plusJakartaSans.variable}`}
    >
      <body
        suppressHydrationWarning
        className="min-h-screen bg-[var(--color-bg)] text-[var(--color-text-main)] font-[family-name:var(--font-plus-jakarta)] antialiased"
      >
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
          <LocaleProvider>
            <SettingsProvider>
              <div className="flex min-h-screen w-full">
                <Sidebar />
                <main className="flex-1 lg:pl-64 w-full min-w-0 transition-all">
                  <div className="w-full px-4 sm:px-6 md:px-8 lg:px-10 py-6 md:py-8 max-w-none">
                    {children}
                  </div>
                </main>
              </div>
            </SettingsProvider>
          </LocaleProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
