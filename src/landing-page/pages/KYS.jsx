import React, { useState, useEffect } from 'react';
import { FileText, Calculator, BookOpen, Rocket } from 'lucide-react';
import { motion } from 'framer-motion';
import Confetti from 'react-confetti';
import toast from 'react-hot-toast';
import bannerImage from '../assets/courses page/banners/KYS_BANNER.jpg.jpeg';

const KYS = () => {
    // Component states
    const [formData, setFormData] = useState({
        name: '',
        mobile: '',
        city: '',
        studentClass: '',
        course: '',
        score: '',
        specialCategory: ''
    });
    
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [result, setResult] = useState(null);
    const [windowDimension, setWindowDimension] = useState({ width: window.innerWidth, height: window.innerHeight });

    useEffect(() => {
        const handleResize = () => setWindowDimension({ width: window.innerWidth, height: window.innerHeight });
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Form options
    const classOptions = ["Class 6", "Class 7", "Class 8", "Class 9", "Class 10", "Class 11", "Class 12", "Dropper"];
    const courseOptions = ["NEET", "JEE Main+Advanced", "Foundation"];

    // Foundation Special Category options with their scholarship %
    const specialCategoryOptions = [
        { label: "None", id: "none", discount: 0 },
        { label: "Siblings studying in Unacademy", id: "siblings", discount: 20 },
        { label: "Rank in Top 100 in Nat/Intl Olympiads", id: "top100", discount: 50 },
        { label: "State Rank 1-3 in Nat/Intl Olympiads", id: "staterank", discount: 25 },
        { label: "HBCSE Stage 1 Qualified", id: "hbcse1", discount: 60 },
        { label: "HBCSE Stage 2 Qualified", id: "hbcse2", discount: 90 },
        { label: "HBCSE OCSC Stage / Medalist", id: "hbcse3", discount: 99 },
        { label: "Child of War Widow (Defence)", id: "warwidow", discount: 90 },
        { label: "Child of Defence/Police Personnel", id: "defence", discount: 50 },
        { label: "Child of Farmer", id: "farmer", discount: 50 },
    ];

    // Handler logic for calculating scholarship
    const calculateScholarship = (studentClass, course, score, specialCategory) => {
        const numScore = parseFloat(score);
        if (isNaN(numScore)) return null;

        // --- Foundation Scholarship (Returns % discount string) ---
        if (course === 'Foundation') {
            // School Performance Scholarship (based on Half-Yearly/Final Marksheet %)
            let performanceDiscount = 0;
            if (numScore >= 90) performanceDiscount = 50;
            else if (numScore >= 80) performanceDiscount = 25;
            else if (numScore >= 70) performanceDiscount = 15;

            // Special Category Scholarship
            let specialDiscount = 0;
            if (specialCategory && specialCategory !== 'none') {
                const foundCategory = specialCategoryOptions.find(o => o.id === specialCategory);
                if (foundCategory) {
                    specialDiscount = foundCategory.discount;
                }
            }

            // Take the MAXIMUM of both
            const finalDiscount = Math.max(performanceDiscount, specialDiscount);

            if (finalDiscount === 0) return null; // No scholarship if score < 70 and no special category
            return `${finalDiscount}%`;
        }

        if (studentClass === 'Dropper') {
            // Dropper logic based on expected marks/percentile
            if (course === 'JEE Main+Advanced') {
                if (numScore >= 99) return "₹9,500";
                if (numScore >= 98) return "₹19,000";
                if (numScore >= 97) return "₹28,500";
                if (numScore >= 95) return "₹38,000";
                if (numScore >= 90) return "₹47,500";
                if (numScore >= 80) return "₹57,000";
                return "₹66,500";
            } else if (course === 'NEET') {
                if (numScore >= 550) return "FREE (₹15,000 Kit Charge)";
                if (numScore >= 501) return "₹30,000";
                if (numScore >= 451) return "₹40,000";
                if (numScore >= 401) return "₹50,000";
                if (numScore >= 351) return "₹55,000";
                if (numScore >= 301) return "₹60,000";
                if (numScore >= 201) return "₹65,000";
                if (numScore >= 151) return "₹70,000";
                return "₹75,000";
            }
        } else {
            // For 11th, 12th based on Board/Previous %
            if (course === 'JEE Main+Advanced') {
                if (numScore >= 95) return "₹57,000";
                if (numScore >= 90) return "₹66,500";
                if (numScore >= 85) return "₹76,000";
                if (numScore >= 71) return "₹85,500";
                return "₹95,000";
            } else if (course === 'NEET') {
                if (numScore >= 95) return "₹54,000";
                if (numScore >= 90) return "₹63,000";
                if (numScore >= 85) return "₹72,000";
                if (numScore >= 71) return "₹81,000";
                return "₹90,000";
            }
        }
        return null;
    };

    const getScorePlaceholder = () => {
        if (formData.studentClass === 'Dropper') {
            if (formData.course === 'NEET') return "Enter Expected NEET Marks *";
            if (formData.course === 'JEE Main+Advanced') return "Enter Expected JEE Percentile *";
            return "Enter Current Percentage *";
        } else if (formData.studentClass === 'Class 11' || formData.studentClass === 'Class 12') {
            return "Enter 10th Board Percentage *";
        } else {
            return "Enter Previous Class Percentage *";
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const fee = calculateScholarship(formData.studentClass, formData.course, formData.score, formData.specialCategory);
        
        let scoreLabel = "";
        if (formData.studentClass === 'Dropper') {
            scoreLabel = `${formData.score} ${formData.course === 'JEE Main+Advanced' ? 'Percentile' : formData.course === 'NEET' ? 'Marks' : '%'}`;
        } else {
            scoreLabel = `${formData.score} %`;
        }

        // For Foundation, also show which category gave the scholarship
        const specialCategoryLabel = formData.course === 'Foundation' && formData.specialCategory && formData.specialCategory !== 'none'
            ? specialCategoryOptions.find(o => o.id === formData.specialCategory)?.label
            : null;

        if (fee) {
            setResult({
                category: formData.course === 'NEET' ? 'NEET Aspirant' : formData.course === 'JEE Main+Advanced' ? 'JEE Aspirant' : 'Foundation Student',
                score: scoreLabel,
                fee: fee,
                isFoundation: formData.course === 'Foundation',
                specialCategoryLabel,
                isNotEligible: false
            });
            setIsSubmitted(true);
            setTimeout(() => {
                document.getElementById('result-section')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }, 100);
        } else {
            setResult({
                category: formData.course === 'NEET' ? 'NEET Aspirant' : formData.course === 'JEE Main+Advanced' ? 'JEE Aspirant' : 'Foundation Student',
                score: scoreLabel,
                isFoundation: formData.course === 'Foundation',
                isNotEligible: true
            });
            setIsSubmitted(true);
            setTimeout(() => {
                document.getElementById('result-section')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }, 100);
        }
    };

    // Cards data
    const workCards = [
        {
            number: "1",
            icon: <FileText className="w-8 h-8 text-blue-500" />,
            title: "Enter Your Details",
            description: "Share your exam, marks and personal details.",
            color: "bg-blue-50"
        },
        {
            number: "2",
            icon: <Calculator className="w-8 h-8 text-green-500" />,
            title: "Get Your Scholarship",
            description: "Our predictor calculates your eligible scholarship instantly.",
            color: "bg-green-50"
        },
        {
            number: "3",
            icon: <BookOpen className="w-8 h-8 text-purple-500" />,
            title: "Book Your Seat",
            description: "Book your seat to learn from Kota's Top Faculty Members",
            color: "bg-purple-50"
        },
        {
            number: "4",
            icon: <Rocket className="w-8 h-8 text-indigo-500" />,
            title: "Start Your Preparation",
            description: "Choose the right course and begin your journey with confidence.",
            color: "bg-indigo-50"
        }
    ];

    return (
        <div className="bg-slate-50 min-h-screen font-sans">
            {/* Hero Banner Area with Overlay Form */}
            <div className="relative w-full">
                
                {/* Desktop Banner */}
                <div className="relative hidden lg:block w-full bg-[#0C1222] max-h-[92vh] overflow-hidden">
                    <img src={bannerImage} alt="Know Your Scholarship" className="w-full h-auto block" />
                    
                    {/* Form container sits exactly over the image */}
                    <div className="absolute inset-0 flex items-center justify-end px-8 lg:px-12 xl:px-24">
                        <div className="w-full max-w-[400px] xl:max-w-[450px] bg-white rounded-2xl shadow-xl p-8 border border-gray-100 origin-right scale-[0.65] xl:scale-85 2xl:scale-95 transition-transform">
                            <h2 className="text-3xl font-bold text-gray-900 mb-6">Unlock Your Scholarship</h2>
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <input type="text" placeholder="Student Name *" required className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} />
                                </div>
                                <div>
                                    <input type="tel" placeholder="Mobile Number *" required className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" value={formData.mobile} onChange={(e) => setFormData({...formData, mobile: e.target.value})} />
                                </div>
                                <div>
                                    <input type="text" placeholder="City *" required className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" value={formData.city} onChange={(e) => setFormData({...formData, city: e.target.value})} />
                                </div>
                                <div>
                                    <select required className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white" value={formData.studentClass} onChange={(e) => setFormData({...formData, studentClass: e.target.value})}>
                                        <option value="" disabled>Current Class *</option>
                                        {classOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <select required className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white" value={formData.course} onChange={(e) => {
                                        setFormData({...formData, course: e.target.value, score: '', specialCategory: ''});
                                    }}>
                                        <option value="" disabled>Select Your Course *</option>
                                        {courseOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                                    </select>
                                </div>
                                {formData.course && (
                                    <div>
                                        <input 
                                            type="number" 
                                            step="0.01"
                                            placeholder={getScorePlaceholder()} 
                                            required 
                                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" 
                                            value={formData.score} 
                                            onChange={(e) => setFormData({...formData, score: e.target.value})} 
                                        />
                                    </div>
                                )}
                                {formData.course === 'Foundation' && (
                                    <div>
                                        <select className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white" value={formData.specialCategory} onChange={(e) => setFormData({...formData, specialCategory: e.target.value})}>
                                            <option value="">Special Category (Optional)</option>
                                            {specialCategoryOptions.map(opt => <option key={opt.id} value={opt.id}>{opt.label}</option>)}
                                        </select>
                                    </div>
                                )}
                                <button type="submit" className="w-full py-4 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition-colors text-lg mt-4 shadow-md">
                                    Unlock My Scholarship
                                </button>
                            </form>
                        </div>
                    </div>
                </div>

                {/* Mobile Banner Image & Form (Below lg: 1024px) */}
                <div className="lg:hidden w-full flex flex-col bg-[#0C1222]">
                    <div className="w-full max-h-[70vh] overflow-hidden flex items-start">
                        <img src={bannerImage} alt="Know Your Scholarship" className="w-full h-auto block" />
                    </div>
                    
                    <div className="w-full px-4 sm:px-6 py-8 bg-[#F7F8FA]">
                        <div className="flex justify-center">
                            <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
                                <h2 className="text-2xl font-bold text-gray-900 mb-6">Unlock Your Scholarship</h2>
                                <form onSubmit={handleSubmit} className="space-y-4">
                                    <div>
                                        <input type="text" placeholder="Student Name *" required className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} />
                                    </div>
                                    <div>
                                        <input type="tel" placeholder="Mobile Number *" required className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" value={formData.mobile} onChange={(e) => setFormData({...formData, mobile: e.target.value})} />
                                    </div>
                                    <div>
                                        <input type="text" placeholder="City *" required className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" value={formData.city} onChange={(e) => setFormData({...formData, city: e.target.value})} />
                                    </div>
                                    <div>
                                        <select required className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white" value={formData.studentClass} onChange={(e) => setFormData({...formData, studentClass: e.target.value})}>
                                            <option value="" disabled>Current Class *</option>
                                            {classOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                                        </select>
                                    </div>
                                    <div>
                                        <select required className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white" value={formData.course} onChange={(e) => {
                                            setFormData({...formData, course: e.target.value, score: '', specialCategory: ''});
                                        }}>
                                            <option value="" disabled>Select Your Course *</option>
                                            {courseOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                                        </select>
                                    </div>
                                    {formData.course && (
                                        <div>
                                            <input 
                                                type="number" 
                                                step="0.01"
                                                placeholder={getScorePlaceholder()} 
                                                required 
                                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" 
                                                value={formData.score} 
                                                onChange={(e) => setFormData({...formData, score: e.target.value})} 
                                            />
                                        </div>
                                    )}
                                    {formData.course === 'Foundation' && (
                                        <div>
                                            <select className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white" value={formData.specialCategory} onChange={(e) => setFormData({...formData, specialCategory: e.target.value})}>
                                                <option value="">Special Category (Optional)</option>
                                                {specialCategoryOptions.map(opt => <option key={opt.id} value={opt.id}>{opt.label}</option>)}
                                            </select>
                                        </div>
                                    )}
                                    <button type="submit" className="w-full py-4 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition-colors text-lg mt-4 shadow-md">
                                        Unlock My Scholarship
                                    </button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>

            </div>

            <main className="flex-grow pt-12 pb-20">
                {/* Result Section */}
                {isSubmitted && result && (
                    <>
                        {!result.isNotEligible && (
                            <Confetti 
                                width={windowDimension.width}
                                height={windowDimension.height}
                                recycle={false}
                                numberOfPieces={500}
                                gravity={0.15}
                                style={{ position: 'fixed', zIndex: 9999, top: 0, left: 0, pointerEvents: 'none' }}
                            />
                        )}
                        <motion.div 
                            initial={{ opacity: 0, y: 50, scale: 0.9 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            transition={{ type: "spring", duration: 0.8 }}
                            id="result-section" 
                            className="max-w-5xl mx-auto px-4 mb-16 relative z-10"
                        >
                            <div className={`bg-white border-2 ${result.isNotEligible ? 'border-red-400 shadow-[0_20px_50px_rgba(239,68,68,0.3)]' : 'border-green-400 shadow-[0_20px_50px_rgba(34,197,94,0.3)]'} rounded-3xl p-6 md:p-8 relative overflow-hidden`}>
                                <div className={`absolute top-0 left-0 w-full h-3 bg-gradient-to-r ${result.isNotEligible ? 'from-red-400 via-red-500 to-rose-600' : 'from-green-400 via-green-500 to-emerald-600'}`}></div>
                                
                                <div className="flex flex-col md:flex-row gap-6 md:gap-8 items-center md:items-stretch">
                                    <div className="w-full md:w-2/3 space-y-4">
                                        <motion.div 
                                            initial={{ x: -20, opacity: 0 }}
                                            animate={{ x: 0, opacity: 1 }}
                                            transition={{ delay: 0.3 }}
                                            className="flex items-center gap-3"
                                        >
                                            <span className="text-4xl drop-shadow-md">{result.isNotEligible ? '⚠️' : '🎉'}</span>
                                            <h2 className={`text-3xl md:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r ${result.isNotEligible ? 'from-red-600 to-rose-600' : 'from-green-600 to-emerald-600'}`}>
                                                {result.isNotEligible ? 'You are not eligible' : 'Congratulations!'}
                                            </h2>
                                        </motion.div>
                                        <p className="text-gray-600 font-medium text-base">
                                            {result.isNotEligible 
                                                ? "Your current inputs don't qualify for a performance-based scholarship at this time. However, you may still be eligible under other offline schemes. Please contact us for details." 
                                                : "Based on your excellent performance, you've unlocked:"}
                                        </p>
                                        
                                        <div className="space-y-3">
                                            <motion.div 
                                                initial={{ x: -20, opacity: 0 }}
                                                animate={{ x: 0, opacity: 1 }}
                                                transition={{ delay: 0.4 }}
                                                className="flex justify-between items-center p-4 bg-gradient-to-r from-gray-50 to-white rounded-xl border border-gray-100 shadow-sm"
                                            >
                                                <span className="text-gray-500 font-semibold uppercase tracking-wider text-sm">Category</span>
                                                <span className="font-bold text-gray-900 text-base">{result.category}</span>
                                            </motion.div>
                                            <motion.div 
                                                initial={{ x: -20, opacity: 0 }}
                                                animate={{ x: 0, opacity: 1 }}
                                                transition={{ delay: 0.5 }}
                                                className="flex justify-between items-center p-4 bg-gradient-to-r from-gray-50 to-white rounded-xl border border-gray-100 shadow-sm"
                                            >
                                                <span className="text-gray-500 font-semibold uppercase tracking-wider text-sm">Your Score</span>
                                                <span className="font-bold text-blue-600 text-lg">{result.score}</span>
                                            </motion.div>
                                            
                                            {!result.isNotEligible && (
                                                <motion.div 
                                                    initial={{ scale: 0.9, opacity: 0 }}
                                                    animate={{ scale: 1, opacity: 1 }}
                                                    transition={{ delay: 0.6, type: "spring" }}
                                                    className="flex flex-col sm:flex-row justify-between items-center p-5 bg-gradient-to-br from-green-50 to-emerald-100 rounded-2xl border-2 border-green-200 shadow-inner relative overflow-hidden"
                                                >
                                                    {/* Shiny effect */}
                                                    <div className="absolute inset-0 bg-white/20 -skew-x-12 translate-x-[-100%] animate-[shimmer_3s_infinite]"></div>
                                                    <style dangerouslySetInnerHTML={{__html: `
                                                        @keyframes shimmer {
                                                            100% { transform: translateX(200%) skewX(-12deg); }
                                                        }
                                                    `}} />
                                                    
                                                    <span className="text-green-900 font-bold text-base mb-1 sm:mb-0 relative z-10">
                                                        {result.isFoundation ? 'Scholarship Discount:' : 'Final Course Fee:'}
                                                    </span>
                                                    <span className="font-extrabold text-green-700 text-2xl sm:text-3xl drop-shadow-sm relative z-10">{result.fee}</span>
                                                </motion.div>
                                            )}
                                            {result.isFoundation && result.specialCategoryLabel && (
                                                <motion.div
                                                    initial={{ opacity: 0, y: 10 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    transition={{ delay: 0.75 }}
                                                    className="flex items-start gap-2 p-3 bg-blue-50 border border-blue-200 rounded-xl"
                                                >
                                                    <span className="text-blue-500 text-lg mt-0.5">🏅</span>
                                                    <p className="text-blue-800 text-sm font-medium">
                                                        <strong>Special Category Applied:</strong> {result.specialCategoryLabel}
                                                    </p>
                                                </motion.div>
                                            )}
                                        </div>
                                    </div>
                                    
                                    {result.isNotEligible ? (
                                        <motion.div 
                                            initial={{ opacity: 0, x: 20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: 0.5 }}
                                            className="w-full md:w-1/3 bg-gradient-to-b from-gray-50 to-slate-100 rounded-2xl p-6 border border-gray-200 flex flex-col justify-center items-center text-center shadow-sm relative overflow-hidden"
                                        >
                                            <h3 className="font-black text-gray-800 text-lg mb-2 relative z-10">Need Help?</h3>
                                            <p className="text-gray-600 text-xs mb-5 font-medium leading-relaxed relative z-10">Reach out to our counselors to explore other financial assistance options available.</p>
                                            
                                            <a 
                                                href="tel:+916366527093"
                                                className="w-full py-3 bg-gray-800 text-white font-bold rounded-xl shadow-md text-base relative z-10 block hover:bg-gray-900 transition-colors"
                                            >
                                                Call Us Now
                                            </a>
                                        </motion.div>
                                    ) : (
                                        <motion.div 
                                            initial={{ opacity: 0, x: 20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: 0.5 }}
                                            className="w-full md:w-1/3 bg-gradient-to-b from-amber-50 to-orange-50 rounded-2xl p-6 border border-amber-200 flex flex-col justify-center items-center text-center shadow-md relative overflow-hidden"
                                        >
                                            <div className="absolute top-0 right-0 p-2 opacity-10">
                                                <Rocket className="w-24 h-24 text-orange-500 transform translate-x-2 -translate-y-2" />
                                            </div>
                                            <h3 className="font-black text-amber-900 text-lg mb-2 relative z-10">Limited Time Offer</h3>
                                            <p className="text-amber-800 text-xs mb-5 font-medium leading-relaxed relative z-10">Hurry! This scholarship is valid for a limited time. Secure your seat with Kota's top faculty today.</p>
                                            
                                            <motion.button 
                                                whileHover={{ scale: 1.05 }}
                                                whileTap={{ scale: 0.95 }}
                                                className="w-full py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white font-bold rounded-xl shadow-[0_10px_20px_rgba(249,115,22,0.3)] text-base relative z-10"
                                            >
                                                Book Seat Now →
                                            </motion.button>
                                        </motion.div>
                                    )}
                                </div>
                                <div className="mt-6 pt-4 border-t border-gray-100">
                                    <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-r-lg shadow-sm">
                                        <p className="text-sm font-semibold text-red-800 leading-relaxed text-center sm:text-left">
                                            <strong className="font-black text-red-900 uppercase tracking-wider">Note:</strong> Valid scholarship proof must be submitted at the time of admission. If proof does not match declared details, scholarship will be revised.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </>
                )}

                {/* How It Works Section */}
                <section className="bg-slate-50">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <h2 className="text-3xl font-bold text-center text-[#1D1D35] mb-12">How Scholarship Predictor Works</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative">
                            {workCards.map((card, idx) => (
                                <div key={idx} className="relative">
                                    <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow h-full flex flex-col">
                                        <div className="flex items-center gap-4 mb-4">
                                            <div className={`w-14 h-14 ${card.color} rounded-full flex items-center justify-center shrink-0`}>
                                                {card.icon}
                                            </div>
                                            <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 font-bold">
                                                {card.number}
                                            </div>
                                        </div>
                                        <h3 className="text-lg font-bold text-gray-900 mb-2">{card.title}</h3>
                                        <p className="text-gray-600 text-sm leading-relaxed">{card.description}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            </main>
        </div>
    );
};

export default KYS;
