import Footer from '../../components/layout/Footer.jsx';
import FeedbackPopup from '../../components/forms/FeedbackPopup.tsx';

export default function PublicLayout({ children }) {
  return (
    <>
      {children}
      <Footer />
      <FeedbackPopup />
    </>
  );
}
