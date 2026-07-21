import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { useLocation } from 'react-router-dom';
import { ArrowLeft, Calendar, CheckCircle2, GraduationCap, CheckCircle, Layers, Receipt, BookOpen } from 'lucide-react';
import DynamicContactForm from '../DynamicContactForm';

import foundationBanner from '../../assets/courses page/banners/UFS_BANNER.jpg.jpeg';
import iitjeeBanner from '../../assets/courses page/banners/IIT_Banner.jpg.jpeg';
import neetugBanner from '../../assets/courses page/banners/NEET_BANNER.jpg.jpeg';
import studyabroadBanner from '../../assets/courses page/banners/USAT_BANNER.jpg.jpeg';

import academicIcon from '../../assets/courses page/icons/academic.png';
import batchDatesIcon from '../../assets/courses page/icons/batch dates.png';
import calenderTimeIcon from '../../assets/courses page/icons/calender time.png';
import competetiveExamsIcon from '../../assets/courses page/icons/competetive exams (1).png';
import conceptBasedIcon from '../../assets/courses page/icons/concept based learning.png';
import facultyIcon from '../../assets/courses page/icons/faculty.png';

const getBannerImage = (categoryId) => {
    switch(categoryId) {
        case 'foundation': return foundationBanner;
        case 'iitjee': return iitjeeBanner;
        case 'neetug': return neetugBanner;
        case 'studyabroad': return studyabroadBanner;
        default: return foundationBanner;
    }
};

