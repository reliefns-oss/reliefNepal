import Link from 'next/link';
import Image from 'next/image';
import Container from '../shared/Container.jsx';
import PrimaryButton from '../shared/PrimaryButton.jsx';
import DesktopNavigation from './DesktopNavigation.jsx';
import MobileNavigation from './MobileNavigation.jsx';

export default function Header() {
  return <header className="border-b border-forest-100 bg-white/95 backdrop-blur">
    <Container className="relative flex h-20 items-center justify-between gap-6">
      <Link href="/" aria-label="Relief Nepal home" className="flex items-center"><Image src="/images/logo.jpg" alt="Relief Nepal" width={230} height={76} priority className="h-auto max-h-16 w-auto object-contain" /></Link>
      <DesktopNavigation />
      <div className="hidden lg:block"><PrimaryButton href="/get-involved">Support our work</PrimaryButton></div>
      <MobileNavigation />
    </Container>
  </header>;
}
