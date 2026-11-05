import ContactForm from '../../../components/forms/ContactForm.jsx';
import JsonLd from '../../../components/seo/JsonLd.jsx';
import { breadcrumbSchema, organizationSchema, faqSchema } from '../../../lib/seo.js';

export const metadata = {
  title: 'Contact Relief Nepal | Get in Touch, Partnership Inquiries',
  description:
    'Contact Relief Nepal for questions, feedback, partnership inquiries, or to discuss supporting our work. Head office in Kamalamai Municipality-6, Sindhuli, Nepal.',
  openGraph: {
    title: 'Contact Relief Nepal | Get in Touch',
    description:
      'Send a question, share feedback, or start a conversation about working together. Our team will follow up using the email address you provide.',
    type: 'website',
    images: [
      {
        url: '/images/og-contact.jpg',
        width: 1200,
        height: 630,
        alt: 'Contact Relief Nepal - Get in touch',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Contact Relief Nepal',
    description:
      'Send a question, share feedback, or start a conversation about working together.',
    images: ['/images/og-contact.jpg'],
  },
  alternates: {
    canonical: '/contact',
  },
};

export default function ContactPage() {
  return (
    <>
      <JsonLd key="contact-breadcrumb" data={breadcrumbSchema([{ name: 'Home', url: '/' }, { name: 'Contact', url: '/contact' }])} />
      <JsonLd key="contact-org" data={organizationSchema} />
      <JsonLd
        key="contact-faq"
        data={faqSchema([
          {
            question: 'Where is Relief Nepal headquartered?',
            answer: 'Relief Nepal is headquartered in Kamalamai Municipality-6, Sindhuli, Nepal.',
          },
          {
            question: 'How can I contact Relief Nepal?',
            answer: 'You can contact Relief Nepal via email at info@reliefnepal.org.np or by phone at +977-047-520915. You can also use the contact form on this page.',
          },
          {
            question: 'Does Relief Nepal accept partnership inquiries?',
            answer: 'Yes, Relief Nepal welcomes partnership inquiries from organizations and individuals interested in supporting community-led development work.',
          },
        ])}
      />
      <section className="bg-[#f7f8f5] px-5 py-16 text-[#183a2a] sm:py-24">
        <div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-[.8fr_1.2fr]">
          <div>
            <p className="text-xs font-bold uppercase tracking-[.2em] text-forest-600">
              Get in touch
            </p>
            <h1 className="mt-3 text-4xl font-bold leading-tight sm:text-5xl">
              We&apos;re here to listen.
            </h1>
            <p className="mt-5 max-w-md leading-7 text-slate-600">
              Send a question, share feedback, or start a conversation about
              working together. Our team will follow up using the email address
              you provide.
            </p>
            <div className="mt-8 space-y-5 rounded-2xl border border-forest-100 bg-white p-6">
              <div>
                <h2 className="font-semibold">Head office</h2>
                <p className="mt-1 text-sm leading-6 text-slate-600">
                  Kamalamai Municipality-6
                  <br />
                  Sindhuli, Nepal
                </p>
              </div>
              <div>
                <h2 className="font-semibold">Contact</h2>
                <a
                  className="mt-1 block text-sm text-forest-700"
                  href="mailto:info@reliefnepal.org.np"
                >
                  info@reliefnepal.org.np
                </a>
                <a
                  className="mt-1 block text-sm text-forest-700"
                  href="tel:+977047520915"
                >
                  +977-047-520915
                </a>
              </div>
            </div>

            {/* Google Maps */}
            <div className="mt-8 rounded-2xl border border-forest-100 bg-white overflow-hidden shadow-sm">
              <div className="aspect-video w-full">
                <iframe
                  title="Relief Nepal Head Office Location"
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3548.2120242284313!2d85.9132123758443!3d27.21249227647014!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39eb8ca13cebecd7%3A0xc9c3490a75bc8925!2sRelief%20Nepal!5e0!3m2!1sen!2snp!4v1793859183190!5m2!1sen!2snp"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen=""
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
            </div>
          </div>
          <div className="rounded-2xl border border-forest-100 bg-white p-6 shadow-sm sm:p-9">
            <h2 className="mb-6 text-2xl font-semibold">Send us a message</h2>
            <ContactForm />
          </div>
        </div>
      </section>
    </>
  );
}