import type { Metadata } from 'next';
import Script from 'next/script';
import './globals.css';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export const metadata: Metadata = {
  metadataBase: new URL('https://toolnestin.co.in'),
  title: {
    default: 'ToolNestIn — 80+ Free Online Tools for India: GST, EMI, Income Tax, SIP Calculator & More',
    template: '%s | ToolNestIn',
  },
  description: 'Free online tools for India: GST Calculator, EMI Calculator, Income Tax Calculator 2026, SIP Calculator, IFSC Finder, HRA Calculator, NPS Calculator and 80+ more. No signup, no login, instant results.',
  keywords: [
    'free online tools india',
    'gst calculator india 2026',
    'emi calculator',
    'income tax calculator 2026',
    'sip calculator india',
    'ifsc finder',
    'hra calculator',
    'nps calculator india',
    'ctc calculator',
    'electricity bill calculator india',
  ],
  authors: [{ name: 'ToolNestIn', url: 'https://toolnestin.co.in' }],
  creator: 'ToolNestIn',
  publisher: 'ToolNestIn',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
      'max-video-preview': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    url: 'https://toolnestin.co.in',
    siteName: 'ToolNestIn',
    title: 'ToolNestIn — 80+ Free Online Tools for India',
    description: 'GST Calculator, EMI Calculator, Income Tax Calculator 2026, SIP Calculator, IFSC Finder and 79 more free tools. No signup required.',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'ToolNestIn — Free Online Tools for India' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ToolNestIn — 80+ Free Online Tools for India',
    description: 'GST Calculator, EMI Calculator, Income Tax 2026 & 80+ more. Free, instant, no login.',
    images: ['/og-image.png'],
    creator: '@toolnestin',
  },
  verification: {
    google: '8RrMXVuLOlUdgu-g3tHmzrWUufAnxPtYYRVmUkDS5GA',
  },
  alternates: {
    canonical: 'https://toolnestin.co.in',
  },
  category: 'technology',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-IN">
      <head>
                {/* EU/EEA consent signal — required for AdSense personalised ads in EU */}
        {/* For India-only traffic this is informational; if EU traffic appears, */}
        {/* replace with Google Funding Choices CMP: fundingchoices.google.com */}
        <meta name="google-adsense-account" content="ca-pub-8140114372302035" />
        {/* Preconnect to AdSense for faster ad loading */}
        <link rel="preconnect" href="https://pagead2.googlesyndication.com" />
        <link rel="preconnect" href="https://googleads.g.doubleclick.net" />
        {/* PWA manifest */}
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#0f0f0f" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="ToolNestIn" />
      </head>
      <body>
        {/* AdSense — loaded once, powers all ad units */}
        <Script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-8140114372302035"
          crossOrigin="anonymous"
          strategy="afterInteractive"
        />

        {/* Website Schema — enables Sitelinks search box in Google */}
        <Script
          id="schema-website"
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'WebSite',
              name: 'ToolNestIn',
              alternateName: 'Tool Nest In',
              url: 'https://toolnestin.co.in',
              description: 'Free online tools for India — calculators, converters, and developer utilities',
              inLanguage: 'en-IN',
              potentialAction: {
                '@type': 'SearchAction',
                target: 'https://toolnestin.co.in/search?q={search_term_string}',
                'query-input': 'required name=search_term_string',
              },
            }),
          }}
        />

        {/* Organization Schema — builds brand entity in Google Knowledge Graph */}
        <Script
          id="schema-org"
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'Organization',
              name: 'ToolNestIn',
              url: 'https://toolnestin.co.in',
              logo: 'https://toolnestin.co.in/logo.png',
              sameAs: [
                'https://twitter.com/toolnestin',
              ],
              contactPoint: {
                '@type': 'ContactPoint',
                contactType: 'customer support',
                email: 'support@toolnestin.co.in',
                availableLanguage: ['English', 'Hindi'],
              },
            }),
          }}
        />

        <Header />
        <main className="min-h-screen" id="main-content">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
