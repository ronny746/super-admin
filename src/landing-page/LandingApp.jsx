import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Calendar } from 'lucide-react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import Navbar from './components/Navbar';
import HeroSection from './components/HeroSection';
import CentreInfo from './components/CentreInfo';
import WhyUnacademy from './components/WhyUnacademy';
import Educators from './components/Educators';
import ParentsSection from './components/ParentsSection';
import Achievers from './components/Achievers';
import HearFromAchievers from './components/HearFromAchievers';
import Batches from './components/Batches';
import DemoClasses from './components/DemoClasses';
import Footer from './components/Footer';
import Programs from './components/Programs';
import USAT from './components/USAT';
import TermsConditions from './pages/TermsConditions';
import PrivacyPolicy from './pages/PrivacyPolicy';
import RefundPolicy from './pages/RefundPolicy';
import Disclaimer from './pages/Disclaimer';
import AboutUs from './pages/AboutUs';
import ThankYou from './pages/ThankYou';
import ScholarshipPage from './pages/ScholarshipPage';
import KYS from './pages/KYS';

import './index.css';
import PublicSlotBooking from '../super-admin-landing-page/pages/PublicSlotBooking';
import { ContactPage, CoursesPage } from './pages/CoursesAndContact';
import logo from './assets/images/unacademy-centre-logo.jpeg';

function LandingPageContent() {
  const [showPopup, setShowPopup] = useState(false);
  const [hasScrolled, setHasScrolled] = useState(false);

  // Reusable wrapper for scroll animation
  const FadeInSection = ({ children }) => (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );

  useEffect(() => {
    const handleScroll = () => {
      // Show popup when user scrolls past a certain point (e.g., 2000px) - Past Why Unacademy
      if (window.scrollY > 2000 && !hasScrolled) {
        // Check if popup has already been shown in this session
        const hasShownPopup = sessionStorage.getItem('hasShownLandingPopup');
        if (!hasShownPopup) {
          setShowPopup(true);
          setHasScrolled(true);
          sessionStorage.setItem('hasShownLandingPopup', 'true');
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [hasScrolled]);

  return (
    <main className="w-full flex flex-col relative">
      <Helmet>
        <title>Unacademy Kota Centre | Best Offline Coaching for IIT JEE & NEET UG</title>
        <meta name="description" content="Join Unacademy Kota Centre for top-tier offline coaching, experienced educators, and excellent infrastructure for IIT JEE and NEET UG preparation. Visit us today!" />
        <meta property="og:title" content="Unacademy Kota Centre | Best Offline Coaching for IIT JEE & NEET UG" />
        <meta property="og:description" content="Discover India's top educators, great infrastructure, and personalized attention at Unacademy Kota Centre. Book your visit and plan your success now!" />
        <meta property="og:url" content="https://unacademykotacentre.com/" />
        <meta property="og:type" content="website" />
        <meta name="keywords" content="Unacademy Kota, Kota Coaching, IIT JEE Coaching Kota, NEET UG Coaching Kota, Offline centre, Foundation courses, Top educators" />

        {/* Structured Data for local business / educational organization */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "EducationalOrganization",
            "name": "Unacademy Kota Centre",
            "url": "https://unacademykotacentre.com/",
            "description": "Top-tier educational institute providing offline classes for IIT JEE, NEET UG, and foundation courses in Kota.",
            "address": {
              "@type": "PostalAddress",
              "addressLocality": "Kota",
              "addressRegion": "Rajasthan",
              "addressCountry": "IN"
            }
          })}
        </script>
      </Helmet>

      <HeroSection />
      
      <FadeInSection>
        <CentreInfo />
      </FadeInSection>
      
      <FadeInSection>
        <Batches />
      </FadeInSection>
      
      <FadeInSection>
        <WhyUnacademy />
      </FadeInSection>
      
      <FadeInSection>
        <Programs />
      </FadeInSection>
      
      <FadeInSection>
        <USAT />
      </FadeInSection>
      
      <FadeInSection>
        <ParentsSection />
      </FadeInSection>
      
      <FadeInSection>
        <Educators />
      </FadeInSection>
      
      <FadeInSection>
        <Achievers />
      </FadeInSection>
      
      <FadeInSection>
        <HearFromAchievers />
      </FadeInSection>

      {/* Ultra Modern Popup Modal */}
      <AnimatePresence>
        {showPopup && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
            onClick={() => setShowPopup(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 30 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 30 }}
              transition={{ type: "spring", stiffness: 400, damping: 30 }}
              className="bg-white rounded-[2rem] shadow-2xl overflow-hidden max-w-md w-full relative group border border-white/20"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button - More Visible & Interactive */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setShowPopup(false);
                }}
                className="absolute top-4 right-4 p-2 bg-black/5 hover:bg-black/10 rounded-full text-gray-500 hover:text-red-500 transition-all z-20 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Popup Content */}
              <div className="relative">
                {/* Dynamic Background Header - Matched to Theme */}
                <div className="absolute top-0 left-0 w-full h-40 bg-gradient-to-r from-[var(--color-una-navy)] to-[var(--color-una-blue)]"></div>

                {/* Floating Circles Decoration */}
                <div className="absolute top-[-20px] left-[-20px] w-24 h-24 bg-white/10 rounded-full blur-xl"></div>
                <div className="absolute top-10 right-10 w-16 h-16 bg-white/10 rounded-full blur-lg"></div>

                <div className="pt-16 px-8 pb-10 relative z-10">
                  {/* Icon Badge */}
                  <div className="w-20 h-20 bg-white rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-xl border-4 border-white rotate-3 group-hover:rotate-0 transition-transform duration-500">
                    {/* Using unacademy logo instead of calendar as requested */}
                    <img src={logo} alt="Unacademy" className="w-12 h-12 object-contain" />
                  </div>

                  <div className="text-center mb-8">
                    <h3 className="text-2xl font-black text-gray-900 mb-2 leading-tight">
                      Plan Your Success <br />
                      <span className="text-transparent bg-clip-text text-gradient-una">Visit Us Today!</span>
                    </h3>
                    <p className="text-gray-500 text-sm font-medium leading-relaxed">
                      Get exclusive access to our campus, meet top educators, and unlock your potential with a free counseling session.
                    </p>
                  </div>

                  <div className="space-y-3">
                    <a
                      href="https://unacademykotacentre.com/admin/form/enquiry-form-web"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block w-full py-4 btn-una-primary rounded-xl"
                      onClick={() => setShowPopup(false)}
                    >
                      Book Free Visit Now
                    </a>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setShowPopup(false);
                      }}
                      className="block w-full py-2 text-gray-400 font-medium text-sm hover:text-gray-800 transition-colors"
                    >
                      No thanks, I'll explore first
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}



