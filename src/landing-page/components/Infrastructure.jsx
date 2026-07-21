import React from "react";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay } from 'swiper/modules';
import 'swiper/css';

// Using existing centre images from assets
import infra1 from '../assets/images/centre-image.jpeg';
import infra2 from '../assets/images/centre-1.jpeg';
import infra3 from '../assets/images/centre-2.jpeg';
import infra4 from '../assets/images/centre-3.jpeg';

const Infrastructure = () => {
    // Repeat images to ensure smooth looping (Swiper needs slides > 2 * slidesPerView)
    const images = [
        infra1, infra2, infra3, infra4,
        infra1, infra2, infra3, infra4,
        infra1, infra2, infra3, infra4
    ];

    return (
        <section className="py-16 md:py-24 bg-white overflow-hidden">
            <div className="max-w-[1200px] mx-auto px-6 text-center mb-12">
                {/* Title */}
                <h2 className="text-[32px] md:text-[40px] font-bold text-[#3C4852] mb-6">
                    <span className="text-[#8A4FFF]">State-of-the-art</span> infrastructure
                </h2>

                {/* Subtitle */}
                <p className="text-[16px] md:text-[18px] text-[#7A8B94] leading-relaxed max-w-3xl mx-auto">
                    Learning in classrooms is nothing new, Then what it is which makes Unacademy special?
                    <br className="hidden md:block" />
                    we get it! and that's why we have completely reimagined learning experience for you
                </p>
            </div>

            {/* Images Swiper */}
            <div className="px-4">
                <style>
                    {`
                    .infrastructure-swiper .swiper-wrapper {
                        transition-timing-function: linear !important;
                    }
                    `}
                </style>
                <Swiper
                    modules={[Autoplay]}
                    spaceBetween={24}
                    slidesPerView={1.2}
                    centeredSlides={true}
                    loop={true}
                    speed={6000} // Slow continuous speed
                    autoplay={{
                        delay: 0, // No delay between transitions
                        disableOnInteraction: false,
                    }}
                    breakpoints={{
                        640: { slidesPerView: 2.2, spaceBetween: 24, centeredSlides: false },
                        1024: { slidesPerView: 4, spaceBetween: 32, centeredSlides: false }, // slightly more visible slides
                    }}
                    className="infrastructure-swiper"
                >
                    {images.map((img, index) => (
                        <SwiperSlide key={index}>
                            <div className="overflow-hidden rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300">
                                <img
                                    src={img}
                                    alt={`Infrastructure ${index + 1}`}
                                    loading="eager"
                                    className="w-full h-[250px] md:h-[300px] object-cover transition-transform duration-700 hover:scale-110"
                                />
                            </div>
                        </SwiperSlide>
                    ))}
                </Swiper>
            </div>
        </section>
    );
};

export default Infrastructure;
