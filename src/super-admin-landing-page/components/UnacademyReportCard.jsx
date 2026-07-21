import React, { useRef, useMemo } from 'react';
import { 
    Activity, User, Hash, Layers, 
    GraduationCap, CalendarDays, Printer, 
    ShieldCheck, Award, TrendingUp, HelpCircle
} from 'lucide-react';
import { useReactToPrint } from 'react-to-print';
import PerformanceChart from './PerformanceChart';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import seal from "../assets/seal.png";
import companyLogo from "../assets/image.png";

// --------------------------------------------------------------------------
// Helper Utility
// --------------------------------------------------------------------------
function formatDate(dateInput) {
    if (!dateInput) return 'N/A';
    
    // If it's an Excel serial date (e.g., 46074)
    if (typeof dateInput === 'number' || (typeof dateInput === 'string' && /^\d+$/.test(dateInput))) {
        const serial = parseFloat(dateInput);
        if (serial > 40000) { // Safety check to ensure it's likely a date serial
            const date = new Date((serial - 25569) * 86400 * 1000);
            return date.toLocaleDateString('en-GB'); // DD/MM/YYYY
        }
    }
    
    return String(dateInput);
}

function cn(...inputs) {
    return twMerge(clsx(inputs));
}

// --------------------------------------------------------------------------
// Visual Components
// --------------------------------------------------------------------------
const Card = ({ children, className }) => (
    <div className={cn("bg-white/90 backdrop-blur-md rounded-2xl border border-emerald-100 shadow-xl shadow-emerald-100/20 overflow-hidden print:overflow-visible print:shadow-none print:border print:border-slate-200 print:rounded-lg", className)}>
        {children}
    </div>
);

const Badge = ({ children, className, variant = 'primary' }) => {
    const variants = {
        primary: "bg-emerald-100 text-emerald-700 border-emerald-200 print:bg-slate-100 print:text-slate-800 print:border-slate-300",
        success: "bg-emerald-100 text-emerald-700 border-emerald-200 print:bg-slate-100 print:text-slate-800 print:border-slate-300",
        warning: "bg-amber-100 text-amber-700 border-amber-200 print:bg-slate-100 print:text-slate-800 print:border-slate-300",
        outline: "bg-white border-slate-200 text-slate-500 shadow-sm"
    };
    return (
        <span className={cn("px-2.5 py-0.5 rounded-full text-[10px] font-bold border uppercase tracking-wide", variants[variant], className)}>
            {children}
        </span>
    );
};

// --------------------------------------------------------------------------
// Sub-components (Mapping from PTM Report Card)
// --------------------------------------------------------------------------
const StudentHeader = ({ profile }) => (
    <Card className="mb-8 bg-linear-to-r from-emerald-600 to-teal-600 text-white border-none shadow-2xl shadow-emerald-500/20 print:hidden">
        <div className="p-6 md:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-center gap-6">
                <div className="h-24 w-24 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center border-2 border-white/20 shadow-inner">
                    <User className="w-10 h-10 text-white" />
                </div>
                <div>
                    <h2 className="text-3xl font-bold tracking-tight mb-2 uppercase">{profile.name}</h2>
                    <div className="flex flex-wrap gap-x-6 gap-y-2 text-emerald-100 text-sm font-medium">
                        <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 border border-white/10">
                            <Hash className="w-3.5 h-3.5" /> Roll: {profile.rollNo}
                        </span>
                        <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 border border-white/10">
                            <Layers className="w-3.5 h-3.5" /> Class {profile.className}
                        </span>
                        <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 border border-white/10">
                            <GraduationCap className="w-3.5 h-3.5" /> {profile.section}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    </Card>
);

