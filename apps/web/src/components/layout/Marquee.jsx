const socialLinks = [
  {
    name: 'LinkedIn',
    href: 'https://linkedin.com/company/reliefnepal',
    icon: (
      <path d="M5 3.5A1.5 1.5 0 1 1 2 3.5a1.5 1.5 0 0 1 3 0ZM2.5 8h3v13h-3V8Zm5 0h2.9v1.8h.1A3.2 3.2 0 0 1 13.4 7.7c3.1 0 3.6 2 3.6 4.6V21h-3v-7.7c0-1.8 0-3.3-2-3.3s-2.3 1.5-2.3 3.2V21h-3V8Z" />
    ),
  },
  {
    name: 'Facebook',
    href: 'https://facebook.com/reliefnepal',
    icon: (
      <path d="M13.5 21v-8.2h2.8l.4-3.2h-3.2v-2c0-.9.3-1.6 1.6-1.6h1.7V3.1c-.3 0-1.3-.1-2.5-.1-2.5 0-4.2 1.5-4.2 4.3v2.3H7.3v3.2h2.8V21h3.4Z" />
    ),
  },
  {
    name: 'Twitter',
    href: 'https://twitter.com/reliefnepal',
    icon: (
      <path d="M22 5.9a8 8 0 0 1-2.4.7 4.2 4.2 0 0 0 1.8-2.3 8.2 8.2 0 0 1-2.7 1 4.1 4.1 0 0 0-7 3.8 11.7 11.7 0 0 1-8.5-4.3 4.1 4.1 0 0 0 1.3 5.5 4 4 0 0 1-1.9-.5v.1a4.1 4.1 0 0 0 3.3 4 4.2 4.2 0 0 1-1.9.1 4.1 4.1 0 0 0 3.8 2.8A8.3 8.3 0 0 1 2 18.5a11.7 11.7 0 0 0 18-9.9v-.5A8.3 8.3 0 0 0 22 5.9Z" />
    ),
  },
];

export default function Marquee() {
  return (
    <div className="border-b border-white/10 bg-forest-800 text-white">
      <div className="rn-container flex min-h-11 items-center justify-between gap-4 py-2">
        <p className="text-xs font-semibold tracking-wide sm:text-sm">
          <span lang="ne" className="mr-2">
            बालबालिकालाई सुनौँ
          </span>
          <span className="text-white/70">Listen to Children</span>
        </p>

        <nav aria-label="Social media" className="flex items-center gap-1">
          {socialLinks.map(({ name, href, icon }) => (
            <a
              key={name}
              href={href}
              target="_blank"
              rel="noreferrer"
              aria-label={`Relief Nepal on ${name}`}
              className="rounded-full p-2 text-white/80 transition hover:bg-white/10 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            >
              <svg
                aria-hidden="true"
                viewBox="0 0 24 24"
                className="h-4 w-4 fill-current"
              >
                {icon}
              </svg>
            </a>
          ))}
        </nav>
      </div>
    </div>
  );
}
