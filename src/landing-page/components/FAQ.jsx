import React from "react";
import { useState, useEffect } from 'react';
import { FiChevronRight, FiPhone, FiX } from 'react-icons/fi';
// Placeholders
import illustrations from '../assets/images/Allabout-iit.png';
import Call from '../assets/images/Call.png';

const FAQ = () => {
    const [activeQuestion, setActiveQuestion] = useState(null);

    // Lock body scroll when side panel is open
    useEffect(() => {
        if (activeQuestion) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [activeQuestion]);

    const faqData = [
        {
            question: "Benefits of Unacademy Centre Kota",
            answer: "Unacademy Centre Kota brings you the best of both worlds – the discipline of offline learning and the flexibility of online resources. You get access to India's top educators, structured curriculum, personal mentorship, high-tech infrastructure, and a competitive peer environment essential for JEE preparation."
        },
        {
            question: "Registration for IIT JEE coaching at Unacademy Kota Centre",
            answer: "Registration is simple. You can visit the Unacademy Centre in Kota directly, or register online through the Unacademy website. We also hold regular scholarship tests (UNSAT) which can help you avail scholarships on the fee."
        },
        {
            question: "Free trial of Centre subscription in Kota for IIT JEE preparation",
            answer: "Yes, we offer demo classes for students to experience our teaching methodology and infrastructure before enrolling. Please contact our helpline or visit the centre to schedule your free trial."
        },
        {
            question: "Student-teacher ratio in Kota Centre for IIT JEE",
            answer: "We maintain an optimal student-teacher ratio to ensure every student gets personal attention. Our batches are sized to facilitate interaction and doubt resolution while maintaining a competitive classroom atmosphere."
        },
        {
            question: "Schedule for IIT JEE coaching classes in Kota",
            answer: "Classes are scheduled in batches (Morning/Evening) to suit school-going students and droppers. A detailed timetable is provided upon enrollment, typically involving 4-6 hours of classes per day along with doubt sessions."
        },
        {
            question: "Refund policy for IIT JEE coaching in Kota",
            answer: "We have a transparent refund policy. If for any reason you wish to withdraw, you can apply for a refund within a specified period from the start of the batch, subject to deduction of administrative charges and pro-rata usage."
        },
        {
            question: "Batch change post purchase of IIT JEE centre subscription?",
            answer: "Batch changes are allowed subject to availability of seats in the desired batch and approval from the centre administration. A valid reason is usually required for such requests."
        },
        {
            question: "Cities in which IIT JEE Unacademy Centres are available",
            answer: "Apart from Kota, Unacademy Centres are available in major cities across India including Delhi, Mumbai, Bangalore, Hyderabad, Pune, Lucknow, Patna, and many more."
        },
        {
            question: "JEE batch start dates in Kota",
            answer: "New batches start regularly throughout the academic year. Major batch commencements happen in April, May, and June for year-long courses. Please check with the centre for the next immediate batch start date."
        }
    ];

    return (
        <section className="py-16 bg-[var(--color-bg-white)] overflow-hidden una-texture">
            <div className="max-w-[1240px] mx-auto px-6">

                {/* Have any questions? Banner - Wrapped in Card */}
                <div className="mb-16">
                    <div className="bg-white rounded-[24px] shadow-sm border border-[rgba(29,29,53,0.05)] overflow-hidden relative">
                        <div className="p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-8 relative z-10">

                            <div className="flex-1 text-center md:text-left">
                                <h2 className="text-[28px] font-bold text-[var(--color-una-navy)] mb-3">Have any questions?</h2>
                                <p className="text-[var(--color-text-secondary)] text-[16px] mb-8 max-w-lg">
                                    Our experts can answer all your questions over a phone call.
                                </p>

                                <div className="flex flex-col sm:flex-row items-center gap-6">
                                    <button className="btn-una-primary">
                                        Get a call from us
                                    </button>

                                    <div className="flex flex-col items-center sm:items-start">
                                        <p className="text-[12px] text-[var(--color-text-secondary)] mb-1">Or call us</p>
                                        <div className="flex items-center gap-2 text-[var(--color-una-navy)] font-bold text-[16px]">
                                            <FiPhone className="w-4 h-4 text-[var(--color-una-blue)]" />
                                            <span>+91 6366527093</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Right side Illustration */}
                            <div className="hidden md:block relative w-[200px] h-[200px]">
                                <div className="absolute right-0 bottom-0 w-[180px] h-[180px]">
                                    <div className="w-full h-full bg-[var(--color-bg-page)] rounded-full overflow-hidden relative border-4 border-white shadow-sm">
                                        <img src={Call} className="w-full h-full object-cover object-top" alt="Support" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default FAQ;
