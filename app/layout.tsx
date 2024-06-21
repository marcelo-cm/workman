import { Toaster } from '@/components/ui/toaster';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export function generateMetadata() {
  return {
    metadataBase: new URL('https://www.workman.so'),
    title: {
      default: 'Workman | Accounting Automation for Builders',
    },
    description:
      'Automated manual data entry from invoices to existing bookkeeping software. Saving you time, money, and mistakes.',
    keywords: [
      'quickbooks online',
      'construction invoices',
      'accounting automation',
      'construction accounting',
      'invoice automation',
      'construction bookkeeping',
      'construction accounting software',
      'construction accounting services',
      'construction accounting software',
    ],
    authors: { name: 'Workman LLC' },
    openGraph: {
      title: 'Workman | Accounting Automation for Builders',
      description:
        'Automated manual data entry from invoices to existing bookkeeping software. Saving you time, money, and mistakes.',
      type: 'website',
      images: ['/opengraph-image.png'],
    },
    twitter: {
      card: 'summary_large_image',
      images: ['/twitter-image.png'],
      description:
        'Automated manual data entry from invoices to existing bookkeeping software. Saving you time, money, and mistakes.',
    },
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/apple-touch-icon.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/favicon-16x16.png"
        />
        <link rel="manifest" href="/site.webmanifest" />
        <link rel="mask-icon" href="/safari-pinned-tab.svg" color="#5bbad5" />
        <meta name="msapplication-TileColor" content="#da532c" />
        <meta name="theme-color" content="#ffffff" />
      </head>
      <body className={`${inter.className} h-dvh min-h-screen bg-white`}>
        {children}
        <Toaster />
      </body>
    </html>
  );
}
