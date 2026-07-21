import React, { useState } from "react";
import { motion } from "framer-motion";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, FreeMode } from 'swiper/modules';
import 'swiper/css';

// Dynamic import of images
const iitImages = import.meta.glob('../assets/IIT-All-EDU/**/*.png', { eager: true, import: 'default' });
const neetImages = import.meta.glob('../assets/NEET-All-EDU/**/*.png', { eager: true, import: 'default' });
const foundationImages = import.meta.glob('../assets/Foundation_EDU/**/*.png', { eager: true, import: 'default' });

const processEducators = (imagesObj, category) => {
    return Object.entries(imagesObj).map(([path, imageUrl]) => {
        // Extract filename process
        let filename = path.split('/').pop().replace(/\.png$/i, '');

        // Extract leading number for sorting
        const numMatch = filename.match(/^(\d+)/);
        const order = numMatch ? parseInt(numMatch[1]) : 999;

        let shortName = null;
        // Check for SN. identifier for Short Name
        if (filename.includes("SN.")) {
            const snParts = filename.split("SN.");
            filename = snParts[0].trim();
            shortName = snParts[1].trim();
        }

        // Remove leading numbers and spaces
        filename = filename.replace(/^\d+\s+/, '');

        // Split by "Exp"
        const parts = filename.split(/Exp[\.\s]*/i);

        let rawNamePart = parts[0] || "";
        let rawExperiencePart = parts[1] || "";

        rawNamePart = rawNamePart.trim();
        rawExperiencePart = rawExperiencePart.trim();

        // Parse experience to add "+"
        const expMatch = rawExperiencePart.match(/(\d+)/);
        let experienceDisplay = rawExperiencePart;
        if (expMatch) {
            experienceDisplay = `${expMatch[1]}+ Years Experience`;
        }

        // Subject and Name logic
        let subject = "Subject";
        let name = rawNamePart;

        // Custom logic for "English & Verbal Trainer" and other multi-word subjects
        if (rawNamePart.toLowerCase().includes("head-ufs")) {
            subject = "Head-UFS";
            name = rawNamePart.replace(/head-ufs/i, '').trim();
        } else if (rawNamePart.toLowerCase().includes("english & verbal trainer")) {
            subject = "English & Verbal Trainer";
            name = rawNamePart.replace(/english & verbal trainer/i, '').trim();
        } else if (rawNamePart.toLowerCase().includes("social studies")) {
            subject = "Social Studies";
            name = rawNamePart.replace(/social studies/i, '').trim();
        } else {
            // Default: first word is subject
            const firstSpaceIdx = rawNamePart.indexOf(' ');
            if (firstSpaceIdx !== -1) {
                subject = rawNamePart.substring(0, firstSpaceIdx);
                name = rawNamePart.substring(firstSpaceIdx + 1);
            }
        }

        return {
            name: name,
            shortName: shortName,
            subject: subject,
            experience: experienceDisplay,
            category: category,
            image: imageUrl,
            order: order
        };
    });
};

const sortEducators = (educators) => {
    const priority = {
        'Head-UFS': 1,
        'Head': 1,
        'Physics': 10,
        'Chemistry': 20,
        'Maths': 30,
        'Mathematics': 30,
        'Biology': 40,
        'Botany': 50,
        'Zoology': 60
    };

    return educators.sort((a, b) => {
        // First sort by subject priority
        const pA = priority[a.subject] || 99;
        const pB = priority[b.subject] || 99;
        
        if (pA !== pB) {
            return pA - pB;
        }

        // Within the same subject, sort by order number from filename
        return a.order - b.order;
    });
};

const iitEducators = sortEducators(processEducators(iitImages, 'IIT'));
const neetEducators = sortEducators(processEducators(neetImages, 'NEET'));
const foundationEducators = sortEducators(processEducators(foundationImages, 'Foundation'));

const colors = {
    IIT: {
        hoverBg: "to-[#086FFF]/5",
        decorationCircle: "bg-[#086FFF]/5 group-hover:bg-[#086FFF]/10",
        imageGradient: "from-[#086FFF]/20",
        imageBorder: "group-hover:border-[#086FFF]/20",
        badgeText: "text-[#086FFF]",
        badgeHover: "group-hover:bg-[#086FFF]",
    },
    NEET: {
        hoverBg: "to-[#08BD80]/5",
        decorationCircle: "bg-[#08BD80]/5 group-hover:bg-[#08BD80]/10",
        imageGradient: "from-[#08BD80]/20",
        imageBorder: "group-hover:border-[#08BD80]/20",
        badgeText: "text-[#08BD80]",
        badgeHover: "group-hover:bg-[#08BD80]",
    },
    Foundation: {
        hoverBg: "to-[#FF9900]/5",
        decorationCircle: "bg-[#FF9900]/5 group-hover:bg-[#FF9900]/10",
        imageGradient: "from-[#FF9900]/20",
        imageBorder: "group-hover:border-[#FF9900]/20",
        badgeText: "text-[#FF9900]",
        badgeHover: "group-hover:bg-[#FF9900]",
    }
};

