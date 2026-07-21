import React, { useState } from 'react';
import { 
    Search, User, GraduationCap, History, 
    ArrowRight, Loader2, Sparkles, AlertCircle, Calendar, Award
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import axiosClient from '../api/axios_client';
import toast from 'react-hot-toast';

import UnacademyReportCard from '../components/UnacademyReportCard';

export default function ResultSearchPage() {
    const [rollNo, setRollNo] = useState('');
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);
    const [error, setError] = useState('');
    const [showOtp, setShowOtp] = useState(false);
    const [otpValue, setOtpValue] = useState('');
    const [maskedPhone, setMaskedPhone] = useState('');
    const [verifyingOtp, setVerifyingOtp] = useState(false);

    const handleSearch = async (e) => {
        if (e) e.preventDefault();
        if (!rollNo.trim()) return;

        setLoading(true);
        setError('');
        setResult(null);
        setShowOtp(false);

        try {
            const res = await axiosClient.get(`/report-cards/public/${rollNo.trim()}`);
            if (res.data.success) {
                if (res.data.otp_required) {
                    setShowOtp(true);
                    setMaskedPhone(res.data.data?.phone || '******' + (res.data.data?.lastDigits || '0000'));
                    toast.success("OTP sent to your linked mobile number");
                } else {
                    setResult(res.data.data);
                }
            }
        } catch (err) {
            setError(err.response?.data?.message || "Result not found for this Roll Number.");
            toast.error("Invalid Roll Number");
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyOtp = async (e) => {
        if (e) e.preventDefault();
        if (otpValue.length < 4) return;

        setVerifyingOtp(true);
        try {
            const res = await axiosClient.post(`/report-cards/verify-otp`, {
                rollNo: rollNo.trim(),
                otp: otpValue
            });
            if (res.data.success) {
                setResult(res.data.data);
                setShowOtp(false);
                toast.success("Identity Verified!");
            }
        } catch (err) {
            toast.error(err.response?.data?.message || "Invalid OTP. Please try again.");
        } finally {
            setVerifyingOtp(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col items-center p-4 md:p-10 font-outfit">
            {/* Animated Background Accents */}
            <div className="fixed top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-500/5 rounded-full blur-[120px] animate-pulse" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-500/5 rounded-full blur-[120px] animate-pulse" />
            </div>

            {/* Header Section */}
            <motion.div 
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center mb-12 space-y-4"
            >
                <h1 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tight">
                    Check Your <span className="text-blue-600">Performance</span>
                </h1>
                <p className="text-gray-500 font-medium max-w-lg mx-auto">
                    Enter your unique roll number to view all your test results and academic analytics.
                </p>
            </motion.div>

            {/* Search Bar */}
            <motion.div 
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="w-full max-w-xl mb-16"
            >
                <form 
                    onSubmit={handleSearch}
                    className="relative group"
                >
                    <div className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-600 transition-colors">
                        <Search size={24} />
                    </div>
                    <input 
                        type="text" 
                        placeholder="Enter your Roll Number..."
                        className="w-full pl-16 pr-32 py-6 bg-white border-2 border-gray-100 rounded-[2.5rem] shadow-xl shadow-gray-200/50 focus:outline-none focus:border-blue-500 focus:ring-8 focus:ring-blue-500/5 transition-all text-xl font-bold placeholder:text-gray-300"
                        value={rollNo}
                        onChange={(e) => setRollNo(e.target.value)}
                    />
                    <button 
                        type="submit"
                        disabled={loading || !rollNo.trim()}
                        className="absolute right-3 top-3 bottom-3 px-8 bg-blue-600 hover:bg-blue-700 text-white rounded-[1.8rem] font-black tracking-tight flex items-center gap-2 transition-all active:scale-95 disabled:opacity-50"
                    >
                        {loading ? <Loader2 className="animate-spin" size={20} /> : <><ArrowRight size={20} /> Search</>}
                    </button>
                </form>
            </motion.div>

            {/* Result Area */}
            <div className="w-full max-w-5xl">
                <AnimatePresence mode="wait">
                    {loading ? (
                        <motion.div 
                            key="loading"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="text-center py-20"
                        >
                            <Loader2 className="animate-spin text-blue-600 mx-auto mb-4" size={48} />
                            <p className="text-gray-400 font-bold">Verifying academic access...</p>
                        </motion.div>
                    ) : showOtp ? (
                        <motion.div
                            key="otp"
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="max-w-md mx-auto bg-white rounded-[2.5rem] p-10 shadow-2xl border-2 border-blue-50 space-y-8"
                        >
                            <div className="text-center space-y-3">
                                <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                                    <ShieldCheck size={32} />
                                </div>
                                <h2 className="text-2xl font-black text-gray-900 tracking-tight">OTP Verification</h2>
                                <p className="text-gray-500 font-medium text-sm">
                                    A security code has been sent to your linked mobile number <span className="font-bold text-blue-600">{maskedPhone}</span>.
                                </p>
                            </div>

                            <form onSubmit={handleVerifyOtp} className="space-y-6">
                                <div className="space-y-2">
                                    <input
                                        type="text"
                                        maxLength="6"
                                        placeholder="Enter 6-digit OTP"
                                        className="w-full text-center py-4 bg-gray-50 border-2 border-gray-100 rounded-2xl focus:border-blue-500 outline-none text-2xl font-black tracking-[0.5em] tabular-nums"
                                        value={otpValue}
                                        onChange={(e) => setOtpValue(e.target.value.replace(/\D/g, ''))}
                                    />
                                    <p className="text-[10px] font-black text-gray-400 text-center uppercase tracking-widest">Type your secret code</p>
                                </div>

                                <button
                                    type="submit"
                                    disabled={verifyingOtp || otpValue.length < 4}
                                    className="w-full py-4 bg-blue-600 hover:bg-black text-white rounded-2xl font-black shadow-xl shadow-blue-200 transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2"
                                >
                                    {verifyingOtp ? <Loader2 className="animate-spin" size={20} /> : "Verify & View Result"}
                                </button>
                                
                                <button 
                                    type="button"
                                    onClick={() => setShowOtp(false)}
                                    className="w-full text-sm font-bold text-gray-400 hover:text-blue-600 transition-colors"
                                >
                                    Cancel & Return
                                </button>
                            </form>
                        </motion.div>
                    ) : error ? (
                        <motion.div 
                            key="error"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            className="bg-rose-50 border-2 border-rose-100 p-10 rounded-[2.5rem] text-center space-y-4 max-w-xl mx-auto"
                        >
                            <div className="w-16 h-16 bg-rose-500 text-white rounded-3xl flex items-center justify-center mx-auto shadow-lg shadow-rose-200">
                                <AlertCircle size={32} />
                            </div>
                            <h3 className="text-xl font-black text-rose-900">Oops! {error}</h3>
                            <p className="text-rose-600 font-medium">Please double-check your Roll Number and try again.</p>
                        </motion.div>
                    ) : result ? (
                        <motion.div 
                            key="result"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="space-y-8"
                        >
                            {/* Student Profile Card */}
                            <div className="bg-linear-to-r from-blue-600 to-indigo-700 rounded-[2.5rem] p-8 md:p-12 text-white shadow-2xl relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
                                
                                <div className="relative flex flex-col md:flex-row items-center gap-8">
                                    <div className="w-24 h-24 bg-white/20 backdrop-blur-md rounded-4xl flex items-center justify-center text-4xl font-black">
                                        {result.student.name[0]}
                                    </div>
                                    <div className="text-center md:text-left space-y-2 flex-1">
                                        <h2 className="text-4xl font-black tracking-tight">{result.student.name}</h2>
                                        <div className="flex flex-wrap justify-center md:justify-start gap-4">
                                            <span className="px-4 py-1.5 bg-white/10 rounded-xl text-sm font-bold flex items-center gap-2">
                                                <History size={14} /> Roll No: {result.student.rollNo}
                                            </span>
                                            <span className="px-4 py-1.5 bg-white/10 rounded-xl text-sm font-bold flex items-center gap-2">
                                                <GraduationCap size={14} /> {result.student.className} - {result.student.section}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="hidden md:block bg-white/10 p-6 rounded-4xl backdrop-blur-sm border border-white/10 text-center">
                                        <p className="text-[10px] font-black uppercase tracking-widest opacity-70 mb-1">Total Exams</p>
                                        <p className="text-3xl font-black">{result.reports.length}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Full Report Card View */}
                            <motion.div
                                initial={{ opacity: 0, scale: 0.98 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="w-full"
                            >
                                <UnacademyReportCard 
                                    student={result.student} 
                                    reports={result.reports} 
                                    config={result.reportCardConfig}
                                />
                            </motion.div>
                        </motion.div>
                    ) : (
                        /* Empty State */
                        <motion.div 
                            key="empty"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="text-center py-20 space-y-4"
                        >
                            <div className="w-20 h-20 bg-gray-100 text-gray-300 rounded-4xl flex items-center justify-center mx-auto">
                                <GraduationCap size={40} />
                            </div>
                            <p className="text-gray-400 font-bold">Your academic history will appear here.</p>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Footer */}
            <div className="mt-auto py-10 text-center">
                <p className="text-gray-300 text-xs font-black uppercase tracking-widest flex items-center justify-center gap-2">
                    <ShieldCheck size={14} className="text-emerald-500/50" />
                    Secure Result Management System
                </p>
            </div>
        </div>
    );
}

function ShieldCheck({ size, className }) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" /><path d="m9 12 2 2 4-4" />
        </svg>
    )
}
