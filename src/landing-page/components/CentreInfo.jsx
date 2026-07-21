import React from "react";
import DynamicContactForm from './DynamicContactForm';

const CentreInfo = () => {
    return (
        <section className="py-12 md:py-16 bg-white border-b border-gray-100">
            <div className="mx-auto max-w-[1366px] px-6 md:px-12 lg:px-20">
                <div className="flex flex-col lg:flex-row gap-14">

                    {/* LEFT CONTENT: ABOUT US */}
                    <div className="w-full lg:w-2/3 flex flex-col justify-start pt-4 lg:pr-10 order-2 lg:order-1">
                        <h1 className="text-3xl md:text-4xl font-extrabold text-[#1F2937] leading-tight mb-6">
                            About Unacademy Kota Centre
                        </h1>
                        
                        <div className="space-y-5 text-[15px] text-[#4B5563] leading-relaxed text-justify">
                            <p>
                                Unacademy Centre, Kota brings together the power of Kota's renowned education ecosystem with modern learning technology to help students achieve their academic goals. With some of the best Kota educators, the centre provides expert guidance, structured learning programs, and personalized support for students preparing for competitive and academic journeys.
                            </p>
                            <p>
                                The centre offers comprehensive preparation programs for IIT-JEE and NEET, helping aspirants build strong concepts, improve problem-solving skills, and prepare effectively for national-level entrance examinations.
                            </p>
                            <p>
                                Beyond engineering and medical entrances, Unacademy Centre, Kota also supports students aspiring for study abroad opportunities through SAT preparation and provides guidance for MBBS abroad pathways, helping students explore global education options with the right mentorship.
                            </p>
                        </div>
                    </div>

                    {/* RIGHT SIDE: ENQUIRY FORM */}
                    <div className="w-full lg:w-1/3 order-1 lg:order-2 flex items-center justify-center">
                        <DynamicContactForm />
                    </div>

                </div>
            </div>
        </section>
    );
};

export default CentreInfo;
