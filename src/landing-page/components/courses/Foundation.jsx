import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, Calendar, BookOpen, User, ClipboardList, Target, Award, Layers, Receipt } from 'lucide-react';

const Foundation = () => {
  const [activeProgram, setActiveProgram] = useState('integrated');
  const [activeFeature, setActiveFeature] = useState('programs');
  const contentRef = useRef(null);

  const programs = [
    { id: 'integrated', label: 'Integrated Program' },
    { id: 'offline', label: 'School success program offline' },
    { id: 'online', label: 'Online programs' }
  ];

  const features = [
    { id: 'programs', label: 'Our Programs', icon: Layers },
    { id: 'batches', label: 'New Batches', icon: Calendar },
    { id: 'fees', label: 'Fee Structure', icon: Receipt },
    { id: 'methodologies', label: 'Teaching Methodologies', icon: BookOpen }
  ];

  return (
    <div className="w-full bg-white">
      {/* Foundation Header */}
      <div className="container-custom py-8">
        <h1 className="text-4xl font-black text-[#08BD80] mb-2 uppercase tracking-tight">Foundation</h1>
      </div>

      {/* Horizontal Tabs */}
      <div className="border-b border-gray-200 sticky top-[72px] z-30 bg-white/90 backdrop-blur-md">
        <div className="container-custom flex overflow-x-auto hide-scrollbar">
          {programs.map((program) => (
            <button
              key={program.id}
              onClick={() => {
                setActiveProgram(program.id);
                setActiveFeature('programs');
              }}
              className={`shrink-0 whitespace-nowrap px-6 py-4 font-semibold text-sm transition-all relative ${
                activeProgram === program.id
                  ? 'text-[#086FFF]'
                  : 'text-gray-500 hover:text-gray-900'
              }`}
            >
              {program.label}
              {activeProgram === program.id && (
                <motion.div
                  layoutId="foundation-program-tab"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#086FFF]"
                />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Hero Banner */}
      <div className="relative bg-[#1D1D35] text-white overflow-hidden py-16 lg:py-24">
        <div className="absolute inset-0 opacity-20">
            <div className="absolute -top-24 -left-24 w-96 h-96 bg-[#08BD80] rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob"></div>
            <div className="absolute top-0 -right-4 w-96 h-96 bg-[#086FFF] rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob animation-delay-2000"></div>
            <div className="absolute -bottom-8 left-20 w-96 h-96 bg-[#8C52FF] rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob animation-delay-4000"></div>
        </div>
        
        <div className="container-custom relative z-10 flex flex-col lg:flex-row items-center gap-12">
          <div className="flex-1 text-center lg:text-left">
            <h2 className="text-4xl lg:text-5xl font-black mb-4 leading-tight">
              Build a Strong <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#08BD80] to-[#086FFF]">Foundation</span> for Your Future
            </h2>
            <p className="text-lg text-gray-300 mb-8 max-w-2xl mx-auto lg:mx-0">
              Join Unacademy's comprehensive foundation programs designed to give you the ultimate edge in school exams and competitive tests.
            </p>
            <div className="inline-flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full border border-white/20">
              <span className="w-2 h-2 rounded-full bg-[#08BD80] animate-pulse"></span>
              <span className="text-sm font-medium">Admissions Open for 2026</span>
            </div>
          </div>

          <div className="w-full max-w-md bg-white rounded-2xl p-6 lg:p-8 shadow-2xl text-gray-900">
            <h3 className="text-2xl font-bold mb-2">Enquire Now</h3>
            <p className="text-gray-500 text-sm mb-6">Fill in your details and we'll get back to you.</p>
            <form className="space-y-4">
              <div>
                <input type="text" placeholder="Student Name" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#08BD80] focus:ring-2 focus:ring-[#08BD80]/20 outline-none transition-all" />
              </div>
              <div>
                <input type="tel" placeholder="Mobile Number" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#08BD80] focus:ring-2 focus:ring-[#08BD80]/20 outline-none transition-all" />
              </div>
              <div>
                <select className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#08BD80] focus:ring-2 focus:ring-[#08BD80]/20 outline-none transition-all bg-white appearance-none" defaultValue="">
                  <option value="" disabled>Select Class</option>
                  <option value="6">Class 6</option>
                  <option value="7">Class 7</option>
                  <option value="8">Class 8</option>
                  <option value="9">Class 9</option>
                  <option value="10">Class 10</option>
                </select>
              </div>
              <button type="button" className="w-full py-4 bg-[#08BD80] hover:bg-[#06a36f] text-white rounded-xl font-bold transition-all shadow-lg shadow-[#08BD80]/30 hover:shadow-[#08BD80]/50 hover:-translate-y-1">
                Submit Enquiry
              </button>
            </form>
          </div>
        </div>
      </div>

      <div className="container-custom py-16">
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-24">
          
          {/* Left Side: Course Description */}
          <div className="flex-1">
            <AnimatePresence mode="wait">
              {activeProgram === 'integrated' && (
                <motion.div
                  key="integrated-desc"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.3 }}
                >
                  <h3 className="text-2xl font-bold text-[#1D1D35] mb-6">Class 6th to 10th | School & Coaching Together <span className="text-[#086FFF]">Building Strong Foundations for Future Success</span></h3>
                  <p className="text-gray-600 leading-relaxed text-lg mb-6">
                    The <span className="font-bold border-b-2 border-dotted border-gray-400">Unacademy</span> Foundation School Integrated Program for Classes 6th to 10th combines <strong className="text-black">school curriculum with competitive exam preparation</strong> under one roof. Designed to build strong academic foundations, the program focuses on conceptual clarity, Olympiad & scholarship exam support, <span className="border-b-2 border-dotted border-gray-400">personalized</span> monitoring, and skill development through an experienced faculty team. With a smart learning environment and regular progress updates, students are guided towards <strong className="text-black">academic excellence and future career success</strong> while reducing stress and learning gaps.
                  </p>
                </motion.div>
              )}

              {activeProgram === 'offline' && (
                <motion.div
                  key="offline-desc"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.3 }}
                >
                  <h3 className="text-2xl font-bold text-[#1D1D35] mb-2">School Success Program</h3>
                  <h4 className="text-xl font-semibold text-[#08BD80] mb-6">( OFFLINE )</h4>
                  <p className="text-gray-600 leading-relaxed text-lg mb-6">
                    The <span className="font-bold border-b-2 border-dotted border-gray-400">Unacademy</span> Foundation school Program for Classes 8th to 10th is designed to strengthen concepts, improve academic performance, and prepare students for future competitive challenges. The program focuses on <strong className="text-black">Olympiad preparation, conceptual clarity, and advanced problem-solving skills</strong> through a structured Basic to Advanced learning approach. With expert faculty, <span className="border-b-2 border-dotted border-gray-400">personalized</span> attention, and regular assessments, students build confidence and a strong academic foundation for future success.
                  </p>
                </motion.div>
              )}

              {activeProgram === 'online' && (
                <motion.div
                  key="online-desc"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.3 }}
                >
                  <h3 className="text-2xl font-bold text-[#1D1D35] mb-6">Online Programs</h3>
                  <p className="text-gray-600 leading-relaxed text-lg mb-6">
                    Experience the excellence of Unacademy's foundation curriculum from the comfort of your home. Our online programs offer interactive live classes, comprehensive study materials, and regular assessments to ensure continuous learning and growth.
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Right Side: Navigation Buttons & Feature Content */}
          <div className="flex-1 flex flex-col">
            <div className="grid grid-cols-2 gap-3 sm:gap-4 mb-8">
              {features.map((feature) => {
                const Icon = feature.icon;
                return (
                  <div
                    key={feature.id}
                    onClick={() => {
                      setActiveFeature(feature.id);
                      setTimeout(() => {
                        if (contentRef.current) {
                          const yOffset = -120;
                          const y = contentRef.current.getBoundingClientRect().top + window.scrollY + yOffset;
                          window.scrollTo({ top: y, behavior: 'smooth' });
                        }
                      }, 50);
                    }}
                    className={`flex items-center p-3 sm:p-4 bg-white border rounded-xl cursor-pointer group transition-all ${
                      activeFeature === feature.id
                        ? 'border-[#0A2351] shadow-md ring-1 ring-[#0A2351]'
                        : 'border-[#e0e7f1] shadow-sm hover:shadow-md'
                    }`}
                  >
                    <div className={`w-10 h-10 sm:mr-4 mb-0 shrink-0 p-2 rounded-lg transition-colors flex items-center justify-center ${
                      activeFeature === feature.id ? 'bg-[#0A2351] text-white' : 'bg-blue-50 text-blue-600 group-hover:bg-blue-100'
                    }`}>
                      <Icon className="w-full h-full" />
                    </div>
                    <span className="font-bold text-[#1a2b4c] text-[13px] sm:text-[15px] leading-tight flex-1">{feature.label}</span>
                  </div>
                );
              })}
            </div>

            <div ref={contentRef} className="bg-white rounded-2xl border border-gray-100 shadow-xl shadow-gray-200/50 p-6 lg:p-8 min-h-[400px]">
              <AnimatePresence mode="wait">
                
                {activeFeature === 'programs' && (
                  <motion.div key="programs" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                    <h4 className="text-xl font-bold mb-6 text-[#1D1D35] border-b pb-4">Our Programs</h4>
                    <div className="space-y-6">
                      {activeProgram === 'integrated' && (
                        <>
                          <div className="relative pl-6 border-l-2 border-[#08BD80]">
                            <div className="absolute -left-[9px] top-1 w-4 h-4 rounded-full bg-[#08BD80] border-4 border-white"></div>
                            <h5 className="font-bold text-lg text-gray-900 mb-2">Class 6th to 8th – Foundation Program</h5>
                            <ul className="space-y-2 text-gray-600 text-sm">
                              <li className="flex items-start gap-2"><CheckCircle2 className="w-4 h-4 text-[#08BD80] mt-0.5 shrink-0"/> Strong conceptual learning in Mathematics, Science, English, and Social Studies</li>
                              <li className="flex items-start gap-2"><CheckCircle2 className="w-4 h-4 text-[#08BD80] mt-0.5 shrink-0"/> Olympiad preparation</li>
                              <li className="flex items-start gap-2"><CheckCircle2 className="w-4 h-4 text-[#08BD80] mt-0.5 shrink-0"/> Logical Reasoning & Mental Ability development</li>
                              <li className="flex items-start gap-2"><CheckCircle2 className="w-4 h-4 text-[#08BD80] mt-0.5 shrink-0"/> Activity-based learning and skill enhancement</li>
                              <li className="flex items-start gap-2"><CheckCircle2 className="w-4 h-4 text-[#08BD80] mt-0.5 shrink-0"/> Regular assessments and performance tracking</li>
                            </ul>
                          </div>
                          <div className="relative pl-6 border-l-2 border-[#086FFF]">
                            <div className="absolute -left-[9px] top-1 w-4 h-4 rounded-full bg-[#086FFF] border-4 border-white"></div>
                            <h5 className="font-bold text-lg text-gray-900 mb-2">Class 9th & 10th – Advanced Foundation Program</h5>
                            <ul className="space-y-2 text-gray-600 text-sm">
                              <li className="flex items-start gap-2"><CheckCircle2 className="w-4 h-4 text-[#086FFF] mt-0.5 shrink-0"/> Complete preparation for School & Board Examinations</li>
                              <li className="flex items-start gap-2"><CheckCircle2 className="w-4 h-4 text-[#086FFF] mt-0.5 shrink-0"/> Competitive exam foundation (JEE, NEET, Olympiads)</li>
                              <li className="flex items-start gap-2"><CheckCircle2 className="w-4 h-4 text-[#086FFF] mt-0.5 shrink-0"/> Advanced Mathematics and Science learning</li>
                              <li className="flex items-start gap-2"><CheckCircle2 className="w-4 h-4 text-[#086FFF] mt-0.5 shrink-0"/> Doubt-solving sessions and revision classes</li>
                              <li className="flex items-start gap-2"><CheckCircle2 className="w-4 h-4 text-[#086FFF] mt-0.5 shrink-0"/> Regular tests, analysis, and <span className="border-b border-dotted border-gray-400">personalized</span> mentoring</li>
                            </ul>
                          </div>
                        </>
                      )}
                      {activeProgram === 'offline' && (
                        <div className="text-gray-600 p-4 bg-gray-50 rounded-xl border border-gray-100">
                          <p className="mb-3 text-lg font-semibold text-gray-900">School Success Program (Classes 8th to 10th)</p>
                          <p>A structured Basic to Advanced learning approach designed to strengthen concepts, improve academic performance, and prepare students for future competitive challenges.</p>
                        </div>
                      )}
                      {activeProgram === 'online' && (
                        <div className="text-gray-600 p-4 bg-gray-50 rounded-xl border border-gray-100">
                          <p className="mb-3 text-lg font-semibold text-gray-900">Online Foundation Programs</p>
                          <p>Interactive live classes and comprehensive digital study material tailored for each class to ensure continuous learning from the comfort of your home.</p>
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}

                {activeFeature === 'batches' && (
                  <motion.div key="batches" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                    <h4 className="text-xl font-bold mb-6 text-[#1D1D35] border-b pb-4 flex items-center justify-between">
                      New Batches Section
                    </h4>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                      {[
                        { name: 'Phase 1 Batch', date: 'April 8 2026' },
                        { name: 'Phase 2 Batch', date: 'April 22 2026' },
                        { name: 'Phase 3 Batch', date: 'May 18 2026' },
                        { name: 'Phase 4 Batch', date: 'June 29 2026' }
                      ].map((batch, idx) => (
                        <div key={idx} className="card-una border border-gray-200 p-5 hover:border-[#08BD80] hover:shadow-md transition-all">
                          <div className="inline-flex px-2 py-1 bg-gray-100 text-gray-600 text-xs font-bold rounded mb-3">
                            {activeProgram === 'online' ? 'ONLINE' : 'OFFLINE'}
                          </div>
                          <h5 className="font-bold text-lg mb-1">{batch.name}</h5>
                          <div className="flex items-center text-sm text-gray-500 mb-4">
                            <Calendar className="w-4 h-4 mr-2 text-[#08BD80]"/> Starts: {batch.date}
                          </div>
                          <button className="w-full py-2 bg-[#1D1D35] text-white rounded-lg text-sm font-bold hover:bg-[#086FFF] transition-colors">
                            Enroll Now
                          </button>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}

                {activeFeature === 'fees' && (
                  <motion.div key="fees" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                    <h4 className="text-xl font-bold mb-6 text-[#1D1D35] border-b pb-4">FEE STRUCTURE:</h4>
                    
                    <div className="overflow-x-auto rounded-xl border border-gray-200 shadow-sm">
                      <table className="w-full min-w-[700px] text-left border-collapse whitespace-nowrap">
                        <thead className="bg-gradient-to-r from-[#0A2351] to-[#1a3673] text-white font-semibold tracking-wide">
                          <tr className="border-b border-blue-800 text-sm">
                            <th className="p-4 font-semibold">Class</th>
                            {activeProgram === 'integrated' && <th className="p-4 font-semibold">Goal</th>}
                            {activeProgram === 'integrated' && <th className="p-4 font-semibold">Course Name</th>}
                            {activeProgram === 'offline' && <th className="p-4 font-semibold">Original Fee</th>}
                            <th className="p-4 font-semibold">{activeProgram === 'offline' ? 'Discounted Fee' : 'Fee'}</th>
                          </tr>
                        </thead>
                        <tbody className="text-sm divide-y divide-gray-100">
                          {activeProgram === 'integrated' ? (
                            <>
                              <tr className="bg-white hover:bg-blue-50/80 transition-colors">
                                <td className="p-4 font-bold text-indigo-600 bg-indigo-50/50">Class 6</td>
                                <td className="p-4 text-gray-600">1 Year</td>
                                <td className="p-4 text-gray-600">Foundation</td>
                                <td className="p-4 text-gray-800 font-medium">Kickstart</td>
                                <td className="p-4 font-bold text-[#08BD80] bg-green-50/50">₹47,000</td>
                              </tr>
                              <tr className="bg-[#f8fafc] hover:bg-blue-50/80 transition-colors">
                                <td className="p-4 font-bold text-indigo-600 bg-indigo-50/50">Class 7</td>
                                <td className="p-4 text-gray-600">1 Year</td>
                                <td className="p-4 text-gray-600">Foundation</td>
                                <td className="p-4 text-gray-800 font-medium">Accelerate</td>
                                <td className="p-4 font-bold text-[#08BD80] bg-green-50/50">₹49,000</td>
                              </tr>
                              <tr className="bg-white hover:bg-blue-50/80 transition-colors">
                                <td className="p-4 font-bold text-indigo-600 bg-indigo-50/50">Class 8</td>
                                <td className="p-4 text-gray-600">1 Year</td>
                                <td className="p-4 text-gray-600">Foundation</td>
                                <td className="p-4 text-gray-800 font-medium">Beginner</td>
                                <td className="p-4 font-bold text-[#08BD80] bg-green-50/50">₹53,000</td>
                              </tr>
                              <tr className="bg-[#f8fafc] hover:bg-blue-50/80 transition-colors">
                                <td className="p-4 font-bold text-indigo-600 bg-indigo-50/50">Class 9</td>
                                <td className="p-4 text-gray-600">1 Year</td>
                                <td className="p-4 text-gray-600">Foundation</td>
                                <td className="p-4 text-gray-800 font-medium">Adapt</td>
                                <td className="p-4 font-bold text-[#08BD80] bg-green-50/50">₹55,000</td>
                              </tr>
                              <tr className="bg-white hover:bg-blue-50/80 transition-colors">
                                <td className="p-4 font-bold text-indigo-600 bg-indigo-50/50">Class 10</td>
                                <td className="p-4 text-gray-600">1 Year</td>
                                <td className="p-4 text-gray-600">Foundation</td>
                                <td className="p-4 text-gray-800 font-medium">Elevate</td>
                                <td className="p-4 font-bold text-[#08BD80] bg-green-50/50">₹60,000</td>
                              </tr>
                            </>
                          ) : (
                            <>
                              <tr className="bg-white hover:bg-blue-50/80 transition-colors">
                                <td className="p-4 font-bold text-indigo-600 bg-indigo-50/50">Class 6</td>
                                <td className="p-4 text-gray-600">1 Year</td>
                                <td className="p-4 text-red-500 line-through decoration-red-400">₹30,000</td>
                                <td className="p-4 font-bold text-[#08BD80] bg-green-50/50">₹18,000</td>
                              </tr>
                              <tr className="bg-[#f8fafc] hover:bg-blue-50/80 transition-colors">
                                <td className="p-4 font-bold text-indigo-600 bg-indigo-50/50">Class 7</td>
                                <td className="p-4 text-gray-600">1 Year</td>
                                <td className="p-4 text-red-500 line-through decoration-red-400">₹30,000</td>
                                <td className="p-4 font-bold text-[#08BD80] bg-green-50/50">₹18,000</td>
                              </tr>
                              <tr className="bg-white hover:bg-blue-50/80 transition-colors">
                                <td className="p-4 font-bold text-indigo-600 bg-indigo-50/50">Class 8</td>
                                <td className="p-4 text-gray-600">1 Year</td>
                                <td className="p-4 text-red-500 line-through decoration-red-400">₹30,000</td>
                                <td className="p-4 font-bold text-[#08BD80] bg-green-50/50">₹18,000</td>
                              </tr>
                              <tr className="bg-[#f8fafc] hover:bg-blue-50/80 transition-colors">
                                <td className="p-4 font-bold text-indigo-600 bg-indigo-50/50">Class 9</td>
                                <td className="p-4 text-gray-600">1 Year</td>
                                <td className="p-4 text-red-500 line-through decoration-red-400">₹40,000</td>
                                <td className="p-4 font-bold text-[#08BD80] bg-green-50/50">₹20,000</td>
                              </tr>
                              <tr className="bg-white hover:bg-blue-50/80 transition-colors">
                                <td className="p-4 font-bold text-indigo-600 bg-indigo-50/50">Class 10</td>
                                <td className="p-4 text-gray-600">1 Year</td>
                                <td className="p-4 text-red-500 line-through decoration-red-400">₹40,000</td>
                                <td className="p-4 font-bold text-[#08BD80] bg-green-50/50">₹20,000</td>
                              </tr>
                            </>
                          )}
                        </tbody>
                      </table>
                    </div>
                    <p className="text-xs text-gray-500 mt-3">*T&C applied</p>
                  </motion.div>
                )}

                {activeFeature === 'methodologies' && (
                  <motion.div key="methodologies" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                    <h4 className="text-xl font-bold mb-6 text-[#1D1D35] border-b pb-4">Section: Teaching Methodologies</h4>
                    
                    {activeProgram === 'integrated' ? (
                      <>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                          <div className="flex items-center gap-4 p-4 rounded-xl bg-gray-50 border border-gray-100 hover:border-[#08BD80] hover:shadow-md transition-all group">
                            <div className="w-12 h-12 rounded-full bg-[#08BD80]/10 flex items-center justify-center group-hover:bg-[#08BD80] group-hover:text-white transition-colors">
                              <BookOpen className="w-6 h-6 text-[#08BD80] group-hover:text-white" />
                            </div>
                            <span className="font-semibold text-gray-800">School and Coaching Together</span>
                          </div>
                          <div className="flex items-center gap-4 p-4 rounded-xl bg-gray-50 border border-gray-100 hover:border-[#086FFF] hover:shadow-md transition-all group">
                            <div className="w-12 h-12 rounded-full bg-[#086FFF]/10 flex items-center justify-center group-hover:bg-[#086FFF] group-hover:text-white transition-colors">
                              <Target className="w-6 h-6 text-[#086FFF] group-hover:text-white" />
                            </div>
                            <span className="font-semibold text-gray-800">Strong Academic Foundation</span>
                          </div>
                          <div className="flex items-center gap-4 p-4 rounded-xl bg-gray-50 border border-gray-100 hover:border-[#8C52FF] hover:shadow-md transition-all group">
                            <div className="w-12 h-12 rounded-full bg-[#8C52FF]/10 flex items-center justify-center group-hover:bg-[#8C52FF] group-hover:text-white transition-colors">
                              <Award className="w-6 h-6 text-[#8C52FF] group-hover:text-white" />
                            </div>
                            <span className="font-semibold text-gray-800">Competitive Exam Readiness</span>
                          </div>
                          <div className="flex items-center gap-4 p-4 rounded-xl bg-gray-50 border border-gray-100 hover:border-[#FF914D] hover:shadow-md transition-all group">
                            <div className="w-12 h-12 rounded-full bg-[#FF914D]/10 flex items-center justify-center group-hover:bg-[#FF914D] group-hover:text-white transition-colors">
                              <User className="w-6 h-6 text-[#FF914D] group-hover:text-white" />
                            </div>
                            <span className="font-semibold text-gray-800">Experienced Faculty</span>
                          </div>
                          <div className="flex items-center gap-4 p-4 rounded-xl bg-gray-50 border border-gray-100 hover:border-[#FBCB15] hover:shadow-md transition-all group">
                            <div className="w-12 h-12 rounded-full bg-[#FBCB15]/10 flex items-center justify-center group-hover:bg-[#FBCB15] group-hover:text-white transition-colors">
                              <ClipboardList className="w-6 h-6 text-[#FBCB15] group-hover:text-white" />
                            </div>
                            <span className="font-semibold text-gray-800">Regular Testing & Performance Analysis</span>
                          </div>
                        </div>

                        <div className="bg-[#1D1D35] rounded-2xl p-6 text-white text-center relative overflow-hidden">
                          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
                          <div className="relative z-10">
                            <p className="text-lg mb-4 text-gray-200">
                              <strong className="text-white block text-xl mb-2">Empowering Young Minds Today for a Brighter Tomorrow</strong> 
                              Join our <span className="border-b-2 border-dotted border-gray-400">Unacademy</span> Foundation School Integrated Program and give your child the perfect blend of school education, competitive preparation, and holistic development under one roof.
                            </p>
                            <button className="btn-una-primary mt-2">
                              <span className="border-b border-dotted border-white/50">Enroll</span> Now
                            </button>
                          </div>
                        </div>
                      </>
                    ) : (
                      <>
                        <ul className="space-y-4 mb-8 text-gray-700">
                          <li className="flex items-center gap-3"><CheckCircle2 className="w-5 h-5 text-[#08BD80]"/> Concept-Based Learning</li>
                          <li className="flex items-center gap-3"><CheckCircle2 className="w-5 h-5 text-[#08BD80]"/> <span className="border-b border-dotted border-gray-400">Personalized</span> Mentorship</li>
                          <li className="flex items-center gap-3"><CheckCircle2 className="w-5 h-5 text-[#08BD80]"/> Regular Practice & Assessments</li>
                          <li className="flex items-center gap-3"><CheckCircle2 className="w-5 h-5 text-[#08BD80]"/> Advanced Problem-Solving Approach</li>
                          <li className="flex items-center gap-3"><CheckCircle2 className="w-5 h-5 text-[#08BD80]"/> Future-Ready Learning Framework</li>
                          <li className="flex items-center gap-3"><CheckCircle2 className="w-5 h-5 text-[#08BD80]"/> Structured Learning & Discipline Building</li>
                        </ul>

                        <div className="bg-gray-50 rounded-2xl p-6 border border-gray-200 text-center">
                           <h5 className="font-black text-2xl text-[#1D1D35] mb-2">Learn. Practice. Improve. Succeed.</h5>
                           <p className="text-gray-600 mb-6">
                            Join our Junior Division and take the first step toward a brighter academic future with structured learning, expert guidance, and continuous growth
                           </p>
                           <button className="btn-una-primary">
                              <span className="border-b border-dotted border-white/50">Enroll</span> Now
                            </button>
                        </div>
                      </>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Foundation;
