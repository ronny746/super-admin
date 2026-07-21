import React from 'react';
import { motion } from 'framer-motion';
import abroad4 from '../assets/abroad-4.jpg';
import abroad5 from '../assets/abroad-5.jpg';
import { CosmicStarField, LayeredCardStack, WireframeCube } from './ThreeDGraphic';

const TableRow = ({ label, value, isHeader = false }) => (
    <div className={`grid grid-cols-1 md:grid-cols-3 border-b border-[#B3D9EE]/50 last:border-b-0 transition-colors ${isHeader ? 'bg-[#A7D8ED] text-black' : 'bg-white text-gray-700 hover:bg-[#F3F8FB]'}`}>
        {/* Label Column */}
        <div className={`p-4 md:col-span-1 border-b md:border-b-0 md:border-r border-[#B3D9EE]/50 flex items-center font-bold text-sm md:text-base`}>
            {label}
        </div>
        {/* Value Column */}
        <div className={`p-4 md:col-span-2 flex items-center text-sm md:text-base ${isHeader ? 'font-black' : 'font-medium'}`}>
            {value}
        </div>
    </div>
);

const TestPrepSection = ({ onEnquire }) => {
    return (
        <section id="services" className="py-20 bg-white border-t border-gray-100 relative overflow-hidden scroll-mt-20">
            <CosmicStarField />
            <div className="absolute top-1/3 right-10 opacity-40 pointer-events-none hidden xl:block z-0">
                <LayeredCardStack />
            </div>
            <div className="absolute bottom-1/4 left-10 opacity-20 pointer-events-none hidden xl:block z-0">
                <WireframeCube size="w-56 h-56" />
            </div>
            {/* Decorative Background */}
            <div className="absolute top-0 left-0 w-96 h-96 bg-blue-50 rounded-full blur-3xl opacity-60"></div>

            <div className="container mx-auto px-6 relative z-10">
                <div className="text-center mb-16">
                    <span className="bg-[#FFD700] text-black font-bold px-4 py-1.5 uppercase tracking-wider text-sm rounded-full mb-4 inline-block shadow-sm">
                        Our Services
                    </span>
                    <h2 className="text-4xl md:text-5xl font-bold text-[#000080] mb-4">Test Prep</h2>
                    <div className="h-1 w-24 bg-[#0047AB] mx-auto rounded-full mb-6"></div>
                    <h3 className="text-2xl font-bold text-[#0047AB]">DIGITAL SAT PREP</h3>
                </div>

                {/* Feature Cards with Images - Full Width */}
                <div className="w-full mb-16">
                    {/* Complete Course Card with Image */}
                    <motion.div
                        whileHover={{ y: -5 }}
                        className="relative rounded-2xl overflow-hidden shadow-xl border-2 border-gray-200 bg-white group"
                    >
                        {/* Image Header */}
                        <div className="h-48 overflow-hidden relative">
                            <img src={abroad4} alt="Complete Course" className="w-full h-full object-contain transition-transform duration-700 group-hover:scale-110" />
                            <div className="absolute inset-0 bg-gradient-to-t from-[#0047AB]/90 to-transparent"></div>
                            <div className="absolute bottom-4 left-4 text-white">
                                <div className="text-xs font-bold text-[#FFD700] mb-1">COMPREHENSIVE PROGRAM</div>
                                <div className="text-2xl font-bold">VERBAL COMPLETE COURSE</div>
                            </div>
                        </div>

                        {/* Table Content */}
                        <div className="border-t-[3px] border-[#82C8E5]">
                            <TableRow label="FEATURE" value="COMPLETE COURSE" isHeader />
                            <TableRow label="DURATION" value="6-7 weeks" />
                            <TableRow label="IDEAL FOR" value="Beginners, those wanting in-depth learning" />
                            <TableRow label="FOCUS" value="Concept building, detailed syllabus coverage, multiple tests" />
                            <TableRow label="MOCK TESTS" value="10 Full Length Mock Tests with Detailed Analysis + Time bounded Sheets" />
                            <TableRow label="LIVE CLASSES" value="Step-by-step learning" />
                        </div>
                    </motion.div>


                </div>

                {/* Why Our Course */}
                <div className="bg-[#F8FAFC] rounded-3xl p-8 lg:p-12 border border-gray-200 shadow-sm">
                    <h3 className="text-2xl font-bold text-[#000080] mb-8">WHY OUR COURSE</h3>
                    <div className="grid md:grid-cols-2 gap-6">
                        {[
                            "Live interaction with faculties.",
                            "Intensive researched study material based on latest SAT trends.",
                            "Exclusive time-tested techniques to improve your speed and accuracy on the SAT test.",
                            "Full length SAT pattern mock tests.",
                            "Test review sessions and personalized feedback shared with parents.",
                            "Learning of 1600 words in classroom studies.",
                            "Complimentary live profile building sessions.",
                            "Complimentary live TOEFL/IELTS training sessions.",
                            "Most affordable and comprehensive course of its kind.",
                            "Homework reviewed and scrutinized in live lectures"
                        ].map((item, index) => (
                            <motion.div
                                key={index}
                                className="flex gap-3"
                                whileHover={{ x: 5 }}
                                transition={{ type: "spring", stiffness: 300 }}
                            >
                                <div className="mt-1 flex-shrink-0 w-6 h-6 rounded-full bg-[#0047AB] flex items-center justify-center text-white text-xs">
                                    ✓
                                </div>
                                <p className="text-gray-700 font-medium">{item}</p>
                            </motion.div>
                        ))}
                    </div>
                    <div className="mt-10 flex justify-center">
                        <motion.button
                            onClick={onEnquire}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="inline-flex items-center gap-2 px-10 py-4 rounded-2xl bg-[#0047AB] text-white font-bold shadow-xl shadow-blue-200 hover:bg-[#000080] transition-all cursor-pointer text-lg"
                        >
                            Enquire Now →
                        </motion.button>
                    </div>
                </div>

            </div>
        </section>
    );
};

export default TestPrepSection;