const PrintHeader = ({ profile }) => (
    <div className="hidden print:block mb-6 font-sans">
        <div className="flex items-stretch justify-between bg-slate-700 border border-slate-700 mb-2 overflow-hidden print:bg-slate-700 print:text-white">
            <div className="flex items-center px-4 py-3">
                <h1 className="text-xl font-bold uppercase tracking-wide text-white m-0 p-0 leading-none">
                    Unacademy Foundation School
                </h1>
            </div>
            <div className="bg-white px-4 flex items-center justify-center min-w-[80px] py-1">
                <img src={companyLogo} alt="Logo" className="w-auto h-12 object-contain" />
            </div>
        </div>

        <div className="text-center mb-6">
            <h2 className="text-xl font-black text-slate-800 uppercase tracking-tight">Result Card</h2>
            <p className="text-sm font-semibold text-slate-900 mt-1">Academic Session: 2026-27</p>
        </div>

        <div className="space-y-4 px-1 text-sm text-slate-900">
            <div className="flex items-end gap-6 w-full">
                <div className="flex items-end grow">
                    <span className="shrink-0 font-medium pb-1">Student Name:</span>
                    <div className="grow border-b border-slate-400 ml-3 px-2 pb-1 relative top-0.5">
                        <span className="font-bold text-lg text-slate-900 uppercase">{profile.name}</span>
                    </div>
                </div>
                <div className="flex items-end w-[30%]">
                    <span className="shrink-0 font-medium pb-1">Roll No.:</span>
                    <div className="grow border-b border-slate-400 ml-3 px-2 pb-1 relative top-0.5">
                        <span className="font-bold text-base text-slate-900">{profile.rollNo}</span>
                    </div>
                </div>
            </div>

            <div className="flex items-end gap-6 w-full">
                <div className="flex items-end w-[40%]">
                    <span className="shrink-0 font-medium pb-1">Class:</span>
                    <div className="grow border-b border-slate-400 ml-3 px-2 pb-1 relative top-0.5">
                        <span className="font-bold text-base text-slate-900">{profile.className}</span>
                    </div>
                </div>
                <div className="flex items-end grow">
                    <span className="shrink-0 font-medium pb-1">Batch / Section:</span>
                    <div className="grow border-b border-slate-400 ml-3 px-2 pb-1 relative top-0.5">
                        <span className="font-bold text-base text-slate-900">{profile.section}</span>
                    </div>
                </div>
            </div>
        </div>

        <div className="mt-6 border-b-2 border-slate-800 mb-2"></div>
    </div>
);

