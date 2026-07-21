import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { 
    ChevronDown, MapPin, Phone, Mail, 
    BookOpen, Globe2, Award, Briefcase, Users, 
    CheckCircle2, ArrowRight, Book, Plane,
    GraduationCap, Building, ShieldCheck, HeartPulse
} from 'lucide-react';
import CosmosLogo from '../assets/Cosmos3.png';
import cosmosHero from '../assets/newcosmos/cosmos-hero.png';
import studyAbroadImage from '../assets/newcosmos/study_abroad_book_globe.png';
import satCardImage from '../assets/newcosmos/sat_illustration.png';
import mbbsCardImage from '../assets/newcosmos/mbbs_card_image.png';
import EnquiryModal from '../components/EnquiryModal';

// You can use placeholder or generic illustrations since exact images aren't available
// We'll use CSS shapes and Lucide icons for rich graphics where needed.

export default function CosmosLanding() {
    const navigate = useNavigate();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isEnquiryModalOpen, setIsEnquiryModalOpen] = useState(false);

    const openEnquiryModal = (e) => {
        if (e) {
            e.preventDefault();
        }
        setIsEnquiryModalOpen(true);
    };

    return (
        <div className="min-h-screen bg-white font-sans text-gray-800 overflow-x-hidden">
            {/* Header */}
            <header className="fixed top-0 w-full bg-white/90 backdrop-blur-md z-50 border-b border-gray-100">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-20">
                        {/* Logo */}
                        <div className="flex-shrink-0 cursor-pointer" onClick={() => window.scrollTo(0,0)}>
                            <img src={CosmosLogo} alt="Cosmos Division" className="h-12 w-auto" />
                        </div>

                        {/* Desktop Nav */}
                        <nav className="hidden md:flex space-x-8 items-center absolute left-1/2 transform -translate-x-1/2">
                            <a href="#about" className="text-gray-600 hover:text-blue-600 font-medium text-sm">About Us</a>
                            <a href="#programs" className="text-gray-600 hover:text-blue-600 font-medium text-sm">Programs</a>
                            <a href="#contact" className="text-gray-600 hover:text-blue-600 font-medium text-sm">Contact Us</a>
                        </nav>

                        {/* CTA Button */}
                        <div className="hidden md:block">
                            <button onClick={openEnquiryModal} className="bg-[#1e40af] text-white px-6 py-2.5 rounded-md font-semibold text-sm hover:bg-blue-800 transition shadow-lg shadow-blue-500/30">
                                Book Free Counseling
                            </button>
                        </div>

                        {/* Mobile Menu Button */}
                        <div className="md:hidden">
                            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-gray-600">
                                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    {isMenuOpen ? (
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    ) : (
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                                    )}
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Mobile Menu */}
                {isMenuOpen && (
                    <div className="md:hidden bg-white border-t border-gray-100 px-4 pt-2 pb-4 space-y-1 shadow-lg">
                        <a href="#about" className="block px-3 py-2 text-gray-600 font-medium">About Us</a>
                        <a href="#programs" className="block px-3 py-2 text-gray-600 font-medium">Programs</a>
                        <a href="#contact" className="block px-3 py-2 text-gray-600 font-medium">Contact Us</a>
                        <button onClick={openEnquiryModal} className="w-full mt-4 bg-[#1e40af] text-white px-4 py-2 rounded-md font-semibold">
                            Book Free Counseling
                        </button>
                    </div>
                )}
            </header>

            {/* Hero Section */}
            <section className="relative pt-32 pb-20 overflow-hidden bg-gradient-to-br from-[#f0f7ff] via-white to-[#e0f2fe]">
                {/* Decorative background elements */}
                <div className="absolute top-20 right-0 w-1/2 h-full opacity-20 pointer-events-none">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,theme(colors.blue.400)_0,transparent_50%)] blur-3xl"></div>
                </div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="grid lg:grid-cols-2 gap-12 items-center">
                        {/* Text Content */}
                        <motion.div 
                            initial={{ opacity: 0, x: -50 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.6 }}
                            className="relative z-20"
                        >
                            <div className="flex gap-3 mb-6">
                                <span className="px-4 py-1.5 bg-blue-100 text-blue-800 rounded-full text-xs font-bold tracking-wide uppercase border border-blue-200 flex items-center gap-2">
                                    <span className="w-2 h-2 rounded-full bg-blue-600"></span> MBBS Abroad
                                </span>
                                <span className="px-4 py-1.5 bg-green-100 text-green-800 rounded-full text-xs font-bold tracking-wide uppercase border border-green-200 flex items-center gap-2">
                                    <span className="w-2 h-2 rounded-full bg-green-600"></span> SAT Preparation
                                </span>
                            </div>

                            <h1 className="text-5xl lg:text-[4rem] font-extrabold leading-tight mb-6 text-gray-900 tracking-tight">
                                Your Global Education <br/>
                                Journey <span className="text-[#1e40af]">Starts Here</span>
                            </h1>
                            
                            <p className="text-lg lg:text-xl text-gray-600 mb-8 max-w-lg leading-relaxed">
                                From MBBS Abroad to SAT Preparation, we guide you to top universities worldwide.
                            </p>
                            
                            <div className="flex flex-wrap gap-4 mb-12">
                                <button 
                                    onClick={() => navigate('/cosmos/mbbs')}
                                    className="bg-[#1e40af] text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-blue-800 transition flex items-center gap-2 shadow-xl shadow-blue-900/20 group"
                                >
                                    Explore MBBS Abroad 
                                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                </button>
                                <button 
                                    onClick={() => navigate('/cosmos/sat')}
                                    className="bg-white text-green-700 border-2 border-green-600 px-8 py-4 rounded-xl font-bold text-lg hover:bg-green-50 transition flex items-center gap-2 shadow-xl shadow-green-900/10 group"
                                >
                                    Explore SAT Program 
                                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                </button>
                            </div>

                            {/* Stats */}
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 bg-white/60 p-6 rounded-2xl backdrop-blur-sm border border-white/40 shadow-lg">
                                {[
                                    { icon: <Building className="w-6 h-6 text-blue-500" />, num: "500+", label: "Universities" },
                                    { icon: <Users className="w-6 h-6 text-blue-500" />, num: "10,000+", label: "Students Guided" },
                                    { icon: <Globe2 className="w-6 h-6 text-blue-500" />, num: "15+", label: "Countries" },
                                    { icon: <Award className="w-6 h-6 text-blue-500" />, num: "98%", label: "Success Rate" },
                                ].map((stat, idx) => (
                                    <div key={idx} className="flex flex-col gap-1 items-center text-center sm:items-start sm:text-left">
                                        <div className="mb-1 bg-blue-50 p-2 rounded-lg">{stat.icon}</div>
                                        <div className="font-bold text-xl text-gray-900">{stat.num}</div>
                                        <div className="text-xs text-gray-500 font-medium">{stat.label}</div>
                                    </div>
                                ))}
                            </div>
                        </motion.div>

                        {/* Graphics Content */}
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                            className="relative lg:h-[650px] flex items-center justify-center lg:justify-end z-0 mt-8 lg:mt-0"
                        >
                            {/* Huge image going behind text on desktop, normal on mobile */}
                            <div className="relative lg:absolute lg:right-[-10%] lg:top-[40%] lg:-translate-y-1/2 w-full max-w-md lg:max-w-none lg:w-[160%] xl:w-[180%] pointer-events-none opacity-95">
                                <img src={cosmosHero} alt="Global Education" className="w-full h-auto drop-shadow-2xl" />
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* What is Study Abroad Section */}
            <section id="about" className="py-24 bg-white relative">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid lg:grid-cols-2 gap-16 items-center">
                        <motion.div 
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6 }}
                        >
                            <h3 className="text-green-500 font-bold tracking-widest text-sm uppercase mb-3">About Study Abroad</h3>
                            <h2 className="text-4xl font-extrabold text-gray-900 mb-6 leading-tight">What is Study Abroad?</h2>
                            <p className="text-gray-600 text-lg leading-relaxed mb-10">
                                Study abroad refers to the opportunity to pursue your education in a foreign country. It allows students to experience a new culture, gain global exposure, and access world-class education and infrastructure that can shape a successful international career.
                            </p>

                            <div className="grid grid-cols-2 gap-8">
                                {[
                                    { icon: <GraduationCap/>, title: "World-Class", subtitle: "Education", color: "text-blue-600", bg: "bg-blue-50" },
                                    { icon: <Globe2/>, title: "Global", subtitle: "Recognition", color: "text-green-600", bg: "bg-green-50" },
                                    { icon: <Users/>, title: "Personal", subtitle: "Growth", color: "text-purple-600", bg: "bg-purple-50" },
                                    { icon: <Briefcase/>, title: "Better Career", subtitle: "Opportunities", color: "text-orange-600", bg: "bg-orange-50" },
                                ].map((item, i) => (
                                    <div key={i} className="flex items-start gap-4">
                                        <div className={`p-3 rounded-xl ${item.bg} ${item.color} shadow-sm`}>
                                            {item.icon}
                                        </div>
                                        <div>
                                            <div className="font-bold text-gray-900">{item.title}</div>
                                            <div className="text-gray-600 text-sm">{item.subtitle}</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </motion.div>

                        <motion.div 
                            initial={{ opacity: 0, x: 30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6 }}
                            className="relative flex justify-center"
                        >
                             <div className="relative w-full max-w-xl flex items-center justify-center">
                                <img src={studyAbroadImage} alt="Study Abroad" className="w-full h-auto mix-blend-multiply" />
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Exposure Section */}
            <section className="py-20 bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl lg:text-4xl font-extrabold text-gray-900">
                            THE <span className="text-[#1e40af]">EXPOSURE</span> YOU GET THROUGH STUDY ABROAD
                        </h2>
                    </div>

                    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {[
                            { icon: <Users className="w-10 h-10 text-green-500" />, title: "Global Networking", desc: "Connect with peers and professionals from across the world.", color: "bg-green-50" },
                            { icon: <GraduationCap className="w-10 h-10 text-blue-600" />, title: "World-Class Education", desc: "Learn from top-ranked universities and experienced faculty.", color: "bg-blue-50" },
                            { icon: <Briefcase className="w-10 h-10 text-purple-600" />, title: "International Career Opportunities", desc: "Access global job markets and build a successful international career.", color: "bg-purple-50" },
                            { icon: <Plane className="w-10 h-10 text-orange-500" />, title: "Cultural Exposure", desc: "Experience new cultures, traditions and become a global citizen.", color: "bg-orange-50" },
                        ].map((card, i) => (
                            <motion.div 
                                key={i}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: i * 0.1 }}
                                className="bg-white rounded-2xl p-8 text-center shadow-lg shadow-gray-200/50 hover:-translate-y-2 transition-transform duration-300 border border-gray-100"
                            >
                                <div className={`w-20 h-20 mx-auto rounded-full ${card.color} flex items-center justify-center mb-6`}>
                                    {card.icon}
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 mb-3">{card.title}</h3>
                                <p className="text-gray-600 leading-relaxed">{card.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Comparison Tables */}
            <section className="py-20 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid lg:grid-cols-2 gap-12">
                        {/* IIT Table */}
                        <div className="bg-blue-50/50 rounded-3xl p-6 md:p-8 border border-blue-100">
                            <h3 className="text-2xl font-bold text-center text-blue-900 mb-8">IITs <span className="text-gray-400 font-medium px-2">vs</span> Abroad Universities</h3>
                            
                            <div className="space-y-4">
                                <div className="grid grid-cols-[1fr_auto_1fr] gap-4 font-bold text-gray-900 text-center border-b border-blue-200 pb-4">
                                    <div className="text-blue-700">IITs</div>
                                    <div className="w-8"></div>
                                    <div className="text-blue-700">Abroad Universities</div>
                                </div>
                                
                                {[
                                    { left: "Highly Competitive Entry", right: "Holistic Admission Process" },
                                    { left: "Focus on Academics", right: "Focus on Research & Innovation" },
                                    { left: "Limited International Exposure", right: "Global Exposure" },
                                    { left: "Curriculum Not Very Flexible", right: "Flexible & Student-Centric" },
                                    { left: "National Recognition", right: "International Recognition" },
                                    { left: "Fewer Career Options", right: "Wide Range of Career Opportunities" }
                                ].map((row, i) => (
                                    <div key={i} className="grid grid-cols-[1fr_auto_1fr] gap-4 items-center bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                                        <div className="text-gray-600 text-sm flex items-center gap-2">
                                            <Building className="w-4 h-4 text-blue-400 shrink-0"/> {row.left}
                                        </div>
                                        <div className="w-8 h-8 rounded-full bg-blue-900 text-white flex items-center justify-center text-xs font-bold shrink-0">VS</div>
                                        <div className="text-gray-900 font-medium text-sm text-right flex items-center justify-end gap-2 text-right">
                                            {row.right}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* NEET Table */}
                        <div className="bg-green-50/50 rounded-3xl p-6 md:p-8 border border-green-100">
                            <h3 className="text-2xl font-bold text-center text-green-900 mb-8">NEET Indian Institutes <span className="text-gray-400 font-medium px-2">vs</span> Abroad Institutes</h3>
                            
                            <div className="space-y-4">
                                <div className="grid grid-cols-[1fr_auto_1fr] gap-4 font-bold text-gray-900 text-center border-b border-green-200 pb-4">
                                    <div className="text-green-700">NEET Indian Institutes</div>
                                    <div className="w-8"></div>
                                    <div className="text-green-700">Abroad Institutes</div>
                                </div>
                                
                                {[
                                    { left: "Extremely High Competition", right: "Easier Admission Process" },
                                    { left: "Limited Number of Seats", right: "More Seats Available" },
                                    { left: "High Fees in Private Colleges", right: "Affordable Tuition Fees" },
                                    { left: "Limited Global Exposure", right: "Global Recognition & Exposure" },
                                    { left: "Lengthy Admission Process", right: "Simple & Transparent Process" },
                                    { left: "Limited Infrastructure", right: "Advanced Infrastructure" }
                                ].map((row, i) => (
                                    <div key={i} className="grid grid-cols-[1fr_auto_1fr] gap-4 items-center bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                                        <div className="text-gray-600 text-sm flex items-center gap-2">
                                            <HeartPulse className="w-4 h-4 text-green-500 shrink-0"/> {row.left}
                                        </div>
                                        <div className="w-8 h-8 rounded-full bg-gray-900 text-white flex items-center justify-center text-xs font-bold shrink-0">VS</div>
                                        <div className="text-gray-900 font-medium text-sm flex justify-end text-right">
                                            {row.right}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Choose Your Path Section */}
            <section className="py-20 bg-gray-50 relative overflow-hidden" id="programs">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl lg:text-4xl font-extrabold text-gray-900 mb-4">
                            CHOOSE <span className="text-[#1e40af]">YOUR PATH</span>
                        </h2>
                        <p className="text-gray-600 text-lg">Select a program to explore detailed information</p>
                    </div>

                    <div className="grid lg:grid-cols-2 gap-8 w-full max-w-7xl mx-auto">
                        {/* MBBS Card */}
                        <motion.div 
                            whileHover={{ y: -8 }}
                            className="bg-white rounded-[2rem] shadow-xl overflow-hidden border border-gray-100 group"
                        >
                            <div className="flex flex-col md:flex-row h-full">
                                <div className="md:w-[45%] bg-[#f4f7fb] flex items-center justify-center overflow-hidden">
                                    <img src={mbbsCardImage} alt="MBBS Abroad" className="w-full h-full object-contain md:object-cover" />
                                </div>
                                <div className="md:w-[55%] p-8 lg:p-10 flex flex-col justify-between">
                                    <div>
                                        <h3 className="text-3xl font-black text-gray-900 mb-2">MBBS</h3>
                                        <h4 className="text-xl font-bold text-green-600 mb-4">ABROAD</h4>
                                        <p className="text-gray-600 mb-6 text-sm leading-relaxed">
                                            Study MBBS from top medical universities across the world with affordable fees and global exposure.
                                        </p>
                                        <ul className="space-y-3 mb-8">
                                            {["Top Medical Universities", "NMC & WHO Recognized", "Affordable Fee Structure", "100% Counselling Support"].map((item, i) => (
                                                <li key={i} className="flex items-center gap-3 text-sm font-medium text-gray-700">
                                                    <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0" />
                                                    {item}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                    <button 
                                        onClick={() => navigate('/cosmos/mbbs')}
                                        className="w-full bg-green-500 hover:bg-green-600 text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition"
                                    >
                                        Explore MBBS Abroad <ArrowRight className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>
                        </motion.div>

                        {/* SAT Card */}
                        <motion.div 
                            whileHover={{ y: -8 }}
                            className="bg-white rounded-[2rem] shadow-xl overflow-hidden border border-gray-100 group"
                        >
                            <div className="flex flex-col md:flex-row h-full">
                                <div className="md:w-[45%] bg-[#f4f7fb] flex items-center justify-center overflow-hidden">
                                    <img src={satCardImage} alt="SAT Preparation" className="w-full h-full object-contain md:object-cover" />
                                </div>
                                <div className="md:w-[55%] p-8 lg:p-10 flex flex-col justify-between">
                                    <div>
                                        <h3 className="text-3xl font-black text-gray-900 mb-2">SAT</h3>
                                        <h4 className="text-xl font-bold text-[#1e40af] mb-4">PREPARATION</h4>
                                        <p className="text-gray-600 mb-6 text-sm leading-relaxed">
                                            Prepare for SAT and get admission in top universities in the USA and other countries worldwide.
                                        </p>
                                        <ul className="space-y-3 mb-8">
                                            {["Expert Faculty Guidance", "Personalized Study Plan", "Full-Length Mock Tests", "Top Score Guaranteed"].map((item, i) => (
                                                <li key={i} className="flex items-center gap-3 text-sm font-medium text-gray-700">
                                                    <CheckCircle2 className="w-5 h-5 text-[#1e40af] shrink-0" />
                                                    {item}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                    <button 
                                        onClick={() => navigate('/cosmos/sat')}
                                        className="w-full bg-[#1e40af] hover:bg-blue-800 text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition"
                                    >
                                        Explore SAT Program <ArrowRight className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* CTA Banner */}
            <section className="bg-gradient-to-r from-[#1e40af] to-blue-600 py-16 relative overflow-hidden">
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute top-0 right-10 w-40 h-40 border-4 border-white rounded-full"></div>
                    <div className="absolute bottom-0 left-20 w-60 h-60 border-4 border-white rounded-full"></div>
                </div>
                <div className="max-w-4xl mx-auto px-4 relative z-10 text-center">
                    <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Ready to Start Your Global Journey?</h2>
                    <p className="text-blue-100 text-lg mb-8">Book a free counselling session with our experts and get personalized guidance.</p>
                    <button onClick={openEnquiryModal} className="bg-white text-[#1e40af] px-8 py-4 rounded-full font-bold text-lg hover:bg-blue-50 transition shadow-xl inline-flex items-center gap-2">
                        Book Free Counseling <ArrowRight className="w-5 h-5" />
                    </button>
                </div>
            </section>

            {/* Footer */}
            <footer id="contact" className="bg-[#0f172a] text-gray-300 py-16 border-t border-gray-800">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
                        <div>
                            <div className="bg-white p-2 inline-block rounded-xl mb-6">
                                <img src={CosmosLogo} alt="Cosmos" className="h-10 w-auto" />
                            </div>
                            <p className="text-sm leading-relaxed text-gray-400 mb-6">
                                Cosmos Division is your trusted partner in achieving your global education dreams. We guide you at every step towards a brighter and successful future.
                            </p>
                            <div className="flex gap-4">
                                <div className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center cursor-pointer hover:bg-blue-600 transition">f</div>
                                <div className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center cursor-pointer hover:bg-blue-400 transition">t</div>
                                <div className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center cursor-pointer hover:bg-red-600 transition">y</div>
                                <div className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center cursor-pointer hover:bg-blue-700 transition">in</div>
                            </div>
                        </div>
                        
                        <div>
                            <h4 className="text-white font-bold text-lg mb-6">Quick Links</h4>
                            <ul className="space-y-3 text-sm">
                                <li><a href="#about" className="hover:text-white transition">About Us</a></li>
                                <li><a href="#programs" className="hover:text-white transition">Programs</a></li>
                                <li><a href="#contact" className="hover:text-white transition">Contact Us</a></li>
                            </ul>
                        </div>
                        
                        <div>
                            <h4 className="text-white font-bold text-lg mb-6">Programs</h4>
                            <ul className="space-y-3 text-sm">
                                <li><Link to="/cosmos/mbbs" className="hover:text-white transition">MBBS Abroad</Link></li>
                                <li><Link to="/cosmos/sat" className="hover:text-white transition">SAT Preparation</Link></li>
                                <li><a href="#" className="hover:text-white transition">University Admission</a></li>
                                <li><a href="#" className="hover:text-white transition">Career Counseling</a></li>
                            </ul>
                        </div>
                        
                        <div>
                            <h4 className="text-white font-bold text-lg mb-6">Contact Us</h4>
                            <ul className="space-y-4 text-sm">
                                <li className="flex items-start gap-3">
                                    <Phone className="w-5 h-5 text-blue-400 shrink-0" />
                                    <span>+91 12345 67890</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <Mail className="w-5 h-5 text-blue-400 shrink-0" />
                                    <span>info@cosmosdivision.com</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <MapPin className="w-5 h-5 text-blue-400 shrink-0" />
                                    <span>123, Education Street,<br/>New Delhi, India</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                    
                    <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-gray-500">
                        <p>© 2026 Cosmos Division. All Rights Reserved.</p>
                        <div className="flex gap-6">
                            <a href="#" className="hover:text-white">Privacy Policy</a>
                            <a href="#" className="hover:text-white">Terms & Conditions</a>
                        </div>
                    </div>
                </div>
            </footer>

            <EnquiryModal 
                isOpen={isEnquiryModalOpen} 
                onClose={() => setIsEnquiryModalOpen(false)} 
            />
        </div>
    );
}
