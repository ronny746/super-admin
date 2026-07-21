import React, { useEffect, useRef, useState } from 'react';
import { motion, useInView, useAnimation } from 'framer-motion';
import { ArrowRight, Download, BookOpen, CheckCircle2, MapPin, Target, Award, ChevronRight } from 'lucide-react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Autoplay, Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

import brochurePdf from '../assets/images/Brouchere.pdf';
import spsSir from '../assets/About/SPS_Sir_photo.jpg';

import infra1 from '../assets/About/infra/unacademy infra 1.webp';
import infra2 from '../assets/About/infra/infra 2.jpg';
import infra3 from '../assets/About/infra/infra 3.jpg';
import infra4 from '../assets/About/infra/infra 4.jpg';
import infra5 from '../assets/About/infra/infra 5.png';
import infra6 from '../assets/About/infra/infra 6.png';
import infra7 from '../assets/About/infra/infra 7.png';

const infraImages = [infra1, infra2, infra3, infra4, infra5, infra6, infra7];

/* ── Animation variants ─────────────────── */
const fadeUp = {
    hidden: { opacity: 0, y: 28 },
    show: (i = 0) => ({
        opacity: 1, y: 0,
        transition: { duration: 0.6, delay: i * 0.12, ease: [0.22, 1, 0.36, 1] },
    }),
};

const fadeLeft  = { hidden: { opacity: 0, x: -40 }, show: { opacity: 1, x: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] } } };
const fadeRight = { hidden: { opacity: 0, x:  40 }, show: { opacity: 1, x: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] } } };
const scaleIn   = { hidden: { opacity: 0, scale: 0.88 }, show: { opacity: 1, scale: 1, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } } };

const stagger = {
    hidden: {},
    show: { transition: { staggerChildren: 0.13 } },
};

/* ── Counter component ───────────────────── */
const Counter = ({ target, suffix = '' }) => {
    const [count, setCount] = useState(0);
    const ref = useRef(null);
    const inView = useInView(ref, { once: true });

    useEffect(() => {
        if (!inView) return;
        const num = parseInt(target.replace(/\D/g, ''));
        let start = 0;
        const step = Math.ceil(num / 40);
        const timer = setInterval(() => {
            start += step;
            if (start >= num) { setCount(num); clearInterval(timer); }
            else setCount(start);
        }, 30);
        return () => clearInterval(timer);
    }, [inView, target]);

    const plus = target.includes('+') ? '+' : '';
    return <span ref={ref}>{count}{plus}{suffix}</span>;
};


