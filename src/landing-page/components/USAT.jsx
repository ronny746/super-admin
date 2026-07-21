import React from "react";
import { CheckCircle2, GraduationCap, ArrowRight, Medal, BookOpen, Target } from "lucide-react";
import rightSideImage from '../assets/unacademy homepage/right hand side image of usat.png';

const USAT = () => {
    const keyBenefits = [
        "Can Be given 24*7",
        "Free Online and Offline",
        "90% Scholarship in Coaching Fee",
        "For Moving Classes 6th–12th",
        "Free Registration"
    ];

    const designedFor = [
        { title: "Fee Benefit For JEE", icon: <Target className="w-4 h-4 text-red-500" /> },
        { title: "Fee Benefit For NEET", icon: <BookOpen className="w-4 h-4 text-blue-500" /> },
        { title: "Fee Benefit For Foundation", icon: <Medal className="w-4 h-4 text-yellow-500" /> }
    ];

    return (
        <section className="py-12 bg-[var(--color-bg-page)] font-sans una-texture">
            <div className="max-w-[1240px] mx-auto px-6">

                {/* Header */}
                <div className="text-center mb-16">
                    <h2 className="text-[32px] md:text-[40px] font-bold text-[#1F2937] mb-4 uppercase">
                        USAT SCHOLARSHIP
                    </h2>
                    <p className="text-[16px] md:text-[18px] text-[#4B5563] max-w-2xl mx-auto">
                        Take the Unacademy Scholarship Cum Admission Test and win up to 90% scholarship.
                    </p>
                </div>

                <div className="bg-white rounded-[24px] shadow-sm border border-[rgba(29,29,53,0.05)] flex flex-col lg:flex-row items-stretch overflow-hidden">

                    {/* Left Content */}
                    <div className="flex-1 p-6 lg:p-10 flex flex-col justify-center">

                        {/* Top Headers */}
                        <div className="mb-5">
                            <div className="flex items-center gap-3 mb-2">
                                <h2 className="text-[28px] md:text-[36px] font-black text-[var(--color-una-navy)] leading-none tracking-tight">
                                    USAT <span className="text-[24px] md:text-[30px] font-bold text-gray-600">2026</span>
                                </h2>
                                <div className="text-[var(--color-una-blue)]">
                                    <GraduationCap className="w-8 h-8 md:w-10 md:h-10" />
                                </div>
                            </div>

                            <h3 className="text-[24px] md:text-[30px] font-bold text-[var(--color-una-blue)] mb-3 leading-tight">
                                Win Up To 90% Scholarship
                            </h3>

                            <div className="inline-block bg-[var(--color-una-navy)] text-white px-5 py-2 rounded-full font-semibold text-sm tracking-wide mb-4">
                                Unacademy Scholarship Cum Admission Test (USAT)
                            </div>

                            <p className="text-[var(--color-text-secondary)] text-[14px] leading-relaxed max-w-md">
                                Get an opportunity to earn scholarships in Coaching Fee through Unacademy.
                            </p>
                        </div>

                        {/* Key Benefits */}
                        <div className="mb-6">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-3 gap-x-4">
                                {keyBenefits.map((benefit, idx) => (
                                    <div key={idx} className="flex items-center gap-2.5">
                                        <div className="w-5 h-5 rounded-full bg-[var(--color-una-blue)] flex items-center justify-center shrink-0">
                                            <CheckCircle2 className="w-3.5 h-3.5 text-white" />
                                        </div>
                                        <span className="text-[var(--color-text-primary)] font-medium text-[14px]">{benefit}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Divider with Text */}
                        <div className="relative flex items-center justify-center mb-6">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-gray-200"></div>
                            </div>
                            <div className="relative bg-white px-3 text-xs font-bold text-gray-500 uppercase tracking-wider">
                                Designed For
                            </div>
                        </div>

                        {/* Designed For Pills */}
                        <div className="flex flex-wrap gap-3 mb-6">
                            {designedFor.map((item, idx) => (
                                <div key={idx} className="bg-[rgba(29,29,53,0.02)] border border-[rgba(29,29,53,0.05)] rounded-lg px-4 py-2 flex items-center gap-2 flex-1 min-w-[180px]">
                                    {item.icon}
                                    <span className="text-[var(--color-una-navy)] font-bold text-[13px] capitalize">{item.title}</span>
                                </div>
                            ))}
                        </div>

                        {/* Buttons */}
                        <div className="flex flex-col sm:flex-row gap-3">
                            <a
                                href="/admin/form/u-sat-scholarship-2026-27"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="btn-una-primary flex-1 flex items-center justify-center gap-2"
                            >
                                Register for Free
                                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                            </a>
                            <a
                                href="#learn-more"
                                className="btn-una-outline flex-1 flex items-center justify-center gap-2"
                            >
                                Learn More
                                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                            </a>
                        </div>

                        {/* Footer Info */}
                        <div className="mt-5 flex items-center gap-2">
                            <div className="flex -space-x-2">
                                <div className="w-3.5 h-3.5 rounded-full bg-yellow-400"></div>
                                <div className="w-3.5 h-3.5 rounded-full bg-green-400"></div>
                                <div className="w-3.5 h-3.5 rounded-full bg-blue-400"></div>
                            </div>
                            <span className="text-xs text-gray-500 font-medium ml-1">
                                Scholarships up to <span className="font-bold text-[#1A1A2E]">90%</span> available <span className="text-[10px] ml-1">(*T&C Apply)</span>
                            </span>
                        </div>

                    </div>

                    {/* Right Image */}
                    <div className="hidden lg:block w-[55%] bg-[#0B184B] shrink-0 relative flex items-center justify-center">
                        <img
                            src={rightSideImage}
                            alt="USAT Scholarship"
                            className="w-full h-full object-contain"
                        />
                    </div>
                    {/* Mobile Image */}
                    <div className="block lg:hidden w-full bg-[#0B184B] shrink-0 flex items-center justify-center">
                        <img
                            src={rightSideImage}
                            alt="USAT Scholarship"
                            className="w-full h-auto object-contain"
                        />
                    </div>

                </div>
            </div>
        </section>
    );
};

export default USAT;
