import React from "react";
import { CheckCircle2, UserCheck, CalendarCheck, BarChart2, Headset } from 'lucide-react';

import attendanceImg from '../assets/unacademy homepage/attendance_card.png';
import parentConnectImg from '../assets/unacademy homepage/parent_connect_card.png';
import performanceImg from '../assets/unacademy homepage/performance_card.png';
import supportImg from '../assets/unacademy homepage/support_card.png';

const ParentsSection = () => {
    const cards = [
        {
            image: attendanceImg,
            icon: <UserCheck className="w-5 h-5" />,
            theme: {
                bg: "bg-[rgba(8,189,128,0.05)]",
                border: "border-[rgba(8,189,128,0.15)]",
                primary: "text-[var(--color-una-green)]",
                iconBg: "bg-[var(--color-una-green)]"
            },
            title: "Attendance Tracking",
            points: [
                "RFID-based attendance monitoring",
                "Instant notifications for absences",
                "Daily attendance reports",
                "Stay updated anytime, anywhere"
            ]
        },
        {
            image: parentConnectImg,
            icon: <CalendarCheck className="w-5 h-5" />,
            theme: {
                bg: "bg-[rgba(8,111,255,0.05)]",
                border: "border-[rgba(8,111,255,0.15)]",
                primary: "text-[var(--color-una-blue)]",
                iconBg: "bg-[var(--color-una-blue)]"
            },
            title: "Parent Connect Sessions",
            points: [
                "One-on-one discussions with mentors",
                "Detailed performance reviews",
                "Goal tracking and improvement plans",
                "Multiple communication channels"
            ]
        },
        {
            image: performanceImg,
            icon: <BarChart2 className="w-5 h-5" />,
            theme: {
                bg: "bg-[rgba(29,29,53,0.03)]",
                border: "border-[rgba(29,29,53,0.1)]",
                primary: "text-[var(--color-una-navy)]",
                iconBg: "bg-[var(--color-una-navy)]"
            },
            title: "Performance Insights",
            points: [
                "Test performance reports",
                "Subject-wise strengths and weaknesses",
                "Personalized improvement suggestions",
                "Progress tracking dashboard"
            ]
        },
        {
            image: supportImg,
            icon: <Headset className="w-5 h-5" />,
            theme: {
                bg: "bg-[rgba(8,189,128,0.05)]",
                border: "border-[rgba(8,189,128,0.15)]",
                primary: "text-[var(--color-una-green)]",
                iconBg: "bg-[var(--color-una-green)]"
            },
            title: "Dedicated Parent Support",
            points: [
                "Quick query resolution",
                "Academic guidance from experts",
                "Fee and schedule assistance",
                "Dedicated support team"
            ]
        }
    ];

    return (
        <section className="py-16 md:py-24 bg-[var(--color-bg-white)] font-sans una-texture">
            <div className="max-w-[1240px] mx-auto px-6">

                {/* Header */}
                <div className="text-center mb-16 flex flex-col items-center">
                    <h2 className="text-[32px] md:text-[40px] font-bold text-[var(--color-una-navy)] mb-4">
                        <span className="text-[var(--color-una-blue)]">Parents,</span> We Keep You Informed at Every Step
                    </h2>
                    <p className="text-[16px] md:text-[18px] text-[var(--color-text-secondary)] max-w-2xl mx-auto leading-relaxed mb-4">
                        Real-time updates and regular interactions to ensure your child's success.
                    </p>
                    <div className="w-12 h-1 bg-[var(--color-una-blue)] rounded-full"></div>
                </div>

                {/* Cards Grid */}
                <div className="grid lg:grid-cols-2 gap-6">
                    {cards.map((card, index) => (
                        <div 
                            key={index} 
                            className={`rounded-[24px] border ${card.theme.border} ${card.theme.bg} p-3 md:p-4 flex flex-col sm:flex-row items-center sm:items-start gap-5 transition-transform hover:-translate-y-1 duration-300 shadow-sm`}
                        >
                            {/* Left Illustration */}
                            <div className="w-[200px] shrink-0">
                                <img 
                                    src={card.image} 
                                    alt={card.title} 
                                    className="w-full h-auto object-contain drop-shadow-sm mix-blend-multiply"
                                />
                            </div>

                            {/* Right Content */}
                            <div className="flex-1 w-full">
                                <div className="flex items-center gap-3 mb-6">
                                    <div className={`${card.theme.iconBg} w-10 h-10 rounded-full flex items-center justify-center text-white shrink-0 shadow-sm`}>
                                        {card.icon}
                                    </div>
                                    <h3 className={`${card.theme.primary} font-bold text-[20px] leading-tight`}>
                                        {card.title}
                                    </h3>
                                </div>
                                
                                <ul className="space-y-3.5">
                                    {card.points.map((point, idx) => (
                                        <li key={idx} className="flex items-start gap-3">
                                            <CheckCircle2 className={`w-5 h-5 ${card.theme.primary} shrink-0 mt-0.5`} />
                                            <span className="text-[var(--color-text-primary)] text-[14.5px] leading-snug font-medium">
                                                {point}
                                            </span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    ))}
                </div>

            </div>
        </section>
    );
};

export default ParentsSection;
