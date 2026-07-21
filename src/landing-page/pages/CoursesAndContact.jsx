import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useLocation } from 'react-router-dom';
import { BookOpen, Monitor, Award, ArrowRight, UserCheck, Clock, MapPin, Mail, Phone } from 'lucide-react';
import DynamicContactForm from '../components/DynamicContactForm';

import CategoryCards from '../components/courses/CategoryCards';
import CategoryDetail from '../components/courses/CategoryDetail';
import { coursesData } from '../data/coursesData';

const CoursesPage = () => {
    const location = useLocation();
    
    const [selectedCategory, setSelectedCategory] = useState(() => {
        const params = new URLSearchParams(location.search);
        return params.get('category') || null;
    });

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const cat = params.get('category');
        setSelectedCategory(cat || null);
    }, [location.search]);

    const handleCategorySelect = (cat) => {
        // Update URL when clicking a card
        const newUrl = new URL(window.location);
        newUrl.searchParams.set('category', cat);
        window.history.pushState({}, '', newUrl);
        setSelectedCategory(cat);
        // Scroll to top so the user sees the banner instead of the middle of the page
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleBack = () => {
        // Remove category from URL when going back
        const newUrl = new URL(window.location);
        newUrl.searchParams.delete('category');
        window.history.pushState({}, '', newUrl);
        setSelectedCategory(null);
    };

    return (
        <div className={`bg-gray-50 min-h-screen pb-8 ${selectedCategory ? '' : 'pt-16 md:pt-24'}`}>
            {selectedCategory ? (
                <CategoryDetail 
                    categoryData={coursesData[selectedCategory]} 
                    onBack={handleBack} 
                />
            ) : (
                <CategoryCards onSelectCategory={handleCategorySelect} />
            )}
        </div>
    );
};

const ContactPage = () => {
    return (
        <div id="contact" className="bg-white py-16 md:py-24">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 mb-16 md:mb-24">
                    {/* Left: Contact Info */}
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                    >
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                            Get in <span className="text-blue-600">Touch</span>
                        </h2>
                        <p className="text-lg text-gray-600 mb-10 leading-relaxed">
                            Have questions? Visit our centre or reach out to us directly. We are here to assist you in your learning journey.
                        </p>

                        <div className="space-y-8">
                            <div className="flex items-start gap-5">
                                <div className="p-3 bg-blue-50 text-blue-600 rounded-lg shrink-0 mt-1">
                                    <MapPin className="w-6 h-6" />
                                </div>
                                <div className="space-y-4">
                                    <div>
                                        <h4 className="font-bold text-gray-900 text-lg">Unacademy Tower</h4>
                                        <p className="text-gray-600 mt-1 text-sm leading-relaxed">
                                            B-21, Road No. 2, Indraprastha Industrial Area,<br />
                                            Kota, Rajasthan
                                        </p>
                                    </div>

                                    <div className="border-t border-gray-100 pt-3">
                                        <h4 className="font-bold text-gray-900 text-lg">Prathmesh Campus</h4>
                                        <p className="text-gray-600 mt-1 text-sm leading-relaxed">
                                            Plot No. 11, (Old Om Cine Plex),<br />
                                            Special Indira Vihar, Kota
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-start gap-5">
                                <div className="p-3 bg-indigo-50 text-indigo-600 rounded-lg shrink-0">
                                    <Phone className="w-6 h-6" />
                                </div>
                                <div>
                                    <h4 className="font-semibold text-gray-900 text-lg">Call Us</h4>
                                    <p className="text-gray-600 mt-1">+91 6366527093</p>

                                </div>
                            </div>

                            <div className="flex items-start gap-5">
                                <div className="p-3 bg-teal-50 text-teal-600 rounded-lg shrink-0">
                                    <Mail className="w-6 h-6" />
                                </div>
                                <div>
                                    <h4 className="font-semibold text-gray-900 text-lg">Email Us</h4>
                                    <p className="text-gray-600 mt-1">Support@unacademykotacentre.com</p>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Right: Dynamic Form */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                    >
                        <DynamicContactForm />
                    </motion.div>
                </div>

                {/* Map Section - Full Width Below */}
                <motion.div
                    initial={{ opacity: 0, marginTop: 20 }}
                    whileInView={{ opacity: 1, marginTop: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.4 }}
                >
                    <div className="relative h-[400px] bg-gray-100 rounded-2xl overflow-hidden shadow-lg border border-gray-200">
                        <iframe
                            src="https://maps.google.com/maps?q=25.136816825176787,75.8464010896333&z=15&output=embed"
                            width="100%"
                            height="100%"
                            style={{ border: 0 }}
                            allowFullScreen=""
                            loading="lazy"
                            referrerPolicy="no-referrer-when-downgrade"
                            title="Unacademy Kota Centres Map"
                            className="absolute inset-0 grayscale hover:grayscale-0 transition-all duration-500"
                        ></iframe>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export { CoursesPage, ContactPage };
