import React from "react";
import result1 from '../assets/images/achivers-1.jpeg'; // Placeholder - Replace with actual result image 1
import result2 from '../assets/images/achivers-2.jpeg'; // Placeholder - Replace with actual result image 2

const Achievers = () => {
    return (
        <section className="py-16 md:py-24 bg-[var(--color-bg-page)] una-texture">
            <div className="max-w-[1240px] mx-auto px-6">

                {/* Header with Lines */}
                <div className="flex items-center gap-4 mb-12 justify-center">
                    <div className="h-[2px] w-12 md:w-24 bg-gradient-to-r from-transparent to-[var(--color-una-blue)] opacity-50"></div>
                    <h2 className="text-[24px] md:text-[32px] font-bold text-[var(--color-una-navy)] text-center">
                        Our numbers speak for themselves
                    </h2>
                    <div className="h-[2px] w-12 md:w-24 bg-gradient-to-l from-transparent to-[var(--color-una-blue)] opacity-50"></div>
                </div>

                {/* Images Grid */}
                <div className="grid md:grid-cols-2 gap-6">
                    {/* Result Card 1 */}
                    <div className="rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                        <img
                            src={result1}
                            alt="Outstanding results of Unacademy Learners in JEE Advanced 2025"
                            className="w-full h-auto object-cover"
                        />
                    </div>

                    {/* Result Card 2 */}
                    <div className="rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                        <img
                            src={result2}
                            alt="Learners selected in JEE Advanced 2025"
                            className="w-full h-auto object-cover"
                        />
                    </div>
                </div>

            </div>
        </section>
    );
};

export default Achievers;
