import "./globals.css";
import JsonLd from "../components/seo/JsonLd.jsx";
import {
  defaultMetadata,
  defaultViewport,
  organizationSchema,
  websiteSchema,
  localBusinessSchema,
} from "../lib/seo.js";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://reliefnepal.org.np';

export const metadata = {
  metadataBase: new URL(siteUrl),
  ...defaultMetadata,
  alternates: {
    canonical: '/',
    languages: {
      'en-NP': siteUrl,
      'ne-NP': `${siteUrl}/ne`,
      'x-default': siteUrl,
    },
    types: {
      'application/rss+xml': '/rss.xml',
    },
  },
};

export const viewport = defaultViewport;

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        {/* Performance hints */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://fonts.googleapis.com" />
        <link rel="dns-prefetch" href="https://fonts.gstatic.com" />
        <link rel="dns-prefetch" href="https://www.google.com" />
        <link rel="preconnect" href="https://www.google.com" crossOrigin="anonymous" />

        {/* JSON-LD Structured Data */}
        <JsonLd key="organization" data={organizationSchema} />
        <JsonLd key="website" data={websiteSchema} />
        <JsonLd key="local-business" data={localBusinessSchema} />
      </head>
      <body>
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:bg-white focus:p-3"
        >
          Skip to content
        </a>
        <div id="main-content">{children}</div>
      </body>
    </html>
  );
}