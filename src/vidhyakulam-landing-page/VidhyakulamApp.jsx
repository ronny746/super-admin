import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import VidhyakulamNavbar from './components/VidhyakulamNavbar';
import Footer from '../landing-page/components/Footer';
import VidhyakulamHome from './pages/Home';

function VidhyakulamApp() {
    const location = useLocation();
    const isThankYou = location.pathname.endsWith('/thank-you');

    // Hide layout elements on pages like thank-you
    const hideLayout = isThankYou;

    return (
        <div className="min-h-screen bg-[#FCFCFC] flex flex-col font-sans">
            {!hideLayout && <VidhyakulamNavbar />}

            <div className="flex-grow flex flex-col pt-[72px] md:pt-[76px]">
                <Routes>
                    <Route path="/" element={<VidhyakulamHome />} />
                    <Route path="*" element={
                        <div className="flex-grow flex items-center justify-center flex-col p-10 text-center">
                            <h2 className="text-3xl font-bold text-gray-800 mb-4">404 - Page Not Found</h2>
                            <p className="text-gray-500">The Vidhyakulam page you are looking for does not exist.</p>
                        </div>
                    } />
                </Routes>
            </div>

            {!hideLayout && <Footer />}
        </div>
    );
}

export default VidhyakulamApp;
