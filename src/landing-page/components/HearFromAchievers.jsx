import React from "react";
import tm1 from '../assets/images/TM1.jpg';
import tm2 from '../assets/images/TM2.jpg';
import tm3 from '../assets/images/TM3.jpg';
import tm4 from '../assets/images/TM4.jpg';

const HearFromAchievers = () => {
    const achievers = [tm1, tm2, tm3, tm4];

    return (
        <section className="py-16 md:py-24 bg-[var(--color-bg-page)] border-t border-[rgba(29,29,53,0.05)] una-texture">
            <div className="max-w-[1240px] mx-auto px-6">

                {/* Header */}
                <div className="text-center mb-12">
                    <h2 className="text-[32px] md:text-[40px] font-bold text-[var(--color-una-navy)] mb-4">
                        Hear from our achievers
                    </h2>
                    {/* Learners Count */}
                    <div className="flex items-center justify-center gap-3">
                        <div className="flex -space-x-2">
                            <div className="w-8 h-8 rounded-full bg-[var(--color-una-blue)] border-2 border-white shadow-sm"></div>
                            <div className="w-8 h-8 rounded-full bg-[var(--color-una-green)] border-2 border-white shadow-sm"></div>
                            <div className="w-8 h-8 rounded-full bg-[var(--color-una-navy)] border-2 border-white shadow-sm"></div>
                        </div>
                        <span className="text-[var(--color-text-primary)] font-semibold text-[15px]">34K+ learners</span>
                    </div>
                </div>

                {/* Images Grid */}
                <div className="grid md:grid-cols-2 gap-8">
                    {achievers.map((image, index) => (
                        <div key={index} className="rounded-[24px] overflow-hidden shadow-sm hover:shadow-lg transition-shadow">
                            <img
                                src={image}
                                alt={`Achiever Testimonial ${index + 1}`}
                                className="w-full h-auto object-cover"
                            />
                        </div>
                    ))}
                </div>

            </div>
        </section>
    );
};


export default HearFromAchievers;
