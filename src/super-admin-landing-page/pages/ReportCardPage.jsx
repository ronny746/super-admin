import React, { useState, useEffect } from 'react';
import {
    FileText, Upload, Search, Users, History, CheckCircle2,
    AlertCircle, FileSpreadsheet, Loader2, X, Eye, Filter, ArrowLeft
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import * as XLSX from 'xlsx';
import axiosClient from '../api/axios_client';
import toast from 'react-hot-toast';

export default function ReportCardPage() {
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [isImporting, setIsImporting] = useState(false);
    const [importing, setImporting] = useState(false);
    const [summary, setSummary] = useState(null);
    const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')) || {});

    // Detail Modal State
    const [selectedStudent, setSelectedStudent] = useState(null);
    const [studentDetail, setStudentDetail] = useState(null);
    const [loadingDetail, setLoadingDetail] = useState(false);
    const [selectedReport, setSelectedReport] = useState(null);
    const [otpEnabled, setOtpEnabled] = useState(false);
    const [availableExams, setAvailableExams] = useState([]);
    const [reportCardConfig, setReportCardConfig] = useState({ enabledPercentages: {} });
    const [savingSettings, setSavingSettings] = useState(false);
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);

    useEffect(() => {
        fetchStudents();
        fetchSettings();
    }, []);

    const fetchSettings = async () => {
        try {
            const res = await axiosClient.get(`/report-cards/settings`);
            if (res.data.success) {
                setOtpEnabled(res.data.data.resultOtpEnabled);
                setAvailableExams(res.data.data.availableExams || []);
                setReportCardConfig(res.data.data.reportCardConfig || { enabledPercentages: {} });
            }
        } catch (err) {
            console.error("Failed to load settings");
        }
    };

    const saveUpdatedSettings = async (newConfig = reportCardConfig, newOtp = otpEnabled) => {
        setSavingSettings(true);
        try {
            await axiosClient.post(`/report-cards/settings`, { 
                resultOtpEnabled: newOtp,
                reportCardConfig: newConfig
            });
            return true;
        } catch (err) {
            toast.error("Failed to save settings");
            return false;
        } finally {
            setSavingSettings(false);
        }
    };

    const toggleOtp = async (val) => {
        const success = await saveUpdatedSettings(reportCardConfig, val);
        if (success) {
            setOtpEnabled(val);
            toast.success(`Result OTP Protection ${val ? 'Enabled' : 'Disabled'}`);
        }
    };

    const toggleExamVisibility = async (examName) => {
        const newEnabled = { ...reportCardConfig.enabledPercentages };
        newEnabled[examName] = !newEnabled[examName];
        
        const newConfig = { ...reportCardConfig, enabledPercentages: newEnabled };
        const success = await saveUpdatedSettings(newConfig, otpEnabled);
        if (success) {
            setReportCardConfig(newConfig);
            toast.success(`Visibility for ${examName} updated`);
        }
    };

    const addExamGroup = async (groupName, selectedExams) => {
        const newGroups = [...(reportCardConfig.examGroups || []), { name: groupName, exams: selectedExams }];
        const newConfig = { ...reportCardConfig, examGroups: newGroups };
        const success = await saveUpdatedSettings(newConfig, otpEnabled);
        if (success) {
            setReportCardConfig(newConfig);
            toast.success(`Group "${groupName}" created successfully`);
        }
    };

    const deleteExamGroup = async (index) => {
        const newGroups = reportCardConfig.examGroups.filter((_, i) => i !== index);
        const newConfig = { ...reportCardConfig, examGroups: newGroups };
        const success = await saveUpdatedSettings(newConfig, otpEnabled);
        if (success) {
            setReportCardConfig(newConfig);
            toast.success("Group deleted");
        }
    };

    const fetchStudents = async () => {
        setLoading(true);
        try {
            const res = await axiosClient.get(`/report-cards/students`);
            if (res.data.success) {
                setStudents(res.data.data);
            }
        } catch (err) {
            toast.error("Failed to load students");
        } finally {
            setLoading(false);
        }
    };

    const [progress, setProgress] = useState(0);
    const [processedCount, setProcessedCount] = useState(0);
    const [totalToProcess, setTotalToProcess] = useState(0);

    const handleFileUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setImporting(true);
        setSummary(null);
        setProgress(0);
        setProcessedCount(0);

        const reader = new FileReader();
        reader.onload = async (evt) => {
            try {
                const bstr = evt.target.result;
                const wb = XLSX.read(bstr, { type: 'binary' });
                const wsname = wb.SheetNames[0];
                const ws = wb.Sheets[wsname];
                const data = XLSX.utils.sheet_to_json(ws);

                if (data.length === 0) {
                    toast.error("Excel file is empty");
                    setImporting(false);
                    return;
                }

                setTotalToProcess(data.length);
                const batchSize = 50; // Reduced batch size for better reliability
                let finalSummary = { inserted: 0, updated: 0, skipped: 0, errors: [] };

                // Map specific Sakshi-format headers to standard internal keys
                const standardizedData = data.map(r => {
                    return {
                        ...r,
                        rollNo: String(r['Roll No.'] || r.RollNo || r.rollNo || r.roll || "").trim(),
                        name: String(r['Learner Name'] || r.Name || r.name || "Unknown").trim(),
                        testName: String(r['Test Name'] || r.TestName || r.test || "").trim(),
                        testDate: typeof r['Test Date'] === 'number'
                            ? new Date((r['Test Date'] - 25569) * 86400 * 1000).toLocaleDateString()
                            : (r['Test Date'] || r.testDate),
                        percentage: r['% NSEJS'] || r['%'] || r.percentage
                    }
                });

                // Process in batches
                for (let i = 0; i < standardizedData.length; i += batchSize) {
                    const batch = standardizedData.slice(i, i + batchSize);

                    try {
                        const res = await axiosClient.post(`/report-cards/import`, {
                            reportCards: batch,
                            instituteId: user.instituteId,
                            isFirstBatch: i === 0
                        });

                        if (res.data.success) {
                            const { inserted, updated, skipped } = res.data.data;
                            finalSummary.inserted += (inserted || 0);
                            finalSummary.updated += (updated || 0);
                            finalSummary.skipped += (skipped || 0);
                            
                            if (res.data.errors) {
                                finalSummary.errors = [...(finalSummary.errors || []), ...(res.data.errors || [])];
                            }

                            const currentProcessed = Math.min(i + batchSize, data.length);
                            setProcessedCount(currentProcessed);
                            setProgress(Math.round((currentProcessed / data.length) * 100));
                        }
                    } catch (batchErr) {
                        console.error(`Batch ${i/batchSize + 1} failed:`, batchErr);
                        throw batchErr; // Rethrow to be caught by main catch
                    }
                }

                toast.success("Sync Completed Successfully!");
                setSummary(finalSummary);
                fetchStudents();
                fetchSettings();
            } catch (err) {
                console.error("Import error detail:", err);
                const errorMsg = err.response?.data?.message || err.message || "Import failed during batch processing";
                toast.error(errorMsg, { duration: 5000 });
            } finally {
                setImporting(false);
            }
        };
        reader.readAsBinaryString(file);
    };

    const openStudentDetail = async (student) => {
        setSelectedStudent(student);
        setLoadingDetail(true);
        setStudentDetail(null);
        try {
            const res = await axiosClient.get(`/report-cards/student/${student._id}`);
            if (res.data.success) {
                setStudentDetail(res.data.data);
            }
        } catch (err) {
            toast.error("Error loading details");
        } finally {
            setLoadingDetail(false);
        }
    };

    const filteredStudents = students.filter(s => {
        const matchesSearch = s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            s.rollNo?.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesSearch;
    });

    return (
        <div className="space-y-6">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                        <FileText className="text-emerald-600" />
                        Report Card Management
                    </h1>
                    <p className="text-gray-500 text-sm mt-1">Independent result directory with Attendance Mapping</p>
                </div>

                <div className="flex items-center gap-4">
                    <button
                        onClick={() => setIsSettingsOpen(true)}
                        className="flex items-center gap-2 bg-white hover:bg-gray-50 text-gray-700 border border-gray-200 px-5 py-2.5 rounded-2xl transition-all shadow-sm active:scale-95 text-sm font-black group"
                    >
                        <div className="p-1.5 bg-emerald-100 text-emerald-600 rounded-lg group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                            <Filter size={16} />
                        </div>
                        Configure Portal
                    </button>

                    <button
                        onClick={() => setIsImporting(true)}
                        className="flex items-center gap-2 bg-slate-900 hover:bg-black text-white px-5 py-2.5 rounded-2xl transition-all shadow-lg active:scale-95 text-sm font-black"
                    >
                        <FileSpreadsheet size={18} className="text-emerald-400" />
                        Master Sync
                    </button>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-blue-50/50 border border-blue-100 p-5 rounded-3xl flex items-center gap-4">
                    <div className="bg-blue-500 p-3 rounded-2xl text-white shadow-lg shadow-blue-200">
                        <Users size={24} />
                    </div>
                    <div>
                        <p className="text-xs text-blue-600 font-bold uppercase tracking-wider">Result Profiles</p>
                        <p className="text-2xl font-black text-gray-800">{students.length}</p>
                    </div>
                </div>
                <div className="bg-emerald-50/50 border border-emerald-100 p-5 rounded-3xl flex items-center gap-4">
                    <div className="bg-emerald-500 p-3 rounded-2xl text-white shadow-lg shadow-emerald-200">
                        <CheckCircle2 size={24} />
                    </div>
                    <div>
                        <p className="text-xs text-emerald-600 font-bold uppercase tracking-wider">Accuracy</p>
                        <p className="text-sm font-bold text-gray-800">RollNo Matched</p>
                    </div>
                </div>
                <div className="bg-rose-50/50 border border-rose-100 p-5 rounded-3xl flex items-center gap-4 text-rose-600">
                    <div className="bg-rose-500 p-3 rounded-2xl text-white shadow-lg shadow-rose-200">
                        <History size={24} />
                    </div>
                    <div>
                        <p className="text-xs font-bold uppercase tracking-wider">Attendance Link</p>
                        <p className="text-sm font-bold leading-tight">Live GR Sync</p>
                    </div>
                </div>
            </div>

            {/* Detailed Settings Modal */}
            <AnimatePresence>
                {isSettingsOpen && (
                    <div className="fixed inset-0 z-100 flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsSettingsOpen(false)}
                            className="absolute inset-0 bg-gray-900/60 backdrop-blur-xl"
                        />
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0, y: 30 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.9, opacity: 0, y: 30 }}
                            className="bg-white rounded-4xl w-full max-w-3xl max-h-[90vh] overflow-hidden relative shadow-2xl flex flex-col border border-white/20"
                        >
                            {/* Modal Header */}
                            <div className="p-8 bg-linear-to-r from-emerald-600 to-teal-700 text-white flex justify-between items-center relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
                                <div className="relative">
                                    <h2 className="text-2xl font-black tracking-tight">Portal Configuration</h2>
                                    <p className="text-emerald-100/70 text-[10px] font-bold uppercase tracking-widest mt-1">Manage Visibility & Security</p>
                                </div>
                                <button
                                    onClick={() => setIsSettingsOpen(false)}
                                    className="p-3 bg-white/10 hover:bg-white/20 rounded-2xl transition-colors relative z-10"
                                >
                                    <X size={20} />
                                </button>
                            </div>

                            <div className="flex-1 overflow-y-auto p-8 space-y-10 custom-scrollbar">
                                {/* Section 1: Core Security */}
                                <div className="space-y-4">
                                    <h3 className="text-sm font-black text-gray-400 uppercase tracking-[0.2em] px-2 flex items-center gap-3">
                                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> Security Settings
                                    </h3>
                                    <div className="grid grid-cols-1 gap-4">
                                        <div className="bg-emerald-50/50 p-6 rounded-3xl border border-emerald-100/50 flex items-center justify-between">
                                            <div className="space-y-1">
                                                <h4 className="text-lg font-black text-emerald-900">SMS OTP Verification</h4>
                                                <p className="text-sm font-medium text-emerald-700/70 italic">Require mobile verification to view results</p>
                                            </div>
                                            <button
                                                onClick={() => toggleOtp(!otpEnabled)}
                                                className={`w-14 h-7 rounded-full transition-all relative flex items-center px-1 shrink-0 shadow-inner ${otpEnabled ? 'bg-emerald-600' : 'bg-slate-300'}`}
                                            >
                                                <div className={`w-5 h-5 bg-white rounded-full shadow-lg transition-all ${otpEnabled ? 'translate-x-7' : 'translate-x-0'}`} />
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                {/* Section 2: Global Layout */}
                                <div className="space-y-4">
                                    <h3 className="text-sm font-black text-gray-400 uppercase tracking-[0.2em] px-2 flex items-center gap-3">
                                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> Global Result Layout
                                    </h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="p-5 rounded-3xl border border-gray-100 bg-gray-50 flex items-center justify-between hover:border-emerald-200 transition-colors">
                                            <div>
                                                <p className="font-extrabold text-gray-800 text-sm">Overall Percentage</p>
                                                <p className="text-[10px] font-bold text-gray-400 uppercase">Hide Aggregate Result</p>
                                            </div>
                                            <button
                                                onClick={() => {
                                                    const newConfig = { ...reportCardConfig, showOverallPercentage: !reportCardConfig.showOverallPercentage };
                                                    saveUpdatedSettings(newConfig).then(s => s && setReportCardConfig(newConfig));
                                                }}
                                                className={`w-10 h-5 rounded-full transition-all relative flex items-center px-0.5 shrink-0 shadow-inner ${
                                                    reportCardConfig.showOverallPercentage !== false ? 'bg-emerald-600' : 'bg-slate-300'
                                                }`}
                                            >
                                                <div className={`w-3.5 h-3.5 bg-white rounded-full shadow-sm transition-all ${
                                                    reportCardConfig.showOverallPercentage !== false ? 'translate-x-5' : 'translate-x-0'
                                                }`} />
                                            </button>
                                        </div>

                                        <div className="p-5 rounded-3xl border border-gray-100 bg-gray-50 flex items-center justify-between hover:border-rose-200 transition-colors">
                                            <div>
                                                <p className="font-extrabold text-gray-800 text-sm">Final Result (Pass/Need Imprv)</p>
                                                <p className="text-[10px] font-bold text-gray-400 uppercase">Show/Hide Final Result Label</p>
                                            </div>
                                            <button
                                                onClick={() => {
                                                    const newConfig = { ...reportCardConfig, showFinalResult: !reportCardConfig.showFinalResult };
                                                    saveUpdatedSettings(newConfig).then(s => s && setReportCardConfig(newConfig));
                                                }}
                                                className={`w-10 h-5 rounded-full transition-all relative flex items-center px-0.5 shrink-0 shadow-inner ${
                                                    reportCardConfig.showFinalResult !== false ? 'bg-rose-600' : 'bg-slate-300'
                                                }`}
                                            >
                                                <div className={`w-3.5 h-3.5 bg-white rounded-full shadow-sm transition-all ${
                                                    reportCardConfig.showFinalResult !== false ? 'translate-x-5' : 'translate-x-0'
                                                }`} />
                                            </button>
                                        </div>

                                        <div className="p-5 rounded-3xl border border-gray-100 bg-gray-50 flex items-center justify-between hover:border-teal-200 transition-colors">
                                            <div>
                                                <p className="font-extrabold text-gray-800 text-sm">Performance Graph</p>
                                                <p className="text-[10px] font-bold text-gray-400 uppercase">Interactive Trend View</p>
                                            </div>
                                            <button
                                                onClick={() => {
                                                    const newConfig = { ...reportCardConfig, showTrendGraph: !reportCardConfig.showTrendGraph };
                                                    saveUpdatedSettings(newConfig).then(s => s && setReportCardConfig(newConfig));
                                                }}
                                                className={`w-10 h-5 rounded-full transition-all relative flex items-center px-0.5 shrink-0 shadow-inner ${
                                                    reportCardConfig.showTrendGraph !== false ? 'bg-teal-600' : 'bg-slate-300'
                                                }`}
                                            >
                                                <div className={`w-3.5 h-3.5 bg-white rounded-full shadow-sm transition-all ${
                                                    reportCardConfig.showTrendGraph !== false ? 'translate-x-5' : 'translate-x-0'
                                                }`} />
                                            </button>
                                        </div>

                                        <div className="p-5 rounded-3xl border border-gray-100 bg-gray-50 flex items-center justify-between hover:border-purple-200 transition-colors md:col-span-2">
                                            <div>
                                                <p className="font-extrabold text-gray-800 text-sm">Detailed Subject Records</p>
                                                <p className="text-[10px] font-bold text-gray-400 uppercase">Show/Hide Subject-wise Marks Table</p>
                                            </div>
                                            <button
                                                onClick={() => {
                                                    const newConfig = { ...reportCardConfig, showSubjectPerformance: !reportCardConfig.showSubjectPerformance };
                                                    saveUpdatedSettings(newConfig).then(s => s && setReportCardConfig(newConfig));
                                                }}
                                                className={`w-10 h-5 rounded-full transition-all relative flex items-center px-0.5 shrink-0 shadow-inner ${
                                                    reportCardConfig.showSubjectPerformance !== false ? 'bg-purple-600' : 'bg-slate-300'
                                                }`}
                                            >
                                                <div className={`w-3.5 h-3.5 bg-white rounded-full shadow-sm transition-all ${
                                                    reportCardConfig.showSubjectPerformance !== false ? 'translate-x-5' : 'translate-x-0'
                                                }`} />
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                {/* Section 3: Granular Exam Visibility */}
                                <div className="space-y-6">
                                    <div className="flex items-center justify-between px-2">
                                        <div className="space-y-1">
                                            <h3 className="text-sm font-black text-gray-400 uppercase tracking-[0.2em] flex items-center gap-3">
                                                <div className="w-1.5 h-1.5 rounded-full bg-amber-500" /> Summary Exam Highlighting
                                            </h3>
                                            <p className="text-[10px] font-bold text-slate-400 uppercase italic">Toggle visibility of specific tests in the performance summary row.</p>
                                        </div>
                                        <button 
                                            onClick={async () => {
                                                const allOn = availableExams.every(e => reportCardConfig?.enabledPercentages?.[e]);
                                                const newEnabled = { ...reportCardConfig.enabledPercentages };
                                                availableExams.forEach(e => newEnabled[e] = !allOn);
                                                const newConfig = { ...reportCardConfig, enabledPercentages: newEnabled };
                                                const success = await saveUpdatedSettings(newConfig, otpEnabled);
                                                if (success) {
                                                    setReportCardConfig(newConfig);
                                                    toast.success(`${allOn ? 'Disabled' : 'Enabled'} all available exams`);
                                                }
                                            }}
                                            className="text-[10px] font-black text-slate-400 hover:text-emerald-600 uppercase tracking-widest transition-colors bg-slate-50 px-4 py-2 rounded-xl border border-dashed border-slate-200"
                                        >
                                            {availableExams.every(e => reportCardConfig?.enabledPercentages?.[e]) ? 'Deselect All Results' : 'Select All Results'}
                                        </button>
                                    </div>
                                    
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                        {availableExams.map((exam) => (
                                            <div 
                                                key={exam}
                                                className={`p-4 rounded-2xl border transition-all flex items-center justify-between ${
                                                    reportCardConfig?.enabledPercentages?.[exam] 
                                                    ? 'bg-emerald-50/50 border-emerald-200 shadow-sm' 
                                                    : 'bg-gray-50 border-gray-100 shadow-inner'
                                                }`}
                                            >
                                                <span className="text-xs font-black text-gray-700 truncate pr-4 uppercase">{exam}</span>
                                                <button
                                                    onClick={() => toggleExamVisibility(exam)}
                                                    className={`w-10 h-5 rounded-full transition-all relative flex items-center px-0.5 shrink-0 shadow-inner ${
                                                        reportCardConfig?.enabledPercentages?.[exam] ? 'bg-emerald-600' : 'bg-slate-300'
                                                    }`}
                                                >
                                                    <div className={`w-3.5 h-3.5 bg-white rounded-full shadow-sm transition-all ${
                                                        reportCardConfig?.enabledPercentages?.[exam] ? 'translate-x-5' : 'translate-x-0'
                                                    }`} />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Section 4: Advanced Grouping */}
                                <div className="space-y-4">
                                    <h3 className="text-sm font-black text-gray-400 uppercase tracking-[0.2em] px-2 flex items-center gap-3">
                                        <div className="w-1.5 h-1.5 rounded-full bg-indigo-500" /> Academic Groups (Aggregates)
                                    </h3>
                                    <p className="text-[10px] font-bold text-slate-400 uppercase italic px-2 mb-2">Create groups to show average percentage of multiple tests (e.g. ST-1 Overall)</p>
                                    
                                    <div className="space-y-3">
                                        {(reportCardConfig.examGroups || []).map((group, idx) => (
                                            <div key={idx} className="p-4 bg-indigo-50 border border-indigo-100 rounded-3xl flex items-center justify-between">
                                                <div>
                                                    <p className="font-extrabold text-indigo-900">{group.name}</p>
                                                    <p className="text-[10px] font-bold text-indigo-400 uppercase">{group.exams.length} Exams Included</p>
                                                </div>
                                                <button 
                                                    onClick={() => deleteExamGroup(idx)}
                                                    className="p-2 hover:bg-rose-500 hover:text-white text-rose-500 rounded-xl transition-all"
                                                >
                                                    <X size={16} />
                                                </button>
                                            </div>
                                        ))}

                                        <ExamGroupCreator availableExams={availableExams} onCreated={addExamGroup} />
                                    </div>
                                </div>
                            </div>
                            
                            <div className="p-8 bg-gray-50 border-t border-gray-100 flex justify-between items-center text-xs font-bold text-gray-400">
                                <span>CONFIG STATUS: {savingSettings ? 'SAVING...' : 'UP TO DATE'}</span>
                                <div className="flex items-center gap-2">
                                    <div className={`w-2 h-2 rounded-full ${savingSettings ? 'bg-amber-500 animate-pulse' : 'bg-emerald-500'}`} />
                                    {savingSettings ? 'Cloud Syncing...' : 'Synced to Database'}
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Filters and Search */}
            <div className="bg-white p-5 rounded-3xl border border-gray-100 shadow-xl shadow-gray-100/50 space-y-5">
                <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                    <h3 className="font-bold text-gray-700">Report Database</h3>
                    <div className="relative w-full md:w-96">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        <input
                            type="text"
                            placeholder="Search by name or roll no..."
                            className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-500/10 transition-all text-sm font-medium"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                {/* Table */}
                <div className="overflow-x-auto rounded-2xl border border-gray-50">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50/50">
                                <th className="py-4 px-6 text-[10px] font-black uppercase tracking-widest text-gray-400">Roll No</th>
                                <th className="py-4 px-6 text-[10px] font-black uppercase tracking-widest text-gray-400">Student Name</th>
                                <th className="py-4 px-6 text-[10px] font-black uppercase tracking-widest text-gray-400">Class & Section</th>
                                <th className="py-4 px-6 text-[10px] font-black uppercase tracking-widest text-gray-400 text-right">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr>
                                    <td colSpan="4" className="py-20 text-center">
                                        <Loader2 className="animate-spin mx-auto text-blue-500 mb-2" size={32} />
                                        <p className="text-gray-400 text-sm font-bold">Loading Result Directory...</p>
                                    </td>
                                </tr>
                            ) : filteredStudents.map((student) => (
                                <motion.tr
                                    layout
                                    key={student._id}
                                    className="border-b border-gray-50 hover:bg-blue-50/30 transition-colors group"
                                >
                                    <td className="py-4 px-6 font-black text-gray-400 text-xs">#{student.rollNo}</td>
                                    <td className="py-4 px-6">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-2xl bg-linear-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-sm font-black shadow-md">
                                                {student.name[0]}
                                            </div>
                                            <span className="font-bold text-gray-800 tracking-tight">{student.name}</span>
                                        </div>
                                    </td>
                                    <td className="py-4 px-6 text-gray-500 font-bold text-sm">
                                        {student.className}-{student.section}
                                    </td>
                                    <td className="py-4 px-6 text-right">
                                        <button
                                            onClick={() => openStudentDetail(student)}
                                            className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 text-emerald-600 rounded-xl font-bold text-xs hover:bg-emerald-600 hover:text-white shadow-sm active:scale-95 group transition-all"
                                        >
                                            <Eye size={14} className="group-hover:scale-110 transition-transform" />
                                            View Performance
                                        </button>
                                    </td>
                                </motion.tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {!loading && filteredStudents.length === 0 && (
                    <div className="py-20 text-center space-y-3">
                        <div className="w-20 h-20 bg-gray-50 rounded-3xl flex items-center justify-center mx-auto text-gray-300">
                            <Search size={40} />
                        </div>
                        <p className="text-gray-500 font-bold">No students found matching "{searchTerm}"</p>
                        <button
                            onClick={() => setSearchTerm('')}
                            className="text-blue-600 font-bold text-sm hover:underline"
                        >
                            View all students
                        </button>
                    </div>
                )}
            </div>

            {/* Performance Detail Modal */}
            <AnimatePresence>
                {selectedStudent && (
                    <div className="fixed inset-0 z-100 flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setSelectedStudent(null)}
                            className="absolute inset-0 bg-gray-900/40 backdrop-blur-xl"
                        />
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0, y: 30 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.9, opacity: 0, y: 30 }}
                            className="bg-white rounded-[3rem] w-full max-w-4xl max-h-[90vh] overflow-hidden relative shadow-2xl flex flex-col border border-white/20"
                        >
                            {/* Modal Header */}
                            <div className="p-8 bg-linear-to-r from-blue-600 to-indigo-700 text-white relative">
                                <button
                                    onClick={() => setSelectedStudent(null)}
                                    className="absolute top-6 right-6 p-2 bg-white/10 hover:bg-white/20 rounded-xl transition"
                                >
                                    <X size={20} />
                                </button>
                                <div className="flex items-center gap-6">
                                    <div className="w-20 h-20 rounded-3xl bg-white/20 backdrop-blur-md flex items-center justify-center text-3xl font-black">
                                        {selectedStudent.name[0]}
                                    </div>
                                    <div className="space-y-1">
                                        <h2 className="text-3xl font-black tracking-tight">{selectedStudent.name}</h2>
                                        <div className="flex gap-4 text-white/80 text-sm font-bold">
                                            <span>Roll No: #{selectedStudent.rollNo}</span>
                                            <span>•</span>
                                            <span>Class: {selectedStudent.className}-{selectedStudent.section}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Modal Content */}
                            <div className="flex-1 overflow-y-auto p-8 bg-gray-50/50 custom-scrollbar">
                                {loadingDetail ? (
                                    <div className="py-20 text-center space-y-4">
                                        <Loader2 className="animate-spin text-blue-600 mx-auto" size={48} />
                                        <p className="font-bold text-gray-500">Matching with Attendance DB...</p>
                                    </div>
                                ) : (
                                    <div className="space-y-8">
                                        {/* Top Section: Attendance & Summary */}
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                            {/* Attendance Card */}
                                            <div className="md:col-span-2 bg-white p-6 rounded-4xl border border-gray-100 shadow-sm flex items-center justify-between">
                                                <div className="space-y-4">
                                                    <div>
                                                        <h4 className="text-xs font-black uppercase tracking-widest text-rose-500 mb-1">Live Attendance Summary</h4>
                                                        <p className="text-gray-500 text-sm font-medium">Mapped via Attendance System</p>
                                                    </div>
                                                    <div className="flex gap-4">
                                                        <div className="text-center">
                                                            <p className="text-2xl font-black text-emerald-600">{studentDetail?.attendance?.present || 0}</p>
                                                            <p className="text-[10px] font-bold text-gray-400">PRESENT</p>
                                                        </div>
                                                        <div className="h-8 w-px bg-gray-100 mt-2" />
                                                        <div className="text-center">
                                                            <p className="text-2xl font-black text-rose-600">{studentDetail?.attendance?.absent || 0}</p>
                                                            <p className="text-[10px] font-bold text-gray-400">ABSENT</p>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="relative w-24 h-24 flex items-center justify-center">
                                                    <svg className="w-full h-full -rotate-90">
                                                        <circle cx="48" cy="48" r="40" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-gray-100" />
                                                        <circle
                                                            cx="48" cy="48" r="40" stroke="currentColor" strokeWidth="8" fill="transparent"
                                                            strokeDasharray={251.2}
                                                            strokeDashoffset={251.2 - (251.2 * (studentDetail?.attendance?.total > 0 ? (studentDetail?.attendance.present / studentDetail?.attendance.total) : 0))}
                                                            className="text-emerald-500 transition-all duration-1000"
                                                        />
                                                    </svg>
                                                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                                                        <span className="text-lg font-black text-gray-800">
                                                            {studentDetail?.attendance?.total > 0
                                                                ? ((studentDetail.attendance.present / studentDetail.attendance.total) * 100).toFixed(2)
                                                                : "0.00"}%
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Quick Stats */}
                                            <div className="bg-linear-to-br from-indigo-500 to-purple-600 p-6 rounded-4xl text-white shadow-lg shadow-indigo-100">
                                                <h4 className="text-[10px] font-black uppercase tracking-widest opacity-80 mb-4">Total Exams</h4>
                                                <p className="text-4xl font-black">{studentDetail?.reports?.length || 0}</p>
                                                <p className="text-sm font-bold opacity-80 mt-2">Recorded in Master Sheet</p>
                                            </div>
                                        </div>

                                        {/* Performance History */}
                                        <div className="space-y-4">
                                            <h4 className="font-black text-gray-800 flex items-center gap-2 px-2">
                                                <History className="text-blue-600" size={18} />
                                                Performance Records
                                            </h4>

                                            <div className="space-y-4">
                                                {(!studentDetail?.reports || studentDetail?.reports?.length === 0) ? (
                                                    <div className="bg-white p-12 rounded-4xl border-2 border-dashed border-gray-100 text-center">
                                                        <p className="text-gray-400 font-bold italic">Bache ka koi result record nahi mila.</p>
                                                    </div>
                                                ) : studentDetail?.reports?.map((report, idx) => (
                                                    <motion.div
                                                        initial={{ opacity: 0, x: -20 }}
                                                        animate={{ opacity: 1, x: 0 }}
                                                        transition={{ delay: idx * 0.1 }}
                                                        key={report._id}
                                                        className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow group flex items-center justify-between"
                                                    >
                                                        <div className="flex items-center gap-6">
                                                            <div className="w-12 h-12 rounded-2xl bg-gray-50 flex items-center justify-center text-gray-400 font-black text-lg">
                                                                {idx + 1}
                                                            </div>
                                                            <div className="space-y-1">
                                                                <p className="text-lg font-black text-gray-800">{report.testName}</p>
                                                                <div className="flex gap-4 text-xs font-bold text-gray-400">
                                                                    <span className="flex items-center gap-1"><History size={12} /> {report.testDate || 'N/A'}</span>
                                                                    <span className="bg-blue-50 text-blue-600 px-2 rounded-md">Roll Match: Success</span>
                                                                </div>
                                                            </div>
                                                        </div>

                                                        <div className="flex items-center gap-8">
                                                            <div className="text-right">
                                                                <p className="text-sm font-black text-gray-400 uppercase tracking-widest">Score</p>
                                                                <p className="text-xl font-black text-blue-600">{report.totalMarks}/{report.maxMarks}</p>
                                                            </div>
                                                            <div className="text-right w-20">
                                                                <p className="text-sm font-black text-gray-400 uppercase tracking-widest">Rank</p>
                                                                <p className="text-xl font-black text-gray-800">#{report.rank || '-'}</p>
                                                            </div>
                                                            <button
                                                                onClick={() => setSelectedReport(report)}
                                                                className="p-3 bg-gray-50 group-hover:bg-blue-600 group-hover:text-white rounded-2xl transition-all active:scale-95"
                                                            >
                                                                <Eye size={20} />
                                                            </button>
                                                        </div>
                                                    </motion.div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Detailed Subject Marks Modal (Sub-Modal) */}
            <AnimatePresence>
                {selectedReport && (
                    <div className="fixed inset-0 z-110 flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setSelectedReport(null)}
                            className="absolute inset-0 bg-gray-900/60 backdrop-blur-md"
                        />
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0, y: 30 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.95, opacity: 0, y: 30 }}
                            className="bg-white rounded-[2.5rem] w-full max-w-lg p-8 relative shadow-2xl border border-white/20"
                        >
                            <div className="flex justify-between items-center mb-6">
                                <div className="space-y-1">
                                    <h4 className="text-xl font-black text-gray-800 tracking-tight">{selectedReport.testName}</h4>
                                    <p className="text-gray-500 font-bold text-xs uppercase tracking-widest">Subject Wise Breakdown</p>
                                </div>
                                <button
                                    onClick={() => setSelectedReport(null)}
                                    className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
                                >
                                    <X size={20} className="text-gray-400" />
                                </button>
                            </div>

                            <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
                                {Object.entries(selectedReport.marks).length === 0 ? (
                                    <div className="py-10 text-center text-gray-400 italic font-bold">
                                        No marks breakdown available.
                                    </div>
                                ) : Object.entries(selectedReport.marks).map(([subject, mark], idx) => (
                                    <div
                                        key={idx}
                                        className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl border border-gray-100/50"
                                    >
                                        <span className="font-black text-gray-500 text-sm uppercase tracking-wide">{subject}</span>
                                        <span className="font-black text-blue-600 text-lg">{mark}</span>
                                    </div>
                                ))}
                            </div>

                            <div className="mt-8 pt-6 border-t border-gray-100 flex justify-between items-center">
                                <div>
                                    <p className="text-[10px] font-black tracking-widest text-gray-400 uppercase">Total Obtained</p>
                                    <p className="text-2xl font-black text-gray-800">{selectedReport.totalMarks}</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-[10px] font-black tracking-widest text-emerald-500 uppercase">Percentage</p>
                                    <p className="text-2xl font-black text-emerald-600">{(parseFloat(selectedReport.percentage) || 0).toFixed(2)}%</p>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Smart Sync Modal */}
            <AnimatePresence>
                {isImporting && (
                    <div className="fixed inset-0 z-100 flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => !importing && setIsImporting(false)}
                            className="absolute inset-0 bg-gray-900/60 backdrop-blur-md"
                        />
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0, y: 30 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.95, opacity: 0, y: 30 }}
                            className="bg-white rounded-[2.5rem] w-full max-w-2xl p-10 relative shadow-2xl overflow-hidden border border-white/20"
                        >
                            <div className="relative">
                                <div className="flex justify-between items-center mb-8">
                                    <div className="space-y-1">
                                        <h2 className="text-3xl font-black text-gray-800 tracking-tight">Master Result Sync</h2>
                                        <p className="text-gray-500 font-medium">Upload your single result file to update all tests</p>
                                    </div>
                                    <button
                                        disabled={importing}
                                        onClick={() => setIsImporting(false)}
                                        className="p-3 hover:bg-gray-100 rounded-2xl transition-colors disabled:opacity-50"
                                    >
                                        <X size={24} className="text-gray-400" />
                                    </button>
                                </div>

                                {summary ? (
                                    <motion.div
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="p-8 bg-emerald-50 rounded-4xl border border-emerald-100 text-center space-y-6"
                                    >
                                        <div className="w-20 h-20 bg-emerald-500 rounded-3xl flex items-center justify-center mx-auto text-white shadow-xl shadow-emerald-200">
                                            <CheckCircle2 size={40} />
                                        </div>
                                        <div>
                                            <h3 className="text-2xl font-black text-emerald-900">Sync Success!</h3>
                                            <p className="text-emerald-700 font-medium mt-1">Found and updated records from your Master Sheet</p>
                                        </div>

                                        <div className="grid grid-cols-3 gap-4 pt-2">
                                            <div className="bg-white p-4 rounded-2xl shadow-sm border border-emerald-100 text-center">
                                                <p className="text-[10px] font-black uppercase tracking-widest text-emerald-600 mb-1">New Results</p>
                                                <p className="text-2xl font-black text-emerald-900">{summary.inserted}</p>
                                            </div>
                                            <div className="bg-white p-4 rounded-2xl shadow-sm border border-emerald-100 text-center">
                                                <p className="text-[10px] font-black uppercase tracking-widest text-blue-600 mb-1">Updated</p>
                                                <p className="text-2xl font-black text-blue-900">{summary.updated}</p>
                                            </div>
                                            <div className="bg-white p-4 rounded-2xl shadow-sm border border-emerald-100 text-center">
                                                <p className="text-[10px] font-black uppercase tracking-widest text-amber-600 mb-1">Skipped</p>
                                                <p className="text-2xl font-black text-amber-900">{summary.skipped}</p>
                                            </div>
                                        </div>

                                        {summary.errors && summary.errors.length > 0 && (
                                            <div className="mt-8 space-y-3 text-left">
                                                <div className="flex items-center gap-2 px-2">
                                                    <div className="w-1 h-1 rounded-full bg-amber-500" />
                                                    <h4 className="text-[10px] font-black text-amber-600 uppercase tracking-widest">Error Log / Skipped Details</h4>
                                                </div>
                                                <div className="max-h-48 overflow-y-auto space-y-2 pr-2 custom-scrollbar">
                                                    {summary.errors.map((err, idx) => (
                                                        <div key={idx} className="p-3 bg-amber-50/50 border border-amber-100 rounded-2xl flex items-start gap-3 transition-all hover:bg-amber-100/50">
                                                            <div className="mt-0.5 p-1 bg-amber-200 text-amber-700 rounded-lg">
                                                                <FileSpreadsheet size={12} />
                                                            </div>
                                                            <p className="text-[11px] font-bold text-amber-800 leading-tight">
                                                                {err}
                                                            </p>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}

                                        <button
                                            onClick={() => setSummary(null)}
                                            className="w-full py-4 bg-emerald-600 text-white rounded-2xl font-black shadow-lg shadow-emerald-200 hover:bg-emerald-700 transition-all active:scale-95"
                                        >
                                            Done
                                        </button>
                                    </motion.div>
                                ) : (
                                    <div className="space-y-8">
                                        <div className="relative">
                                            {importing && (
                                                <div className="absolute inset-0 z-10 bg-white/90 backdrop-blur-sm flex flex-col items-center justify-center rounded-4xl p-10 text-center">
                                                    <div className="relative w-32 h-32 mb-6">
                                                        <svg className="w-full h-full -rotate-90">
                                                            <circle cx="64" cy="64" r="58" stroke="currentColor" strokeWidth="10" fill="transparent" className="text-gray-100" />
                                                            <circle
                                                                cx="64" cy="64" r="58" stroke="currentColor" strokeWidth="10" fill="transparent"
                                                                strokeDasharray={364.4}
                                                                strokeDashoffset={364.4 - (364.4 * (progress / 100))}
                                                                className="text-blue-600 transition-all duration-500 ease-out"
                                                                strokeLinecap="round"
                                                            />
                                                        </svg>
                                                        <div className="absolute inset-0 flex items-center justify-center">
                                                            <span className="text-3xl font-black text-gray-800">{progress}%</span>
                                                        </div>
                                                    </div>
                                                    <div className="space-y-2">
                                                        <h4 className="text-xl font-black text-gray-800 tracking-tight">Syncing Master Data...</h4>
                                                        <p className="text-gray-500 font-bold text-sm">
                                                            {processedCount.toLocaleString()} of {totalToProcess.toLocaleString()} rows processed
                                                        </p>
                                                    </div>
                                                    <div className="mt-8 w-full max-w-xs bg-gray-100 h-2 rounded-full overflow-hidden">
                                                        <motion.div
                                                            initial={{ width: 0 }}
                                                            animate={{ width: `${progress}%` }}
                                                            className="h-full bg-linear-to-r from-blue-500 to-indigo-600 shadow-lg shadow-blue-200"
                                                        />
                                                    </div>
                                                </div>
                                            )}

                                            <label className="block p-12 border-4 border-dashed border-gray-100 rounded-4xl text-center space-y-6 bg-gray-50/50 hover:bg-blue-50/50 hover:border-blue-400/30 transition-all cursor-pointer group relative overflow-hidden">
                                                <input
                                                    type="file"
                                                    accept=".xlsx, .xls"
                                                    onChange={handleFileUpload}
                                                    className="hidden"
                                                />
                                                <div className="w-20 h-20 bg-blue-100 rounded-3xl flex items-center justify-center mx-auto text-blue-600 shadow-lg shadow-blue-100 group-hover:scale-110 transition-transform duration-500">
                                                    <Upload size={36} />
                                                </div>
                                                <div className="space-y-2">
                                                    <h4 className="text-xl font-black text-gray-800">Drop Master Result Sheet</h4>
                                                    <p className="text-gray-500 font-medium">Only .xlsx or .xls files supported</p>
                                                </div>
                                            </label>
                                        </div>

                                        <div className="grid grid-cols-2 gap-6 bg-gray-50 p-6 rounded-4xl">
                                            <div className="text-center p-4 bg-white rounded-3xl border border-gray-100">
                                                <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center mx-auto text-emerald-600 mb-2">
                                                    <AlertCircle size={20} />
                                                </div>
                                                <p className="text-xs font-black text-gray-400 uppercase tracking-widest">Auto Match</p>
                                                <p className="text-[10px] font-bold text-gray-500 mt-1">Via Smart RollNo Sync</p>
                                            </div>
                                            <div className="text-center p-4 bg-white rounded-3xl border border-gray-100">
                                                <div className="w-10 h-10 bg-amber-50 rounded-xl flex items-center justify-center mx-auto text-amber-600 mb-2">
                                                    <CheckCircle2 size={20} />
                                                </div>
                                                <p className="text-xs font-black text-gray-400 uppercase tracking-widest">Bulk Import</p>
                                                <p className="text-[10px] font-bold text-gray-500 mt-1">Multi-Test Integration</p>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Helper Components */}
            <AnimatePresence>
                {/* Hidden logic for grouping creator */}
            </AnimatePresence>
        </div>
    );
}

function ExamGroupCreator({ availableExams, onCreated }) {
    const [isOpen, setIsOpen] = useState(false);
    const [name, setName] = useState('');
    const [selected, setSelected] = useState([]);

    const toggleExam = (exam) => {
        if (selected.includes(exam)) setSelected(selected.filter(e => e !== exam));
        else setSelected([...selected, exam]);
    };

    const handleCreate = () => {
        if (!name || selected.length === 0) return toast.error("Please provide name and select exams");
        onCreated(name, selected);
        setName('');
        setSelected([]);
        setIsOpen(false);
    };

    return (
        <div className="space-y-3">
            {!isOpen ? (
                <button 
                    onClick={() => setIsOpen(true)}
                    className="w-full py-4 border-2 border-dashed border-gray-200 text-gray-400 hover:border-emerald-500 hover:text-emerald-500 rounded-3xl font-bold transition-all text-sm flex items-center justify-center gap-2"
                >
                    <Users size={16} /> Create New Aggregate Group
                </button>
            ) : (
                <div className="bg-white p-6 rounded-3xl border border-emerald-100 shadow-xl shadow-emerald-100/50 space-y-4">
                    <div>
                        <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest mb-1 block">Group Identity</label>
                        <input 
                            placeholder="e.g. ST-1 Combined Average"
                            className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-4 focus:ring-emerald-500/10 focus:outline-none font-bold"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                    </div>
                    <div>
                        <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest mb-2 block">Choose Tests to Average</label>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-40 overflow-y-auto pr-2 custom-scrollbar">
                            {availableExams.map(exam => (
                                <button
                                    key={exam}
                                    onClick={() => toggleExam(exam)}
                                    className={`px-4 py-2.5 rounded-xl text-left text-xs font-bold transition-all border ${
                                        selected.includes(exam) 
                                        ? 'bg-emerald-600 text-white border-emerald-600' 
                                        : 'bg-gray-50 text-gray-600 border-gray-100'
                                    }`}
                                >
                                    {exam}
                                </button>
                            ))}
                        </div>
                    </div>
                    <div className="flex gap-2 pt-2">
                        <button 
                            onClick={handleCreate}
                            className="flex-1 py-3 bg-emerald-600 text-white rounded-2xl font-black shadow-lg shadow-emerald-200 active:scale-95 transition-all text-sm"
                        >
                            Confirm Group
                        </button>
                        <button 
                            onClick={() => setIsOpen(false)}
                            className="px-6 py-3 bg-gray-100 text-gray-500 rounded-2xl font-black active:scale-95 transition-all text-sm"
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
