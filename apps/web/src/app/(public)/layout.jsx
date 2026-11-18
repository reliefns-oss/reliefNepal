import Header from '../../components/layout/Header.jsx';
import Marquee from '../../components/layout/Marquee.jsx';
import NoticeVacancyTicker from '../../components/layout/NoticeVacancyTicker.jsx';
import Footer from '../../components/layout/Footer.jsx';
import { FeedbackButton } from '../../components/forms/FeedbackButton';
import FeedbackPopup from '../../components/forms/FeedbackPopup.tsx';

export default function PublicLayout({ children }) {
  return (
    <>
      <div className="sticky top-0 z-40 shadow-[0_8px_24px_rgba(16,54,39,0.08)]">
        <Header />
        <Marquee />
        <NoticeVacancyTicker />
      </div>
      {children}
      <Footer />
      <FeedbackButton />
      <FeedbackPopup />
    </>
  );
}
