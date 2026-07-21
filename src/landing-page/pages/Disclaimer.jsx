import React, { useEffect } from 'react';

const Disclaimer = () => {
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <div className="bg-white min-h-screen py-16 md:py-24">
            <div className="max-w-4xl mx-auto px-6">

                {/* Header */}
                <div className="text-center mb-16">
                    <h1 className="text-3xl md:text-5xl font-bold text-[#1F2937] mb-6 flex items-center justify-center gap-3">
                        <span className="text-yellow-500">⚠️</span> Disclaimer
                    </h1>
                    <div className="h-1.5 w-24 bg-[#A962FF] mx-auto rounded-full"></div>
                    <p className="mt-4 text-[#4B5563] font-medium">Unacademy Kota Centre</p>
                </div>

                {/* Content */}
                <div className="prose prose-lg max-w-none text-[#4B5563]">

                    <div className="bg-yellow-50 border-l-4 border-yellow-400 p-6 rounded-r-lg mb-8">
                        <p className="font-bold text-[#1F2937] mb-2">Important Notice</p>
                        <p>This website is created for informational and promotional purposes only.</p>
                    </div>

                    <ul className="list-disc pl-6 space-y-4 text-lg leading-relaxed">
                        <li>
                            Unacademy Kota Centre operates as an offline coaching centre in association with Unacademy.
                        </li>
                        <li>
                            Course details, faculty, schedules, fees, and results are subject to change without prior notice.
                        </li>
                        <li>
                            We do not guarantee specific exam ranks, scores, or selection results.
                        </li>
                        <li>
                            Actual outcomes depend on student effort, attendance, and performance.
                        </li>
                        <li>
                            Unacademy Kota Centre shall not be held responsible for any decisions taken based solely on the information available on this website.
                        </li>
                    </ul>

                </div>
            </div>
        </div>
    );
};

export default Disclaimer;
