import React from "react";
import { FiGift, FiMessageCircle, FiMonitor, FiClock } from 'react-icons/fi';
import { BsBuilding } from 'react-icons/bs';
import centreImage from '../assets/images/centre-image.jpeg';

const VisitCentre = () => {
    return (
        <section className="py-12 bg-white">
            <div className="max-w-[1240px] mx-auto px-4 md:px-6">
                <div className="bg-[#FFF3E3] rounded-[24px] p-8 md:p-12 lg:p-16 flex flex-col-reverse lg:flex-row items-center gap-12 lg:gap-20">

                    {/* Left Content */}
                    <div className="flex-1 w-full">
                        <h2 className="text-[28px] md:text-[36px] font-bold text-[#3C4852] mb-10 leading-tight">
                            Visit the centre for a <br className="hidden md:block" />
                            personalized experience
                        </h2>

                        {/* Features Grid */}
                        <div className="grid md:grid-cols-2 gap-x-8 gap-y-10 mb-10">

                            {/* Item 1 */}
                            <div className="flex items-start gap-4">
                                <div className="w-12 h-12 flex-shrink-0 text-[#C67C4E]">
                                    {/* Custom SVG for cleaner look matching the image */}
                                    <svg viewBox="0 0 24 24" fill="currentColor" className="w-10 h-10">
                                        <path d="M20 7h-4.19c.17-.67.24-1.28.16-1.78-.26-1.71-2.22-2.75-4.4-2.31-1.39.27-2.39 1.25-2.6 1.48-.2-.23-1.21-1.21-2.6-1.48-2.18-.44-4.14.6-4.4 2.31-.08.5-.01 1.11.16 1.78H2v2h2v10h16V9h2V7zM9.91 5c.42.08.83.42 1.09.82-.6.18-1.55.57-2.73 1.1-.38-.72-.44-1.33-.4-1.6.14-.94 1.25-1.51 2.04-1.35v.03zm-5.46.7c.18-1.21 1.63-1.69 2.51-1.51.52.1.84.44.97.66.08.13.13.29.13.46 0 .34-.1.74-.29 1.18-1.42-.58-2.58-1-3.23-1.12-.04-.01-.06.33-.09.33zm4.55 13.3H4V9h5v10zm2 0V9h8v10h-8z" />
                                    </svg>
                                </div>
                                <div>
                                    <p className="text-[#3C4852] text-[15px] leading-snug">
                                        Get exclusive Unacademy <br />
                                        goodies and swag
                                    </p>
                                </div>
                            </div>

                            {/* Item 2 */}
                            <div className="flex items-start gap-4">
                                <div className="w-12 h-12 flex-shrink-0 text-[#C67C4E]">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-10 h-10">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                                    </svg>
                                </div>
                                <div>
                                    <p className="text-[#3C4852] text-[15px] leading-snug">
                                        Avail personal priority <br />
                                        counseling session
                                    </p>
                                </div>
                            </div>

                            {/* Item 3 */}
                            <div className="flex items-start gap-4">
                                <div className="w-12 h-12 flex-shrink-0 text-[#C67C4E]">
                                    <svg viewBox="0 0 24 24" fill="currentColor" className="w-10 h-10">
                                        <path d="M21 3H3c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h18c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H3V5h18v14zM5 15h7v3H5v-3zm0-4h14v2H5v-2zm0-4h14v2H5V7z" />
                                    </svg>
                                </div>
                                <div>
                                    <p className="text-[#3C4852] text-[15px] leading-snug">
                                        Attend free special <br />
                                        classes by top mentors
                                    </p>
                                </div>
                            </div>

                            {/* Item 4 */}
                            <div className="flex items-start gap-4">
                                <div className="w-12 h-12 flex-shrink-0 text-[#C67C4E]">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-10 h-10">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                    </svg>
                                </div>
                                <div>
                                    <p className="text-[#3C4852] text-[15px] leading-snug">
                                        Take a tour of our tech <br />
                                        enabled classes and library
                                    </p>
                                </div>
                            </div>

                        </div>

                        {/* Buttons & Warning */}
                        <div className="space-y-4">
                            <div className="flex flex-col sm:flex-row gap-4">
                                <a
                                    href="https://unacademykotacentre.com/admin/form/enquiry-form-web"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="bg-[#3C4852] hover:bg-[#2A333A] text-white px-8 py-3.5 rounded-[8px] font-bold text-[15px] transition-colors w-full sm:w-auto text-center shadow-lg inline-block"
                                >
                                    Book a visit
                                </a>
                                <button className="bg-white border text-[#3C4852] border-[#3C4852] hover:bg-gray-50 px-6 py-3.5 rounded-[8px] font-semibold text-[15px] transition-colors w-full sm:w-auto text-center">
                                    Know more about centres
                                </button>
                            </div>
                            <div className="flex items-center gap-2 text-[#C67C4E] font-medium text-sm pl-1">
                                <FiClock className="w-4 h-4" />
                                <span>Slots filling fast</span>
                            </div>
                        </div>
                    </div>

                    {/* Right Image */}
                    <div className="flex-1 w-full max-w-[500px]">
                        <img
                            src={centreImage}
                            alt="Unacademy Centre Interior"
                            className="w-full h-[320px] object-cover rounded-[16px] shadow-sm"
                        />
                    </div>

                </div>
            </div>
        </section>
    );
};

export default VisitCentre;
