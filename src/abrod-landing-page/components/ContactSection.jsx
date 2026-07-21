import React from 'react';
import { motion } from 'framer-motion';
import contactImage from '../assets/contact.jpg';
import { CosmicStarField, WireframeCube, FloatingRings } from './ThreeDGraphic';

const ContactSection = ({ onEnquire }) => {
    return (
        <section className="py-16 md:py-24 bg-gradient-to-b from-white to-blue-50 relative overflow-hidden" id="contact">
            <CosmicStarField />
            <div className="absolute top-20 right-10 opacity-30 pointer-events-none hidden xl:block z-0">
                <WireframeCube size="w-48 h-48" />
            </div>
            <div className="absolute bottom-20 left-10 opacity-30 pointer-events-none hidden xl:block z-0">
                <FloatingRings size="w-64 h-64" />
            </div>
            {/* Background Decorative Elements */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#82C8E5]/10 rounded-full blur-3xl -z-10 translate-x-1/2 -translate-y-1/2"></div>
            <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-[#0047AB]/5 rounded-full blur-3xl -z-10 -translate-x-1/2 translate-y-1/2"></div>

            <div className="container mx-auto px-4 md:px-6">

                <div className="text-center mb-12 md:mb-16">
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-3xl md:text-5xl font-bold text-[#000080] mb-4"
                    >
                        Get in Touch
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="text-[#6D8196] text-base md:text-xl max-w-2xl mx-auto"
                    >
                        Have questions about your global education journey? We are here to help.
                    </motion.p>
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.2 }}
                    className="max-w-6xl mx-auto bg-white rounded-2xl md:rounded-3xl shadow-2xl overflow-hidden border border-[#82C8E5]/20 grid grid-cols-1 lg:grid-cols-2"
                >

                    {/* Left Side: Image */}
                    <div className="relative overflow-hidden h-80 md:h-96 lg:h-auto order-2 lg:order-1">
                        {/* Background Image */}
                        <div className="absolute inset-0">
                            <img src={contactImage} alt="Contact Us" className="w-full h-full object-contain" />
                            <div className="absolute inset-0 bg-gradient-to-br from-[#000080]/85 via-[#0047AB]/80 to-[#82C8E5]/60"></div>
                        </div>

                        {/* Content Overlay */}
                        <div className="relative z-10 p-8 md:p-12 lg:p-14 text-white h-full flex flex-col justify-center">
                            {/* Animated Pattern Overlay */}
                            <div className="absolute inset-0 opacity-5">
                                <svg className="w-full h-full" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
                                    <defs>
                                        <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                                            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" strokeWidth="1" />
                                        </pattern>
                                    </defs>
                                    <rect width="100%" height="100%" fill="url(#grid)" />
                                </svg>
                            </div>

                            <div className="relative z-10">
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    whileInView={{ opacity: 1, scale: 1 }}
                                    viewport={{ once: true }}
                                    className="mb-8 md:mb-10"
                                >
                                    <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center mb-6">
                                        <span className="text-4xl md:text-5xl">🎓</span>
                                    </div>
                                </motion.div>

                                <motion.h3
                                    initial={{ opacity: 0, x: -20 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ once: true }}
                                    className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 md:mb-6 leading-tight"
                                >
                                    Your Global Education Journey Starts Here
                                </motion.h3>
                                <motion.p
                                    initial={{ opacity: 0, x: -20 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: 0.1 }}
                                    className="text-blue-100 text-base md:text-lg mb-8 md:mb-10 leading-relaxed"
                                >
                                    Connect with our expert counselors who will guide you through every step of your study abroad journey.
                                </motion.p>

                                <div className="space-y-4 md:space-y-5">
                                    <motion.div
                                        whileHover={{ x: 5 }}
                                        className="flex items-center gap-4"
                                    >
                                        <div className="w-12 h-12 md:w-14 md:h-14 rounded-xl bg-white/20 flex items-center justify-center backdrop-blur-sm">
                                            <span className="text-2xl md:text-3xl">📞</span>
                                        </div>
                                        <div>
                                            <p className="opacity-70 text-xs md:text-sm">Call us at</p>
                                            <p className="font-bold text-lg md:text-xl">+91 9079041937</p>
                                        </div>
                                    </motion.div>
                                    <motion.div
                                        whileHover={{ x: 5 }}
                                        className="flex items-center gap-4"
                                    >
                                        <div className="w-12 h-12 md:w-14 md:h-14 rounded-xl bg-white/20 flex items-center justify-center backdrop-blur-sm">
                                            <span className="text-2xl md:text-3xl">✉️</span>
                                        </div>
                                        <div>
                                            <p className="opacity-70 text-xs md:text-sm">Email us at</p>
                                            <p className="font-bold text-base md:text-lg break-all">support@COSMOS.com</p>
                                        </div>
                                    </motion.div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Side: CTA */}
                    <div className="w-full p-8 md:p-12 lg:p-16 bg-gradient-to-br from-gray-50 to-white flex flex-col justify-center items-center text-center order-1 lg:order-2">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="w-full max-w-md"
                        >
                            {/* Icon */}
                            <motion.div
                                animate={{
                                    scale: [1, 1.1, 1],
                                    rotate: [0, 5, -5, 0]
                                }}
                                transition={{
                                    duration: 3,
                                    repeat: Infinity,
                                    ease: "easeInOut"
                                }}
                                className="w-20 h-20 md:w-24 md:h-24 mx-auto mb-6 md:mb-8 rounded-full bg-gradient-to-br from-[#0047AB] to-[#82C8E5] flex items-center justify-center shadow-xl"
                            >
                                <span className="text-4xl md:text-5xl">🌍</span>
                            </motion.div>

                            {/* Heading */}
                            <h3 className="text-2xl md:text-4xl font-bold text-gray-800 mb-4 md:mb-6">
                                Ready to Take the <span className="text-[#0047AB]">Next Step?</span>
                            </h3>

                            {/* Description */}
                            <p className="text-gray-600 text-sm md:text-lg mb-8 md:mb-10 leading-relaxed">
                                Get personalized guidance from our expert counselors for SAT preparation, university selection, and admission support.
                            </p>

                            {/* Premium Enquiry Now Button */}
                            <motion.button
                                onClick={onEnquire}
                                whileHover={{ scale: 1.05, y: -3 }}
                                whileTap={{ scale: 0.95 }}
                                className="w-full bg-gradient-to-r from-[#0047AB] via-[#000080] to-[#0047AB] text-white font-bold py-4 md:py-5 px-8 rounded-2xl shadow-2xl shadow-blue-900/30 hover:shadow-blue-900/50 transition-all duration-300 flex items-center justify-center gap-3 group relative overflow-hidden text-base md:text-lg cursor-pointer"
                            >
                                {/* Animated Background Shimmer */}
                                <motion.div
                                    animate={{ x: ['-100%', '100%'] }}
                                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                                ></motion.div>

                                <span className="relative z-10 flex items-center gap-3">
                                    <span className="text-2xl md:text-3xl">📧</span>
                                    <span className="font-bold tracking-wide">Enquire Now</span>
                                    <motion.span
                                        animate={{ x: [0, 5, 0] }}
                                        transition={{ duration: 1.5, repeat: Infinity }}
                                        className="text-xl md:text-2xl"
                                    >
                                        →
                                    </motion.span>
                                </span>
                            </motion.button>

                            {/* Trust Indicators */}
                            <div className="mt-8 md:mt-10 space-y-3 md:space-y-4">
                                <div className="flex items-center justify-center gap-2 text-gray-500 text-xs md:text-sm">
                                    <span className="text-green-500 text-lg">✓</span>
                                    <span>Free Consultation</span>
                                </div>
                                <div className="flex items-center justify-center gap-2 text-gray-500 text-xs md:text-sm">
                                    <span className="text-green-500 text-lg">✓</span>
                                    <span>Expert Counselors</span>
                                </div>
                                <div className="flex items-center justify-center gap-2 text-gray-500 text-xs md:text-sm">
                                    <span className="text-green-500 text-lg">✓</span>
                                    <span>24/7 Support Available</span>
                                </div>
                            </div>

                            {/* Security Badge */}
                            <div className="mt-6 md:mt-8 p-4 rounded-xl bg-white border border-gray-200 shadow-sm">
                                <p className="text-xs md:text-sm text-gray-600 flex items-center justify-center gap-2">
                                    <span className="text-base md:text-lg">🔒</span>
                                    <span>Your information is 100% safe and secure</span>
                                </p>
                            </div>
                        </motion.div>
                    </div>
                </motion.div>

            </div>
        </section>
    );
};

export default ContactSection;
