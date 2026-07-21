import React from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { Calendar, CheckCircle2, GraduationCap, Target, Clock, BookOpen, Layers } from 'lucide-react';
import DynamicContactForm from '../components/DynamicContactForm';
import bannerImage from '../assets/courses page/banners/USAT_BANNER.jpg copy.jpeg';

const ScholarshipPage = () => {
    return (
        <div className="bg-[#F7F8FA] min-h-screen pb-20">
            <Helmet>
                <title>USAT Scholarship | Unacademy Centre Kota</title>
                <meta name="description" content="Take the Unacademy Scholarship Cum Admission Test (USAT) and win up to 90% scholarship." />
            </Helmet>

            {/* Hero Banner Area */}
            <div className="relative w-full">
                {/* Desktop Banner */}
                <div className="relative hidden lg:block w-full bg-[#0C1222] max-h-[92vh] overflow-hidden">
                    <img src={bannerImage} alt="USAT Banner" className="w-full h-auto block" />
                    
                    {/* Form container sits exactly over the image */}
                    <div className="absolute inset-0 flex items-center justify-end px-8 lg:px-12 xl:px-24">
                        <div className="w-full max-w-[400px] xl:max-w-[420px] origin-right scale-[0.65] xl:scale-75 2xl:scale-90 transition-transform">
                            <DynamicContactForm slug="u-sat-scholarship-2026-27" />
                        </div>
                    </div>
                </div>

                {/* Mobile Banner Image & Form */}
                <div className="lg:hidden w-full flex flex-col bg-[#0C1222]">
                    <div className="w-full max-h-[70vh] overflow-hidden flex items-start">
                        <img src={bannerImage} alt="USAT Banner" className="w-full h-auto block" />
                    </div>
                    
                    <div className="w-full px-4 sm:px-6 py-8 bg-[#F7F8FA]">
                        <div className="flex justify-center">
                            <div className="w-full max-w-md">
                                <DynamicContactForm slug="u-sat-scholarship-2026-27" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content Area */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 space-y-16">
                
                {/* Section 1: Top Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Card 1 */}
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8 hover:shadow-md transition-shadow">
                        <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center mb-6">
                            <Clock className="w-6 h-6 text-blue-600" />
                        </div>
                        <h3 className="text-xl font-bold text-[#1a2b4c] mb-4">Scholarship Test Details</h3>
                        <ul className="space-y-3 mb-6 text-gray-600">
                            <li className="flex items-start gap-2">
                                <span className="font-semibold text-gray-900 shrink-0">Available:</span> 24×7
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="font-semibold text-gray-900 shrink-0">Mode:</span> Offline or Online
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="font-semibold text-gray-900 shrink-0">Registration:</span> Free of Cost
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="font-semibold text-gray-900 shrink-0">Test Name:</span> USAT
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="font-semibold text-[#08BD80] shrink-0">Scholarship:</span> Get up to 90% Scholarship
                            </li>
                        </ul>
                        <p className="text-sm text-gray-500 italic">Take the test anytime, anywhere and unlock your opportunity for a better future.</p>
                    </div>

                    {/* Card 2 */}
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8 hover:shadow-md transition-shadow">
                        <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center mb-6">
                            <Target className="w-6 h-6 text-green-600" />
                        </div>
                        <h3 className="text-xl font-bold text-[#1a2b4c] mb-4">Scholarship Benefits</h3>
                        <p className="font-medium text-gray-900 mb-4">Avail Benefits On:</p>
                        <ul className="space-y-3 text-gray-600">
                            <li className="flex items-start gap-3">
                                <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0" />
                                <span>Free Benefit on JEE Preparation</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0" />
                                <span>Free Benefit on NEET Preparation</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0" />
                                <span>Free Benefit on Foundation Courses</span>
                            </li>
                        </ul>
                    </div>

                    {/* Card 3 */}
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8 hover:shadow-md transition-shadow">
                        <div className="w-12 h-12 bg-orange-50 rounded-xl flex items-center justify-center mb-6">
                            <GraduationCap className="w-6 h-6 text-orange-600" />
                        </div>
                        <h3 className="text-xl font-bold text-[#1a2b4c] mb-4">Who Can Appear for the Test?</h3>
                        <p className="font-medium text-gray-900 mb-4">Eligible Students:</p>
                        <ul className="space-y-3 mb-6 text-gray-600">
                            <li className="flex items-start gap-2">
                                <div className="w-1.5 h-1.5 rounded-full bg-orange-500 mt-2 shrink-0"></div>
                                <span>Students from Class 6th to 12th</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <div className="w-1.5 h-1.5 rounded-full bg-orange-500 mt-2 shrink-0"></div>
                                <span>Students preparing for JEE & NEET</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <div className="w-1.5 h-1.5 rounded-full bg-orange-500 mt-2 shrink-0"></div>
                                <span>Students enrolled in Foundation Programs</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <div className="w-1.5 h-1.5 rounded-full bg-orange-500 mt-2 shrink-0"></div>
                                <span>Students looking for scholarship opportunities</span>
                            </li>
                        </ul>
                        <p className="font-semibold text-gray-900 mb-2">Registration Fee: <span className="text-[#08BD80]">Free of Cost</span></p>
                        <p className="text-sm text-gray-500 italic">Appear for USAT and get a chance to earn scholarships up to 90%.</p>
                    </div>
                </div>

                {/* Section 2: Why Choose USAT */}
                <div className="mt-20">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-4xl font-extrabold text-[#1a2b4c]">Why Should You Choose USAT?</h2>
                        <div className="w-24 h-1 bg-blue-600 mx-auto mt-4 rounded-full"></div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* Card 1 */}
                        <div className="bg-gradient-to-br from-[#0A2351] to-[#1a3673] rounded-2xl p-6 sm:p-8 shadow-lg text-white relative overflow-hidden group hover:-translate-y-1 transition-transform">
                            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                                <Target className="w-24 h-24" />
                            </div>
                            <h3 className="text-xl font-bold mb-4 relative z-10">Win Scholarships & Maximize Savings</h3>
                            <p className="text-blue-100 text-sm leading-relaxed mb-4 relative z-10">
                                Appear for USAT and get a chance to win up to 90% scholarship on classroom programs.
                            </p>
                            <p className="text-white text-sm font-medium relative z-10">
                                Get access to quality education with maximum financial benefits.
                            </p>
                        </div>

                        {/* Card 2 */}
                        <div className="bg-gradient-to-br from-[#08BD80] to-[#06a670] rounded-2xl p-6 sm:p-8 shadow-lg text-white relative overflow-hidden group hover:-translate-y-1 transition-transform">
                            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                                <BookOpen className="w-24 h-24" />
                            </div>
                            <h3 className="text-xl font-bold mb-4 relative z-10">Free Benefits on JEE, NEET & Foundation</h3>
                            <p className="text-green-50 text-sm mb-3 relative z-10">Unlock free benefits for:</p>
                            <ul className="space-y-2 mb-4 relative z-10">
                                <li className="flex items-center gap-2 text-sm text-white font-medium">
                                    <CheckCircle2 className="w-4 h-4 text-white" /> JEE Preparation
                                </li>
                                <li className="flex items-center gap-2 text-sm text-white font-medium">
                                    <CheckCircle2 className="w-4 h-4 text-white" /> NEET Preparation
                                </li>
                                <li className="flex items-center gap-2 text-sm text-white font-medium">
                                    <CheckCircle2 className="w-4 h-4 text-white" /> Foundation Courses
                                </li>
                            </ul>
                            <p className="text-green-50 text-sm relative z-10">
                                Get the right guidance and support to achieve your academic goals.
                            </p>
                        </div>

                        {/* Card 3 */}
                        <div className="bg-gradient-to-br from-amber-500 to-orange-500 rounded-2xl p-6 sm:p-8 shadow-lg text-white relative overflow-hidden group hover:-translate-y-1 transition-transform">
                            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                                <Clock className="w-24 h-24" />
                            </div>
                            <h3 className="text-xl font-bold mb-4 relative z-10">24×7 | Online or Offline | Free of Cost</h3>
                            <p className="text-orange-50 text-sm leading-relaxed mb-4 relative z-10">
                                USAT is available 24×7, allowing students to appear anytime as per their convenience.
                            </p>
                            <p className="text-orange-50 text-sm leading-relaxed mb-4 relative z-10">
                                Choose between Online or Offline mode and take the test completely free of cost.
                            </p>
                            <div className="bg-white/20 px-4 py-2 rounded-lg inline-block relative z-10">
                                <p className="text-white font-bold text-sm">
                                    Available for students from Class 6th to 12th.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ScholarshipPage;