const EducatorCard = ({ educator, className = "" }) => {
    const theme = colors[educator.category] || colors.IIT;

    return (
    <div className={`bg-white rounded-3xl p-6 shadow-md hover:shadow-2xl transition-all duration-500 border border-gray-100 flex flex-col items-center text-center w-[300px] min-h-[380px] shrink-0 transform hover:-translate-y-2 group relative overflow-hidden ${className}`}>
        {/* Hover Gradient Background */}
        <div className={`absolute inset-0 bg-linear-to-b from-transparent ${theme.hoverBg} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}></div>

        {/* Decoration Circle */}
        <div className={`absolute -right-8 -top-8 w-24 h-24 rounded-full blur-2xl transition-colors duration-500 ${theme.decorationCircle}`}></div>

        {/* Image Container - Increased Size */}
        <div className="relative mb-6 w-44 h-44 md:w-52 md:h-52 z-10">
            <div className={`absolute inset-0 bg-linear-to-tr ${theme.imageGradient} to-transparent rounded-full scale-110 group-hover:scale-125 transition-transform duration-500`}></div>
            <div className={`w-full h-full rounded-full overflow-hidden border-4 border-white shadow-lg relative z-10 transition-colors duration-300 ${theme.imageBorder}`}>
                <img
                    src={educator.image}
                    alt={educator.name}
                    className="w-full h-full object-cover object-top hover:scale-110 transition-transform duration-700"
                />
            </div>
            {/* Subject Badge */}
            <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 z-20">
                <span className={`bg-white text-xs font-bold px-4 py-1.5 rounded-full shadow-md border border-gray-50 uppercase tracking-wide whitespace-nowrap transition-colors duration-300 group-hover:text-white ${theme.badgeText} ${theme.badgeHover}`}>
                    {educator.subject}
                </span>
            </div>
        </div>

        {/* Content - Reduced Gap */}
        <div className="w-full z-10 flex-1 flex flex-col justify-end gap-1">
            <div>
                {educator.shortName ? (
                    <>
                        <h3 className="text-2xl font-bold text-[var(--color-text-primary)] mb-0 px-2 leading-tight group-hover:text-[var(--color-una-blue)] transition-colors duration-300">
                            {educator.shortName}
                        </h3>
                        <p className="text-sm font-medium text-[var(--color-text-secondary)] mb-2 px-2">
                            {educator.name}
                        </p>
                    </>
                ) : (
                    <h3 className="text-xl font-bold text-[var(--color-text-primary)] mb-1 px-2 leading-tight group-hover:text-[var(--color-una-blue)] transition-colors duration-300">
                        {educator.name}
                    </h3>
                )}
                <div className="w-12 h-1 bg-[rgba(8,189,128,0.3)] rounded-full mx-auto mb-3 group-hover:w-20 group-hover:bg-[var(--color-una-green)] transition-all duration-500"></div>
            </div>

            <div className="flex items-center justify-center gap-2 text-[var(--color-text-secondary)] text-sm font-medium bg-[var(--color-bg-page)] py-2 px-4 rounded-xl mx-auto w-fit group-hover:bg-white group-hover:shadow-sm transition-all duration-300">
                <svg className="w-4 h-4 text-[var(--color-una-green)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <span>{educator.experience}</span>
            </div>
        </div>
    </div>
    );
};

const InfiniteCarousel = ({ items, direction = "left", speed = 5000 }) => {
    return (
        <div className="relative w-full overflow-hidden mask-gradient hidden md:block">
            <Swiper
                modules={[Autoplay, FreeMode]}
                slidesPerView="auto"
                spaceBetween={32}
                loop={true}
                speed={speed}
                freeMode={true}
                allowTouchMove={true}
                grabCursor={true}
                autoplay={{
                    delay: 0,
                    disableOnInteraction: false,
                    reverseDirection: direction === "right"
                }}
                className="educator-swiper-desktop !overflow-visible"
            >
                {items.map((educator, idx) => (
                    <SwiperSlide key={`${educator.name}-desktop-${idx}`} className="!w-auto py-4">
                        <EducatorCard educator={educator} />
                    </SwiperSlide>
                ))}
            </Swiper>
            {/* Gradient Masks */}
            <div className="absolute inset-y-0 left-0 w-24 bg-linear-to-r from-[#FFFBF5] to-transparent z-10 pointer-events-none"></div>
            <div className="absolute inset-y-0 right-0 w-24 bg-linear-to-l from-[#FFFBF5] to-transparent z-10 pointer-events-none"></div>

            <style>
                {`
                .educator-swiper-desktop .swiper-wrapper {
                    transition-timing-function: linear !important;
                }
                `}
            </style>
        </div>
    );
};

const MobileCarousel = ({ items, delay = 3000 }) => {
    return (
        <div className="block md:hidden w-full">
            <Swiper
                modules={[Autoplay]}
                spaceBetween={20}
                slidesPerView={'auto'}
                centeredSlides={true}
                loop={true}
                speed={500}
                autoplay={{
                    delay: delay,
                    disableOnInteraction: false,
                }}
                className="pb-4"
            >
                {items.map((educator, idx) => (
                    <SwiperSlide key={`${educator.name}-mobile-${idx}`} className="flex justify-center py-2 !w-auto">
                        <EducatorCard educator={educator} className="w-[85vw] max-w-[320px]" />
                    </SwiperSlide>
                ))}
            </Swiper>
        </div>
    );
};

const Educators = () => {
    return (
        <section className="py-20 md:py-28 bg-[var(--color-bg-page)] relative overflow-hidden una-texture">
            {/* Background Decorations */}
            <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[rgba(8,189,128,0.05)] rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none"></div>
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-[rgba(8,111,255,0.05)] rounded-full blur-3xl translate-y-1/3 -translate-x-1/4 pointer-events-none"></div>

            <div className="max-w-[100vw] mx-auto relative z-10 w-full overflow-hidden">
                {/* Header Section */}
                <div className="text-center mb-12 px-6">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                    >
                        <span className="section-label mb-4 inline-block">Our Faculty</span>
                        <h2 className="text-4xl md:text-5xl font-extrabold text-[var(--color-text-primary)] leading-tight mb-4">
                            Learn from <span className="text-[var(--color-una-blue)]">India's Best</span>
                        </h2>
                        <p className="text-[var(--color-text-secondary)] text-lg max-w-2xl mx-auto">
                            Our top-tier educators with years of experience are here to guide you towards your goal.
                        </p>
                    </motion.div>
                </div>

                {/* IIT JEE Section */}
                <div className="mb-20">
                    <div className="max-w-7xl mx-auto px-6 mb-10">
                        <div className="flex items-center gap-4">
                            <div className="h-px flex-1 bg-gradient-to-r from-transparent to-[var(--color-una-blue)]/30"></div>
                            <h3 className="text-2xl md:text-3xl font-bold text-[var(--color-text-primary)] bg-white px-8 py-3 rounded-full shadow-sm border border-gray-100 flex items-center gap-3">
                                <span className="w-2 h-2 rounded-full bg-[var(--color-una-blue)]"></span>
                                <span><span className="text-[var(--color-una-blue)]">IIT JEE</span> Educators</span>
                            </h3>
                            <div className="h-px flex-1 bg-gradient-to-l from-transparent to-[var(--color-una-blue)]/30"></div>
                        </div>
                    </div>

                    <InfiniteCarousel items={iitEducators} speed={8000} direction="left" />
                    <MobileCarousel items={iitEducators} delay={3000} />
                </div>

                {/* NEET Section */}
                <div className="mb-20">
                    <div className="max-w-7xl mx-auto px-6 mb-10">
                        <div className="flex items-center gap-4">
                            <div className="h-px flex-1 bg-gradient-to-r from-transparent to-[var(--color-una-green)]/30"></div>
                            <h3 className="text-2xl md:text-3xl font-bold text-[var(--color-text-primary)] bg-white px-8 py-3 rounded-full shadow-sm border border-gray-100 flex items-center gap-3">
                                <span className="w-2 h-2 rounded-full bg-[var(--color-una-green)]"></span>
                                <span><span className="text-[var(--color-una-green)]">NEET</span> Educators</span>
                            </h3>
                            <div className="h-px flex-1 bg-gradient-to-l from-transparent to-[var(--color-una-green)]/30"></div>
                        </div>
                    </div>

                    <InfiniteCarousel items={neetEducators} speed={10000} direction="left" />
                    <MobileCarousel items={neetEducators} delay={4000} />
                </div>

                {/* Foundation Section */}
                <div className="mb-8">
                    <div className="max-w-7xl mx-auto px-6 mb-10">
                        <div className="flex items-center gap-4">
                            <div className="h-px flex-1 bg-gradient-to-r from-transparent to-[var(--color-una-orange)]/30"></div>
                            <h3 className="text-2xl md:text-3xl font-bold text-[var(--color-text-primary)] bg-white px-8 py-3 rounded-full shadow-sm border border-gray-100 flex items-center gap-3">
                                <span className="w-2 h-2 rounded-full bg-[var(--color-una-orange)]"></span>
                                <span><span className="text-[var(--color-una-orange)]">Foundation</span> Educators</span>
                            </h3>
                            <div className="h-px flex-1 bg-gradient-to-l from-transparent to-[var(--color-una-orange)]/30"></div>
                        </div>
                    </div>

                    <InfiniteCarousel items={foundationEducators} speed={12000} direction="left" />
                    <MobileCarousel items={foundationEducators} delay={5000} />
                </div>

            </div>
        </section>
    );
};

export default Educators;
