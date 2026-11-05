export const navigationGroups = [
  { label: 'Home', href: '/', links: [] },
  {
    label: 'About Us',
    href: '/about',
    links: [
      ['VMGO', '/about#principles-title'],
      ['Who We Are', '/about'],
      ['How We Work', '/about#org-title'],
      ['Achievements', '/impact'],
      ['Advisory Team', '/about#board-title'],
      ['Organization’s Structure', '/about#org-title'],
    ],
  },
  {
    label: 'Programs',
    href: '/projects',
    links: [],
  },
  {
    label: 'Gallery',
    href: '/gallery',
    links: [],
  },
  {
    label: 'Networks',
    href: '/network',
    links: [],
  },
  {
    label: 'Notice',
    href: '/notice',
    links: [
      ['Announcements', '/notice'],
      ['Vacancies', '/vacancies'],
    ],
  },
  {
    label: 'Get Involved',
    href: '/get-involved',
    links: [
      ['Support', '/get-involved#support'],
      ['Procurement', '/procurement'],
      ['Membership', '/get-involved#membership'],
    ],
  },
  { label: 'Contact', href: '/contact', links: [] },
];
