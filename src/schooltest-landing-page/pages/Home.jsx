import React from 'react';
import { motion } from 'framer-motion';
import { Download } from 'lucide-react';
import logo from '../../landing-page/assets/images/UA_LOGO_Color.png';
import Footer from '../../landing-page/components/Footer';

// Import local images
import class5Img from '../assets/Preparatary Thumbnail_class5.jpg';
import class6Img from '../assets/Preparatary Thumbnail_class6.jpg';
import class7Img from '../assets/Preparatary Thumbnail_class7.jpg';
import class8Img from '../assets/Preparatary Thumbnail_class8.jpg';
import class9Img from '../assets/Preparatary Thumbnail_class9.jpg';
import class10Img from '../assets/Preparatary Thumbnail_class10.jpg';
import evaluateImg from '../assets/evaluate.jpeg';

const SchoolTestHome = () => {
    // Classes data from 5 to 10 with local images
    const classes = [
        {
            class: 'Class 5',
            color: 'from-blue-600 to-indigo-600',
            imageUrl: class5Img
        },
        {
            class: 'Class 6',
            color: 'from-blue-600 to-indigo-600',
            imageUrl: class6Img
        },
        {
            class: 'Class 7',
            color: 'from-blue-600 to-indigo-600',
            imageUrl: class7Img
        },
        {
            class: 'Class 8',
            color: 'from-blue-600 to-indigo-600',
            imageUrl: class8Img
        },
        {
            class: 'Class 9',
            color: 'from-blue-600 to-indigo-600',
            imageUrl: class9Img
        },
        {
            class: 'Class 10',
            color: 'from-blue-600 to-indigo-600',
            imageUrl: class10Img
        }
    ];

    const handleDownload = (className) => {
        const classNumber = className.split(' ')[1];
        const formUrl = `${window.location.origin}/admin/form/${classNumber}spp`;
        window.location.href = formUrl;
    };

    return (
        <div className="min-h-screen bg-bg-main flex flex-col">
            {/* Simple Navbar with Logo Only */}
            <nav className="sticky top-0 z-50 w-full bg-white border-b border-gray-100 shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10">
                    <div className="flex items-center h-16">
                        <a href="/" className="flex items-center">
                            <img src={logo} alt="Unacademy Centre" className="h-8 md:h-12 object-contain" />
                        </a>
                    </div>
                </div>
            </nav>

            {/* Simple Banner Slider */}
            <div className="w-full relative">
                <div className="w-full relative">
                    <img
                        src={evaluateImg}
                        alt="Background"
                        className="w-full h-auto object-contain"
                    />
                </div>
            </div>

            {/* Download Button Section - Responsive & Rounded (Compact) */}
            <div className="w-full relative z-20 py-4  flex justify-center bg-linear-to-b from-white to-gray-50">
                <button
                    onClick={() => {
                        window.open('https://unacademykotacentre.com/admin/form/evaluate', '_blank');
                    }}
                    className="
                        group relative w-full max-w-2xl flex items-center justify-center gap-2 md:gap-3 
                        bg-linear-to-r from-blue-600 via-indigo-600 to-blue-600 bg-[length:200%_auto] hover:bg-right 
                        text-white py-2 md:py-2.5 rounded-full
                        border-2 border-white shadow-lg hover:shadow-blue-600/30
                        transform transition-all duration-300 hover:-translate-y-0.5 hover:scale-[1.01] active:scale-[0.98]
                        cursor-pointer
                    "
                >
                    <div className="p-1 bg-white/20 rounded-full animate-bounce">
                        <Download className="w-4 h-4 md:w-5 md:h-5" />
                    </div>
                    <span className="text-sm md:text-lg font-bold uppercase tracking-wider">Download Now</span>
                </button>
            </div>

            {/* Spacer/Divider */}
            <div className="w-full h-8"></div>

            {/* Class Cards Section */}
            <div id="class-cards-section" className="flex-1 pb-20 pt-10 bg-linear-to-br from-gray-50 to-gray-100 min-h-[500px]">
                <div className="container-custom">


                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                        {classes.map((item, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: index * 0.1 }}
                                whileHover={{ y: -10, scale: 1.02 }}
                                className="group relative"
                            >
                                <div className="relative overflow-hidden rounded-2xl bg-white shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-200">
                                    {/* Image Thumbnail with Gradient Overlay */}
                                    <div className="relative overflow-hidden bg-gray-100">
                                        <img
                                            src={item.imageUrl}
                                            alt={item.class}
                                            className="w-full h-auto object-contain"
                                        />

                                    </div>

                                    {/* Card Content */}
                                    <div className="p-6">

                                        {/* Download Button - App Theme Colors */}
                                        <button
                                            onClick={() => handleDownload(item.class)}
                                            className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-linear-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
                                        >
                                            <Download className="w-5 h-5" />
                                            Download
                                        </button>
                                    </div>

                                    {/* Corner decoration */}
                                    <div className="absolute top-4 left-4 w-12 h-12 bg-white/20 rounded-full blur-xl"></div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    );
};

export default SchoolTestHome;
