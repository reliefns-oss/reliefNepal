/**
 * SEO Configuration & Utilities
 * Centralized SEO constants and helper functions
 */

export const siteConfig = {
  name: 'Relief Nepal',
  description: 'A non-profit organization dedicated to improving the well-being of underserved children, families, and communities across Nepal through community-led development.',
  url: process.env.NEXT_PUBLIC_SITE_URL || 'https://reliefnepal.org.np',
  ogImage: '/images/og-default.jpg',
  twitterHandle: '@reliefnepal',
  organization: {
    name: 'Relief Nepal',
    legalName: 'Relief Nepal',
    url: 'https://reliefnepal.org.np',
    logo: '/images/logo.jpg',
    sameAs: [
      'https://www.facebook.com/reliefnepal',
      'https://twitter.com/reliefnepal',
      'https://www.linkedin.org/company/relief-nepal',
      'https://www.youtube.com/@reliefnepal',
    ],
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: '+977-047-520915',
      contactType: 'customer service',
      availableLanguage: ['Nepali', 'English'],
    },
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Sindhuli, Bagmati Province',
      addressLocality: 'Sindhuli',
      addressRegion: 'Bagmati Province',
      addressCountry: 'NP',
    },
    foundingDate: '2008',
    areaServed: 'NP',
  },
};

export const defaultMetadata = {
  title: {
    default: 'Relief Nepal | Community, dignity, hope',
    template: '%s | Relief Nepal',
  },
  description: siteConfig.description,
  keywords: [
    'Relief Nepal',
    'non-profit Nepal',
    'community development Nepal',
    'child protection Nepal',
    'humanitarian aid Nepal',
    'disaster relief Nepal',
    'WASH Nepal',
    'livelihoods Nepal',
    'Sindhuli NGO',
    'Bagmati Province NGO',
  ],
  authors: [{ name: 'Relief Nepal' }],
  creator: 'Relief Nepal',
  publisher: 'Relief Nepal',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: 'website',
    siteName: 'Relief Nepal',
    title: 'Relief Nepal | Community, dignity, hope',
    description: siteConfig.description,
    images: [
      {
        url: siteConfig.ogImage,
        width: 1200,
        height: 630,
        alt: 'Relief Nepal - Building self-reliant, equitable communities across Nepal',
      },
    ],
    locale: 'en_NP',
    alternateLocale: ['ne_NP'],
  },
  twitter: {
    card: 'summary_large_image',
    site: siteConfig.twitterHandle,
    creator: siteConfig.twitterHandle,
    title: 'Relief Nepal | Community, dignity, hope',
    description: siteConfig.description,
    images: [siteConfig.ogImage],
  },
  alternates: {
    canonical: '/',
    languages: {
      'en-NP': siteConfig.url,
      'ne-NP': `${siteConfig.url}/ne`,
      'x-default': siteConfig.url,
    },
    types: {
      'application/rss+xml': '/rss.xml',
    },
  },
  icons: {
    icon: '/icons/favicon.ico',
    shortcut: '/icons/favicon-16x16.png',
    apple: '/icons/apple-touch-icon.png',
  },
  manifest: '/site.webmanifest',
  other: {
    'theme-color': '#087943',
    'color-scheme': 'light',
  },
};

export const defaultViewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#087943',
};

