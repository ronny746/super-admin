import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Phone, Download, MapPin, ArrowRight, CheckCircle2,
    BookOpen, Users, Clock, Shield, Coffee, ChevronDown,
    Star, GraduationCap, Building, Video, Target, Camera,
    MessageCircle, Calendar
} from 'lucide-react';

// Assets
import vidhyakulamImg from '../assets/vidhyakulam.jpeg';
import unacademyLogo from '../../landing-page/assets/images/unacademy-centre-logo.jpeg';
import brochurePdf from '../../landing-page/assets/images/Brouchere.pdf';

import vd1Img from '../assets/VD1.jpg';
import vd2Img from '../assets/VD2.jpg';
import vd4Img from '../assets/VD4.jpg';
import vd5Img from '../assets/VD5.jpg';
import vd6Img from '../assets/VD6.jpg';
import vd9Img from '../assets/VD9.jpg';
import vd10Img from '../assets/VD10.jpg';
import vd11Img from '../assets/VD11.jpg';
import vd12Img from '../assets/VD12.jpg';
import vd13Img from '../assets/VD13.jpg';

const VidhyakulamHome = () => {
    // FAQ State
    const [openFaq, setOpenFaq] = useState(null);

    const toggleFaq = (index) => {
        setOpenFaq(openFaq === index ? null : index);
    };

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <div className="w-full bg-[#FCFCFC] overflow-hidden scroll-smooth">

            {/* FLOATING ACTION BUTTONS */}
            <div className="fixed bottom-6 right-6 z-[100] flex flex-col gap-3">
                <a href="https://wa.me/916366527093" target="_blank" rel="noopener noreferrer" className="bg-green-500 text-white w-14 h-14 rounded-full shadow-2xl flex items-center justify-center hover:scale-110 transition-transform cursor-pointer relative group">
                    <MessageCircle className="w-7 h-7" />
                    <span className="absolute right-full mr-4 bg-gray-900 text-white text-xs px-3 py-1.5 rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">Chat on WhatsApp</span>
                </a>
                <a href="tel:6366527093" className="bg-blue-600 text-white w-14 h-14 rounded-full shadow-2xl flex items-center justify-center hover:scale-110 transition-transform cursor-pointer relative group">
                    <Phone className="w-6 h-6" />
                    <span className="absolute right-full mr-4 bg-gray-900 text-white text-xs px-3 py-1.5 rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">Call Us Now</span>
                </a>
            </div>

            {/* 1. HERO SECTION */}
            <section className="relative pt-12 pb-20 lg:pt-20 lg:pb-28 overflow-hidden bg-gradient-to-b from-blue-50/50 to-white">
                <div className="absolute top-0 right-0 -translate-y-12 translate-x-1/3 z-0">
                    <div className="w-[600px] h-[600px] bg-blue-100/40 rounded-full blur-3xl" />
                </div>

                <div className="container mx-auto px-4 sm:px-6 relative z-10 max-w-7xl">
                    <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-8">
                        {/* Text Content */}
                        <motion.div
                            initial={{ opacity: 0, x: -30 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.6 }}
                            className="w-full lg:w-1/2 text-center lg:text-left z-10"
                        >


                            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-gray-900 leading-[1.1] mb-5 tracking-tight">
                                Vidhyakulam <br className="hidden sm:block" />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
                                    Residential Program
                                </span>
                            </h1>

                            <p className="text-xl md:text-2xl font-bold text-gray-800 mb-4 inline-block bg-yellow-100 px-2 py-1 -mx-2 rounded rotate-1">
                                Learn, Live & Excel in Kota
                            </p>

                            <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto lg:mx-0 leading-relaxed font-medium">
                                Premium Residential Coaching Program for JEE, NEET & Foundation (Classes 6–12 & 12 Pass). The ultimate ecosystem for serious aspirants.
                            </p>

                            <div className="flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start mb-6">
                                <a href="/admin/form/vidhyakulam" target="_blank" rel="noopener noreferrer" className="w-full sm:w-auto px-8 py-4 bg-linear-to-r from-blue-600 to-indigo-600 text-white font-bold rounded-xl shadow-lg hover:shadow-blue-500/40 hover:-translate-y-1 transition-all flex items-center justify-center gap-2">
                                    Enroll Now
                                    <ArrowRight className="w-5 h-5" />
                                </a>
                                <a href={brochurePdf} download className="w-full sm:w-auto px-8 py-4 bg-white text-gray-800 border-2 border-gray-200 font-bold rounded-xl hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700 transition-all flex items-center justify-center gap-2 shadow-sm">
                                    <Download className="w-5 h-5" />
                                    Download Brochure
                                </a>
                            </div>


                        </motion.div>

                        {/* Image & Lead Form Content */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                            className="w-full lg:w-1/2 relative"
                        >
                            <div className="relative rounded-3xl overflow-hidden shadow-2xl border-[6px] border-white w-full group bg-white">
                                <img src={vidhyakulamImg} alt="Vidhyakulam Campus" className="w-full h-auto object-contain transform group-hover:scale-105 transition-transform duration-700" />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>

                                <div className="absolute bottom-6 left-6 right-6 text-white text-left">
                                    <p className="font-bold text-lg">Integrated Campus Ecosystem</p>
                                    <p className="text-white/80 text-sm">Classes + Hostel + 24/7 Library</p>
                                </div>
                            </div>


                        </motion.div>
                    </div>
                </div>
            </section>

            {/* 2. ABOUT VIDHYAKULAM */}
            <section className="py-20 bg-white" id="about">
                <div className="container mx-auto px-4 sm:px-6 max-w-7xl">
                    <div className="flex flex-col lg:flex-row items-center gap-12">
                        <div className="w-full lg:w-1/2">
                            <h2 className="text-3xl sm:text-4xl font-black text-gray-900 mb-6 relative inline-block">
                                About Vidhyakulam
                                <div className="absolute -bottom-2 left-0 w-1/2 h-1.5 bg-blue-600 rounded-full"></div>
                            </h2>
                            <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                                <strong className="text-gray-900">Vidhyakulam</strong> is a fully integrated residential academic program by <strong className="text-blue-600">Unacademy Centre, Kota</strong>.
                            </p>
                            <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                                Designed for serious aspirants of JEE and NEET, the program combines expert faculty, school alignment, hostel living, and 24×7 academic support under one disciplined ecosystem.
                            </p>

                            <div className="grid grid-cols-2 gap-4">
                                {[
                                    { icon: <Target />, text: "Academic excellence" },
                                    { icon: <Users />, text: "Personal mentoring" },
                                    { icon: <Clock />, text: "Structured daily routine" },
                                    { icon: <Shield />, text: "Safe & secure environment" }
                                ].map((item, i) => (
                                    <div key={i} className="flex items-center gap-3 bg-gray-50 p-4 rounded-xl border border-gray-100">
                                        <div className="text-blue-600">{item.icon}</div>
                                        <span className="font-bold text-gray-800 text-sm">{item.text}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="w-full lg:w-1/2 relative">
                            <img src={vd12Img} alt="About Vidhyakulam" className="rounded-3xl shadow-2xl w-full object-cover" />
                        </div>
                    </div>
                </div>
            </section>

            {/* 3. PROGRAMS OFFERED */}
            <section className="py-20 bg-gray-50 border-y border-gray-100">
                <div className="container mx-auto px-4 sm:px-6 max-w-7xl">
                    <div className="text-center mb-16">
                        <span className="text-blue-600 font-bold tracking-wider uppercase text-sm mb-2 block">Our Courses</span>
                        <h2 className="text-3xl sm:text-4xl font-black text-gray-900 inline-block relative">
                            Programs We Offer
                            <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-20 h-1.5 bg-blue-600 rounded-full"></div>
                        </h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {[
                            { title: "JEE (Main & Advanced)", tag: "Engineering" },
                            { title: "NEET (UG)", tag: "Medical" },
                            { title: "Foundation Program (Classes 6–10)", tag: "Junior" },
                            { title: "11th & 12th Integrated Program", tag: "Schooling" },
                            { title: "12th Pass Dropper Batch", tag: "Target" }
                        ].map((prog, i) => (
                            <motion.div
                                whileHover={{ y: -5 }}
                                key={i}
                                className="bg-white rounded-2xl p-8 border border-gray-200 shadow-sm hover:shadow-xl transition-all relative overflow-hidden group"
                            >
                                <div className="absolute top-0 right-0 p-4">
                                    <span className="bg-blue-50 text-blue-600 text-xs font-bold px-3 py-1 rounded-full">{prog.tag}</span>
                                </div>
                                <GraduationCap className="w-10 h-10 text-blue-600 mb-6" />
                                <h3 className="text-xl font-bold text-gray-900 mb-4">{prog.title}</h3>
                                <p className="text-gray-500 text-sm mb-6">Comprehensive coaching structured by Kota's top educators with specialized studying materials.</p>
                                <a href="/admin/form/vidhyakulam" target="_blank" rel="noopener noreferrer" className="inline-flex items-center text-blue-600 font-bold hover:text-blue-800 transition-colors group-hover:underline">
                                    Enquire Now <ArrowRight className="w-4 h-4 ml-1" />
                                </a>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* 4. HIGHLIGHTS / WHY CHOOSE */}
            <section className="py-20 bg-white">
                <div className="container mx-auto px-4 sm:px-6 max-w-7xl">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl sm:text-4xl font-black text-gray-900 inline-block relative">
                            Why Choose Vidhyakulam?
                            <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-24 h-1.5 bg-blue-600 rounded-full"></div>
                        </h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {[
                            { icon: <Star />, title: "India's Best Educators" },
                            { icon: <Building />, title: "School Support (CBSE / State)" },
                            { icon: <Target />, title: "Olympiad Preparation" },
                            { icon: <Shield />, title: "Safe & Disciplined Hostel" },
                            { icon: <Coffee />, title: "Nutrition-rich Meals" },
                            { icon: <Users />, title: "Well-being & Extracurriculars" },
                            { icon: <Clock />, title: "24×7 Academic Support" },
                            { icon: <Video />, title: "24×7 CCTV Surveillance" }
                        ].map((item, i) => (
                            <div key={i} className="bg-gray-50 rounded-2xl p-6 border border-gray-100 hover:border-blue-200 hover:bg-blue-50 transition-colors flex flex-col items-center text-center group">
                                <div className="w-14 h-14 bg-white rounded-full shadow-sm flex items-center justify-center text-blue-600 mb-4 group-hover:scale-110 transition-transform">
                                    {React.cloneElement(item.icon, { className: 'w-6 h-6' })}
                                </div>
                                <h3 className="font-bold text-gray-900 text-sm md:text-base">{item.title}</h3>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* 5. HOSTEL & FACILITIES */}
            <section className="py-20 bg-gray-900 text-white relative overflow-hidden">
                <div className="absolute inset-0 z-0 opacity-20">
                    <img src={vd10Img} alt="Hostel Background" className="w-full h-full object-cover" />
                </div>
                <div className="container mx-auto px-4 sm:px-6 relative z-10 max-w-7xl">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl sm:text-4xl font-black inline-block relative">
                            World-Class Facilities
                            <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-20 h-1.5 bg-blue-500 rounded-full"></div>
                        </h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                        <div className="space-y-6">
                            {[
                                "Separate hostel for boys & girls",
                                "Clean & spacious rooms",
                                "Balanced, hygienic meals",
                                "Dedicated study hall",
                                "24×7 doubt support",
                                "Round-the-clock security & CCTV"
                            ].map((text, i) => (
                                <div key={i} className="flex items-center gap-4 bg-white/10 backdrop-blur-sm p-4 rounded-xl border border-white/20 hover:bg-white/20 transition-colors">
                                    <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center shrink-0">
                                        <CheckCircle2 className="w-5 h-5 text-white" />
                                    </div>
                                    <span className="font-bold text-lg">{text}</span>
                                </div>
                            ))}
                        </div>
                        <div className="flex flex-col gap-4">
                            <img src={vd1Img} alt="Hostel Room" className="rounded-2xl w-full h-56 object-cover" />
                            <img src={vd2Img} alt="Dining Hall" className="rounded-2xl w-full h-56 object-cover" />
                        </div>
                    </div>
                </div>
            </section>

            {/* 6. ACADEMIC SUPPORT */}
            <section className="py-20 bg-white">
                <div className="container mx-auto px-4 sm:px-6 max-w-7xl">
                    <div className="flex flex-col lg:flex-row-reverse items-center gap-12">
                        <div className="w-full lg:w-1/2">
                            <h2 className="text-3xl sm:text-4xl font-black text-gray-900 mb-8 relative inline-block">
                                Academic Support System
                                <div className="absolute -bottom-2 left-0 w-1/2 h-1.5 bg-blue-600 rounded-full"></div>
                            </h2>
                            <ul className="space-y-5">
                                {[
                                    { title: "Structured Daily Timetable", desc: "Optimized for learning and self-study" },
                                    { title: "Weekly Tests & Analysis", desc: "Detailed performance tracking" },
                                    { title: "Parent Performance Updates", desc: "Keeping parents informed constantly" },
                                    { title: "Personal Mentorship", desc: "1-on-1 guidance for every student" },
                                    { title: "Dedicated Doubt Counters", desc: "Available when students need help" },
                                    { title: "Academic Review Meetings", desc: "Regular strategy and correction sessions" }
                                ].map((item, i) => (
                                    <li key={i} className="flex gap-4">
                                        <div className="mt-1">
                                            <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center">
                                                <div className="w-2.5 h-2.5 bg-blue-600 rounded-full"></div>
                                            </div>
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-gray-900 text-lg">{item.title}</h4>
                                            <p className="text-gray-500">{item.desc}</p>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div className="w-full lg:w-1/2 relative">
                            <div className="grid grid-cols-2 gap-4">
                                <img src={vd5Img} alt="Academic Mentorship" className="rounded-2xl w-full h-56 object-cover" />
                                <img src={vd6Img} alt="Academic Facilities" className="rounded-2xl w-full h-56 object-cover" />
                                <img src={vd4Img} alt="Study Session" className="rounded-2xl w-full h-48 object-cover col-span-2" />
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* 7. LOCATION & MAP */}
            <section className="py-20 bg-gray-50 border-t border-gray-200">
                <div className="container mx-auto px-4 sm:px-6 max-w-7xl">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl sm:text-4xl font-black text-gray-900 inline-block relative">
                            Located in the Heart of Kota
                            <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-20 h-1.5 bg-blue-600 rounded-full"></div>
                        </h2>
                    </div>

                    <div className="flex flex-col lg:flex-row gap-8 bg-white rounded-3xl overflow-hidden shadow-lg border border-gray-100">
                        <div className="lg:w-1/2 p-8 lg:p-12">
                            <h3 className="text-xl font-bold mb-6 text-gray-900">Our Campuses</h3>

                            <div className="space-y-6">
                                <div className="flex gap-4">
                                    <MapPin className="w-6 h-6 text-blue-600 shrink-0 mt-1" />
                                    <div>
                                        <h4 className="font-bold text-gray-900 text-lg">Unacademy Tower</h4>
                                        <p className="text-gray-600">B-21, Road No. 2, Indraprastha Industrial Area, Kota</p>
                                    </div>
                                </div>

                                <div className="flex gap-4">
                                    <MapPin className="w-6 h-6 text-blue-600 shrink-0 mt-1" />
                                    <div>
                                        <h4 className="font-bold text-gray-900 text-lg">Prathmesh Tower</h4>
                                        <p className="text-gray-600">Special 11, (Old Om Cine Plex), Indira Vihar, Kota</p>
                                    </div>
                                </div>

                                <div className="pt-6 border-t border-gray-100">
                                    <div className="flex gap-4 items-center">
                                        <Phone className="w-6 h-6 text-blue-600" />
                                        <a href="tel:6366527093" className="font-bold text-gray-900 text-xl hover:text-blue-600 transition-colors">6366527093</a>
                                    </div>
                                </div>

                                <a href="/admin/form/vidhyakulam" target="_blank" rel="noopener noreferrer" className="w-full py-4 mt-4 bg-gray-100 font-bold text-gray-800 rounded-xl hover:bg-gray-200 transition-colors flex items-center justify-center gap-2">
                                    <Calendar className="w-5 h-5" />
                                    Book a Campus Tour
                                </a>
                            </div>
                        </div>
                        <div className="lg:w-1/2 min-h-[400px]">
                            {/* Map Image Placeholder (Replacing Google Map Embed) */}
                            <img
                                src={vd13Img}
                                alt="Kota Rajasthan - Seven Wonders Park"
                                className="w-full h-full object-cover rounded-3xl"
                            />
                        </div>
                    </div>
                </div>
            </section>

            {/* 8. TESTIMONIALS */}
            {/* <section className="py-20 bg-white">
                <div className="container mx-auto px-4 sm:px-6 max-w-7xl">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl sm:text-4xl font-black text-gray-900 inline-block relative">
                            Success Stories
                            <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-20 h-1.5 bg-blue-600 rounded-full"></div>
                        </h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="bg-blue-50/50 rounded-3xl p-8 border border-blue-100">
                            <div className="flex gap-2 text-yellow-500 mb-4">
                                <Star className="fill-current w-5 h-5" /><Star className="fill-current w-5 h-5" /><Star className="fill-current w-5 h-5" /><Star className="fill-current w-5 h-5" /><Star className="fill-current w-5 h-5" />
                            </div>
                            <p className="text-gray-700 italic mb-6 text-lg">"The disciplined environment at Vidhyakulam changed my approach to studying. Having teachers available for doubt clearing late at night in the study hall was a game changer for my JEE prep."</p>
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">ST</div>
                                <div>
                                    <h4 className="font-bold text-gray-900">Student Name</h4>
                                    <p className="text-sm text-gray-500">JEE Advanced Ranker</p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-gray-50 rounded-3xl p-8 border border-gray-100">
                            <div className="flex gap-2 text-yellow-500 mb-4">
                                <Star className="fill-current w-5 h-5" /><Star className="fill-current w-5 h-5" /><Star className="fill-current w-5 h-5" /><Star className="fill-current w-5 h-5" /><Star className="fill-current w-5 h-5" />
                            </div>
                            <p className="text-gray-700 italic mb-6 text-lg">"As parents, our primary concern was safety and food. Vidhyakulam exceeds expectations in both. We get regular updates and our child is very happy with the integrated schooling and coaching."</p>
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-gray-800 rounded-full flex items-center justify-center text-white font-bold">PT</div>
                                <div>
                                    <h4 className="font-bold text-gray-900">Parent Name</h4>
                                    <p className="text-sm text-gray-500">Father of NEET Aspirant</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section> */}

            {/* 9. LEAD FORM & CALL TO ACTION (ABOVE THE FOLD THEME REPEATED) */}
            <section className="py-20 bg-gradient-to-br from-blue-900 to-indigo-900 text-white relative overflow-hidden" id="enroll">
                {/* Background Pattern */}
                <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '24px 24px' }}></div>

                <div className="container mx-auto px-4 sm:px-6 max-w-5xl relative z-10 text-center">
                    <h2 className="text-4xl md:text-5xl font-black mb-6">
                        Ready to Begin Your Journey?
                    </h2>
                    <p className="text-xl text-blue-200 mb-10 max-w-2xl mx-auto">
                        Limited seats available. Secure your place in Kota's premier structured residential learning program today.
                    </p>

                    <div className="bg-white rounded-3xl overflow-hidden shadow-2xl flex flex-col md:flex-row items-stretch max-w-4xl mx-auto">
                        <div className="w-full md:w-2/5 relative min-h-[300px]">
                            <img src={vd9Img} alt="Vidhyakulam Life" className="w-full h-full object-cover" />
                        </div>
                        <div className="w-full md:w-3/5 p-8 md:p-12 text-center md:text-left flex flex-col justify-center bg-white">
                            <h3 className="text-2xl md:text-3xl font-black text-gray-900 mb-4 leading-tight">Request a Call Back</h3>
                            <p className="text-gray-600 mb-8 font-medium italic">"Your child's future is our priority. Let's talk about the best path."</p>

                            <div className="flex justify-center md:justify-start">
                                <a
                                    href="/admin/form/vidhyakulam"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center justify-center w-full sm:w-auto px-10 py-5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-black rounded-2xl shadow-xl hover:shadow-indigo-500/40 hover:-translate-y-1 transition-all text-xl gap-2 group"
                                >
                                    Submit Enquiry
                                    <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
                                </a>
                            </div>
                            <p className="text-center md:text-left text-xs text-gray-400 mt-6 font-medium">Redirects to our secure response portal.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* 10. FAQ SECTION */}
            <section className="py-20 bg-gray-50">
                <div className="container mx-auto px-4 sm:px-6 max-w-4xl">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl sm:text-4xl font-black text-gray-900 inline-block relative">
                            Frequently Asked Questions
                            <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-20 h-1.5 bg-blue-600 rounded-full"></div>
                        </h2>
                    </div>

                    <div className="space-y-4">
                        {[
                            { q: "Is school integrated in the program?", a: "Yes, we provide complete school support and alignment for both CBSE and State Boards so students don't have to manage dual workloads." },
                            { q: "Is hostel compulsory?", a: "To maintain the strict academic discipline and 24x7 support ecosystem, the hostel is a mandatory part of the Vidhyakulam residential program." },
                            { q: "What is the daily schedule?", a: "The schedule includes morning classes, school sessions, dedicated self-study hours in the study hall, doubt solving sessions, and adequate time for meals, rest, and sports." },
                            { q: "Are meals included?", a: "Yes, nutritious and strictly hygienic meals (Breakfast, Lunch, Evening Snacks, and Dinner) are provided daily." },
                            { q: "Is there medical support?", a: "Yes, we have tie-ups with nearby hospitals and a basic medical room on campus for immediate first-aid and routine checkups." },
                            { q: "How often are tests conducted?", a: "Tests are conducted weekly/bi-weekly depending on the batch, followed by thorough performance analysis and review meetings." },
                            { q: "Is there a separate hostel for girls?", a: "Absolutely. We have strictly segregated and secure hostel buildings for boys and girls with dedicated wardens and 24x7 security." }
                        ].map((faq, index) => (
                            <div key={index} className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
                                <button
                                    onClick={() => toggleFaq(index)}
                                    className="w-full px-6 py-5 text-left font-bold text-gray-900 flex justify-between items-center focus:outline-none"
                                >
                                    <span className="text-lg pr-4">{faq.q}</span>
                                    <ChevronDown className={`w-5 h-5 text-blue-600 transition-transform duration-300 shrink-0 ${openFaq === index ? 'rotate-180' : ''}`} />
                                </button>
                                <AnimatePresence>
                                    {openFaq === index && (
                                        <motion.div
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: "auto", opacity: 1 }}
                                            exit={{ height: 0, opacity: 0 }}
                                            transition={{ duration: 0.3 }}
                                            className="px-6 pb-5 text-gray-600 border-t border-gray-100 pt-4 bg-gray-50"
                                        >
                                            <p>{faq.a}</p>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

        </div>
    );
};

export default VidhyakulamHome;
