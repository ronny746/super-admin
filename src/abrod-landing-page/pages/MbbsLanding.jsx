import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { 
    ChevronDown, MapPin, Phone, Mail, 
    BookOpen, Globe2, Award, Briefcase, Users, 
    CheckCircle2, ArrowRight, Building, 
    GraduationCap, ClipboardCheck, CalendarDays, User,
    BadgeCheck, ShieldCheck, HeartPulse, Clock, FileText, CheckSquare
} from 'lucide-react';
import CosmosLogo from '../assets/Cosmos3.png';
import globeImage from '../assets/newcosmos/globe .png';
import tajikistanFlag from '../assets/newcosmos/tajikistan flag.png';
import tajikistanImg from '../assets/newcosmos/tajikistan.jpg';
import uzbekistanFlag from '../assets/newcosmos/uzbekistan flag.jpg';
import uzbekistanImg from '../assets/newcosmos/usbekistan.jpg';
import georgiaFlag from '../assets/newcosmos/georgia flag.png';
import georgiaImg from '../assets/newcosmos/georgia.jpg';
import russiaFlag from '../assets/newcosmos/russia flag (1).png';
import russiaImg from '../assets/newcosmos/russia.jpg';
import mbbsCardImage from '../assets/newcosmos/mbbs_card_image.png';
import EnquiryModal from '../components/EnquiryModal';
import medicalImage from '../assets/newcosmos/medical.png';