export function generatePageMetadata({
  title,
  description,
  path,
  image,
  type = 'website',
  noIndex = false,
  noFollow = false,
  publishedTime,
  modifiedTime,
  authors,
  section,
  tags,
  locale = 'en_NP',
  alternateLocales = ['ne_NP'],
}) {
  const url = `${siteConfig.url}${path}`;
  const ogImage = image || siteConfig.ogImage;

  return {
    title,
    description: description || siteConfig.description,
    keywords: tags?.join(', ') || defaultMetadata.keywords.join(', '),
    authors: authors || defaultMetadata.authors,
    creator: defaultMetadata.creator,
    publisher: defaultMetadata.publisher,
    robots: {
      index: !noIndex,
      follow: !noFollow,
      googleBot: {
        index: !noIndex,
        follow: !noFollow,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    openGraph: {
      type,
      siteName: 'Relief Nepal',
      title,
      description: description || siteConfig.description,
      url,
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      locale,
      alternateLocale: alternateLocales,
      ...(publishedTime && { publishedTime }),
      ...(modifiedTime && { modifiedTime }),
      ...(authors && { authors }),
      ...(section && { section }),
      ...(tags && { tags }),
    },
    twitter: {
      card: 'summary_large_image',
      site: siteConfig.twitterHandle,
      creator: siteConfig.twitterHandle,
      title,
      description: description || siteConfig.description,
      images: [ogImage],
    },
    alternates: {
      canonical: url,
      languages: {
        'en-NP': url,
        'ne-NP': url.replace('/en/', '/ne/').replace(siteConfig.url, `${siteConfig.url}/ne`),
        'x-default': url,
      },
    },
    other: {
      'theme-color': '#087943',
      'color-scheme': 'light',
    },
    viewport: {
      width: 'device-width',
      initialScale: 1,
      themeColor: '#087943',
    },
  };
}

export function generateJsonLd(data) {
  return {
    '@context': 'https://schema.org',
    ...data,
  };
}

export const organizationSchema = generateJsonLd({
  '@type': 'NonprofitOrganization',
  name: siteConfig.organization.name,
  legalName: siteConfig.organization.legalName,
  url: siteConfig.organization.url,
  logo: siteConfig.organization.logo,
  sameAs: siteConfig.organization.sameAs,
  contactPoint: siteConfig.organization.contactPoint,
  address: siteConfig.organization.address,
  foundingDate: siteConfig.organization.foundingDate,
  areaServed: siteConfig.organization.areaServed,
  description: siteConfig.description,
  missionStatement: 'To improve the well-being of underserved children, families, and communities through community-led development.',
  knowsAbout: [
    'Child Protection',
    'Health & Education',
    'Disaster & Climate Resilience',
    'WASH (Water, Sanitation & Hygiene)',
    'Livelihoods',
    'Humanitarian Aid',
    'Community Development',
  ],
});

export const websiteSchema = generateJsonLd({
  '@type': 'WebSite',
  name: siteConfig.name,
  url: siteConfig.url,
  potentialAction: {
    '@type': 'SearchAction',
    target: {
      '@type': 'EntryPoint',
      urlTemplate: `${siteConfig.url}/search?q={search_term_string}`,
    },
    'query-input': 'required name=search_term_string',
  },
  publisher: {
    '@type': 'Organization',
    name: siteConfig.organization.name,
    logo: {
      '@type': 'ImageObject',
      url: siteConfig.organization.logo,
    },
  },
  inLanguage: ['en-NP', 'ne-NP'],
});

export function breadcrumbSchema(items) {
  return generateJsonLd({
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: `${siteConfig.url}${item.url}`,
    })),
  });
}

export function articleSchema({
  headline,
  description,
  image,
  datePublished,
  dateModified,
  authorName,
  publisherName = 'Relief Nepal',
  publisherLogo = siteConfig.organization.logo,
  mainEntityOfPage,
  speakableSections = [],
}) {
  const schema = generateJsonLd({
    '@type': 'Article',
    headline,
    description,
    image: image ? [image] : [siteConfig.ogImage],
    datePublished,
    dateModified,
    author: {
      '@type': 'Person',
      name: authorName,
    },
    publisher: {
      '@type': 'Organization',
      name: publisherName,
      logo: {
        '@type': 'ImageObject',
        url: publisherLogo,
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': mainEntityOfPage || `${siteConfig.url}`,
    },
    inLanguage: 'en-NP',
  });

  // Add speakable schema for voice search optimization
  if (speakableSections.length > 0) {
    schema.speakable = {
      '@type': 'SpeakableSpecification',
      cssSelector: speakableSections.join(', '),
    };
  }

  return schema;
}

export function projectSchema({
  name,
  description,
  image,
  url,
  startDate,
  endDate,
  location,
  program,
  status,
}) {
  return generateJsonLd({
    '@type': 'Project',
    name,
    description,
    image,
    url,
    startDate,
    endDate,
    location: {
      '@type': 'Place',
      name: location,
      address: {
        '@type': 'PostalAddress',
        addressCountry: 'NP',
      },
    },
    projectStatus: status,
    about: program,
    organizer: {
      '@type': 'Organization',
      name: siteConfig.organization.name,
      url: siteConfig.organization.url,
    },
  });
}

export function eventSchema({
  name,
  description,
  startDate,
  endDate,
  location,
  image,
  url,
  eventStatus = 'EventScheduled',
  eventAttendanceMode = 'OfflineEventAttendanceMode',
}) {
  return generateJsonLd({
    '@type': 'Event',
    name,
    description,
    startDate,
    endDate,
    eventStatus,
    eventAttendanceMode,
    location: {
      '@type': 'Place',
      name: location,
      address: {
        '@type': 'PostalAddress',
        addressCountry: 'NP',
      },
    },
    image,
    url,
    organizer: {
      '@type': 'Organization',
      name: siteConfig.organization.name,
      url: siteConfig.organization.url,
    },
  });
}

export function faqSchema(faqs) {
  return generateJsonLd({
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  });
}

/**
 * Site Navigation Element Schema
 * Helps search engines understand the site structure
 */
export function navigationSchema(navigationItems) {
  return generateJsonLd({
    '@type': 'SiteNavigationElement',
    name: 'Main Navigation',
    url: siteConfig.url,
    siteNavigationElement: navigationItems.map((item) => ({
      '@type': 'ListItem',
      position: item.position,
      name: item.name,
      item: `${siteConfig.url}${item.url}`,
    })),
  });
}

/**
 * WebPage Schema
 * Provides explicit webpage structured data
 */
export function webPageSchema({
  name,
  description,
  url,
  image,
  datePublished,
  dateModified,
  breadcrumb,
  mainContentOfPage,
  isPartOf,
}) {
  return generateJsonLd({
    '@type': 'WebPage',
    name,
    description,
    url,
    image: image ? [image] : [siteConfig.ogImage],
    datePublished,
    dateModified,
    breadcrumb: breadcrumb ? {
      '@type': 'BreadcrumbList',
      itemListElement: breadcrumb.map((item, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        name: item.name,
        item: `${siteConfig.url}${item.url}`,
      })),
    } : undefined,
    mainContentOfPage: mainContentOfPage ? {
      '@type': 'WebPageElement',
      ...mainContentOfPage,
    } : undefined,
    isPartOf: isPartOf ? {
      '@type': 'WebSite',
      name: siteConfig.name,
      url: siteConfig.url,
    } : undefined,
    inLanguage: 'en-NP',
    potentialAction: {
      '@type': 'ReadAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: url,
        actionPlatform: [
          'http://schema.org/DesktopWebPlatform',
          'http://schema.org/MobileWebPlatform',
        ],
      },
    },
  });
}

