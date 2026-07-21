import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import unacademyLogo from '../../landing-page/assets/images/UA_LOGO_Color.png';

const VidhyakulamNavbar = () => {
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            const isScrolled = window.scrollY > 10;
            if (isScrolled !== scrolled) {
                setScrolled(isScrolled);
            }
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, [scrolled]);

    return (
        <motion.nav
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.5 }}
            className={`fixed top-0 left-0 right-0 z-100 transition-all duration-300 flex items-center ${scrolled
                ? 'bg-white/90 backdrop-blur-md shadow-sm border-b border-gray-100'
                : 'bg-white'
                }`}
        >
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl flex items-center justify-start h-12 sm:h-16">
                {/* Logo */}
                <a href="#top" className="flex items-center gap-2 group shrink-0">
                    <img
                        src={unacademyLogo}
                        alt="Unacademy Centre Kota"
                        className="h-6 md:h-8 lg:h-10 object-contain transition-transform duration-300 group-hover:scale-105"
                    />
                </a>
            </div>
        </motion.nav>
    );
};

export default VidhyakulamNavbar;
