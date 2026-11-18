'use client';

import JsonLd from '../seo/JsonLd.jsx';

/**
 * Client wrapper for SEO components to be used in server components
 * Receives pre-computed JSON-LD data as props
 */
export default function SeoComponents({ breadcrumb, organization, article, faq, project, webPage, navigation }) {
  return (
    <>
      {breadcrumb && <JsonLd key="breadcrumb" data={breadcrumb} />}
      {organization && <JsonLd key="organization" data={organization} />}
      {article && <JsonLd key="article" data={article} />}
      {faq && <JsonLd key="faq" data={faq} />}
      {project && <JsonLd key="project" data={project} />}
      {webPage && <JsonLd key="webpage" data={webPage} />}
      {navigation && <JsonLd key="navigation" data={navigation} />}
    </>
  );
}