/**
 * LocalBusiness Schema (for nonprofit as local entity)
 */
export const localBusinessSchema = generateJsonLd({
  '@type': ['NonprofitOrganization', 'LocalBusiness'],
  name: siteConfig.organization.name,
  legalName: siteConfig.organization.legalName,
  url: siteConfig.organization.url,
  logo: siteConfig.organization.logo,
  image: siteConfig.ogImage,
  description: siteConfig.description,
  address: siteConfig.organization.address,
  geo: {
    '@type': 'GeoCoordinates',
    latitude: 27.2125,
    longitude: 85.9132,
  },
  telephone: '+977-047-520915',
  email: 'info@reliefnepal.org.np',
  sameAs: siteConfig.organization.sameAs,
  openingHoursSpecification: [
    {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
      opens: '09:00',
      closes: '17:00',
    },
  ],
  priceRange: 'Free',
  currenciesAccepted: 'NPR',
  paymentAccepted: 'Cash, Bank Transfer, Online Payment',
  areaServed: {
    '@type': 'AdministrativeArea',
    name: 'Nepal',
  },
  knowsAbout: [
    'Child Protection',
    'Health & Education',
    'Disaster & Climate Resilience',
    'WASH (Water, Sanitation & Hygiene)',
    'Livelihoods',
    'Humanitarian Aid',
    'Community Development',
  ],
});

/**
 * Organization Schema with donation action
 */
export const organizationWithDonationSchema = generateJsonLd({
  '@type': 'NonprofitOrganization',
  name: siteConfig.organization.name,
  legalName: siteConfig.organization.legalName,
  url: siteConfig.organization.url,
  logo: siteConfig.organization.logo,
  sameAs: siteConfig.organization.sameAs,
  contactPoint: siteConfig.organization.contactPoint,
  address: siteConfig.organization.address,
  foundingDate: siteConfig.organization.foundingDate,
  areaServed: siteConfig.organization.areaServed,
  description: siteConfig.description,
  missionStatement: 'To improve the well-being of underserved children, families, and communities through community-led development.',
  makesOffer: {
    '@type': 'Offer',
    name: 'Donate to Relief Nepal',
    description: 'Support our community-led development programs across Nepal.',
    url: `${siteConfig.url}/contact`,
    price: '0',
    priceCurrency: 'NPR',
    availability: 'https://schema.org/InStock',
  },
});

/**
 * Generate complete SEO metadata for a page including all relevant schemas
 */
export function generateCompletePageSEO({
  title,
  description,
  path,
  image,
  type = 'website',
  publishedTime,
  modifiedTime,
  authors,
  section,
  tags,
  breadcrumbItems,
  schemaType = 'WebPage',
  schemaData = {},
}) {
  const metadata = generatePageMetadata({
    title,
    description,
    path,
    image,
    type,
    publishedTime,
    modifiedTime,
    authors,
    section,
    tags,
  });

  const schemas = [
    organizationSchema,
    websiteSchema,
  ];

  if (breadcrumbItems) {
    schemas.push(breadcrumbSchema(breadcrumbItems));
  }

  // Add page-specific schema
  if (schemaType === 'Article') {
    schemas.push(articleSchema({
      headline: title,
      description: description || siteConfig.description,
      image,
      datePublished: publishedTime,
      dateModified: modifiedTime,
      authorName: authors?.[0]?.name || 'Relief Nepal',
      publisherName: 'Relief Nepal',
      mainEntityOfPage: `${siteConfig.url}${path}`,
      speakableSections: ['.article-body', 'main article', '[role="main"]'],
      ...schemaData,
    }));
  } else if (schemaType === 'Project') {
    schemas.push(projectSchema({ ...schemaData }));
  } else if (schemaType === 'Event') {
    schemas.push(eventSchema({ ...schemaData }));
  } else if (schemaType === 'FAQPage') {
    schemas.push(faqSchema(schemaData.faqs || []));
  } else {
    schemas.push(webPageSchema({
      name: title,
      description: description || siteConfig.description,
      url: `${siteConfig.url}${path}`,
      image,
      datePublished: publishedTime,
      dateModified: modifiedTime,
      breadcrumb: breadcrumbItems,
      isPartOf: true,
    }));
  }

  return { metadata, schemas };
}