function LandingApp() {
  const location = useLocation();
  const isSlotBooking = location.pathname === '/book-slot';
  const isThankYou = location.pathname.endsWith('/thank-you');
  const hideLayout = isSlotBooking || isThankYou;

  return (
    <div className="min-h-screen bg-[#FCFCFC] flex flex-col">
      {!hideLayout && <Navbar />}

      <Routes>
        <Route path="/" element={<LandingPageContent />} />
        <Route path="/about-us" element={<AboutUs />} />
        <Route path="/courses" element={<CoursesPage />} />
        <Route path="/contact-us" element={<ContactPage />} />
        <Route path="/terms-conditions" element={<TermsConditions />} />
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        <Route path="/refund-policy" element={<RefundPolicy />} />
        <Route path="/disclaimer" element={<Disclaimer />} />
        <Route path="/thank-you" element={<ThankYou />} />
        <Route path="/contact-us/thank-you" element={<ThankYou />} />
        <Route path="/scholarship" element={<ScholarshipPage />} />
        <Route path="/unlock-your-scholarship" element={<KYS />} />

        {/* Public Slot Booking */}
        <Route path="/book-slot" element={<PublicSlotBooking />} />
      </Routes>

      {!hideLayout && <Footer />}

      {/* Floating WhatsApp Button */}
      <a
        href="https://wa.me/918764820042"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-50 bg-[#25D366] text-white p-4 rounded-full shadow-lg hover:bg-[#128C7E] hover:scale-110 transition-all duration-300 flex items-center justify-center"
        aria-label="Chat on WhatsApp"
      >
        <svg viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 00-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
        </svg>
      </a>
    </div>
  );
}

export default LandingApp;
