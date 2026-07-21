import React from 'react';
import { motion } from 'framer-motion';
import abroad6 from '../assets/abroad-6.jpg';
import mathImg from '../assets/mathmetics.jpeg';
import satPracticeTest from '../assets/sat-practice-test-digital-BG8b_5Ta.pdf';
import satPracticeAnswers from '../assets/sat-practice-test-answers-digital-Dm4pDh8P.pdf';
import { CosmicStarField, WireframeCube, LayeredCardStack } from './ThreeDGraphic';

const TableRow = ({ col1, col2, col3, isHeader = false }) => (
    <div className={`flex border-b border-gray-400 last:border-b-0 ${isHeader ? 'bg-[#7F7F7F] text-white font-bold' : 'bg-[#E7F3FF] text-black'}`}>
        <div className={`min-w-[200px] w-[200px] p-2 md:p-3 border-r border-gray-400 flex items-center text-xs md:text-base ${isHeader ? '' : 'font-bold'}`}>
            {col1}
        </div>
        <div className={`min-w-[250px] w-[250px] p-2 md:p-3 border-r border-gray-400 flex items-center text-xs md:text-base ${isHeader ? '' : 'font-medium'}`}>
            {col2}
        </div>
        <div className="min-w-[150px] flex-1 p-2 md:p-3 flex items-center text-xs md:text-base font-medium">
            {col3}
        </div>
    </div>
);

const MathTableRow = ({ col1, col2, isHeader = false }) => (
    <div className={`flex border-b border-gray-400 last:border-b-0 ${isHeader ? 'bg-[#7F7F7F] text-white font-bold' : 'bg-[#E7F3FF] text-black'}`}>
        <div className={`min-w-[280px] w-[280px] p-2 md:p-3 border-r border-gray-400 flex items-center text-xs md:text-base ${isHeader ? '' : 'font-bold'}`}>
            {col1}
        </div>
        <div className="min-w-[220px] flex-1 p-2 md:p-3 flex items-center text-xs md:text-base font-medium">
            {col2}
        </div>
    </div>
);

