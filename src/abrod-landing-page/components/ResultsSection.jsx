import React from 'react';
import { motion } from 'framer-motion';
import FadeIn from './FadeIn';

const ResultsSection = () => {
    return (
        <section id="results" className="py-20 bg-white border-t border-gray-100 relative overflow-hidden scroll-mt-20">
            {/* Background elements */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gradient-to-bl from-[#E5F1F8] to-transparent rounded-full blur-3xl opacity-60"></div>
            
            <div className="container mx-auto px-6 relative z-10">
                <div className="text-center mb-16">
                    <span className="bg-[#FFD700] text-black font-bold px-4 py-1.5 uppercase tracking-wider text-sm rounded-full mb-4 inline-block shadow-sm">
                        Success Stories
                    </span>
                    <h2 className="text-4xl md:text-5xl font-bold text-[#000080] mb-4">Our Results</h2>
                    <div className="h-1 w-24 bg-[#0047AB] mx-auto rounded-full mb-6"></div>
                    <p className="text-gray-600 max-w-2xl mx-auto md:text-lg">
                        Hear from our top achievers who have successfully made it to the world's leading universities with our expert guidance.
                    </p>
                </div>

                <div className="grid lg:grid-cols-2 gap-12 items-center max-w-6xl mx-auto">
                    {/* Video Section */}
                    <FadeIn direction="right">
                        <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-white aspect-video bg-gray-900 group">
                            {/* Placeholder for actual video - using iframe structure */}
                            <iframe 
                                className="w-full h-full object-cover"
                                src="https://www.youtube.com/embed/dQw4w9WgXcQ?rel=0&showinfo=0&autoplay=0" 
                                title="COSMOS Results Video" 
                                frameBorder="0" 
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                                allowFullScreen
                            ></iframe>
                            
                            {/* Decorative overlay in corner */}
                            <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-[#FFD700] to-transparent opacity-30 pointer-events-none"></div>
                        </div>
                    </FadeIn>

                    {/* Testimonial Section */}
                    <FadeIn direction="left" delay={0.2}>
                        <div className="relative">
                            <div className="absolute -left-6 -top-6 text-[8rem] text-[#E5F1F8] font-serif leading-none z-0">"</div>
                            
                            <motion.div 
                                className="bg-gradient-to-br from-[#F8FAFC] to-white rounded-3xl p-8 md:p-10 shadow-lg border border-[#D1E8F5] relative z-10"
                                whileHover={{ y: -5 }}
                                transition={{ type: "spring", stiffness: 300 }}
                            >
                                <div className="mb-6">
                                    <div className="flex gap-1 mb-4">
                                        {[1, 2, 3, 4, 5].map((star) => (
                                            <svg key={star} className="w-5 h-5 text-[#FFD700]" fill="currentColor" viewBox="0 0 20 20">
                                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                            </svg>
                                        ))}
                                    </div>
                                    <h3 className="text-xl font-bold text-[#000080] mb-2 cursor-pointer transition-colors duration-300">
                                        Perfect Score Journey!
                                    </h3>
                                    <p className="text-gray-700 leading-relaxed italic border-l-4 border-[#FFD700] pl-4">
                                        "COSMOS completely transformed my SAT preparation. The targeted practice sheets and live review sessions were incredibly helpful. Getting a 1580 opened doors for me at Oxford and Ivy League colleges that I only dreamed of before!"
                                    </p>
                                </div>
                                
                                <div className="flex items-center gap-4 pt-6 border-t border-gray-100">
                                    <div className="w-14 h-14 rounded-full bg-[#E5F1F8] flex items-center justify-center font-bold text-xl text-[#0047AB] border-2 border-[#82C8E5]">
                                        AS
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-gray-900">Aryan S.</h4>
                                        <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 text-sm">
                                            <span className="text-[#0047AB] font-semibold">SAT: 1580</span>
                                            <span className="hidden sm:inline text-gray-300">|</span>
                                            <span className="text-gray-500">Admitted to Oxford Univ.</span>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                            
                            <div className="absolute -right-6 -bottom-6 text-[8rem] text-[#E5F1F8] font-serif leading-none z-0 rotate-180">"</div>
                        </div>
                    </FadeIn>
                </div>
            </div>
        </section>
    );
};

export default ResultsSection;