const AboutUs = () => {
    return (
        <div className="bg-[var(--color-bg-page)] font-sans">

            {/* ─── 1. HERO ─────────────────────────────────── */}
            <section className="relative w-full h-[58vh] md:h-[68vh] overflow-hidden">
                {/* Parallax-style image scale on load */}
                <motion.img
                    src={infra5}
                    alt="Unacademy Kota Campus"
                    className="absolute inset-0 w-full h-full object-cover object-center"
                    initial={{ scale: 1.08 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 1.6, ease: [0.22, 1, 0.36, 1] }}
                />
                <div className="absolute inset-0 bg-black/55" />

                <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-6">
                    <motion.div
                        variants={stagger} initial="hidden" animate="show"
                        className="max-w-5xl mx-auto"
                    >
                        <motion.span
                            variants={fadeUp}
                            className="inline-block px-5 py-2 rounded-full bg-white/15 backdrop-blur-sm text-white/90 text-sm font-semibold uppercase tracking-widest mb-6 border border-white/20"
                        >
                            About Unacademy Kota
                        </motion.span>
                        <motion.h1
                            variants={fadeUp}
                            className="text-4xl md:text-6xl lg:text-7xl font-extrabold text-white tracking-tight drop-shadow-xl mb-5"
                        >
                            Redefining Learning,{' '}
                            <span className="text-[var(--color-una-blue)]">Empowering Aspirations</span>
                        </motion.h1>
                        <motion.p
                            variants={fadeUp}
                            className="text-white/75 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed"
                        >
                            India's most trusted offline coaching hub — where Kota's legacy meets innovation.
                        </motion.p>
                    </motion.div>
                </div>
            </section>

            {/* ─── 2. ABOUT UNACADEMY ──────────────────────── */}
            <section className="py-20 md:py-28 bg-[var(--color-bg-white)] relative overflow-hidden una-texture">
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[rgba(8,189,128,0.05)] rounded-full blur-3xl -translate-y-1/3 translate-x-1/3 pointer-events-none" />

                <div className="w-full px-6 md:px-12 lg:px-20 xl:px-28 relative z-10">

                    {/* heading */}
                    <div className="text-center mb-16">
                        <motion.div variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }}>
                            <div className="inline-flex items-center gap-2 px-4 py-2 bg-[rgba(8,111,255,0.08)] text-[var(--color-una-blue)] font-bold text-xs rounded-full uppercase tracking-widest mb-5">
                                <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-una-blue)]" /> Our Story
                            </div>
                            <h2 className="text-4xl md:text-5xl font-black text-gray-900 leading-tight mb-5">
                                About Unacademy
                            </h2>
                            <p className="text-xl text-gray-500 max-w-3xl mx-auto leading-relaxed">
                                Founded in 2015, Unacademy began with a vision to democratize quality education and has since become one of India's leading learning platforms.
                            </p>
                        </motion.div>
                    </div>

                    {/* cards grid */}
                    <motion.div
                        variants={stagger} initial="hidden" whileInView="show" viewport={{ once: true }}
                        className="grid grid-cols-1 lg:grid-cols-2 gap-8"
                    >

                        <motion.div
                            variants={fadeUp}
                            whileHover={{ y: -6, boxShadow: '0 20px 40px rgba(8,111,255,0.08)' }}
                            transition={{ type: 'spring', stiffness: 300 }}
                            className="bg-[var(--color-bg-page)] rounded-3xl p-10 md:p-12 border border-[rgba(29,29,53,0.05)] cursor-default"
                        >
                            <motion.div
                                className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center mb-7 shadow-sm border border-[rgba(29,29,53,0.05)]"
                                whileHover={{ rotate: 15, scale: 1.1 }} transition={{ type: 'spring', stiffness: 400 }}
                            >
                                <MapPin className="text-[var(--color-una-blue)] w-7 h-7" />
                            </motion.div>
                            <h3 className="text-2xl font-bold text-gray-900 mb-5">Unacademy Kota</h3>
                            <p className="text-gray-600 text-[17px] leading-relaxed">
                                Established to bring our renowned teaching ecosystem to the education capital of India. Combining Kota's proven academic culture with our innovative approach, we provide comprehensive classroom programs for JEE and NEET aspirants. Students benefit from experienced faculty, structured study plans, regular tests, and personalized mentorship.
                            </p>
                        </motion.div>

                        <motion.div
                            variants={fadeUp}
                            whileHover={{ y: -6 }}
                            transition={{ type: 'spring', stiffness: 300 }}
                            className="bg-gradient-to-br from-[var(--color-una-navy)] to-[var(--color-una-blue)] rounded-3xl p-10 md:p-12 text-white shadow-xl shadow-[rgba(8,111,255,0.2)] cursor-default"
                        >
                            <motion.div
                                className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center mb-7 border border-white/20"
                                whileHover={{ rotate: -15, scale: 1.1 }} transition={{ type: 'spring', stiffness: 400 }}
                            >
                                <Target className="text-white w-7 h-7" />
                            </motion.div>
                            <h3 className="text-2xl font-bold mb-5">Our Mission</h3>
                            <p className="text-blue-50 text-[17px] leading-relaxed">
                                To nurture future engineers and doctors through high-quality education and holistic student development. With state-of-the-art classrooms, comprehensive study material, doubt-solving support, and continuous performance tracking — we ensure every student gets the guidance needed to succeed.
                            </p>
                        </motion.div>

                        <motion.div
                            variants={fadeUp}
                            whileHover={{ backgroundColor: 'rgba(8,189,128,0.02)' }}
                            className="lg:col-span-2 bg-white border-2 border-dashed border-[rgba(8,189,128,0.3)] rounded-3xl p-10 md:p-12 flex flex-col md:flex-row items-center gap-8 cursor-default"
                        >
                            <div className="flex-1 text-center md:text-left">
                                <h3 className="text-2xl font-bold text-gray-900 mb-3">Every Dream Deserves the Right Guidance</h3>
                                <p className="text-gray-600 text-[17px] leading-relaxed">
                                    Whether you're preparing for JEE or NEET, at Unacademy Kota we are committed to helping you turn your aspirations into achievements.
                                </p>
                            </div>
                            <motion.div
                                className="w-16 h-16 bg-[rgba(8,189,128,0.1)] rounded-full flex items-center justify-center shrink-0"
                                animate={{ scale: [1, 1.12, 1] }}
                                transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
                            >
                                <CheckCircle2 className="text-[var(--color-una-green)] w-8 h-8" />
                            </motion.div>
                        </motion.div>

                    </motion.div>
                </div>
            </section>

            {/* ─── 3. DIRECTOR ─────────────────────────────── */}
            <section className="py-20 md:py-28 bg-[var(--color-bg-page)] overflow-hidden una-texture">
                <div className="w-full px-6 md:px-12 lg:px-20 xl:px-28">

                    {/* Section label */}
                    <div className="text-center mb-16">
                        <motion.div variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }}>
                            <div className="inline-flex items-center gap-2 px-4 py-2 bg-[rgba(8,111,255,0.08)] text-[var(--color-una-blue)] font-bold text-xs rounded-full uppercase tracking-widest mb-5">
                                <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-una-blue)]" /> Meet Our Director
                            </div>
                            <h2 className="text-4xl md:text-5xl font-black text-gray-900 leading-tight">
                                The Visionary Behind the Success
                            </h2>
                        </motion.div>
                    </div>

                    {/* New Layout: Image card + content side-by-side, naturally sized */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-start">

                        {/* ── IMAGE COLUMN ── natural height, no overflow:hidden on img container */}
                        <motion.div
                            variants={fadeLeft} initial="hidden" whileInView="show"
                            viewport={{ once: true }}
                            className="relative"
                        >
                            {/* Decorative background blob behind card */}
                            <div className="absolute -inset-4 bg-gradient-to-br from-[rgba(8,111,255,0.15)] to-[rgba(8,189,128,0.15)] rounded-[3rem] blur-sm opacity-60 pointer-events-none" />

                            {/* Floating wrapper on the card */}
                            <motion.div
                                animate={{ y: [0, -10, 0] }}
                                transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                                className="relative bg-white rounded-[2.5rem] overflow-hidden border border-[rgba(29,29,53,0.05)] shadow-xl shadow-[rgba(8,111,255,0.1)]"
                            >
                                {/* Top accent strip */}
                                <div className="h-2 bg-gradient-to-r from-[var(--color-una-blue)] to-[var(--color-una-green)] w-full" />

                                {/* Image — full natural dimensions, no cropping */}
                                <img
                                    src={spsSir}
                                    alt="SPS Sir - Director Unacademy Kota"
                                    className="w-full h-auto block"
                                />

                                {/* Bottom name card inside image container */}
                                <div className="bg-gradient-to-br from-[var(--color-una-navy)] to-[var(--color-una-blue)] px-8 py-6 flex items-center gap-4">
                                    <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center shrink-0 border border-white/20">
                                        <Award className="w-6 h-6 text-white" />
                                    </div>
                                    <div>
                                        <p className="text-white font-black text-xl leading-tight">SPS Sir</p>
                                        <p className="text-blue-200 text-sm font-semibold mt-0.5">Centre Director • IIT Bombay Alumni</p>
                                    </div>
                                </div>
                            </motion.div>
                        </motion.div>

                        {/* ── CONTENT COLUMN ── */}
                        <motion.div
                            variants={fadeRight} initial="hidden" whileInView="show"
                            viewport={{ once: true }}
                            className="flex flex-col gap-7"
                        >
                            {/* Pull quote */}
                            <div className="bg-white border border-[rgba(29,29,53,0.05)] rounded-3xl p-8 shadow-sm">
                                <div className="text-5xl text-[rgba(8,111,255,0.2)] font-black leading-none mb-3">"</div>
                                <p className="text-gray-800 font-semibold text-xl leading-relaxed">
                                    The one and only Mathematics faculty in Kota who has mentored students securing <span className="text-[var(--color-una-blue)]">All India Ranks 1–100 each in JEE.</span>
                                </p>
                            </div>

                            {/* Bio */}
                            <div className="space-y-5 text-gray-600 text-[17px] leading-relaxed">
                                <p>
                                    <strong className="text-gray-900 font-bold">IIT Bombay Alumni SPS Sir</strong> stands as a towering figure whose unparalleled guidance has consistently shaped toppers and created a legacy of excellence year after year.
                                </p>
                                <p>
                                    He is among the pioneering mentors from Kota under whose guidance Kota's first-ever <strong className="text-gray-900 font-bold">Medalist in the International Mathematical Olympiad</strong> emerged — a milestone that defines his stature as India's finest.
                                </p>
                                <p>
                                    Recognized as a visionary leader and mathematics maestro, SPS Sir continues to inspire brilliance — building not just achievers, but future innovators.
                                </p>
                            </div>

                            {/* Achievement tags */}
                            <div className="flex flex-wrap gap-3">
                                {['IIT Bombay Alumni', 'IMO Mentor', 'JEE Top 100 Coach', '25+ Years Experience in Kota'].map((tag, i) => (
                                    <span key={i} className="px-4 py-2.5 bg-white border border-gray-200 text-gray-700 font-semibold text-sm rounded-full shadow-sm">
                                        {tag}
                                    </span>
                                ))}
                            </div>

                            {/* Highlight stat cards */}
                            <div className="grid grid-cols-2 gap-4 mt-2">
                                <div className="bg-[var(--color-una-blue)] rounded-2xl p-6 text-white text-center">
                                    <p className="text-4xl font-black mb-1">100+</p>
                                    <p className="text-blue-100 text-sm font-medium">Top 100 AIR JEE Students</p>
                                </div>
                                <div className="bg-gray-900 rounded-2xl p-6 text-white text-center">
                                    <p className="text-4xl font-black mb-1">IMO</p>
                                    <p className="text-gray-400 text-sm font-medium">First Kota Medalist Mentor</p>
                                </div>
                            </div>
                        </motion.div>

                    </div>
                </div>
            </section>


            {/* ─── 4. INFRASTRUCTURE ───────────────────────── */}
            <section className="py-20 md:py-28 bg-white">
                <div className="w-full px-6 md:px-12 lg:px-20 xl:px-28">

                    <div className="text-center max-w-3xl mx-auto mb-16">
                        <motion.div variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }}>
                            <div className="inline-flex items-center gap-2 px-4 py-2 bg-[rgba(8,189,128,0.1)] text-[var(--color-una-green)] font-bold text-xs rounded-full uppercase tracking-widest mb-5">
                                <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-una-green)]" /> Campus Tour
                            </div>
                            <h2 className="text-4xl md:text-5xl font-black text-gray-900 leading-tight mb-5">
                                State-of-the-art Infrastructure
                            </h2>
                            <p className="text-xl text-[var(--color-text-secondary)] leading-relaxed">
                                Learning in classrooms is nothing new. <strong className="text-[var(--color-una-blue)]">We've completely reimagined the learning experience for you.</strong>
                            </p>
                        </motion.div>
                    </div>

                    <motion.div variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }}>
                        <Swiper
                            modules={[Pagination, Autoplay, Navigation]}
                            spaceBetween={24}
                            slidesPerView={1}
                            navigation
                            pagination={{ clickable: true, dynamicBullets: true }}
                            autoplay={{ delay: 3200, disableOnInteraction: false }}
                            breakpoints={{
                                640: { slidesPerView: 2 },
                                1024: { slidesPerView: 3 },
                            }}
                            className="pb-16"
                        >
                            {infraImages.map((img, idx) => (
                                <SwiperSlide key={idx}>
                                    <div className="rounded-3xl overflow-hidden bg-gray-100 group aspect-[4/3] shadow-sm border border-gray-100">
                                        <img
                                            src={img}
                                            alt={`Unacademy Infrastructure ${idx + 1}`}
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                                        />
                                    </div>
                                </SwiperSlide>
                            ))}
                        </Swiper>
                    </motion.div>
                </div>
            </section>

            {/* ─── 5. CTA ──────────────────────────────────── */}
            <section className="py-20 md:py-24 bg-[var(--color-bg-page)] border-t border-[rgba(29,29,53,0.05)] una-texture">
                <div className="w-full px-6 md:px-12 lg:px-20 xl:px-28">
                    <motion.div
                        variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }}
                        className="flex flex-col lg:flex-row items-center justify-between gap-12 bg-white rounded-3xl border border-[rgba(29,29,53,0.05)] shadow-sm px-10 md:px-16 py-12 md:py-14"
                    >
                        {/* Left — text */}
                        <div className="flex-1 text-center lg:text-left">
                            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-[rgba(8,111,255,0.08)] text-[var(--color-una-blue)] font-semibold text-xs rounded-full uppercase tracking-widest mb-5">
                                <BookOpen className="w-3.5 h-3.5" /> Explore Our Brochure
                            </div>
                            <h2 className="text-3xl md:text-4xl font-black text-gray-900 leading-tight mb-4">
                                Get Detailed Program<br className="hidden md:block" /> Information
                            </h2>
                            <p className="text-gray-500 text-lg leading-relaxed max-w-xl">
                                Programs, courses, faculty, facilities, and our learning approach — all in one place.
                            </p>
                        </div>

                        {/* Right — buttons */}
                        <div className="flex flex-col sm:flex-row lg:flex-col xl:flex-row gap-4 shrink-0">
                            <a
                                href="https://unacademykotacentre.com/admin/form/enquiry-form-web"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="btn-una-primary"
                            >
                                Enquire Now <ArrowRight className="w-5 h-5 ml-1" />
                            </a>
                            <a
                                href={brochurePdf}
                                download="Unacademy_Kota_Brochure.pdf"
                                className="btn-una-outline bg-white"
                            >
                                <Download className="w-5 h-5" /> Download Brochure
                            </a>
                        </div>
                    </motion.div>
                </div>
            </section>

        </div>
    );
};

export default AboutUs;
