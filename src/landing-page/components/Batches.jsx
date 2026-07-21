import React from "react";
import { Megaphone, BookOpen, Target, Award, Users, FileText, ChevronRight, Trophy, GraduationCap, Calendar, HelpCircle } from "lucide-react";

const Announcements = () => {
    return (
        <section className="py-16 bg-[var(--color-bg-page)] una-texture">
            <div className="max-w-[1240px] mx-auto px-6">
                
                {/* Header */}
                <div className="text-center mb-16">
                    <h2 className="text-[32px] md:text-[40px] font-bold text-[#1F2937] mb-4 uppercase">
                        LATEST ANNOUNCEMENTS
                    </h2>
                    <p className="text-[16px] md:text-[18px] text-[#4B5563] max-w-2xl mx-auto">
                        Stay updated with our newest batches, programs, and opportunities.
                    </p>
                </div>

                <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden flex flex-col md:flex-row">
                    
                    {/* Left Side Content */}
                    <div className="flex-1 p-8 md:p-12 border-b md:border-b-0 md:border-r border-[rgba(29,29,53,0.05)]">
                        <div className="inline-flex items-center gap-2 bg-[rgba(8,111,255,0.08)] text-[var(--color-una-blue)] px-4 py-2 rounded-full font-semibold text-sm mb-6">
                            <Megaphone className="w-4 h-4" />
                            Latest Updates & Announcements
                        </div>
                        
                        <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-4">
                            Stay Ahead with Unacademy
                        </h2>
                        <p className="text-gray-600 text-lg mb-8">
                            Get the latest updates about:
                        </p>
                        
                        <div className="space-y-4 mb-8">
                            {[
                                { icon: <BookOpen className="text-[var(--color-una-blue)] w-5 h-5" />, text: "Upcoming IITJEE AND NEET BATCHES" },
                                { icon: <GraduationCap className="text-[var(--color-una-navy)] w-5 h-5" />, text: "Foundation Programs" },
                                { icon: <Trophy className="text-[#F5A623] w-5 h-5" />, text: "Scholarship Tests (USAT – Upto 90% Scholarships)" },
                                { icon: <Users className="text-[var(--color-una-green)] w-5 h-5" />, text: "Doubt session and Workshops" },
                                { icon: <FileText className="text-purple-500 w-5 h-5" />, text: "All India Test Series" }
                            ].map((item, idx) => (
                                <div key={idx} className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center shrink-0">
                                        {item.icon}
                                    </div>
                                    <span className="text-gray-700 font-medium">{item.text}</span>
                                </div>
                            ))}
                        </div>
                        
                        <div className="flex items-center gap-2 text-sm text-[var(--color-text-secondary)] bg-[var(--color-bg-page)] p-4 rounded-xl border border-[rgba(29,29,53,0.05)]">
                            <CheckCircleIcon className="w-5 h-5 text-[var(--color-una-green)]" />
                            Stay informed and never miss an important opportunity.
                        </div>
                    </div>

                    {/* Right Side Announcement Panel */}
                    <div className="flex-1 bg-[rgba(29,29,53,0.02)] p-6 md:p-8">
                        <div className="bg-white rounded-2xl shadow-lg border border-[rgba(29,29,53,0.05)] overflow-hidden">
                            <div className="bg-gradient-to-r from-[var(--color-una-navy)] to-[var(--color-una-blue)] text-white p-4 flex items-center justify-center gap-2 font-bold text-lg">
                                <Megaphone className="w-5 h-5" />
                                New Courses & Announcements
                            </div>
                            
                            <div className="divide-y divide-gray-100">
                                {/* Item 1 */}
                                <a href="https://unacademykotacentre.com/admin/form/u-sat" target="_blank" rel="noopener noreferrer" className="block p-5 hover:bg-[rgba(8,111,255,0.02)] transition-colors group">
                                    <div className="flex items-start gap-4">
                                        <div className="w-10 h-10 rounded-full bg-yellow-50 flex items-center justify-center shrink-0 border border-yellow-100">
                                            <Trophy className="w-5 h-5 text-yellow-500" />
                                        </div>
                                        <div className="flex-1">
                                            <h4 className="font-bold text-gray-900 group-hover:text-[var(--color-una-blue)] transition-colors">USAT Scholarship Test 2026</h4>
                                            <p className="text-sm text-gray-500 mt-1">Win up to 90% Scholarship in School Fee & Coaching Fee.</p>
                                        </div>
                                        <ChevronRight className="w-5 h-5 text-gray-300 group-hover:text-[var(--color-una-blue)] shrink-0 mt-2" />
                                    </div>
                                </a>

                                {/* Item 2 */}
                                <a href="https://unacademykotacentre.com/admin/form/enquiry-form-web" target="_blank" rel="noopener noreferrer" className="block p-5 hover:bg-[rgba(8,111,255,0.02)] transition-colors group">
                                    <div className="flex items-start gap-4">
                                        <div className="w-10 h-10 rounded-full bg-[rgba(8,111,255,0.08)] flex items-center justify-center shrink-0">
                                            <Target className="w-5 h-5 text-[var(--color-una-blue)]" />
                                        </div>
                                        <div className="flex-1">
                                            <h4 className="font-bold text-gray-900 group-hover:text-[var(--color-una-blue)] transition-colors">Upcoming NEET & JEE batches</h4>
                                            <p className="text-sm text-gray-500 mt-1">Admission Enquiry for engineering and medical preparation.</p>
                                        </div>
                                        <ChevronRight className="w-5 h-5 text-gray-300 group-hover:text-[var(--color-una-blue)] shrink-0 mt-2" />
                                    </div>
                                </a>

                                {/* Item 3 */}
                                <a href="https://unacademykotacentre.com/admin/form/enquiry-form-web" target="_blank" rel="noopener noreferrer" className="block p-5 hover:bg-[rgba(8,111,255,0.02)] transition-colors group">
                                    <div className="flex items-start gap-4">
                                        <div className="w-10 h-10 rounded-full bg-[rgba(29,29,53,0.08)] flex items-center justify-center shrink-0">
                                            <GraduationCap className="w-5 h-5 text-[var(--color-una-navy)]" />
                                        </div>
                                        <div className="flex-1">
                                            <h4 className="font-bold text-gray-900 group-hover:text-[var(--color-una-blue)] transition-colors">Foundation classes</h4>
                                            <p className="text-sm text-gray-500 mt-1">For class 6 to 10 students.</p>
                                        </div>
                                        <ChevronRight className="w-5 h-5 text-gray-300 group-hover:text-[var(--color-una-blue)] shrink-0 mt-2" />
                                    </div>
                                </a>

                                {/* Item 4 */}
                                <a href="https://unacademykotacentre.com/admin/form/enquiry-form-web" target="_blank" rel="noopener noreferrer" className="block p-5 hover:bg-[rgba(8,189,128,0.05)] transition-colors group">
                                    <div className="flex items-start gap-4">
                                        <div className="w-10 h-10 rounded-full bg-[rgba(8,189,128,0.1)] flex items-center justify-center shrink-0">
                                            <HelpCircle className="w-5 h-5 text-[var(--color-una-green)]" />
                                        </div>
                                        <div className="flex-1">
                                            <h4 className="font-bold text-gray-900 group-hover:text-[var(--color-una-blue)] transition-colors">Doubt solving session</h4>
                                            <p className="text-sm text-gray-500 mt-1">Enquire for doubt solving and mentorship.</p>
                                        </div>
                                        <ChevronRight className="w-5 h-5 text-gray-300 group-hover:text-[var(--color-una-blue)] shrink-0 mt-2" />
                                    </div>
                                </a>

                                {/* Item 5 */}
                                <a href="/unlock-your-scholarship" className="block p-5 hover:bg-[rgba(8,111,255,0.02)] transition-colors group">
                                    <div className="flex items-start gap-4">
                                        <div className="w-10 h-10 rounded-full bg-purple-50 flex items-center justify-center shrink-0 border border-purple-100">
                                            <Award className="w-5 h-5 text-purple-500" />
                                        </div>
                                        <div className="flex-1">
                                            <h4 className="font-bold text-gray-900 group-hover:text-[var(--color-una-blue)] transition-colors">Unlock Your Scholarship</h4>
                                            <p className="text-sm text-gray-500 mt-1">Check your scholarship status and details.</p>
                                        </div>
                                        <ChevronRight className="w-5 h-5 text-gray-300 group-hover:text-[var(--color-una-blue)] shrink-0 mt-2" />
                                    </div>
                                </a>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
};

// Simple check circle icon since it wasn't imported
const CheckCircleIcon = ({ className }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);

export default Announcements;