const CategoryDetail = ({ categoryData, onBack }) => {
    const location = useLocation();
    
    const [activeTabId, setActiveTabId] = useState(() => {
        const params = new URLSearchParams(location.search);
        const tab = params.get('tab');
        if (tab && categoryData.tabs.find(t => t.id === tab)) {
            return tab;
        }
        return categoryData.tabs[0].id;
    });
    
    const [activeFeature, setActiveFeature] = useState('programs');
    const tabsRef = useRef(null);
    const contentRef = useRef(null);

    // Update active tab and scroll if URL changes
    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const tab = params.get('tab');
        if (tab) {
            const foundTab = categoryData.tabs.find(t => t.id === tab);
            if (foundTab) {
                setActiveTabId(tab);
            }
        }
    }, [location.search, categoryData]);

    useEffect(() => {
        setActiveFeature('programs');
    }, [activeTabId]);

    const activeTab = categoryData.tabs.find(t => t.id === activeTabId);
    const categoryId = categoryData.title.toLowerCase().replace(/[^a-z]/g, '');
    let bannerId = 'foundation';
    if(categoryData.title.includes('IIT')) bannerId = 'iitjee';
    if(categoryData.title.includes('NEET')) bannerId = 'neetug';
    if(categoryData.title.includes('Study')) bannerId = 'studyabroad';

    const bannerImage = getBannerImage(bannerId);

    const hasPrograms = activeTab && activeTab.programs && activeTab.programs.length > 0;

    const navButtons = [
        { id: 'programs', label: hasPrograms ? 'Our Programs' : 'Course Description', icon: Layers },
        { id: 'batches', label: 'New Batches', icon: Calendar },
        { id: 'fees', label: 'Fee Structure', icon: Receipt },
        { id: 'methodologies', label: 'Teaching Methodologies', icon: BookOpen }
    ];

    return (
        <div className="bg-[#F7F8FA] min-h-screen pb-20">
            {/* Hero Banner Area */}
            <div className="relative w-full">
                
                {/* Desktop Banner */}
                <div className="relative hidden lg:block w-full bg-[#0C1222] max-h-[92vh] overflow-hidden">
                    <img src={bannerImage} alt="Course Banner" className="w-full h-auto block" />
                    
                    {/* Form container sits exactly over the image and scales down proportionally */}
                    <div className="absolute inset-0 flex items-center justify-end px-8 lg:px-12 xl:px-24">
                        <div className="w-full max-w-[400px] xl:max-w-[420px] origin-right scale-[0.65] xl:scale-75 2xl:scale-90 transition-transform">
                            {bannerId !== 'studyabroad' && <DynamicContactForm />}
                        </div>
                    </div>
                </div>

                {/* Mobile Banner Image & Form (Below lg: 1024px) */}
                <div className="lg:hidden w-full flex flex-col bg-[#0C1222]">
                    <div className="w-full max-h-[70vh] overflow-hidden flex items-start">
                        <img src={bannerImage} alt="Course Banner" className="w-full h-auto block" />
                    </div>
                    
                    <div className="w-full px-4 sm:px-6 py-8 bg-[#F7F8FA]">
                        <div className="flex justify-center">
                            <div className="w-full max-w-md">
                                {bannerId !== 'studyabroad' && <DynamicContactForm />}
                            </div>
                        </div>
                    </div>
                </div>

            </div>

            {/* Content Area */}
            <div ref={tabsRef} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 relative z-20">
                {/* Horizontal Tabs */}
                <div className="flex border border-gray-200 rounded-xl overflow-x-auto mb-12 bg-white custom-scrollbar">
                    {categoryData.tabs.map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTabId(tab.id)}
                            className={`
                                flex-1 shrink-0 min-w-max whitespace-nowrap px-5 sm:px-6 py-3.5 sm:py-4 font-bold text-[14px] sm:text-[15px] transition-all text-center
                                ${activeTabId === tab.id 
                                    ? 'bg-[#0A2351] text-white' 
                                    : 'bg-white text-[#F57B51] hover:bg-gray-50'}
                            `}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>

                {activeTab && (
                    <motion.div 
                        key={activeTab.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="space-y-16"
                    >
                        {/* Intro & 4 Buttons */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                            <div>
                                <h2 className="text-3xl font-bold text-[#1a2b4c] mb-6">{activeTab.label}</h2>
                                <div className="text-gray-600 leading-relaxed text-[15px] mb-8 text-justify whitespace-pre-line">
                                    {activeTab.description}
                                </div>
                            </div>
                            
                            {/* 2x2 Grid Buttons */}
                            <div className="grid grid-cols-2 gap-3 sm:gap-4 h-fit">
                                {navButtons.map((btn, i) => {
                                    const Icon = btn.icon;
                                    const isActive = activeFeature === btn.id;
                                    return (
                                        <div 
                                            key={i} 
                                            onClick={() => {
                                                setActiveFeature(btn.id);
                                                setTimeout(() => {
                                                    const element = document.getElementById(`section-${btn.id}`);
                                                    if (element) {
                                                        const yOffset = -120;
                                                        const y = element.getBoundingClientRect().top + window.scrollY + yOffset;
                                                        window.scrollTo({ top: y, behavior: 'smooth' });
                                                    }
                                                }, 50);
                                            }}
                                            className={`flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left p-4 sm:p-5 rounded-2xl transition-all duration-300 cursor-pointer group border ${
                                                isActive 
                                                    ? 'bg-gradient-to-br from-[#0A2351] to-[#1a3673] border-transparent shadow-[0_8px_20px_-6px_rgba(10,35,81,0.5)] transform -translate-y-1' 
                                                    : 'bg-white border-gray-100 shadow-sm hover:border-[#086FFF]/30 hover:shadow-md hover:-translate-y-0.5'
                                            }`}
                                        >
                                            <div className={`w-12 h-12 sm:mr-4 mb-3 sm:mb-0 shrink-0 rounded-full flex items-center justify-center transition-colors mx-auto sm:mx-0 ${
                                                isActive 
                                                    ? 'bg-white/10 text-white shadow-inner' 
                                                    : 'bg-blue-50 text-blue-600 group-hover:bg-[#086FFF] group-hover:text-white'
                                            }`}>
                                                <Icon className="w-6 h-6 object-contain" />
                                            </div>
                                            <div className="flex-1 flex items-center h-full min-h-[48px]">
                                                <span className={`font-bold text-[14px] sm:text-[15px] leading-snug transition-colors ${
                                                    isActive ? 'text-white' : 'text-[#1a2b4c] group-hover:text-[#086FFF]'
                                                }`}>
                                                    {btn.label}
                                                </span>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Interactive Content Area */}
                        <div ref={contentRef} className="bg-white rounded-xl border border-gray-200 p-6 sm:p-8 shadow-sm space-y-12">
                                
                                {/* Our Programs */}
                                {hasPrograms && (
                                    <motion.div id="section-programs" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                                        <h3 className="text-2xl font-bold text-[#1a2b4c] mb-6 border-b border-gray-200 pb-3">Our Programs</h3>
                                        <div className="space-y-8">
                                            {activeTab.programs.map((program, idx) => (
                                                <div key={idx} className={`relative pl-6 border-l-2 ${idx % 2 === 0 ? 'border-[#08BD80]' : 'border-[#086FFF]'}`}>
                                                    <div className={`absolute -left-[9px] top-1 w-4 h-4 rounded-full border-4 border-white ${idx % 2 === 0 ? 'bg-[#08BD80]' : 'bg-[#086FFF]'}`}></div>
                                                    <h5 className="font-bold text-lg text-gray-900 mb-3">{program.title}</h5>
                                                    <ul className="space-y-2 text-gray-600 text-sm">
                                                        {program.points.map((point, pIdx) => (
                                                            <li key={pIdx} className="flex items-start gap-2">
                                                                <CheckCircle2 className={`w-4 h-4 mt-0.5 shrink-0 ${idx % 2 === 0 ? 'text-[#08BD80]' : 'text-[#086FFF]'}`}/> 
                                                                <span>{point}</span>
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            ))}
                                        </div>
                                    </motion.div>
                                )}

                                {/* New Batches */}
                                <motion.div id="section-batches" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                                    <h3 className="text-2xl font-bold text-[#1a2b4c] mb-6 border-b border-gray-200 pb-3">New Batches</h3>
                                    {activeTab.batches && activeTab.batches.length > 0 ? (
                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                            {activeTab.batches.map((batch, idx) => (
                                                <div key={idx} className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden">
                                                    <div className="flex justify-between items-start mb-6">
                                                        <div className="flex items-start">
                                                            <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 mr-4 shrink-0">
                                                                <Calendar className="w-6 h-6" />
                                                            </div>
                                                            <div>
                                                                <h4 className="text-lg font-bold text-gray-900">{batch.name}</h4>
                                                                <p className="text-sm text-gray-500 font-medium mt-1">Start Date</p>
                                                                <p className="text-gray-900 font-bold">{batch.startDate}</p>
                                                            </div>
                                                        </div>
                                                        {batch.mode && (
                                                            <span className="bg-gray-100 text-gray-800 text-[10px] font-bold px-2.5 py-1 rounded-full tracking-wider uppercase border border-gray-200">
                                                                {batch.mode}
                                                            </span>
                                                        )}
                                                    </div>
                                                    <button className="w-full bg-[#0A2351] text-white font-bold py-3 rounded-lg hover:bg-blue-800 transition-colors">
                                                        Enroll Now
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <p className="text-gray-500">No batches currently scheduled.</p>
                                    )}
                                </motion.div>

                            {/* Fee Structure */}
                                <motion.div id="section-fees" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                                    <h3 className="text-2xl font-bold text-[#1a2b4c] mb-6 border-b border-gray-200 pb-3">Fee Structure</h3>
                                    {activeTab.feeStructure && activeTab.feeStructure.length > 0 ? (
                                        <>
                                            <div className="overflow-x-auto border border-gray-200 rounded-xl shadow-sm">
                                                <table className="min-w-full text-left text-sm whitespace-nowrap">
                                                    <thead className="bg-gradient-to-r from-[#0A2351] to-[#1a3673] text-white font-semibold tracking-wide">
                                                        {activeTab.feeStructure[0].hasOwnProperty('discountedFee') ? (
                                                            <tr>
                                                                <th className="px-6 py-4">Class</th>
                                                                <th className="px-6 py-4">Duration</th>
                                                                <th className="px-6 py-4">Original Fee</th>
                                                                <th className="px-6 py-4">Discounted Fee</th>
                                                                <th className="px-6 py-4"></th>
                                                            </tr>
                                                        ) : activeTab.feeStructure[0].hasOwnProperty('isSimpleFee') ? (
                                                            <tr>
                                                                <th className="px-6 py-4">Class</th>
                                                                <th className="px-6 py-4">Duration</th>
                                                                <th className="px-6 py-4">Fee</th>
                                                                <th className="px-6 py-4"></th>
                                                            </tr>
                                                        ) : activeTab.feeStructure[0].hasOwnProperty('isCourseFee') ? (
                                                            <tr>
                                                                <th className="px-6 py-4">Course</th>
                                                                <th className="px-6 py-4">Duration</th>
                                                                <th className="px-6 py-4">Fee</th>
                                                                <th className="px-6 py-4"></th>
                                                            </tr>
                                                        ) : (
                                                            <tr>
                                                                <th className="px-6 py-4">Class</th>
                                                                <th className="px-6 py-4">Duration</th>
                                                                <th className="px-6 py-4 hidden md:table-cell">Goal</th>
                                                                <th className="px-6 py-4">Course Name</th>
                                                                <th className="px-6 py-4">Fee*</th>
                                                                <th className="px-6 py-4"></th>
                                                            </tr>
                                                        )}
                                                    </thead>
                                                    <tbody className="divide-y divide-gray-100">
                                                        {activeTab.feeStructure.map((fee, idx) => (
                                                            <tr key={idx} className={`transition-colors ${idx % 2 === 0 ? 'bg-white' : 'bg-[#f8fafc]'} hover:bg-blue-50/80`}>
                                                                {fee.hasOwnProperty('discountedFee') ? (
                                                                    <>
                                                                        <td className="px-6 py-5 whitespace-nowrap font-bold text-indigo-600 bg-indigo-50/50">{fee.class}</td>
                                                                        <td className="px-6 py-5 whitespace-nowrap text-gray-600">{fee.duration}</td>
                                                                        <td className="px-6 py-5 whitespace-nowrap text-red-500 line-through decoration-red-400">{fee.originalFee}</td>
                                                                        <td className="px-6 py-5 whitespace-nowrap font-bold text-[#08BD80] bg-green-50/50">{fee.discountedFee}</td>
                                                                        <td className="px-6 py-5 whitespace-nowrap text-right">
                                                                            <button className="bg-gradient-to-r from-[#086FFF] to-[#0A2351] text-white px-5 py-2 rounded-lg text-sm font-bold shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all">
                                                                                Pay Now ↗
                                                                            </button>
                                                                        </td>
                                                                    </>
                                                                ) : fee.hasOwnProperty('isSimpleFee') ? (
                                                                    <>
                                                                        <td className="px-6 py-5 whitespace-nowrap font-bold text-indigo-600 bg-indigo-50/50">{fee.class}</td>
                                                                        <td className="px-6 py-5 whitespace-nowrap text-gray-600">{fee.duration}</td>
                                                                        <td className="px-6 py-5 whitespace-nowrap font-bold text-[#08BD80] bg-green-50/50">{fee.fee}</td>
                                                                        <td className="px-6 py-5 whitespace-nowrap text-right">
                                                                            <button className="bg-gradient-to-r from-[#086FFF] to-[#0A2351] text-white px-5 py-2 rounded-lg text-sm font-bold shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all">
                                                                                Pay Now ↗
                                                                            </button>
                                                                        </td>
                                                                    </>
                                                                ) : fee.hasOwnProperty('isCourseFee') ? (
                                                                    <>
                                                                        <td className="px-6 py-5 whitespace-nowrap font-bold text-indigo-600 bg-indigo-50/50">{fee.course}</td>
                                                                        <td className="px-6 py-5 whitespace-nowrap text-gray-600">{fee.duration}</td>
                                                                        <td className="px-6 py-5 whitespace-nowrap font-bold text-[#08BD80] bg-green-50/50">{fee.fee}</td>
                                                                        <td className="px-6 py-5 whitespace-nowrap text-right">
                                                                            <button className="bg-gradient-to-r from-[#086FFF] to-[#0A2351] text-white px-5 py-2 rounded-lg text-sm font-bold shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all">
                                                                                Pay Now ↗
                                                                            </button>
                                                                        </td>
                                                                    </>
                                                                ) : (
                                                                    <>
                                                                        <td className="px-6 py-5 whitespace-nowrap font-bold text-indigo-600 bg-indigo-50/50">{fee.class}</td>
                                                                        <td className="px-6 py-5 whitespace-nowrap text-gray-600">{fee.duration}</td>
                                                                        <td className="px-6 py-5 whitespace-nowrap hidden md:table-cell text-gray-600">{fee.goal}</td>
                                                                        <td className="px-6 py-5 whitespace-nowrap text-gray-800 font-medium">{fee.courseName}</td>
                                                                        <td className="px-6 py-5 whitespace-nowrap font-bold text-[#08BD80] bg-green-50/50">{fee.fee}</td>
                                                                        <td className="px-6 py-5 whitespace-nowrap text-right">
                                                                            <button className="bg-gradient-to-r from-[#086FFF] to-[#0A2351] text-white px-5 py-2 rounded-lg text-sm font-bold shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all">
                                                                                Pay Now ↗
                                                                            </button>
                                                                        </td>
                                                                    </>
                                                                )}
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                            </div>
                                            <p className="text-sm text-gray-500 mt-4">*T&C applied</p>
                                        </>
                                    ) : (
                                        <p className="text-gray-500">Please contact the centre for fee details.</p>
                                    )}
                                </motion.div>

                            {/* Teaching Methodologies */}
                                <motion.div id="section-methodologies" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                                    <h3 className="text-2xl font-bold text-[#1a2b4c] mb-6 border-b border-gray-200 pb-3">Teaching Methodologies</h3>
                                    {activeTab.methodologies && activeTab.methodologies.length > 0 ? (
                                        <>
                                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 mb-8">
                                                {activeTab.methodologies.map((method, idx) => (
                                                    <div key={idx} className="flex flex-col items-center text-center">
                                                        <div className="w-16 h-16 rounded-2xl bg-blue-50/50 border border-blue-100 flex items-center justify-center mb-3 text-blue-600">
                                                            <img src={[conceptBasedIcon, competetiveExamsIcon, facultyIcon][idx % 3]} alt="Methodology" className="w-8 h-8 object-contain" />
                                                        </div>
                                                        <span className="font-semibold text-gray-800 text-[13px]">{method}</span>
                                                    </div>
                                                ))}
                                            </div>
                                            {activeTab.closingLines && (
                                                <div className="bg-blue-50/50 p-6 md:p-8 rounded-xl border border-blue-100 text-center flex flex-col items-center">
                                                    <p className="text-[#0A2351] font-medium leading-relaxed text-[15px] md:text-base mb-6 max-w-3xl">{activeTab.closingLines}</p>
                                                    <button 
                                                        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                                                        className="bg-gradient-to-r from-[#086FFF] to-[#0A2351] text-white px-8 py-3.5 rounded-xl font-bold shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all text-[15px] flex items-center gap-2"
                                                    >
                                                        Enroll Now <ArrowLeft className="w-4 h-4 rotate-135" style={{transform: "rotate(90deg)"}} />
                                                    </button>
                                                </div>
                                            )}
                                        </>
                                    ) : (
                                        <p className="text-gray-500">Methodologies will be updated soon.</p>
                                    )}
                                </motion.div>
                        </div>

                    </motion.div>
                )}
            </div>
        </div>
    );
};

export default CategoryDetail;