const AboutSatSection = ({ onEnquire }) => {
    return (
        <section id="about-sat" className="py-12 md:py-20 bg-white border-t border-gray-100 scroll-mt-20 relative overflow-hidden">
            <CosmicStarField />

            {/* 3D Animated Background Element */}
            <div className="absolute top-1/4 -right-10 opacity-30 pointer-events-none hidden lg:block z-0">
                <WireframeCube size="w-64 h-64" />
            </div>
            <div className="absolute bottom-1/4 -left-10 opacity-30 pointer-events-none hidden lg:block z-0">
                <LayeredCardStack />
            </div>

            <div className="container mx-auto px-4 md:px-6">

                <div className="text-center mb-12 md:mb-16">
                    <span className="bg-[#FFD700] text-black font-bold px-4 py-1.5 uppercase tracking-wider text-xs md:text-sm rounded-full mb-4 inline-block shadow-sm">
                        About Digital SAT
                    </span>
                    <h2 className="text-3xl md:text-5xl font-bold text-[#000080] mb-4">Understanding the Exam</h2>
                    <div className="h-1 w-24 bg-[#0047AB] mx-auto rounded-full"></div>
                </div>



                <div className="space-y-8 md:space-y-12">
                    {/* Structure Section with Image */}
                    <div className="grid lg:grid-cols-2 gap-6 md:gap-8 items-start">
                        <div className="w-full max-w-full min-w-0 overflow-hidden">
                            <h3 className="text-lg md:text-xl font-bold underline mb-4 text-black">How the SAT Is Structured</h3>
                            <p className="text-gray-700 mb-4 leading-relaxed text-sm md:text-base">
                                The SAT is composed of two sections: (1) the Reading and Writing section, and (2) the Math section.
                                You have 64 minutes to complete the Reading and Writing section and 70 minutes to complete the Math section, for a total of 2 hours and 14 minutes.
                            </p>
                            <p className="text-gray-700 mb-6 leading-relaxed text-sm md:text-base">
                                Each section is divided into 2 equal-length modules, and there is a 10-minute break between the Reading and Writing section and the Math section.
                                The first module of each section contains a broad mix of easy, medium, and hard questions.
                            </p>

                            {/* Structure Table - RESPONSIVE */}
                            <div className="w-full max-w-full rounded-lg border-2 border-gray-400 mb-6 md:mb-8">
                                <div className="overflow-x-auto">
                                    <div className="min-w-[600px]">
                                        <TableRow col1="Component" col2="Time Allotted (minutes)" col3="Questions" isHeader />
                                        <TableRow col1="Reading and Writing" col2="64 (two 32-min modules)" col3="54" />
                                        <TableRow col1="Math" col2="70 (two 35-min modules)" col3="44" />
                                        <TableRow col1="Total" col2="134" col3="98" />
                                    </div>
                                </div>
                                <div className="md:hidden text-center py-2 bg-blue-50 text-xs text-gray-600 border-t border-gray-400">
                                    ← Scroll to see all →
                                </div>
                            </div>

                            <p className="text-gray-700 leading-relaxed text-sm md:text-base">
                                Most of the questions are multiple choice, though some of the math questions ask you to enter the answer rather than select it.
                            </p>
                        </div>

                        {/* Image Card */}
                        <motion.div
                            whileHover={{ scale: 1.02 }}
                            className="rounded-xl md:rounded-2xl overflow-hidden shadow-xl border-2 md:border-4 border-white relative group h-64 md:h-full md:min-h-[400px]"
                        >
                            <img src={abroad6} alt="SAT Exam Structure" className="w-full h-full object-contain transition-transform duration-700 group-hover:scale-110" />
                            <div className="absolute inset-0 bg-linear-to-t from-[#000080]/80 to-transparent"></div>
                            <div className="absolute bottom-4 md:bottom-6 left-4 md:left-6 text-white">
                                <div className="text-xs md:text-sm font-bold text-[#FFD700] mb-1">EXAM STRUCTURE</div>
                                <div className="text-lg md:text-2xl font-bold">Digital SAT Format <br />134 Minutes Total</div>
                            </div>
                        </motion.div>
                    </div>

                    {/* Reading and Writing Section */}
                    <div>
                        <h3 className="text-lg md:text-xl font-bold underline mb-4 text-black">The Reading and Writing Section</h3>
                        <p className="text-gray-700 mb-4 leading-relaxed text-sm md:text-base">
                            The Reading and Writing section presents short reading passages (or passage pairs) followed by a single multiple-choice question.
                            Questions on the Reading and Writing section represent one of four content domains.
                        </p>
                        <div className="bg-gray-50 p-4 md:p-6 rounded-xl border border-gray-200">
                            <h4 className="font-bold text-gray-800 mb-2 text-sm md:text-base">Content Domains:</h4>
                            <ul className="list-disc pl-5 space-y-2 text-gray-700 text-xs md:text-base">
                                <li><strong>Information and Ideas:</strong> Comprehension, analysis, and reasoning skills.</li>
                                <li><strong>Craft and Structure:</strong> Vocabulary, analysis, synthesis, and reasoning skills.</li>
                                <li><strong>Expression of Ideas:</strong> Ability to revise texts effectively.</li>
                                <li><strong>Standard English Conventions:</strong> Edit text to conform to Standard English.</li>
                            </ul>
                        </div>
                        {/* Download Resources Buttons - Moved here */}
                        <div className="flex flex-col sm:flex-row justify-center gap-4 mt-8">
                            <a
                                href={satPracticeTest}
                                download="SAT-Practice-Test-Digital.pdf"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="px-8 py-3 bg-linear-to-r from-[#0047AB] to-[#000080] text-white font-bold rounded-lg shadow-lg hover:shadow-xl hover:scale-105 transition-all text-center flex items-center justify-center gap-2"
                            >
                                <span>📄</span> Download Practice Test
                            </a>
                            <a
                                href={satPracticeAnswers}
                                download="SAT-Practice-Test-Answers-Digital.pdf"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="px-8 py-3 bg-white border-2 border-[#0047AB] text-[#0047AB] font-bold rounded-lg shadow-md hover:shadow-lg hover:bg-blue-50 hover:scale-105 transition-all text-center flex items-center justify-center gap-2"
                            >
                                <span>✅</span> Download Answers
                            </a>
                        </div>
                    </div>

                    {/* Math Section with Image */}
                    <div className="grid lg:grid-cols-2 gap-6 md:gap-8 items-start">
                        {/* Image on Left */}
                        <motion.div
                            whileHover={{ scale: 1.02 }}
                            className="rounded-xl md:rounded-2xl overflow-hidden shadow-xl border-2 md:border-4 border-white relative group h-64 md:h-full md:min-h-[350px] order-2 lg:order-1"
                        >
                            <img src={mathImg} alt="SAT Math Section" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                            <div className="absolute inset-0 bg-gradient-to-t from-[#0047AB]/80 to-transparent"></div>
                            <div className="absolute bottom-4 md:bottom-6 left-4 md:left-6 text-white">
                                <div className="text-xs md:text-sm font-bold text-[#FFD700] mb-1">MATHEMATICS</div>
                                <div className="text-lg md:text-2xl font-bold">Advanced Math <br />& Problem Solving</div>
                            </div>
                        </motion.div>

                        {/* Content on Right */}
                        <div className="order-1 lg:order-2 w-full max-w-full min-w-0 overflow-hidden">
                            <h3 className="text-lg md:text-xl font-bold underline mb-4 text-black">The Math Section</h3>
                            <p className="text-gray-700 mb-4 leading-relaxed text-sm md:text-base">
                                The Math section focuses on the areas of math that play the biggest role in college and career success:
                                Algebra, Advanced Math, Problem-Solving and Data Analysis, and Geometry and Trigonometry.
                            </p>

                            <h4 className="font-bold text-gray-800 mb-2 text-sm md:text-base">Types of Math Tested</h4>
                            <p className="text-gray-700 mb-4 text-xs md:text-sm">
                                The math questions are divided into four categories.
                            </p>
                            <div className="w-full max-w-full border-2 border-gray-400 rounded-lg">
                                <div className="overflow-x-auto">
                                    <div className="min-w-[500px]">
                                        <MathTableRow col1="Type of Math" col2="Questions" isHeader />
                                        <MathTableRow col1="Algebra" col2="13–15" />
                                        <MathTableRow col1="Advanced Math" col2="13–15" />
                                        <MathTableRow col1="Problem-Solving" col2="5–7" />
                                        <MathTableRow col1="Geometry & Trig" col2="5–7" />
                                    </div>
                                </div>
                                <div className="md:hidden text-center py-2 bg-blue-50 text-xs text-gray-600 border-t border-gray-400">
                                    ← Scroll to see all →
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Comparisons */}
                    <div className="flex flex-col gap-8 mt-12 w-full max-w-5xl mx-auto">
                        {/* Why SAT */}
                        <div className="bg-gradient-to-br from-[#E5F1F8] to-white rounded-2xl p-6 md:p-8 shadow-sm border border-[#D1E8F5] transform hover:-translate-y-1 transition-transform duration-300 w-full mb-4">
                            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-[#B3D9EE]/50">
                                <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm">
                                    <span className="text-xl">🌟</span>
                                </div>
                                <h3 className="text-xl md:text-2xl font-bold text-[#000080]">Why SAT</h3>
                            </div>
                            <ul className="space-y-4">
                                {[
                                    { title: "Universally accepted", desc: "by top universities across the USA, UK, Canada, Europe, Singapore, and more" },
                                    { title: "More than just a test", desc: "evaluates critical thinking, reasoning, and real-world application" },
                                    { title: "Best predictor of college success", desc: "not just exam performance" },
                                    { title: "SAT scores follow you", desc: "used for admissions, scholarships, and academic placement" }
                                ].map((item, idx) => (
                                    <li key={idx} className="flex items-start gap-4">
                                        <div className="mt-1.5 w-2 h-2 rounded-full bg-[#0047AB] shrink-0 relative">
                                            <div className="absolute inset-0 bg-[#0047AB] rounded-full animate-ping opacity-20"></div>
                                        </div>
                                        <span className="text-gray-700 text-sm md:text-base font-medium">
                                            <strong className="text-[#000080]">{item.title}:</strong> {item.desc}
                                        </span>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* SAT vs IIT-JEE Table */}
                        <div className="w-full">
                            <h3 className="text-xl md:text-2xl font-bold text-[#000080] mb-6 flex items-center gap-3 justify-center">
                                <span className="text-2xl">⚖️</span> SAT vs IIT-JEE
                            </h3>
                            <div className="overflow-x-auto rounded-xl shadow-lg border-2 border-[#82C8E5]">
                                <table className="w-full text-center table-fixed min-w-[600px] border-collapse">
                                    <thead>
                                        <tr>
                                            <th className="w-1/2 p-4 md:p-6 bg-[#A7D8ED] border-r-2 border-b-2 border-[#82C8E5] text-black font-black text-lg md:text-xl tracking-wider">
                                                SAT
                                            </th>
                                            <th className="w-1/2 p-4 md:p-6 bg-[#A7D8ED] border-b-2 border-[#82C8E5] text-black font-black text-lg md:text-xl tracking-wider">
                                                IIT-JEE
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white text-gray-700 font-medium text-base md:text-lg">
                                        <tr className="hover:bg-[#F3F8FB] transition-colors border-b border-[#B3D9EE]/50">
                                            <td className="p-4 md:p-6 border-r border-[#B3D9EE]/50">
                                                Focuses on aptitude, logic & college readiness
                                            </td>
                                            <td className="p-4 md:p-6">
                                                High-pressure, rank-based elimination exam
                                            </td>
                                        </tr>
                                        <tr className="hover:bg-[#F3F8FB] transition-colors border-b border-[#B3D9EE]/50">
                                            <td className="p-4 md:p-6 border-r border-[#B3D9EE]/50">
                                                Score-based admission system
                                            </td>
                                            <td className="p-4 md:p-6">
                                                Strict rank-based selection
                                            </td>
                                        </tr>
                                        <tr className="hover:bg-[#F3F8FB] transition-colors border-b border-[#B3D9EE]/50">
                                            <td className="p-4 md:p-6 border-r border-[#B3D9EE]/50">
                                                Multiple attempts per year
                                            </td>
                                            <td className="p-4 md:p-6">
                                                Limited attempts, once a year cycle
                                            </td>
                                        </tr>
                                        <tr className="hover:bg-[#F3F8FB] transition-colors">
                                            <td className="p-4 md:p-6 border-r border-[#B3D9EE]/50">
                                                Opens global opportunities
                                            </td>
                                            <td className="p-4 md:p-6">
                                                Limited to a small number of seats in India
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>

                    {/* Final CTA for this section */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="mt-16 text-center"
                    >
                        <p className="text-gray-600 mb-6 font-medium">Have more questions about the Digital SAT?</p>
                        <motion.button
                            onClick={onEnquire}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="inline-flex items-center gap-3 px-8 py-4 rounded-full bg-linear-to-r from-[#0047AB] to-[#000080] text-white font-bold shadow-2xl hover:shadow-blue-500/40 transition-all cursor-pointer text-lg"
                        >
                            <span>Enquire Now</span>
                            <span className="text-2xl">→</span>
                        </motion.button>
                    </motion.div>
                </div>
            </div>
        </section>
    );
};

export default AboutSatSection;
