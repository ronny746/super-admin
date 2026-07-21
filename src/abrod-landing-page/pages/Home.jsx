import React, { useRef } from 'react';
import { motion, useScroll, useTransform, useSpring, useMotionValue } from 'framer-motion';
import ClassesSection from '../components/ClassesSection';
import TestPrepSection from '../components/TestPrepSection';
import SatDatesSection from '../components/SatDatesSection';
import AboutSatSection from '../components/AboutSatSection';
import ContactSection from '../components/ContactSection';
import COSMOShomeImg from '../assets/cosmoshome.png';
import aboutUsImg from '../assets/aboutus.jpeg';
import abroad2 from '../assets/abroad-2.jpg';
import abroad3 from '../assets/abroad-3.jpg';
import COSMOSLogo from '../assets/Cosmos3.png';
import FadeIn from '../components/FadeIn';
import ausFlag from '../assets/Australia-flag.jpeg';
import canadaFlag from '../assets/Canada-flag.jpeg';
import sinFlag from '../assets/SINGAPORE-flag.jpeg';
import ukFlag from '../assets/UK-flag.jpeg';
import usaFlag from '../assets/USA-flag.jpeg';
import { WireframeCube, FloatingRings, HexagonGrid, LayeredCardStack, ParticleNetwork, CosmicStarField } from '../components/ThreeDGraphic';
import EnquiryModal from '../components/EnquiryModal';

// 3D Tilt Card Component
const TiltCard = ({ children, className = "" }) => {
    const x = useMotionValue(0);
    const y = useMotionValue(0);

    const mouseX = useSpring(x, { stiffness: 150, damping: 15 });
    const mouseY = useSpring(y, { stiffness: 150, damping: 15 });

    const rotateX = useTransform(mouseY, [-0.5, 0.5], ["10deg", "-10deg"]);
    const rotateY = useTransform(mouseX, [-0.5, 0.5], ["-10deg", "10deg"]);

    const handleMouseMove = (e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const width = rect.width;
        const height = rect.height;
        const mouseXVal = e.clientX - rect.left;
        const mouseYVal = e.clientY - rect.top;
        const xPct = mouseXVal / width - 0.5;
        const yPct = mouseYVal / height - 0.5;
        x.set(xPct);
        y.set(yPct);
    };

    const handleMouseLeave = () => {
        x.set(0);
        y.set(0);
    };

    return (
        <motion.div
            style={{
                rotateX,
                rotateY,
                transformStyle: "preserve-3d",
            }}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            className={`relative cursor-3d-move perspective-1000 ${className}`}
        >
            <div style={{ transform: "translateZ(30px)" }} className="h-full">
                {children}
            </div>
        </motion.div>
    );
};


