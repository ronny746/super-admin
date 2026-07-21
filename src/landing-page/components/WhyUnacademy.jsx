import React from "react";
import { Users, BookOpen, Video, Target, CheckCircle2 } from "lucide-react";

const WhyUnacademy = () => {
    const cards = [
        {
            title: "Top Educators from the Country",
            icon: <Users className="w-8 h-8" />,
            iconColor: "text-[var(--color-una-blue)]",
            iconBg: "bg-[rgba(8,111,255,0.1)] group-hover:bg-[rgba(8,111,255,0.2)]",
            accentColor: "bg-[var(--color-una-blue)]",
            description: "Learn from highly experienced educators dedicated to helping every student achieve their dream rank.",
            bullets: [
                "Experienced faculty from across India",
                "Proven teaching methodologies",
                "Personalized mentorship and doubt-solving",
                "Regular performance tracking and feedback",
                "Strategic exam preparation and guidance"
            ]
        },
        {
            title: "Best-in-Class Study Material",
            icon: <BookOpen className="w-8 h-8" />,
            iconColor: "text-[var(--color-una-green)]",
            iconBg: "bg-[rgba(8,189,128,0.1)] group-hover:bg-[rgba(8,189,128,0.2)]",
            accentColor: "bg-[var(--color-una-green)]",
            description: "Comprehensive, exam-focused study material designed to strengthen concepts, improve problem-solving skills, and ensure effective revision.",
            bullets: [
                "Structured and syllabus-aligned modules",
                "Concept builders and practice exercises",
                "Previous year questions and mock tests",
                "Quick revision notes and assignments",
                "Detailed solutions and performance analysis"
            ]
        },
        {
            title: "Learn Beyond the Classroom",
            icon: <Video className="w-8 h-8" />,
            iconColor: "text-[#FF9900]",
            iconBg: "bg-[rgba(255,153,0,0.1)] group-hover:bg-[rgba(255,153,0,0.2)]",
            accentColor: "bg-[#FF9900]",
            description: "Attend live classes, revise with recorded lectures, and learn from India's top educators anytime, anywhere.",
            bullets: [
                "Live interactive classes",
                "Recorded lectures & unlimited access",
                "Regular tests and performance tracking",
                "Learn at your own pace"
            ]
        },
        {
            title: "Focused Learning Experience",
            icon: <Target className="w-8 h-8" />,
            iconColor: "text-[#A962FF]",
            iconBg: "bg-[rgba(169,98,255,0.1)] group-hover:bg-[rgba(169,98,255,0.2)]",
            accentColor: "bg-[#A962FF]",
            description: "Small batches, doubt-solving sessions, and personalized attention ensure better understanding and academic growth.",
            bullets: [
                "Small batch sizes",
                "Dedicated doubt support",
                "Regular assessments",
                "Competitive learning environment"
            ]
        }
    ];

    return (
        <section className="py-16 md:py-24 bg-[var(--color-bg-page)] relative overflow-hidden una-texture">
            <div className="max-w-[1200px] mx-auto px-6 relative z-10">

                {/* Header Section */}
                <div className="text-center mb-16 animate-fadeInUp">
                    <span className="section-label mb-4 inline-block">Why Choose Us</span>
                    <h2 className="text-[32px] md:text-[40px] font-extrabold text-[var(--color-text-primary)] mb-4">
                        Why Students Love Learning with Us
                    </h2>
                    <p className="text-[16px] md:text-[18px] text-[var(--color-text-secondary)] max-w-2xl mx-auto">
                        Everything you need to excel in your preparation, all in one place.
                    </p>
                </div>

                {/* Cards Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
                    {cards.map((card, index) => (
                        <div 
                            key={index}
                            className={`group card-una p-6 md:p-8 flex flex-col cursor-pointer animate-fadeInUp delay-${(index % 4 + 1) * 100} relative overflow-hidden`}
                        >
                            {/* Accent line on top of card */}
                            <div className={`absolute top-0 left-0 w-full h-1 ${card.accentColor} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}></div>

                            <div className="flex items-start gap-4 mb-4 relative z-10">
                                <div className={`p-3 rounded-xl shrink-0 group-hover:scale-110 transition-all duration-300 ${card.iconBg}`}>
                                    {React.cloneElement(card.icon, { className: `w-7 h-7 ${card.iconColor}` })}
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-[var(--color-text-primary)] mb-2 group-hover:text-[var(--color-una-navy)] transition-colors duration-300">{card.title}</h3>
                                    <p className="text-[var(--color-text-secondary)] text-[15px] leading-relaxed">
                                        {card.description}
                                    </p>
                                </div>
                            </div>

                            {/* Bullets - Always visible on mobile, Reveal on Hover smoothly on desktop */}
                            <div className="grid grid-rows-[1fr] lg:grid-rows-[0fr] lg:group-hover:grid-rows-[1fr] transition-[grid-template-rows] duration-500 ease-in-out relative z-10">
                                <div className="overflow-hidden">
                                    <div className="mt-4 pt-4 border-t border-[rgba(29,29,53,0.05)] flex-grow">
                                        <ul className="space-y-3">
                                            {card.bullets.map((bullet, idx) => (
                                                <li 
                                                    key={idx} 
                                                    className="flex items-start gap-2 lg:translate-y-4 lg:opacity-0 lg:group-hover:translate-y-0 lg:group-hover:opacity-100 transition-all duration-500" 
                                                    style={{ transitionDelay: `${idx * 50}ms` }}
                                                >
                                                    <CheckCircle2 className={`w-4 h-4 shrink-0 mt-0.5 ${card.iconColor}`} />
                                                    <span className="text-[14px] font-medium text-[var(--color-text-secondary)] group-hover:text-[var(--color-text-primary)] transition-colors">{bullet}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            </div>
                            
                            {/* Card Hover Glow effect inside card */}
                            <div className={`absolute bottom-0 right-0 w-40 h-40 ${card.accentColor} opacity-0 group-hover:opacity-[0.03] blur-3xl rounded-full transition-opacity duration-500 pointer-events-none`}></div>
                        </div>
                    ))}
                </div>

            </div>
        </section>
    );
};

export default WhyUnacademy;
