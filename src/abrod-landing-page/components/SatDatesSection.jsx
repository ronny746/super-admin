import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import abroad2 from '../assets/abroad-2.jpg';
import ieltsImg from '../assets/IELTS.jpeg';
import profileImg from '../assets/profile-building.jpeg';
import { CosmicStarField, ParticleNetwork, FloatingRings } from './ThreeDGraphic';

const SatDatesSection = () => {
    return (
        <section id="sat-dates" className="py-12 md:py-20 bg-white border-t border-gray-100 scroll-mt-20 relative overflow-hidden">
            <CosmicStarField />

            {/* 3D Animated Background Element */}
            <div className="absolute bottom-40 -left-20 w-[500px] h-[500px] opacity-40 pointer-events-none hidden lg:block z-0">
                <ParticleNetwork />
            </div>
            <div className="absolute top-40 -right-20 opacity-30 pointer-events-none hidden lg:block z-0">
                <FloatingRings size="w-80 h-80" />
            </div>

            <div className="container mx-auto px-4 md:px-6 relative z-10">

                {/* Header with Yellow Badge */}
                <div className="text-center mb-12 md:mb-16">
                    <span className="bg-[#FFD700] text-black font-bold px-4 py-1.5 uppercase tracking-wider text-xs md:text-sm rounded-full mb-4 inline-block shadow-sm">
                        Important Dates
                    </span>
                    <h2 className="text-3xl md:text-5xl font-bold text-[#000080] mb-4">
                        DIGITAL SAT DATES
                    </h2>
                    <div className="h-1 w-24 bg-[#0047AB] mx-auto rounded-full"></div>
                </div>

                {/* Dates Table - FULLY RESPONSIVE */}
                <div className="mb-12 rounded-xl shadow-lg border-2 border-[#82C8E5] overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full min-w-[600px] border-collapse text-xs md:text-base">
                            <thead>
                                <tr className="bg-[#A7D8ED] text-black border-b-2 border-[#82C8E5]">
                                    <th className="p-3 md:p-4 text-left border-r-2 border-[#82C8E5] font-black tracking-wider">SAT TEST DATES</th>
                                    <th className="p-3 md:p-4 text-left border-r-2 border-[#82C8E5] font-black tracking-wider">REGISTRATION DEADLINES</th>
                                    <th className="p-3 md:p-4 text-left font-black tracking-wider">DEADLINE FOR CHANGES</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white text-gray-700">
                                {[
                                    { date: 'MARCH 14, 2026', reg: 'Feb. 27, 2026', deadline: 'March 3, 2026' },
                                    { date: 'MAY 2, 2026', reg: 'Apr. 17, 2026', deadline: 'April 21, 2026' },
                                    { date: 'JUNE 6, 2026', reg: 'May 22, 2026', deadline: 'May 26, 2026' },
                                ].map((row, index) => (
                                    <tr key={index} className="hover:bg-[#F3F8FB] transition-colors border-b border-[#B3D9EE]/50 font-medium last:border-b-0">
                                        <td className="p-3 md:p-4 border-r border-[#B3D9EE]/50">{row.date}</td>
                                        <td className="p-3 md:p-4 border-r border-[#B3D9EE]/50">{row.reg}</td>
                                        <td className="p-3 md:p-4">{row.deadline}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    {/* Mobile Scroll Hint */}
                    <div className="md:hidden text-center py-2 bg-blue-50 text-xs text-gray-600">
                        ← Scroll horizontally to see all columns →
                    </div>
                </div>

                {/* Confirmed Dates */}
                <div className="mb-12 md:mb-20">
                    <h3 className="text-lg md:text-xl font-bold text-[#0047AB] underline mb-6">CONFIRMED DATES -</h3>
                    <ul className="space-y-3 md:space-y-4">
                        {[
                            'August 15, 2026',
                            'September 12, 2026',
                            'October 3, 2026',
                            'November 7, 2026',
                            'December 5, 2026'
                        ].map((date, index) => (
                            <li key={index} className="flex items-center gap-3 font-bold text-black text-sm md:text-base">
                                <div className="w-1.5 h-1.5 bg-black rounded-full flex-shrink-0" />
                                {date}
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Value Addition Section with BACKGROUND IMAGE */}
                <div className="relative rounded-2xl md:rounded-[2.5rem] overflow-hidden shadow-2xl">
                    {/* Background Image */}
                    <div className="absolute inset-0">
                        <img src={abroad2} alt="Value Add Background" className="w-full h-full object-contain opacity-10 grayscale hover:grayscale-0 transition-all duration-1000" />
                        <div className="absolute inset-0 bg-gradient-to-r from-white via-white/80 to-transparent"></div>
                    </div>

                    <div className="relative z-10 p-6 md:p-8 lg:p-12 space-y-8 md:space-y-12">
                        <div className="flex items-center gap-3 md:gap-4 mb-2">
                            <div className="w-2 h-2 bg-[#0047AB] rounded-full flex-shrink-0"></div>
                            <h3 className="text-lg md:text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#0047AB] to-[#000080]">
                                VALUE ADDITION – IELTS/TOEFL + Profile Building Support
                            </h3>
                        </div>

                        {/* IELTS / TOEFL */}
                        <div className="bg-white/90 backdrop-blur-md rounded-3xl p-6 md:p-8 shadow-sm border border-[#E5F1F8] transform hover:-translate-y-1 transition-transform duration-300 flex flex-col lg:flex-row gap-8 items-center">
                            <div className="flex-1">
                                <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-100">
                                    <div className="w-10 h-10 rounded-full bg-[#E5F1F8] flex items-center justify-center">
                                        <span className="text-xl">🌍</span>
                                    </div>
                                    <h4 className="text-xl md:text-2xl font-bold text-[#000080]">IELTS / TOEFL</h4>
                                </div>
                                <ul className="space-y-4">
                                    {[
                                        'Globally recognized English proficiency tests',
                                        'Required by top universities (UK, USA, Canada, Australia, etc.)',
                                        'Covers Listening, Reading, Writing & Speaking skills',
                                        'Builds strong academic English foundation',
                                        'Helps in university applications & visa process',
                                        'Prepares students for international admissions confidently'
                                    ].map((point, idx) => (
                                        <li key={idx} className="flex items-start gap-4">
                                            <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-[#82C8E5] flex-shrink-0 relative">
                                                <div className="absolute inset-0 bg-[#82C8E5] rounded-full animate-ping opacity-20"></div>
                                            </div>
                                            <span className="text-gray-700 text-base md:text-lg font-medium">{point}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            <div className="lg:w-1/3 w-full flex justify-center items-center">
                                <img src={ieltsImg} alt="IELTS" className="max-w-full h-auto object-contain" />
                            </div>
                        </div>

                        {/* Profile Building */}
                        <div className="bg-white/90 backdrop-blur-md rounded-3xl p-6 md:p-8 shadow-sm border border-[#E5F1F8] transform hover:-translate-y-1 transition-transform duration-300 mt-8 flex flex-col lg:flex-row gap-8 items-center">
                            <div className="flex-1">
                                <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-100">
                                    <div className="w-10 h-10 rounded-full bg-[#E5F1F8] flex items-center justify-center">
                                        <span className="text-xl">🎯</span>
                                    </div>
                                    <div className="flex flex-col">
                                        <h4 className="text-xl md:text-2xl font-bold text-[#000080]">Profile Building</h4>
                                        <span className="text-sm font-semibold text-[#82C8E5] tracking-wide uppercase">Free Value Addition</span>
                                    </div>
                                </div>
                                <ul className="space-y-4">
                                    {[
                                        'Top universities evaluate overall profile, not just marks',
                                        'Focus on extracurriculars, leadership & real-world projects',
                                        'Guidance for volunteering & impactful activities',
                                        'Strong application narratives & personal storytelling',
                                        'Personalized mentorship & structured support',
                                        'Makes students exam-ready and future-ready'
                                    ].map((point, idx) => (
                                        <li key={idx} className="flex items-start gap-4">
                                            <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-[#0047AB] flex-shrink-0 relative">
                                                <div className="absolute inset-0 bg-[#0047AB] rounded-full animate-ping opacity-20"></div>
                                            </div>
                                            <span className="text-gray-700 text-base md:text-lg font-medium">{point}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            <div className="lg:w-1/3 w-full flex justify-center items-center">
                                <img src={profileImg} alt="Profile Builder" className="max-w-full h-auto object-contain" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        </section >
    );
};

export default SatDatesSection;
