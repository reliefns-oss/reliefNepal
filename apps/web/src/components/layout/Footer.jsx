import { Facebook, Linkedin, Twitter, Mail, MapPin, Phone } from 'lucide-react';
import styles from './Footer.module.css';

const usefulLinks = [
  { label: 'AHAH', href: 'https://www.allhandsandhearts.org/', external: true },
  { label: 'NATAN', href: 'https://natanrelief.org', external: true },
  { label: 'NJSI', href: 'http://www.njsi.org.np/', external: true },
  { label: 'CWW', href: 'https://www.concern.net/', external: true },
  { label: 'WVIN', href: 'http://www.wvi.org/nepal', external: true },
  {
    label: 'Association of INGO Nepal',
    href: 'http://www.ain.org.np/',
    external: true,
  },
  {
    label: 'Nepal Government',
    href: 'http://www.nepal.gov.np/',
    external: true,
  },
];

const offices = [
  {
    label: 'Head Office',
    address: 'Kamalamai Municipality-6, Sindhuli',
    phone: '+977-047-520915',
    email: 'info@reliefnepal.org.np',
    secondaryEmail: 'dr.paudel@reliefnepal.org.np',
  },
  {
    label: 'Secretariat Office',
    address: 'Mahalaxmi Municipality-10, Lalitpur',
    phone: '+977-9851001193',
    email: 'info@reliefnepal.org.np',
  },
];

export default function Footer() {
  return (
    <footer className={styles.footer} role="contentinfo">
      {/* Main Footer Grid */}
      <div className={styles.main}>
        <div className={styles.container}>
          <div className={styles.grid}>
            {/* Column 1: About Relief Nepal */}
            <div className={styles.column} aria-labelledby="about-title">
              <h3 id="about-title" className={styles.columnTitle}>
                About Relief Nepal
              </h3>
              <p className={styles.aboutText}>
                Relief Nepal is a non-profit non-government organization
                dedicated to improve the quality of life of poor, youth,
                underprivileged and most disadvantaged people in Nepal.
              </p>
              <nav className={styles.social} aria-label="Social media">
                <a
                  href="https://linkedin.com/company/reliefnepal"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Relief Nepal on LinkedIn"
                >
                  <Linkedin size={20} />
                </a>
                <a
                  href="https://facebook.com/reliefnepal"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Relief Nepal on Facebook"
                >
                  <Facebook size={20} />
                </a>
                <a
                  href="https://twitter.com/reliefnepal"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Relief Nepal on Twitter"
                >
                  <Twitter size={20} />
                </a>
              </nav>
            </div>

            {/* Useful Links */}
            <div className={styles.column} aria-labelledby="useful-title">
              <h3 id="useful-title" className={styles.columnTitle}>
                Useful Links
              </h3>
              <nav aria-label="Partner and useful links">
                <ul className={styles.linksList}>
                  {usefulLinks.map((link) => (
                    <li key={link.label}>
                      <a
                        href={link.href}
                        target={link.external ? '_blank' : undefined}
                        rel={link.external ? 'noopener noreferrer' : undefined}
                        className={styles.link}
                      >
                        {link.label}
                        {link.external && (
                          <span
                            className={styles.externalIcon}
                            aria-hidden="true"
                          >
                            <svg
                              width="12"
                              height="12"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                            >
                              <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                              <polyline points="15 3 21 3 21 9" />
                              <line x1="10" y1="14" x2="21" y2="3" />
                            </svg>
                          </span>
                        )}
                      </a>
                    </li>
                  ))}
                </ul>
              </nav>
            </div>

            {/* Quick Contact */}
            <div className={styles.column} aria-labelledby="contact-title">
              <h3 id="contact-title" className={styles.columnTitle}>
                Quick Contact
              </h3>
              <address className={styles.contactInfo}>
                {offices.map((office) => (
                  <div key={office.label} className={styles.office}>
                    <h4 className={styles.officeLabel}>{office.label}</h4>
                    <div className={styles.officeDetails}>
                      <div className={styles.contactRow}>
                        <MapPin size={16} aria-hidden="true" />
                        <span>{office.address}</span>
                      </div>
                      <div className={styles.contactRow}>
                        <Phone size={16} aria-hidden="true" />
                        <a
                          href={`tel:${office.phone.replace(/\s/g, '')}`}
                          className={styles.contactLink}
                        >
                          {office.phone}
                        </a>
                      </div>
                      <div className={styles.contactRow}>
                        <Mail size={16} aria-hidden="true" />
                        <a
                          href={`mailto:${office.email}`}
                          className={styles.contactLink}
                        >
                          {office.email}
                        </a>
                      </div>
                      {office.secondaryEmail && (
                        <div className={styles.contactRow}>
                          <Mail size={16} aria-hidden="true" />
                          <a
                            href={`mailto:${office.secondaryEmail}`}
                            className={styles.contactLink}
                          >
                            {office.secondaryEmail}
                          </a>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </address>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className={styles.bottom}>
        <div className={styles.container}>
          <div className={styles.bottomContent}>
            <p className={styles.copyright}>
              © {new Date().getFullYear()} Relief Nepal. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}