const PrintResultSummary = ({ summary, showOverall = true }) => {
    const ResultCard = ({ title, value, highlight }) => (
        <div className={cn(
            "rounded-xl border p-4 flex flex-col justify-between h-full text-center flex-1 min-w-[140px]",
            highlight ? "bg-emerald-50 border-emerald-200" : "bg-white border-slate-200"
        )}>
            <span className={cn("text-[10px] uppercase tracking-wider font-bold mb-1", highlight ? "text-emerald-900" : "text-slate-700")}>{title}</span>
            <span className={cn("text-2xl font-black tracking-tight", highlight ? "text-emerald-800" : "text-black")}>{value}</span>
        </div>
    );

    return (
        <div className="w-full mb-8 break-inside-avoid print:mt-4">
            <h2 className="text-sm font-bold text-emerald-800 uppercase tracking-wider mb-3 flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
                Performance Summary
            </h2>
            <div className="flex flex-wrap gap-3">
                {summary.summaryCards?.map((card, idx) => (
                    <ResultCard key={idx} title={card.title} value={card.value} />
                ))}
                
                {showOverall && (
                    <ResultCard title="Overall %" value={summary.overall} highlight={true} />
                )}

                {summary.showFinalResult !== false && (
                    <div className="flex-1 min-w-[140px]">
                        <div className="rounded-xl border p-4 flex flex-col justify-center items-center h-full bg-slate-900 border-slate-800 text-white min-h-[80px]">
                            <span className="text-[10px] uppercase tracking-wider font-bold mb-1 text-slate-400">Final Result</span>
                            <span className={cn("text-xl font-black tracking-tight", 
                                summary.result === 'PASS' ? "text-emerald-400" : "text-rose-400"
                            )}>{summary.result}</span>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

const SUBJECT_ORDER = ['P', 'C', 'B', 'H', 'E', 'Math', 'SST', 'MAT'];
const SUBJECT_LABELS = { 
    'P': 'Physics', 
    'C': 'Chemistry', 
    'B': 'Biology', 
    'H': 'Hindi', 
    'E': 'English', 
    'Math': 'Mathematics', 
    'SST': 'Social Studies', 
    'MAT': 'Mental Ability' 
};
const MM_KEYS = {
    'P': 'P(MM)',
    'C': 'C(MM)',
    'B': 'B(MM)',
    'H': 'H(MM)',
    'E': 'E(MM)',
    'Math': 'Math(MM)',
    'SST': 'SST(MM)',
    'MAT': 'MAT(MM)'
};

const PrintPerformanceTable = ({ reports, title = "Detailed Performance Record" }) => {
    const activeSubjects = SUBJECT_ORDER.filter(subj => {
        return reports.some(r => {
            const m = r.marks || {};
            return m[subj] !== undefined || m[`${subj}(MM)`] !== undefined;
        });
    });

    return (
        <div className="w-full mb-10 print:mb-6 print:mt-4 font-sans break-inside-avoid">
            <h2 className="text-sm font-bold text-emerald-800 uppercase tracking-wider mb-2 flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
                {title}
            </h2>
            <div className="border border-slate-200 rounded-lg overflow-hidden shadow-sm">
                <table className="w-full text-[10px] border-collapse">
                    <thead>
                        <tr className="bg-emerald-600 text-white font-bold uppercase text-center tracking-wider">
                            <th className="px-3 py-2.5 text-left border-r border-emerald-500/50">Date</th>
                            <th className="px-3 py-2.5 text-left border-r border-emerald-500/50">Test Name</th>
                            {activeSubjects.map(subj => (
                                <th key={subj} className="px-1 py-2.5 border-r border-emerald-500/50">{SUBJECT_LABELS[subj]?.toUpperCase()}</th>
                            ))}
                            <th className="px-3 py-2.5 border-r border-emerald-500/50 bg-emerald-700">Total</th>
                            <th className="px-3 py-2.5 bg-emerald-800 tracking-tighter">Percentage (%)</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {reports.map((report, idx) => (
                            <tr key={idx} className="text-center font-bold text-slate-700 hover:bg-emerald-50/50">
                                <td className="px-3 py-2 text-left border-r border-slate-100 font-bold text-slate-700 whitespace-nowrap text-[9px]">
                                    {formatDate(report.testDate)}
                                </td>
                                <td className="px-3 py-2 text-left border-r border-slate-100 max-w-[150px] leading-tight font-bold text-slate-950">
                                    {report.testName}
                                </td>
                                {activeSubjects.map(subj => {
                                    const m = report.marks || {};
                                    const obt = m[subj];
                                    const max = m[`${subj}(MM)`] || m['MM'] || '';
                                    const hasMark = obt !== undefined && obt !== null && obt !== '-';
                                    
                                    return (
                                        <td key={subj} className="px-1 py-2 border-r border-slate-100 tabular-nums">
                                            {hasMark ? (
                                                <span>
                                                    <span className="text-black">{obt}</span>
                                                    <span className="text-slate-600 text-[9px] font-bold">/{max}</span>
                                                </span>
                                            ) : <span className="text-slate-200">-</span>}
                                        </td>
                                    );
                                })}
                                <td className="px-3 py-2 font-bold bg-slate-50 text-emerald-700 tabular-nums border-r border-slate-100">
                                    {report.totalMarks} <span className="text-slate-700 text-[9px] font-bold">/{report.maxMarks}</span>
                                </td>
                                <td className="px-3 py-2 font-black text-emerald-900 bg-emerald-50/30 tabular-nums">
                                    {report.percentage === 'NA' ? 'NA' : `${report.percentage}%`}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

const TestGroupCard = ({ report, showPercentages = true }) => {
    const activeSubjects = SUBJECT_ORDER.filter(subj => report.marks[subj] !== undefined);
    
    return (
        <Card className="flex flex-col h-full bg-white ring-1 ring-slate-900/5 transition-all duration-300 hover:shadow-2xl hover:shadow-emerald-500/10 hover:-translate-y-1 break-inside-avoid">
            <div className="p-5 border-b border-slate-100 bg-linear-to-r from-slate-50/80 to-white print:bg-none flex items-start justify-between">
                <div className="space-y-2">
                    <div className="flex items-center gap-2">
                        <span className="flex items-center gap-1 text-[11px] text-slate-400 font-medium">
                            <CalendarDays className="w-3 h-3" /> {formatDate(report.testDate)}
                        </span>
                    </div>
                    <h3 className="text-lg font-bold text-slate-800 leading-tight">
                        {report.testName}
                    </h3>
                </div>
                <div className="text-right">
                    {showPercentages && (
                        <div className={cn(
                            "text-2xl font-black tracking-tight",
                            report.percentage >= 75 ? "text-emerald-500" :
                            report.percentage >= 50 ? "text-amber-500" : "text-rose-500"
                        )}>
                            {report.percentage === 'NA' ? 'NA' : `${report.percentage}%`}
                        </div>
                    )}
                </div>
            </div>

            <div className="p-0 grow">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-slate-50 text-slate-500 font-semibold text-[11px] uppercase tracking-wider border-b border-slate-100">
                            <tr>
                                <th className="py-2.5 px-6">Subject</th>
                                <th className="py-2.5 px-6 text-right">Marks / MM</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {activeSubjects.map((subj, idx) => (
                                <tr key={idx} className="hover:bg-slate-50/50">
                                    <td className="py-3 px-6 text-slate-700 font-medium flex items-center gap-3">
                                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500/50"></div>
                                        {SUBJECT_LABELS[subj] || subj}
                                    </td>
                                    <td className="py-3 px-6 text-right tabular-nums font-bold text-slate-700">
                                        {report.marks[subj]} <span className="text-slate-400 text-xs font-medium">/ {report.marks[`${subj}(MM)`] || report.marks['MM'] || ''}</span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <div className="p-4 bg-slate-50/50 border-t border-slate-100 flex justify-between items-center text-sm">
                <span className="font-bold text-slate-500 text-[10px] uppercase tracking-wider">Total</span>
                <div className="flex items-center gap-1 bg-white px-2.5 py-1 rounded-md border border-slate-200 shadow-sm">
                    <span className="font-bold text-slate-800 tabular-nums">{report.totalMarks}</span>
                    <span className="text-slate-400 text-xs">/ {report.maxMarks}</span>
                </div>
            </div>
        </Card>
    );
};

const PrintDeclaration = ({ summary }) => {
    let performanceStatus = "Satisfactory progress";
    let remarks = "Needs improvement through regular practice and focused effort.";
    const overallVal = parseFloat(summary.overall) || 0;

    if (overallVal < 33) {
        performanceStatus = "Needs improvement";
        remarks = "Performance is below expectations and needs significant improvement.";
    } else if (overallVal < 60) {
        performanceStatus = "Needs improvement";
        remarks = "Needs improvement through regular practice and focused effort.";
    } else if (overallVal < 75) {
        performanceStatus = "Satisfactory progress";
        remarks = "Has shown satisfactory progress and can perform better with consistency.";
    } else if (overallVal < 90) {
        performanceStatus = "Consistent and commendable";
        remarks = "Has demonstrated very good understanding and consistent performance.";
    } else {
        performanceStatus = "Outstanding Achievement";
        remarks = "Has shown excellent academic performance and commendable consistency.";
    }

    return (
        <div className="w-full mt-4 pt-4 break-inside-avoid font-sans">
            <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 mb-4">
                <h3 className="text-sm font-bold text-emerald-800 uppercase tracking-wider mb-2 border-b border-slate-200 pb-2">
                    Remarks & Final Status
                </h3>
                <div className="space-y-3">
                    <div className="flex items-baseline">
                        <span className="w-32 text-xs font-bold text-slate-500 uppercase tracking-wider shrink-0">Performance:</span>
                        <span className="text-sm font-bold text-black border-b border-slate-300 border-dashed grow pb-0.5">{performanceStatus}</span>
                    </div>
                    <div className="flex items-baseline">
                        <span className="w-32 text-xs font-bold text-slate-500 uppercase tracking-wider shrink-0">Remarks:</span>
                        <span className="text-sm font-bold text-black border-b border-slate-300 border-dashed grow pb-0.5">{remarks}</span>
                    </div>
                </div>
            </div>

            <div className="flex justify-end pt-2 pr-12 pb-4">
                <div className="w-24 h-24 flex items-center justify-center relative overflow-hidden">
                    <img src={seal} alt="Official Seal" className="w-full h-full object-contain" />
                </div>
            </div>
        </div>
    );
};

// --------------------------------------------------------------------------
// Main Component
// --------------------------------------------------------------------------
export default function UnacademyReportCard({ student, reports, config = { enabledPercentages: {} } }) {
    const printRef = useRef();
    const handlePrint = useReactToPrint({
        contentRef: printRef,
        documentTitle: `Official_Result_${student.rollNo}`,
    });

    const { sortedReports, summary, graphs, subjectPerformance } = useMemo(() => {
        // Enforce proper calculation of totalMarks and maxMarks for each report
        const processed = reports.map(r => {
            let total = 0;
            let maxTotal = 0;
            let hasValidSubjectMarks = false;
            let allNA = false;
            const marksObj = r.marks || {};
            
            const validSubjectKeys = Object.keys(marksObj).filter(key => SUBJECT_LABELS[key]);
            
            if (validSubjectKeys.length > 0) {
                const isMarkPresent = (m) => {
                    if (m === undefined || m === null || m === '' || m === '-') return false;
                    if (m.toString().toUpperCase() === 'NA') return false;
                    return true;
                };

                allNA = validSubjectKeys.every(k => !isMarkPresent(marksObj[k]));
                
                validSubjectKeys.forEach(key => {
                    const mark = marksObj[key];
                    const mm = marksObj[MM_KEYS[key]] || marksObj[`${key}(MM)`] || marksObj['MM'];
                    
                    if (isMarkPresent(mark)) {
                        const val = parseFloat(mark);
                        if (!isNaN(val)) {
                            total += val;
                            hasValidSubjectMarks = true;
                            
                            const mmVal = parseFloat(mm);
                            if (!isNaN(mmVal)) {
                                maxTotal += mmVal;
                            }
                        }
                    }
                });
            }

            // In case totalMarks/maxMarks were provided but subjects weren't
            const finalMax = (hasValidSubjectMarks && maxTotal > 0) ? maxTotal : (allNA ? 'NA' : (r.maxMarks || 0));
            const finalTotal = (hasValidSubjectMarks) ? total : (allNA ? 'NA' : (r.totalMarks || 0));
            
            let finalPct = '0.00';
            if (hasValidSubjectMarks && maxTotal > 0) {
                finalPct = ((total / maxTotal) * 100).toFixed(2);
            } else if (allNA) {
                finalPct = 'NA';
            } else {
                const sheetPct = r.percentage || (r.marks && Object.keys(r.marks).find(k => k.startsWith('%')));
                finalPct = sheetPct ? parseFloat(sheetPct.toString().replace('%', '')).toFixed(2) : '0.00';
            }

            return {
                ...r,
                totalMarks: finalTotal,
                maxMarks: finalMax,
                percentage: finalPct
            };
        });

        const sorted = [...processed].sort((a, b) => new Date(a.testDate || 0) - new Date(b.testDate || 0));

        const groupCards = (config.examGroups || []).map(group => {
            const groupExams = sorted.filter(r => group.exams.includes(r.testName));
            if (groupExams.length === 0) return null;
            
            const totalObt = groupExams.reduce((acc, r) => acc + (typeof r.totalMarks === 'number' ? r.totalMarks : 0), 0);
            const totalMax = groupExams.reduce((acc, r) => acc + (typeof r.maxMarks === 'number' ? r.maxMarks : 0), 0);
            
            const avg = totalMax > 0 ? (totalObt / totalMax) * 100 : 0;
            return {
                title: group.name,
                value: `${avg.toFixed(2)}%`,
                isGroup: true
            };
        }).filter(Boolean);

        const availableSummaryExams = sorted.filter(r => config.enabledPercentages?.[r.testName] === true);
        const summaryCards = [
            ...groupCards,
            ...availableSummaryExams.map(r => ({
                title: r.testName,
                value: r.percentage === 'NA' ? 'NA' : `${r.percentage}%`
            }))
        ];

        const totalObtAll = sorted.reduce((acc, r) => acc + (typeof r.totalMarks === 'number' ? r.totalMarks : 0), 0);
        const totalMaxAll = sorted.reduce((acc, r) => acc + (typeof r.maxMarks === 'number' ? r.maxMarks : 0), 0);
        const overall = totalMaxAll > 0 ? ((totalObtAll / totalMaxAll) * 100).toFixed(2) : '0.00';

        const summaryObj = {
            summaryCards,
            overall: `${overall}%`,
            result: Number(overall) >= 33 ? 'PASS' : 'NEED IMPROVEMENT',
            showFinalResult: config.showFinalResult !== false
        };

        const majorTypes = ['half yearly', 're-half yearly', 'annual', 'pre board'];
        const isMajor = (r) => majorTypes.some(t => r.testName.toLowerCase().includes(t));

        const majorTrend = sorted
            .filter(isMajor)
            .map(r => ({ testName: r.testName, percentage: r.percentage, date: r.testDate }));

        const st_otTrend = sorted
            .filter(r => !isMajor(r))
            .map(r => ({ testName: r.testName.split('-')[0].trim(), percentage: r.percentage, date: r.testDate }));

        const catStats = { 'ST/OT': {}, 'Major Exams': {} };

        sorted.forEach(r => {
            const cat = isMajor(r) ? 'Major Exams' : 'ST/OT';
            const marksObj = r.marks || {};
            Object.keys(SUBJECT_LABELS).forEach(key => {
                const obt = marksObj[key];
                const mm = marksObj[`${key}(MM)`] || marksObj['MM'];
                if (typeof obt === 'number' && typeof mm === 'number' && mm > 0) {
                    if (!catStats[cat][key]) catStats[cat][key] = { obt: 0, mm: 0 };
                    catStats[cat][key].obt += obt;
                    catStats[cat][key].mm += mm;
                } else if (typeof obt === 'string' && !isNaN(parseFloat(obt))) {
                    if (!catStats[cat][key]) catStats[cat][key] = { obt: 0, mm: 0 };
                    catStats[cat][key].obt += parseFloat(obt);
                    catStats[cat][key].mm += parseFloat(mm || 0);
                }
            });
        });

        const subPerf = {};
        Object.keys(catStats).forEach(cat => {
            const list = Object.keys(catStats[cat]).map(key => ({
                subject: SUBJECT_LABELS[key] || key,
                percentage: parseFloat(((catStats[cat][key].obt / catStats[cat][key].mm) * 100).toFixed(1))
            }));
            if (list.length > 0) subPerf[cat] = list;
        });

        return { 
            sortedReports: sorted, 
            summary: summaryObj, 
            graphs: { major: majorTrend, st_ot: st_otTrend },
            subjectPerformance: subPerf
        };
    }, [reports]);

    return (
        <div className="bg-slate-50/50 min-h-screen py-16 px-4 font-outfit">
            <div className="max-w-[1000px] mx-auto mb-10 flex flex-col md:flex-row md:items-center justify-between gap-6 print:hidden">
                <div className="flex items-center gap-5">
                    <div className="p-4 bg-emerald-600 text-white rounded-2xl shadow-xl">
                        <Award size={32} />
                    </div>
                    <div>
                        <h1 className="text-3xl font-black text-slate-800 tracking-tight">Public Result Portal</h1>
                        <p className="text-slate-500 font-bold uppercase text-[10px] tracking-widest mt-1">Official Institutional Records</p>
                    </div>
                </div>
                <button 
                    onClick={handlePrint}
                    className="flex items-center gap-3 bg-slate-900 hover:bg-black text-white px-10 py-4 rounded-full font-black shadow-2xl transition-all active:scale-95 group"
                >
                    <Printer size={20} /> Download Official PDF
                </button>
            </div>

            <div 
                ref={printRef}
                className="w-full max-w-[1000px] mx-auto bg-white shadow-2xl p-8 md:p-16 rounded-[3rem] print:shadow-none print:p-4 print:rounded-none print:max-w-none"
            >
                <PrintHeader profile={student} />
                <StudentHeader profile={student} />
                
                <PrintResultSummary summary={summary} showOverall={config.showOverallPercentage !== false} />
                
                {config.showSubjectPerformance !== false && (
                    /PRIME Elevate 1|PRIME Adapt 1|PRIME Beginner 1/i.test(student.section || "") ? (
                        <>
                            {sortedReports.filter(r => r.testName.toLowerCase().includes('ioqm')).length > 0 && (
                                <PrintPerformanceTable 
                                    reports={sortedReports.filter(r => r.testName.toLowerCase().includes('ioqm'))} 
                                    title="Detailed Performance Record - IOQM" 
                                />
                            )}
                            {sortedReports.filter(r => r.testName.toLowerCase().includes('nsejs')).length > 0 && (
                                <PrintPerformanceTable 
                                    reports={sortedReports.filter(r => r.testName.toLowerCase().includes('nsejs'))} 
                                    title="Detailed Performance Record - NSEJS" 
                                />
                            )}
                            {sortedReports.filter(r => !r.testName.toLowerCase().includes('ioqm') && !r.testName.toLowerCase().includes('nsejs')).length > 0 && (
                                <PrintPerformanceTable 
                                    reports={sortedReports.filter(r => !r.testName.toLowerCase().includes('ioqm') && !r.testName.toLowerCase().includes('nsejs'))} 
                                    title="Detailed Performance Record - Other Tests" 
                                />
                            )}
                        </>
                    ) : (
                        <PrintPerformanceTable reports={sortedReports} />
                    )
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-20 w-full print:hidden">
                    {sortedReports.map((report, idx) => (
                        <TestGroupCard 
                            key={idx} 
                            report={report} 
                            showPercentages={true}
                        />
                    ))}
                </div>

                {config.showTrendGraph !== false && (
                    <div className="space-y-8 print:mt-0" style={{ breakBefore: 'page' }}>
                        <div className="mb-4 flex items-center gap-3 text-slate-500">
                            <div className="p-2 bg-emerald-50 rounded-lg">
                                <Activity className="w-5 h-5 text-emerald-600" />
                            </div>
                            <span className="text-sm font-bold uppercase tracking-wider text-slate-700">Performance Trend</span>
                            <div className="h-px bg-slate-100 grow ml-4"></div>
                        </div>

                        <div className="grid grid-cols-1 gap-8 break-inside-avoid">
                            {graphs.st_ot.length > 0 && (
                                <Card className="p-6">
                                    <h3 className="text-xs font-black uppercase tracking-widest text-emerald-800 mb-4 flex items-center gap-2">
                                        <div className="w-2 h-2 rounded-full bg-emerald-500" /> ST / OT Performance Trend
                                    </h3>
                                    <div className="h-[200px] w-full">
                                        <PerformanceChart data={graphs.st_ot} color="#10b981" chartType="bar" />
                                    </div>
                                </Card>
                            )}
                            {graphs.major.length > 0 && (
                                <Card className="p-6">
                                    <h3 className="text-xs font-black uppercase tracking-widest text-teal-800 mb-4 flex items-center gap-2">
                                        <div className="w-2 h-2 rounded-full bg-teal-500" /> Major Exams Trend
                                    </h3>
                                    <div className="h-[200px] w-full">
                                        <PerformanceChart data={graphs.major} color="#14b8a6" chartType="bar" />
                                    </div>
                                </Card>
                            )}
                        </div>
                    </div>
                )}

                <PrintDeclaration summary={summary} />
            </div>
        </div>
    );
}
