import React from "react";
import { BookOpen, Stethoscope, Lightbulb, Globe2, Home, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const Programs = () => {
    const programs = [
        {
            title: "IIT-JEE",
            subtitle: "Engineering Entrance Preparation",
            icon: <Lightbulb className="w-8 h-8 text-[var(--color-una-blue)]" />,
            iconBg: "bg-[rgba(8,111,255,0.08)]",
            accentColor: "bg-[var(--color-una-blue)]",
            subtitleColor: "text-[var(--color-una-blue)]",
            description: "Comprehensive preparation for JEE Main & Advanced with expert faculty, regular tests, and personalized mentoring.",
        },
        {
            title: "NEET",
            subtitle: "Medical Entrance Preparation",
            icon: <Stethoscope className="w-8 h-8 text-[var(--color-una-green)]" />,
            iconBg: "bg-[rgba(8,189,128,0.08)]",
            accentColor: "bg-[var(--color-una-green)]",
            subtitleColor: "text-[var(--color-una-green)]",
            description: "Structured preparation for NEET with concept-building classes, practice sessions, and performance analysis.",
        },
        {
            title: "Foundation",
            subtitle: "Classes 6th–10th",
            icon: <BookOpen className="w-8 h-8 text-[#FF9900]" />,
            iconBg: "bg-[rgba(255,153,0,0.08)]",
            accentColor: "bg-[#FF9900]",
            subtitleColor: "text-[#FF9900]",
            description: "Build strong fundamentals for Olympiads, School Exams, NTSE, and Board Preparation.",
        },
        {
            title: "Study Abroad",
            subtitle: "Global Education Pathways",
            icon: <Globe2 className="w-8 h-8 text-[#A962FF]" />,
            iconBg: "bg-[rgba(169,98,255,0.08)]",
            accentColor: "bg-[#A962FF]",
            subtitleColor: "text-[#A962FF]",
            description: "Guidance for international admissions, profile building, test preparation, and university applications.",
        },
        {
            title: "Residential Program",
            subtitle: "Integrated Learning & Hostel Facilities",
            icon: <Home className="w-8 h-8 text-[#F26419]" />,
            iconBg: "bg-[rgba(242,100,25,0.08)]",
            accentColor: "bg-[#F26419]",
            subtitleColor: "text-[#F26419]",
            description: "A focused academic environment with expert mentoring, structured schedules, and premium residential support.",
        }
    ];

    return (
        <section className="py-16 md:py-24 bg-[var(--color-bg-white)] relative overflow-hidden una-texture">
            <div className="max-w-[1240px] mx-auto px-6 relative z-10">
                
                {/* Header */}
                <div className="text-center mb-16 animate-fadeInUp">
                    <span className="section-label mb-4 inline-block">Discover the right fit</span>
                    <h2 className="text-[32px] md:text-[40px] font-extrabold text-[var(--color-text-primary)] mb-4">
                        Our Programs
                    </h2>
                    <p className="text-[16px] md:text-[18px] text-[var(--color-text-secondary)] max-w-2xl mx-auto">
                        Explore the right pathway to achieve your academic goals with expert mentorship and structured learning.
                    </p>
                </div>

                {/* Cards Grid */}
                <div className="flex flex-wrap justify-center gap-6 lg:gap-8">
                    {programs.map((program, index) => (
                        <div 
                            key={index} 
                            className={`w-full sm:w-[calc(50%-1rem)] lg:w-[calc(33.333%-1.5rem)] card-una p-6 sm:p-8 flex flex-col group relative overflow-hidden animate-fadeInUp delay-${(index % 4 + 1) * 100}`}
                        >
                            {/* Accent line on top of card */}
                            <div className={`absolute top-0 left-0 w-full h-1.5 ${program.accentColor} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}></div>
                            
                            <div className={`w-16 h-16 ${program.iconBg} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-500 shadow-sm border border-white`}>
                                {program.icon}
                            </div>
                            
                            <h3 className="text-2xl font-extrabold text-[var(--color-text-primary)] mb-1.5 transition-colors duration-300 group-hover:text-[var(--color-una-navy)]">{program.title}</h3>
                            <p className={`text-[13px] font-bold ${program.subtitleColor} mb-4 tracking-wider uppercase`}>{program.subtitle}</p>
                            
                            <p className="text-[var(--color-text-secondary)] text-[15px] mb-8 flex-grow leading-relaxed">
                                {program.description}
                            </p>
                            
                            <div className="mt-auto pt-5 border-t border-[rgba(29,29,53,0.05)] relative z-10">
                                <Link to="/courses" className={`inline-flex items-center gap-2 font-bold group/btn transition-colors text-[15px] ${program.subtitleColor} hover:opacity-80`}>
                                    Explore Program
                                    <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1.5 transition-transform" />
                                </Link>
                            </div>
                            
                            {/* Card Hover Glow effect inside card */}
                            <div className={`absolute bottom-0 right-0 w-32 h-32 ${program.accentColor} opacity-0 group-hover:opacity-[0.03] blur-2xl rounded-tl-full transition-opacity duration-500 pointer-events-none`}></div>
                        </div>
                    ))}
                </div>

            </div>
        </section>
    );
};

export default Programs;
