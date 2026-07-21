import React from "react";
import { FiCheckCircle } from 'react-icons/fi';
import trophyImg from '../assets/images/Scholarship1.jpg';

const Scholarship = () => {
    return (
        <section className="py-12 bg-white">
            <div className="max-w-[1240px] mx-auto px-4 md:px-6">
                <div className="bg-[#F9F5FF] rounded-xl overflow-hidden flex flex-col lg:flex-row items-stretch justify-between relative pl-8 md:pl-16 py-10 lg:py-0">

                    {/* Left Content */}
                    <div className="flex-1 w-full max-w-[640px] z-10 py-6 lg:py-16 pr-6">
                        <h2 className="text-[28px] md:text-[36px] font-bold text-[#1A1A2E] mb-3">
                            Avail scholarships up to 90% <span className="text-[#FFD700]">✨</span>
                        </h2>
                        <p className="text-[#7A8B94] text-[15px] md:text-[16px] mb-8 leading-relaxed">
                            Get scholarship based on your school or board marks, UNSAT or DST score, Olympiad or other National exams
                        </p>

                        {/* Features List */}
                        <div className="grid md:grid-cols-2 gap-y-4 gap-x-8 mb-10">
                            {[
                                "Quick 15 min test",
                                "15 quick questions",
                                "Scholarship for board, state toppers",
                                "Scholarship based on KVPY, NTSE and other Olympiad ranks"
                            ].map((item, idx) => (
                                <div key={idx} className="flex items-start gap-3">
                                    <FiCheckCircle className="w-5 h-5 text-[#8A4FFF] mt-0.5 shrink-0" />
                                    <span className="text-[#3C4852] text-[15px] font-medium">{item}</span>
                                </div>
                            ))}
                        </div>

                        {/* Buttons */}
                        <div className="flex flex-col sm:flex-row gap-4 mb-8">
                            <a
                                href="https://unacademykotacentre.com/admin/form/scholarships-test"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="bg-[#3C4852] hover:bg-[#2A333A] text-white px-6 py-3 rounded-md font-bold text-[15px] transition-colors w-full sm:w-auto text-center shadow-sm inline-block"
                            >
                                Attempt test at centre
                            </a>
                            <a href="/unlock-your-scholarship" className="bg-white border text-[#3C4852] border-[#D0D5DD] hover:border-[#9CA3AF] px-6 py-3 rounded-md font-bold text-[15px] transition-colors w-full sm:w-auto text-center inline-block cursor-pointer">
                                Unlock more
                            </a>
                        </div>

                        {/* Social Proof */}
                        <div className="flex items-center gap-3">
                            <div className="flex -space-x-2">
                                <div className="w-7 h-7 rounded-full bg-[#FFD93D] border-2 border-white"></div>
                                <div className="w-7 h-7 rounded-full bg-[#6BCB77] border-2 border-white"></div>
                                <div className="w-7 h-7 rounded-full bg-[#4D96FF] border-2 border-white"></div>
                            </div>
                            <p className="text-[14px] text-[#5C6770] font-medium">
                                <span className="font-bold text-[#3C4852]">52 learners</span> have won <span className="font-bold text-[#3C4852]">₹20.2L</span> worth of scholarships
                            </p>
                        </div>
                    </div>

                    {/* Right Image */}
                    <div className="flex-1 w-full lg:w-1/2 relative min-h-[300px] lg:min-h-full">
                        <img
                            src={trophyImg}
                            alt="Scholarship Trophy"
                            className="absolute inset-0 w-full h-full object-cover z-10"
                        />
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Scholarship;