export default function MbbsLanding() {
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
                        <div className="flex-shrink-0 cursor-pointer" onClick={() => navigate('/cosmos')}>
                            <img src={CosmosLogo} alt="Cosmos Division" className="h-12 w-auto" />
                        </div>

                        {/* Desktop Nav */}
                        <nav className="hidden md:flex space-x-8 items-center absolute left-1/2 transform -translate-x-1/2">
                            <a href="#about" className="text-gray-600 hover:text-blue-600 font-medium text-sm">About MBBS</a>
                            <a href="#eligibility" className="text-gray-600 hover:text-blue-600 font-medium text-sm">Eligibility</a>
                            <a href="#destinations" className="text-gray-600 hover:text-blue-600 font-medium text-sm">Destinations</a>
                            <a href="#why-us" className="text-gray-600 hover:text-blue-600 font-medium text-sm">Why Cosmos</a>
                            <a href="#contact" className="text-gray-600 hover:text-blue-600 font-medium text-sm">Contact Us</a>
                        </nav>
                        
                        <div className="hidden md:block">
                            <button onClick={openEnquiryModal} className="bg-[#1e40af] text-white px-6 py-2.5 rounded-md font-semibold text-sm hover:bg-blue-800 transition shadow-lg shadow-blue-500/30">
                                Book Free Session
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
                        <a href="#about" className="block px-3 py-2 text-gray-600 font-medium">About MBBS</a>
                        <a href="#eligibility" className="block px-3 py-2 text-gray-600 font-medium">Eligibility</a>
                        <a href="#destinations" className="block px-3 py-2 text-gray-600 font-medium">Destinations</a>
                        <a href="#why-us" className="block px-3 py-2 text-gray-600 font-medium">Why Cosmos</a>
                        <a href="#contact" className="block px-3 py-2 text-gray-600 font-medium">Contact Us</a>
                        <button onClick={openEnquiryModal} className="w-full mt-4 bg-[#1e40af] text-white px-4 py-2 rounded-md font-semibold">
                            Book Free Session
                        </button>
                    </div>
                )}
            </header>

            {/* Breadcrumb & Hero Section */}
            <section className="pt-28 pb-20 bg-gradient-to-br from-[#f0fdf4] via-white to-[#e0f2fe] relative overflow-hidden">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    {/* Breadcrumb */}
                    <div className="flex items-center text-sm text-gray-500 mb-8">
                        <Link to="/cosmos" className="hover:text-blue-600">Home</Link>
                        <span className="mx-2">{'>'}</span>
                        <span className="hover:text-blue-600 cursor-pointer">Programs</span>
                        <span className="mx-2">{'>'}</span>
                        <span className="text-[#1e40af] font-semibold">MBBS Abroad</span>
                    </div>

                    <div className="grid lg:grid-cols-2 gap-12 items-center">
                        {/* Text Content */}
                        <motion.div 
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6 }}
                        >
                            <h1 className="text-5xl lg:text-[4rem] font-extrabold text-[#1e40af] mb-4 tracking-tight leading-none uppercase">
                                MBBS ABROAD
                            </h1>
                            <h2 className="text-2xl font-bold text-gray-900 mb-6">Your Pathway to a Global Medical Career</h2>
                            
                            <p className="text-lg text-gray-600 mb-12 max-w-lg leading-relaxed">
                                Study MBBS at internationally recognized medical universities and build a successful healthcare career with global exposure, affordable tuition fees, and quality education.
                            </p>
                            
                            {/* Icon Stats row */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-8">
                                {[
                                    { icon: "🏥", label: "Globally Recognized Universities", desc: "Degrees recognized by international medical bodies and accepted worldwide." },
                                    { icon: "📚", label: "High-Quality Education", desc: "Modern curriculum, advanced laboratories, and experienced faculty." },
                                    { icon: "💰", label: "Affordable Fee Structure", desc: "Quality medical education at a fraction of the cost of many private colleges." },
                                    { icon: "🌎", label: "Global Career Opportunities", desc: "Expand your career prospects with international exposure and global recognition." },
                                ].map((item, idx) => (
                                    <div key={idx} className="flex items-start gap-4 p-4 rounded-xl bg-white/60 hover:bg-white transition shadow-sm border border-white/50 backdrop-blur-sm">
                                        <div className="text-3xl shrink-0 leading-none">
                                            {item.icon}
                                        </div>
                                        <div>
                                            <div className="text-sm font-bold text-gray-900 mb-1">{item.label}</div>
                                            <div className="text-xs text-gray-600 leading-relaxed">{item.desc}</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </motion.div>

                        {/* Visual Content */}
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                            className="relative flex justify-center lg:justify-end"
                        >
                            <div className="relative w-full max-w-lg flex justify-center">
                                <img src={globeImage} alt="MBBS Abroad" className="w-full h-auto drop-shadow-2xl relative z-10" />
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* What is MBBS Abroad */}
            <section id="about" className="py-20 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid lg:grid-cols-2 gap-16 items-center">
                        <motion.div 
                            initial={{ opacity: 0, x: -30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6 }}
                            className="relative"
                        >
                            {/* Abstract Hospital visual */}
                            <div className="w-full aspect-video rounded-[2rem] overflow-hidden relative flex items-center justify-center shadow-xl border border-gray-100 bg-[#f4f7fb]">
                                <img src={mbbsCardImage} alt="About MBBS Abroad" className="w-full h-full object-cover md:object-contain" />
                            </div>
                        </motion.div>
                        
                        <motion.div 
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6 }}
                        >
                            <h3 className="text-blue-600 font-bold tracking-widest text-sm uppercase mb-3 px-4 py-1.5 bg-blue-50 inline-block rounded-full">About MBBS Abroad</h3>
                            <h2 className="text-3xl lg:text-4xl font-extrabold text-gray-900 mb-6">What is MBBS Abroad?</h2>
                            <p className="text-gray-600 text-lg leading-relaxed mb-8">
                                MBBS Abroad provides students with the opportunity to pursue a medical degree from internationally recognized universities. It offers world-class education, modern infrastructure, advanced teaching methodologies, and valuable global exposure.
                            </p>
                            
                            <ul className="space-y-4">
                                {[
                                    "Globally recognized medical degree",
                                    "Modern teaching methods and technologies",
                                    "Better international career opportunities",
                                    "Safe and student-friendly environment",
                                    "Affordable tuition fees",
                                    "Multicultural learning experience"
                                ].map((item, idx) => (
                                    <li key={idx} className="flex items-center gap-3">
                                        <div className="w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center text-white shrink-0">
                                            <CheckCircle2 className="w-4 h-4" />
                                        </div>
                                        <span className="font-semibold text-gray-800">{item}</span>
                                    </li>
                                ))}
                            </ul>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Who Can Apply - Eligibility */}
            <section id="eligibility" className="py-20 bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <span className="text-blue-600 font-bold tracking-widest text-xs uppercase mb-3 px-4 py-1.5 bg-blue-100 inline-block rounded-full flex items-center gap-2 mx-auto w-fit">
                            <BadgeCheck className="w-4 h-4" /> ELIGIBILITY CRITERIA
                        </span>
                        <h2 className="text-3xl lg:text-4xl font-extrabold text-gray-900 mt-4 mb-4">Who Can Apply?</h2>
                        <p className="text-gray-600 text-lg">Students who meet the following criteria can apply for MBBS Abroad programs.</p>
                    </div>

                    <div className="grid sm:grid-cols-1 md:grid-cols-3 gap-6">
                        {[
                            { icon: <GraduationCap />, title: "Academic Qualification", desc: "Completed Class 12th with Physics, Chemistry, Biology, and English. Minimum qualifying marks as per university requirements." },
                            { icon: <ClipboardCheck />, title: "NEET Qualification", desc: "NEET qualification is mandatory for Indian students as per current regulations.", color: "text-green-600" },
                            { icon: <CalendarDays />, title: "Minimum Marks Requirement", desc: "Minimum 50% aggregate marks in PCB (Physics, Chemistry, Biology). Reserved category candidates may have relaxation as per guidelines." },
                        ].map((item, i) => (
                            <motion.div 
                                key={i}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: i * 0.1 }}
                                className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex items-start gap-4 hover:shadow-md transition-shadow"
                            >
                                <div className={`w-12 h-12 rounded-full ${item.color ? 'bg-green-50 text-green-600' : 'bg-blue-50 text-blue-600'} flex items-center justify-center shrink-0`}>
                                    {item.icon}
                                </div>
                                <div>
                                    <h3 className="font-bold text-gray-900 mb-1">{item.title}</h3>
                                    <p className="text-sm text-gray-500 leading-snug">{item.desc}</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Countries We Offer MBBS In */}
            <section id="destinations" className="py-20 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl lg:text-4xl font-extrabold text-gray-900">Countries We Offer MBBS In</h2>
                    </div>

                    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {[
                            { 
                                country: "Tajikistan", 
                                flag: tajikistanFlag, 
                                img: tajikistanImg,
                                unis: ["Tajik National University", "Khatloon State Medical University"],
                                highlights: ["Affordable fee structure", "English-medium programs", "Growing destination for Indian students"]
                            },
                            { 
                                country: "Uzbekistan", 
                                flag: uzbekistanFlag, 
                                img: uzbekistanImg,
                                unis: ["Andijan State Medical University"],
                                highlights: ["Modern infrastructure", "Globally recognized degrees", "Strong clinical exposure"]
                            },
                            { 
                                country: "Georgia", 
                                flag: georgiaFlag, 
                                img: georgiaImg,
                                unis: ["European University Georgia", "Georgian National University"],
                                highlights: ["European-standard education", "High FMGE performance", "Safe and welcoming environment"]
                            },
                            { 
                                country: "Russia", 
                                flag: russiaFlag, 
                                img: russiaImg,
                                unis: ["Tambov State University", "Dagestan State Medical University", "Rostov State Medical University", "Kazan State Medical University", "Crimean Federal University"],
                                highlights: ["Long-established medical institutions", "Advanced research facilities", "Internationally recognized programs"]
                            },
                        ].map((item, i) => (
                            <motion.div 
                                key={i}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: i * 0.1 }}
                                className="group bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden flex flex-col relative h-full min-h-[450px]"
                            >
                                <div className="h-48 relative shrink-0">
                                    <div className="absolute inset-0 bg-blue-900/20 mix-blend-multiply z-10 transition-all duration-300 group-hover:bg-blue-900/40"></div>
                                    <img src={item.img} alt={item.country} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                                    {/* Flag badge */}
                                    <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 w-16 h-16 rounded-full border-4 border-white overflow-hidden shadow-md z-20 bg-white">
                                        <img src={item.flag} alt={`${item.country} Flag`} className="w-full h-full object-cover" />
                                    </div>
                                </div>
                                <div className="pt-10 pb-6 px-6 flex-grow flex flex-col transition-all duration-300 relative z-10 bg-white h-full">
                                    <h3 className="text-xl font-bold text-center text-gray-900 mb-6">{item.country}</h3>
                                    <div className="mb-2">
                                        <h4 className="text-sm font-bold text-gray-800 mb-3">Top Universities</h4>
                                        <ul className="space-y-2">
                                            {item.unis.map((uni, idx) => (
                                                <li key={idx} className="flex items-start gap-2 text-sm text-gray-600">
                                                    <Building className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
                                                    <span className="leading-tight">{uni}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>

                                {/* Hover Highlights Overlay */}
                                <div className="absolute inset-0 bg-[#1e40af] text-white p-6 flex flex-col justify-center translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-in-out z-30">
                                    <h3 className="text-2xl font-bold text-white mb-6 text-center">{item.country} Highlights</h3>
                                    <ul className="space-y-4">
                                        {item.highlights.map((highlight, idx) => (
                                            <li key={idx} className="flex items-start gap-3">
                                                <div className="w-6 h-6 rounded-full bg-blue-400/30 flex items-center justify-center shrink-0 mt-0.5">
                                                    <CheckCircle2 className="w-4 h-4 text-blue-100" />
                                                </div>
                                                <span className="font-medium text-blue-50 leading-snug">{highlight}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    {/* Stats Horizontal Row */}
                    <div className="mt-16 bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-wrap justify-between items-center gap-6">
                        {[
                            { icon: <Users />, label: "1000+ Students\nAlready Enrolled" },
                            { icon: <HeartPulse />, label: "Affordable Fees\nStructure" },
                            { icon: <ShieldCheck />, label: "No Donation\nPolicy" },
                            { icon: <FileText />, label: "FMGE / NExT\nCoaching Support" },
                            { icon: <CheckSquare />, label: "Visa Assistance\nProvided" },
                        ].map((stat, i) => (
                            <div key={i} className="flex items-center gap-3 w-[45%] md:w-auto">
                                <div className="text-blue-600">{stat.icon}</div>
                                <div className="text-sm font-bold text-gray-700 whitespace-pre-line leading-tight">{stat.label}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Why Choose Us */}
            <section id="why-us" className="py-20 bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="mb-12">
                        <span className="text-blue-600 font-bold tracking-widest text-xs uppercase mb-3 inline-block">WHY CHOOSE COSMOS?</span>
                        <h2 className="text-3xl lg:text-4xl font-extrabold text-gray-900">Why MBBS in Cosmos is Right For You?</h2>
                    </div>

                    <div className="grid lg:grid-cols-[1fr_auto] gap-16 items-center">
                        <div className="grid sm:grid-cols-2 gap-8">
                            {[
                                { icon: <ShieldCheck />, title: "Expert Guidance", desc: "Complete support from university selection to graduation." },
                                { icon: <Building />, title: "University Partnerships", desc: "Strong tie-ups with reputed international universities." },
                                { icon: <Globe2 />, title: "End-to-End Support", desc: "Assistance with admissions, documentation, visa processing, travel, accommodation, and onboarding." },
                                { icon: <HeartPulse />, title: "Affordable Packages", desc: "Transparent and budget-friendly fee structures." },
                                { icon: <BookOpen />, title: "FMGE / NEXT Coaching Support", desc: "Regular coaching, study materials, and mock tests to help students prepare for licensing examinations." },
                                { icon: <Clock />, title: "24×7 Student Support", desc: "Dedicated support team available throughout your academic journey." }
                            ].map((item, i) => (
                                <div key={i} className="flex items-start gap-4 group">
                                    <div className="w-12 h-12 rounded-full bg-white text-blue-600 border border-blue-100 shadow-sm flex items-center justify-center shrink-0 group-hover:bg-blue-600 group-hover:text-white transition">
                                        {item.icon}
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-gray-900">{item.title}</h4>
                                        <p className="text-sm text-gray-500">{item.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="hidden lg:flex justify-end relative w-full max-w-md ml-auto">
                            <img src={medicalImage} alt="Why Choose Cosmos" className="w-full h-auto drop-shadow-2xl" />
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Banner */}
            <section className="bg-gradient-to-r from-[#1e40af] to-blue-600 py-16 relative overflow-hidden">
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute top-0 right-10 w-40 h-40 border-4 border-white rounded-full"></div>
                    <div className="absolute bottom-0 left-20 w-60 h-60 border-4 border-white rounded-full"></div>
                </div>
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
                    <div className="max-w-2xl">
                        <h2 className="text-3xl font-bold text-white mb-2">Ready to Start Your Medical Journey?</h2>
                        <p className="text-blue-100 text-lg leading-relaxed">Book a free one-on-one counseling session with our experts and receive personalized guidance on universities, admissions, visas, and career opportunities.</p>
                    </div>
                    <button onClick={openEnquiryModal} className="bg-white text-[#1e40af] px-8 py-4 rounded-xl font-bold text-lg hover:bg-blue-50 transition shadow-xl shrink-0 flex items-center gap-2">
                        Book Free Counseling Session <ArrowRight className="w-5 h-5" />
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
                                Cosmos Division is committed to helping students achieve their dream of studying abroad and building a successful medical career.
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
                                <li><a href="#about" className="hover:text-white transition">About MBBS</a></li>
                                <li><a href="#eligibility" className="hover:text-white transition">Eligibility</a></li>
                                <li><a href="#destinations" className="hover:text-white transition">Destinations</a></li>
                                <li><a href="#why-us" className="hover:text-white transition">Why Cosmos</a></li>
                                <li><a href="#contact" className="hover:text-white transition">Contact Us</a></li>
                            </ul>
                        </div>
                        
                        <div>
                            <h4 className="text-white font-bold text-lg mb-6">Programs</h4>
                            <ul className="space-y-3 text-sm">
                                <li><Link to="/cosmos/mbbs" className="hover:text-white transition">MBBS Abroad</Link></li>
                                <li><Link to="/cosmos/sat" className="hover:text-white transition">SAT Program</Link></li>
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
