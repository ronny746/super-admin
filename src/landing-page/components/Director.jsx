import React from 'react';
import spsSirImage from '../assets/images/SPS_Sir_wb2.jpg';

const Director = () => {
    return (
        <section className="py-8 md:py-12 bg-white border-b border-gray-100">
            <div className="mx-auto max-w-[1366px] px-6 md:px-12 lg:px-20">
                <div className="flex flex-col lg:flex-row items-center gap-8 md:gap-12">

                    {/* LEFT CONTENT */}
                    <div className="w-full lg:max-w-[600px] flex flex-col justify-center">

                        {/* Tag */}
                        <div className="mb-3">
                            <span className="text-[12px] md:text-[14px] font-bold tracking-widest text-brand-blue uppercase bg-blue-50 px-3 py-1 rounded-full border border-blue-100">
                                MEET OUR DIRECTOR
                            </span>
                        </div>

                        {/* Title */}
                        <h1 className="text-[24px] md:text-[32px] font-extrabold text-[#1F2937] leading-tight mb-4">
                            About Director
                        </h1>

                        {/* Description */}
                        <div className="text-[15px] md:text-[16px] text-[#4B5563] leading-relaxed text-justify">
                            <p>
                                <span className="font-bold text-[#1F2937]">IIT Bombay Alumni SPS Sir</span> stands as the one and only Mathematics faculty in Kota who has mentored students securing <span className="font-semibold text-[#1F2937]">All India Ranks from 1 to 100 each in JEE</span>. His unparalleled guidance has consistently shaped toppers and created a legacy of excellence. He is also among the pioneering mentors from Kota under whose guidance Kota's first-ever <span className="font-semibold text-[#1F2937]">Medalist in the International Mathematical Olympiad</span> emerged. Recognized as a visionary leader and mathematics maestro, SPS Sir continues to inspire brilliance, building not just achievers but future innovators.
                            </p>
                        </div>
                    </div>

                    {/* RIGHT IMAGE */}
                    <div className="w-full lg:flex-1 h-full flex items-center justify-center">
                        <div className="relative overflow-hidden rounded-xl shadow-lg group w-full max-w-[450px]">
                            {/* Image */}
                            <img
                                src={spsSirImage}
                                alt="SPS Sir - Director"
                                className="w-full h-auto object-cover rounded-xl transition-transform duration-700 group-hover:scale-[1.04]"
                            />
                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
};

export default Director;
