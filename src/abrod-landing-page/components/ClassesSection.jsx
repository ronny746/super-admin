import React, { useRef } from 'react';
import { motion, useScroll, useTransform, useSpring, useMotionValue } from 'framer-motion';
import classesImg from '../assets/classes.jpeg';
import { CosmicStarField, FloatingRings, ParticleNetwork } from './ThreeDGraphic';

// Reusable Tilt Card (matching Home.jsx)
const TiltCard = ({ children, className = "" }) => {
    const x = useMotionValue(0);
    const y = useMotionValue(0);
    const mouseX = useSpring(x, { stiffness: 150, damping: 15 });
    const mouseY = useSpring(y, { stiffness: 150, damping: 15 });
    const rotateX = useTransform(mouseY, [-0.5, 0.5], ["5deg", "-5deg"]);
    const rotateY = useTransform(mouseX, [-0.5, 0.5], ["-5deg", "5deg"]);

    const handleMouseMove = (e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const width = rect.width;
        const height = rect.height;
        const mouseXVal = e.clientX - rect.left;
        const mouseYVal = e.clientY - rect.top;
        const xPct = mouseXVal / width - 0.5;
        const yPct = mouseYVal / height - 0.5;
        x.set(xPct);
        y.set(yPct);
    };

    const handleMouseLeave = () => { x.set(0); y.set(0); };

    return (
        <motion.div
            style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            className={`relative cursor-3d-move perspective-1000 ${className}`}
        >
            <div style={{ transform: "translateZ(20px)" }} className="h-full">
                {children}
            </div>
        </motion.div>
    );
};

const ClassesSection = ({ onEnquire }) => {
    return (
        <section id="classes" className="py-20 bg-white relative overflow-hidden scroll-mt-20">
            <CosmicStarField />
            <div className="absolute top-20 -left-10 opacity-30 pointer-events-none hidden lg:block z-0">
                <FloatingRings size="w-72 h-72" />
            </div>
            <div className="absolute bottom-10 -right-10 w-[400px] h-[400px] opacity-30 pointer-events-none hidden lg:block z-0">
                <ParticleNetwork />
            </div>
            {/* Decorative Background Blob */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-100 rounded-full blur-3xl opacity-50 -translate-y-1/2 translate-x-1/2"></div>

            <div className="container mx-auto px-4 md:px-6 relative z-10">
                <div className="max-w-6xl mx-auto">
                    <div className="text-center mb-12">
                        <span className="bg-[#FFD700] text-black font-bold px-4 py-1.5 uppercase tracking-wider text-sm rounded-full mb-4 inline-block shadow-sm">
                            Classes
                        </span>
                        <h2 className="text-4xl md:text-5xl font-bold text-[#000080] mb-4">Who Is This Program For?</h2>
                        <div className="h-1 w-24 bg-[#0047AB] mx-auto rounded-full"></div>
                    </div>

                    <div className="flex flex-col lg:flex-row gap-8 items-stretch">
                        {/* Text Content */}
                        <div className="lg:w-3/5 bg-[#F3F4F6] rounded-2xl p-8 border-l-8 border-[#0047AB] shadow-sm flex flex-col justify-center">
                            <p className="text-xl text-gray-700 font-medium mb-6">
                                COSMOS is ideal for:
                            </p>
                            <ul className="space-y-4">
                                {[
                                    "Learners of Class 9 to Class 12",
                                    "Learners aspiring to study in USA, UK, UAE, Canada, Australia, Europe & other top destinations",
                                    "Learners aiming for top universities, scholarships, and global careers"
                                ].map((item, index) => (
                                    <li key={index} className="flex items-start gap-4">
                                        <div className="mt-1.5 w-2 h-2 rounded-full bg-[#0047AB] shrink-0" />
                                        <span className="text-lg text-gray-700 leading-relaxed">{item}</span>
                                    </li>
                                ))}
                            </ul>
                            <div className="mt-8">
                                <motion.button
                                    onClick={onEnquire}
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    className="inline-flex items-center gap-2 px-8 py-3 rounded-xl bg-[#0047AB] text-white font-bold shadow-lg hover:bg-[#000080] transition-all cursor-pointer"
                                >
                                    Enquire Now →
                                </motion.button>
                            </div>
                        </div>

                        {/* Image Content */}
                        <div className="lg:w-2/5">
                            <TiltCard className="h-full">
                                <div className="h-full rounded-2xl overflow-hidden shadow-xl border-4 border-white relative group">
                                    <img
                                        src={classesImg}
                                        alt="Classes at COSMOS"
                                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                    />
                                    <div className="absolute inset-0 bg-linear-to-t from-[#000080]/80 to-transparent opacity-90"></div>
                                    <div className="absolute bottom-6 left-6 text-white">
                                        <div className="text-sm font-bold text-[#FFD700] mb-1">GLOBAL OPPORTUNITIES</div>
                                        <div className="text-2xl font-bold">Build Your Future <br />On Campus</div>
                                    </div>
                                </div>
                            </TiltCard>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default ClassesSection;