const AbroadHome = () => {
    const [isMenuOpen, setIsMenuOpen] = React.useState(false);
    const [isEnquiryModalOpen, setIsEnquiryModalOpen] = React.useState(false);
    const [activeSection, setActiveSection] = React.useState('about');

    const openEnquiryModal = (e) => {
        if (e) {
            e.preventDefault();
        }
        setIsEnquiryModalOpen(true);
    };

    const { scrollYProgress } = useScroll();
    const scaleX = useSpring(scrollYProgress, {
        stiffness: 100,
        damping: 30,
        restDelta: 0.001
    });

    // Scroll Spy - Track active section
    React.useEffect(() => {
        const sections = ['about', 'classes', 'services', 'sat-dates', 'about-sat', 'contact'];

        const observerOptions = {
            root: null,
            rootMargin: '-20% 0px -70% 0px',
            threshold: 0
        };

        const observerCallback = (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    setActiveSection(entry.target.id);
                }
            });
        };

        const observer = new IntersectionObserver(observerCallback, observerOptions);

        sections.forEach((sectionId) => {
            const element = document.getElementById(sectionId);
            if (element) observer.observe(element);
        });

        return () => {
            sections.forEach((sectionId) => {
                const element = document.getElementById(sectionId);
                if (element) observer.unobserve(element);
            });
        };
    }, []);


    return (
        <div className="min-h-screen font-sans bg-white selection:bg-[#82C8E5] selection:text-[#000080] overflow-x-hidden">
            {/* Progress Bar */}
            <motion.div
                className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#000080] to-[#82C8E5] origin-left z-[60]"
                style={{ scaleX }}
            />

            {/* Navbar */}
            <motion.nav
                initial={{ y: -100 }}
                animate={{ y: 0 }}
                transition={{ duration: 0.6, ease: "circOut" }}
                className="fixed w-full z-50 bg-white/90 backdrop-blur-md border-b border-[#82C8E5]/20"
            >
                <div className="container mx-auto px-2 sm:px-4 md:px-6 py-3 md:py-4 flex justify-between items-center gap-2">
                    <div className="flex-shrink-0">
                        <img src={COSMOSLogo} alt="COSMOS" className="h-10 sm:h-12 md:h-14 lg:h-16 w-auto object-contain transition-all duration-300" />
                    </div>

                    {/* Desktop Menu */}
                    <div className="hidden lg:flex space-x-4 xl:space-x-6 text-[#6D8196] font-medium">
                        {[
                            { name: 'ABOUT US', id: 'about' },
                            { name: 'CLASSES', id: 'classes' },
                            { name: 'SERVICES', id: 'services' },
                            { name: 'SAT DATES', id: 'sat-dates' },
                            { name: 'ABOUT DIGITAL SAT', id: 'about-sat' },
                            { name: 'CONTACT US', id: 'contact' }
                        ].map((item, i) => {
                            const isActive = activeSection === item.id;
                            return (
                                <motion.a
                                    key={item.name}
                                    href={`#${item.id}`}
                                    onClick={(e) => {
                                        e.preventDefault();
                                        document.getElementById(item.id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                                    }}
                                    className={`transition-all cursor-pointer text-xs xl:text-sm whitespace-nowrap ${isActive
                                        ? 'text-[#0047AB] font-bold'
                                        : 'text-[#6D8196] hover:text-[#0047AB] font-medium'
                                        }`}
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    {item.name}
                                </motion.a>
                            );
                        })}
                    </div>
                    <motion.button
                        onClick={openEnquiryModal}
                        whileHover={{ scale: 1.05, boxShadow: "0px 10px 20px rgba(0, 71, 171, 0.4)" }}
                        whileTap={{ scale: 0.95 }}
                        className="hidden lg:block px-4 xl:px-6 py-2 xl:py-2.5 rounded-full bg-[#0047AB] text-white font-semibold shadow-lg shadow-blue-500/30 transition-all duration-300 cursor-pointer text-xs xl:text-sm whitespace-nowrap"
                    >
                        Enquire Now
                    </motion.button>

                    {/* Mobile Menu Button */}
                    <button
                        className="lg:hidden text-[#000080] p-2"
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                    >
                        <svg className="w-6 h-6 sm:w-8 sm:h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            {isMenuOpen ? (
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            ) : (
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                            )}
                        </svg>
                    </button>
                </div>

                {/* Mobile Menu Dropdown */}
                {isMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        className="lg:hidden bg-white border-t border-gray-100 shadow-xl absolute w-full left-0 top-full overflow-hidden"
                    >
                        <div className="flex flex-col p-6 space-y-4">
                            {[
                                { name: 'ABOUT US', id: 'about' },
                                { name: 'CLASSES', id: 'classes' },
                                { name: 'SERVICES', id: 'services' },
                                { name: 'SAT DATES', id: 'sat-dates' },
                                { name: 'ABOUT DIGITAL SAT', id: 'about-sat' },
                                { name: 'CONTACT US', id: 'contact' }
                            ].map((item) => {
                                const isActive = activeSection === item.id;
                                return (
                                    <a
                                        key={item.name}
                                        href={`#${item.id}`}
                                        onClick={(e) => {
                                            e.preventDefault();
                                            setIsMenuOpen(false);
                                            document.getElementById(item.id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                                        }}
                                        className={`cursor-pointer transition-all ${isActive
                                            ? 'text-[#0047AB] font-bold'
                                            : 'text-[#6D8196] font-medium hover:text-[#0047AB]'
                                            }`}
                                    >
                                        {item.name}
                                    </a>
                                );
                            })}
                            <button
                                onClick={openEnquiryModal}
                                className="px-6 py-3 rounded-xl bg-[#0047AB] text-white font-semibold shadow-lg w-full text-center cursor-pointer block"
                            >
                                Enquire Now
                            </button>
                        </div>
                    </motion.div>
                )}
            </motion.nav>

            {/* Hero Section */}
            <div className="relative pt-32 pb-20 lg:pt-40 lg:pb-32 overflow-hidden bg-gradient-to-r from-[#E5F1F8] to-[#F3F8FB]">
                {/* Background Decor */}
                <div className="absolute inset-0 z-0 opacity-40">
                    <CosmicStarField />
                    <HexagonGrid />
                </div>

                <div className="container mx-auto px-4 md:px-6 relative z-10 max-w-7xl">
                    <div className="relative flex flex-col items-start justify-between min-h-[500px]">

                        {/* Text Content (Left Aligned, Top) */}
                        <div className="w-full lg:w-1/2 text-center lg:text-left pt-10 z-20 relative">
                            <FadeIn direction="up">
                                <h1 className="text-6xl md:text-[5rem] lg:text-[6.5rem] font-bold text-[#1E3A8A] leading-none tracking-tight mb-4 drop-shadow-md" style={{ textShadow: '2px 4px 10px rgba(0, 71, 171, 0.3)' }}>
                                    COSMOS
                                </h1>
                            </FadeIn>

                            <FadeIn direction="up" delay={0.2}>
                                <h2 className="text-lg md:text-xl lg:text-3xl font-bold text-gray-800 mb-2">
                                    Your Global Journey Begins with COSMOS
                                </h2>
                                <p className="text-base md:text-lg lg:text-xl text-gray-700 leading-relaxed max-w-lg mx-auto lg:mx-0 font-medium mb-8">
                                    Expert SAT training and international admissions mentorship for ambitious students in Classes 9-12
                                </p>
                                <motion.button
                                    onClick={openEnquiryModal}
                                    whileHover={{ scale: 1.05, boxShadow: "0px 10px 20px rgba(0, 71, 171, 0.4)" }}
                                    whileTap={{ scale: 0.95 }}
                                    className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-[#0047AB] text-white font-bold shadow-lg shadow-blue-500/30 transition-all duration-300 cursor-pointer text-lg"
                                >
                                    <span>Enquire Now</span>
                                    <span className="text-xl">→</span>
                                </motion.button>
                            </FadeIn>
                        </div>

                        {/* Image Content (Absolute positioned to right) */}
                        <div className="w-full lg:w-3/5 absolute right-0 top-10 lg:top-0 z-10 flex justify-end pointer-events-none opacity-40 lg:opacity-100 mix-blend-multiply">
                            <FadeIn direction="left" delay={0.3} className="w-full max-w-3xl lg:translate-x-12 translate-y-12 lg:translate-y-4">
                                <img
                                    src={COSMOShomeImg}
                                    alt="Global Education"
                                    className="w-full h-auto object-contain mix-blend-multiply"
                                />
                            </FadeIn>
                        </div>

                        {/* Journey Timeline (Full Width, Bottom) */}
                        <div className="w-full mt-24 lg:mt-32 z-30 relative px-4 sm:px-8">
                            <FadeIn direction="up" delay={0.4} className="w-full">
                                <div className="flex flex-col xl:flex-row items-center xl:items-center justify-between w-full max-w-[1400px] mx-auto gap-8 xl:gap-8 bg-transparent">
                                    <h3 className="text-xl md:text-2xl font-bold text-gray-800 xl:w-[200px] text-center xl:text-left shrink-0">Journey Timeline</h3>

                                    <div className="relative flex flex-col md:flex-row items-start md:items-center justify-between w-full flex-grow gap-12 md:gap-0 mt-8 md:mt-0 md:pt-16 pb-12 xl:pl-8">
                                        {/* Dashed Line Background */}
                                        <div className="absolute left-[13px] md:left-4 right-auto md:right-4 top-0 md:top-[66px] bottom-0 md:bottom-auto w-[2px] md:w-auto h-full md:h-[0px] border-l-2 md:border-l-0 md:border-t-2 border-dashed border-[#BCCCDC] lg:mr-[60px] z-0"></div>
                                        {/* Arrow for Desktop */}
                                        <div className="hidden md:block absolute right-[50px] top-[66px] -translate-y-1/2 w-4 h-4 border-t-2 border-r-2 border-[#BCCCDC] transform rotate-45 z-0"></div>

                                        {/* Step 1 */}
                                        <div className="relative z-10 flex flex-row md:flex-col items-center w-full md:w-auto pl-10 md:pl-0">
                                            <div className="w-4 h-4 rounded-full bg-[#FFDF00] border-2 border-white mb-0 md:mb-5 absolute left-[6px] md:static shadow-[0_0_12px_rgba(255,223,0,0.8)] z-10"></div>
                                            <div className="flex flex-col text-left md:text-center md:absolute md:top-8 w-full md:w-32 md:-ml-12">
                                                <span className="text-sm md:text-base font-extrabold text-[#2C3E50] whitespace-nowrap drop-shadow-sm">Test Prep</span>
                                            </div>
                                        </div>

                                        {/* Step 2 */}
                                        <div className="relative z-10 flex flex-row md:flex-col items-center w-full md:w-auto pl-10 md:pl-0">

                                            <div className="w-4 h-4 rounded-full bg-[#FFDF00] border-2 border-white mb-0 md:mb-5 absolute left-[6px] md:static shadow-[0_0_12px_rgba(255,223,0,0.8)] mt-[28px] md:mt-0 z-10"></div>
                                            <div className="flex flex-col text-left md:text-center md:absolute md:top-8 w-full md:w-64 md:-ml-28">
                                                <span className="text-sm md:text-base font-extrabold text-[#2C3E50] whitespace-nowrap drop-shadow-sm">SAT Score achieved (1500+)</span>
                                            </div>
                                        </div>

                                        {/* Step 3 */}
                                        <div className="relative z-10 flex flex-row md:flex-col items-center w-full md:w-auto pl-10 md:pl-0 mt-4 md:mt-0">

                                            <div className="w-4 h-4 rounded-full bg-[#FFDF00] border-2 border-white mb-0 md:mb-5 absolute left-[6px] md:static shadow-[0_0_12px_rgba(255,223,0,0.8)] mt-[28px] md:mt-0 xl:mr-[60px] z-10"></div>
                                            <div className="flex flex-col text-left md:text-center md:absolute md:top-8 w-full md:w-64 md:-ml-[50px] xl:mr-[60px]">
                                                <span className="text-sm md:text-base font-extrabold text-[#2C3E50] whitespace-nowrap drop-shadow-sm">Harvard University - Admitted</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </FadeIn>
                        </div>

                    </div>
                </div>

                {/* Wavy bottom border */}
                <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-none z-20 pointer-events-none">
                    <svg className="relative block w-full h-[60px] lg:h-[80px]" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none">
                        <path d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z" fill="#F3F4F6"></path>
                    </svg>
                </div>
            </div>

            {/* Main Content Area - Light Gray Background */}
            <div className="bg-[#F3F4F6] pb-24 relative overflow-hidden">
                <CosmicStarField />
                <div className="absolute top-20 left-0 opacity-30 pointer-events-none">
                    <FloatingRings size="w-96 h-96" delay={1} />
                </div>

                <div className="container mx-auto px-4 md:px-6 relative z-10">

                    {/* About Section - Restructured Grid with Image - NEW ASSET 1 */}
                    <FadeIn direction="up">
                        <div id="about" className="bg-white rounded-3xl overflow-hidden shadow-sm mb-12 border border-gray-100 hover:shadow-xl transition-shadow duration-300 scroll-mt-20">
                            <div className="flex flex-col lg:flex-row">
                                <div className="p-8 lg:p-12 lg:w-3/5">
                                    <h2 className="text-3xl font-bold text-[#000080] mb-6 border-l-4 border-[#0047AB] pl-4">About Us</h2>
                                    <div className="space-y-4 text-gray-600 text-base lg:text-lg leading-relaxed">
                                        <p>
                                            <span className="font-semibold text-[#0047AB]">COSMOS – Study Abroad Division</span> was built with one clear mission: to shape global achievers from an early stage.
                                        </p>
                                        <p>
                                            We guide students from Classes 9 to 12 with a long-term, strategic roadmap to top international universities. Our program integrates structured SAT preparation with academic mentoring and profile development. We believe global success is not accidental — it is carefully planned.
                                        </p>
                                        <p>
                                            That’s why we focus on critical thinking, communication, and intellectual depth. Beyond test scores, we help students build strong, authentic global profiles. Our mentors provide clarity at every step — from subject choices to university strategy.
                                        </p>
                                        <div className="pt-4">
                                            <motion.button
                                                onClick={openEnquiryModal}
                                                whileHover={{ scale: 1.05 }}
                                                whileTap={{ scale: 0.95 }}
                                                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#0047AB] text-white font-bold shadow-md hover:bg-[#000080] transition-colors cursor-pointer"
                                            >
                                                Enquire Now →
                                            </motion.button>
                                        </div>
                                    </div>
                                </div>
                                <div className="lg:w-2/5 relative h-64 lg:h-auto overflow-hidden">
                                    <TiltCard className="h-full w-full">
                                        <img
                                            src={aboutUsImg}
                                            alt="About COSMOS"
                                            className="w-full h-full object-cover transition-transform duration-700 hover:scale-110"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-[#0047AB]/60 to-transparent"></div>
                                        <div className="absolute bottom-6 left-6 text-white font-bold text-xl">
                                            Excellence in <br />Education
                                        </div>
                                    </TiltCard>
                                </div>
                            </div>
                        </div>
                    </FadeIn>

                    {/* Why Choose & Mission Grid */}
                    <div className="grid md:grid-cols-2 gap-8 mb-12">
                        {/* Why Choose Card */}
                        <FadeIn direction="right" delay={0.2} className="h-full">
                            <TiltCard className="h-full">
                                <div className="bg-[#0047AB] text-white rounded-3xl p-8 lg:p-10 shadow-xl relative overflow-hidden group h-full">
                                    <div className="absolute top-0 right-0 w-32 h-32 bg-[#82C8E5] rounded-bl-full opacity-10 transition-transform duration-700 group-hover:scale-[3]"></div>
                                    <h3 className="text-2xl font-bold mb-6 flex items-center gap-2">
                                        <span>Why Choose COSMOS?</span>
                                    </h3>
                                    <p className="text-blue-100 text-lg leading-relaxed relative z-10">
                                        COSMOS is a future-focused global education platform designed to help students confidently access the world’s best universities through structured test preparation and expert guidance.
                                    </p>
                                </div>
                            </TiltCard>
                        </FadeIn>

                        {/* Mission Card */}
                        <FadeIn direction="left" delay={0.4} className="h-full">
                            <TiltCard className="h-full">
                                <div id="mission" className="bg-white rounded-3xl p-8 lg:p-10 shadow-sm border border-gray-100 relative overflow-hidden h-full hover:shadow-lg transition-all scroll-mt-20">
                                    <h3 className="text-2xl font-bold text-[#000080] mb-6 flex items-center gap-2">
                                        <span>Our Mission</span>
                                    </h3>
                                    <p className="text-gray-600 mb-6 font-medium">
                                        To empower Indian students with world-class test prep and personalized guidance so they can secure admission to top global universities.
                                    </p>
                                    <ul className="space-y-4">
                                        {[
                                            'Comprehensive preparation for SAT, ACT, IELTS, TOEFL',
                                            'Mentoring and profile building',
                                            'University shortlisting & applications',
                                            'Early planning to final admits'
                                        ].map((item, i) => (
                                            <li key={i} className="flex items-start gap-3">
                                                <span className="mt-1 w-2 h-2 rounded-full bg-[#0047AB] flex-shrink-0"></span>
                                                <span className="text-gray-600">{item}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </TiltCard>
                        </FadeIn>
                    </div>

                    {/* Vision Section with Background Image - NEW ASSET 2 */}
                    <FadeIn direction="up" delay={0.2}>
                        <div id="vision" className="relative rounded-3xl overflow-hidden shadow-xl group scroll-mt-20 border border-[#E5F1F8]">
                            {/* Background Image Overlay */}
                            <div className="absolute inset-0 z-0 opacity-40">
                                <img src={abroad2} alt="Vision Background" className="w-full h-full object-cover blur-[2px] opacity-30 group-hover:scale-105 transition-transform duration-1000" />
                                <div className="absolute inset-0 bg-gradient-to-br from-[#E5F1F8]/90 to-[#F3F8FB]/90"></div>
                            </div>

                            {/* Particle Effect */}
                            <div className="absolute inset-0 z-[1] opacity-30 mix-blend-multiply">
                                <ParticleNetwork />
                            </div>

                            <div className="relative z-10 p-8 lg:p-12 text-gray-800">
                                <div className="max-w-[90rem] mx-auto text-center">
                                    <h2 className="text-3xl font-bold mb-8 relative inline-block text-[#000080]">
                                        Our Vision
                                        <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-12 h-1 bg-[#0047AB] rounded-full"></div>
                                    </h2>
                                    <p className="text-xl text-gray-700 mb-10 max-w-4xl mx-auto font-medium">
                                        COSMOS envisions students studying at institutions such as:
                                    </p>

                                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 text-left mt-12">
                                        {[
                                            {
                                                country: "USA",
                                                flag: usaFlag,
                                                schools: ["Harvard University", "Stanford University", "Massachusetts Institute of Technology", "California Institute of Technology", "University of Chicago"]
                                            },
                                            {
                                                country: "UK",
                                                flag: ukFlag,
                                                schools: ["University of Oxford", "University of Cambridge", "Imperial College London", "University College London", "King's College London"]
                                            },
                                            {
                                                country: "Canada",
                                                flag: canadaFlag,
                                                schools: ["University of Toronto", "University of British Columbia", "McGill University", "University of Alberta", "McMaster University"]
                                            },
                                            {
                                                country: "Australia",
                                                flag: ausFlag,
                                                schools: ["University of Melbourne", "Australian National University", "University of Sydney", "University of New South Wales", "Monash University"]
                                            },
                                            {
                                                country: "Singapore",
                                                flag: sinFlag,
                                                schools: ["National University of Singapore", "Nanyang Technological University", "Singapore Management University"]
                                            }
                                        ].map((group, index) => (
                                            <motion.div
                                                key={index}
                                                whileHover={{ y: -8, boxShadow: "0px 20px 40px rgba(0, 0, 0, 0.3)" }}
                                                className={`bg-gradient-to-br from-[#000080] to-[#0047AB] backdrop-blur-lg rounded-[2rem] p-6 lg:p-8 border border-white/10 transition-all shadow-xl relative overflow-hidden group/card ${index === 3 ? 'lg:col-start-1 lg:col-span-1 lg:translate-x-1/2' : ''} ${index === 4 ? 'lg:col-start-2 lg:col-span-1 lg:translate-x-1/2' : ''}`}
                                            >

                                                <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-bl from-[#FFD700]/10 via-white/5 to-transparent rounded-bl-full opacity-30 pointer-events-none z-0"></div>

                                                <div className="flex items-center gap-4 mb-6 relative z-10">
                                                    <div className="w-16 h-16 rounded-full flex items-center justify-center border-2 border-white/20 shadow-lg overflow-hidden bg-white/10 shrink-0 backdrop-blur-sm">
                                                        <img src={group.flag} alt={`${group.country} Flag`} className="w-full h-full object-cover" />
                                                    </div>
                                                    <h4 className="text-2xl font-black text-white tracking-wider uppercase">{group.country}</h4>
                                                </div>

                                                <div className="w-16 h-1 bg-[#FFD700] rounded-full mb-6 relative z-10 transition-all duration-300 group-hover/card:w-24"></div>

                                                <ul className="space-y-4 relative z-10">
                                                    {group.schools.map((school, sIndex) => (
                                                        <li key={sIndex} className="flex items-start gap-3 group/item">
                                                            <div className="mt-2 w-1.5 h-1.5 rounded-full bg-[#82C8E5] shrink-0 transition-all duration-300 group-hover/item:w-4 group-hover/item:bg-[#FFD700]"></div>
                                                            <span className="text-blue-50 font-medium text-sm lg:text-[15px] leading-snug hover:text-white transition-all duration-300 cursor-default group-hover/item:translate-x-1">{school}</span>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </motion.div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </FadeIn>

                </div>
            </div>

            {/* Classes Section */}
            <FadeIn>
                <ClassesSection onEnquire={openEnquiryModal} />
            </FadeIn>

            {/* Services / Test Prep Section */}
            <FadeIn delay={0.2}>
                <TestPrepSection onEnquire={openEnquiryModal} />
            </FadeIn>

            {/* SAT Dates / Value Add Section */}
            <FadeIn>
                <SatDatesSection />
            </FadeIn>

            {/* About Digital SAT Section */}
            <FadeIn>
                <AboutSatSection onEnquire={openEnquiryModal} />
            </FadeIn>

            {/* Contact Form Section */}
            <FadeIn>
                <ContactSection onEnquire={openEnquiryModal} />
            </FadeIn>

            {/* Footer Placeholder */}
            <footer className="bg-[#000080] text-center py-8 border-t border-[#82C8E5]/10">
                <p className="text-[#82C8E5] text-sm">© 2026 COSMOS. Designed for Excellence.</p>
            </footer>

            <EnquiryModal 
                isOpen={isEnquiryModalOpen} 
                onClose={() => setIsEnquiryModalOpen(false)} 
            />
        </div>
    );
};

export default AbroadHome;
