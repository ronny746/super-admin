import React, { useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import { ChevronLeft, ChevronRight } from "lucide-react";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

import heroBg1 from '../assets/images/Slider1.jpeg';
import heroBg2 from '../assets/images/Slider2.jpg';
import heroBg3 from '../assets/unacademy homepage/Sliders/JEE Adv Slider.jpg.jpeg';
import heroBg4 from '../assets/unacademy homepage/Sliders/Slider_Courses.jpg.jpeg';
import heroBg5 from '../assets/unacademy homepage/Sliders/Slider_USAT.jpg.jpeg';

const HeroSection = () => {
    const slides = [
        { src: heroBg1 },
        { src: heroBg2 },
        { src: heroBg3 },
        { src: heroBg4 },
        { src: heroBg5, link: "/admin/form/u-sat-scholarship-2026-27" }
    ];

    return (
        <section className="relative w-full py-4 md:py-8 bg-[#F7F8FA] overflow-hidden">
            <h1 className="sr-only">Unacademy Kota Centre: Best Offline Coaching for IIT JEE & NEET UG</h1>

            <div className="container mx-auto px-2 md:px-4 relative">
                <Swiper
                    modules={[Navigation, Pagination, Autoplay]}
                    spaceBetween={10}
                    slidesPerView={1}
                    centeredSlides={true}
                    loop={true}
                    speed={700}
                    autoplay={{ delay: 5000, disableOnInteraction: false, pauseOnMouseEnter: true }}
                    navigation={{ 
                        prevEl: '.hero-prev-btn', 
                        nextEl: '.hero-next-btn' 
                    }}
                    pagination={{ clickable: true, dynamicBullets: true }}
                    breakpoints={{
                        640:  { slidesPerView: 1.1,  spaceBetween: 12 },
                        1024: { slidesPerView: 1.08, spaceBetween: 20 },
                        1280: { slidesPerView: 1.15, spaceBetween: 24 },
                    }}
                    className="w-full hero-swiper overflow-visible!"
                >
                    {slides.map((slide, index) => (
                        <SwiperSlide key={index} className="transition-all duration-300">
                            {({ isActive }) => (
                                <div 
                                    className={`relative w-full overflow-hidden rounded-2xl shadow-lg transition-all duration-500 ease-out
                                    ${isActive ? 'scale-100 opacity-100 ring-1 ring-black/5' : 'scale-95 opacity-50 blur-[1px]'}
                                    ${slide.link ? 'cursor-pointer' : ''}`}
                                    onClick={() => {
                                        if (slide.link) {
                                            window.location.href = slide.link;
                                        }
                                    }}
                                >
                                    <div className="relative w-full aspect-[2048/700] bg-gray-100">
                                        <img
                                            src={slide.src}
                                            alt={`Banner ${index + 1}`}
                                            className="absolute inset-0 w-full h-full object-cover"
                                            loading={index === 0 ? "eager" : "lazy"}
                                            decoding={index === 0 ? "sync" : "async"}
                                        />
                                        <div className={`absolute inset-0 bg-black/10 transition-opacity duration-300 ${isActive ? 'opacity-0' : 'opacity-10'}`} />
                                    </div>
                                </div>
                            )}
                        </SwiperSlide>
                    ))}
                </Swiper>

                {/* Prev arrow */}
                <button
                    className="hero-prev-btn hidden md:flex absolute left-2 md:left-20 xl:left-32 top-1/2 -translate-y-1/2 z-20 w-11 h-11 md:w-12 md:h-12 bg-white hover:bg-[#08BD80] border border-gray-200 rounded-full items-center justify-center transition-all duration-200 shadow-md text-[#1D1D35] hover:text-white hover:border-[#08BD80] hover:shadow-[0_4px_16px_rgba(8,189,128,0.3)] group focus:outline-none cursor-pointer"
                    aria-label="Previous slide"
                >
                    <ChevronLeft className="w-5 h-5 group-hover:-translate-x-0.5 transition-transform" />
                </button>
                {/* Next arrow */}
                <button
                    className="hero-next-btn hidden md:flex absolute right-2 md:right-20 xl:right-32 top-1/2 -translate-y-1/2 z-20 w-11 h-11 md:w-12 md:h-12 bg-white hover:bg-[#08BD80] border border-gray-200 rounded-full items-center justify-center transition-all duration-200 shadow-md text-[#1D1D35] hover:text-white hover:border-[#08BD80] hover:shadow-[0_4px_16px_rgba(8,189,128,0.3)] group focus:outline-none cursor-pointer"
                    aria-label="Next slide"
                >
                    <ChevronRight className="w-5 h-5 group-hover:translate-x-0.5 transition-transform" />
                </button>
            </div>

            <style>{`
                .hero-swiper .swiper-pagination-bullet {
                    width: 8px; height: 8px;
                    background: #CBD5E1; opacity: 1;
                    transition: all 0.3s ease;
                    border-radius: 99px;
                }
                .hero-swiper .swiper-pagination-bullet-active {
                    width: 24px; border-radius: 4px;
                    background: #08BD80;
                }
            `}</style>
        </section>
    );
};

export default HeroSection;
