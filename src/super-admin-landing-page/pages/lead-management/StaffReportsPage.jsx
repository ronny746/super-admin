import React, { useState, useEffect } from 'react';
import { Calendar, User, Search, Clock, MessageSquare, CreditCard, Filter, LucideFileDown } from 'lucide-react';
import { getStaff } from '../../api/staffApi';
import { getDailyActivityReport, getDailySummaryReport } from '../../api/leadApi';
import toast from 'react-hot-toast';

import * as XLSX from 'xlsx';

export default function StaffReportsPage() {
    const [viewMode, setViewMode] = useState('individual'); // 'individual' or 'summary'
    const [summaryData, setSummaryData] = useState([]);
    const [staffList, setStaffList] = useState([]);
    const [selectedStaff, setSelectedStaff] = useState("");
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
    const [activities, setActivities] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchStaff = async () => {
            const res = await getStaff();
            if (res.success) {
                setStaffList(res.data);
                if (res.data.length > 0) setSelectedStaff(res.data[0]._id);
            }
        };
        fetchStaff();
    }, []);

    const fetchReport = async () => {
        if (!selectedStaff || !selectedDate) return;
        setLoading(true);
        try {
            const res = await getDailyActivityReport(selectedStaff, selectedDate);
            if (res.success) {
                setActivities(res.data);
                if (res.data.length === 0) toast.success("No activities found for this date.");
            }
        } catch (err) {
            toast.error("Failed to load report");
        } finally {
            setLoading(false);
        }
    };

    const fetchSummary = async () => {
        if (!selectedDate) return;
        setLoading(true);
        try {
            const res = await getDailySummaryReport(selectedDate);
            if (res.success) {
                setSummaryData(res.data);
                if (res.data.length === 0) toast.success("No summary data found for this date.");
            }
        } catch (err) {
            toast.error("Failed to load summary");
        } finally {
            setLoading(false);
        }
    };

    const exportToExcel = () => {
        if (activities.length === 0) {
            toast.error("No data to export");
            return;
        }
        
        const dataToExport = activities.map(act => ({
            "Time": new Date(act.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            "Action": act.action,
            "Description": act.description,
            "Lead Name": act.leadName,
            "Lead Phone": act.leadPhone,
        }));
        
        const ws = XLSX.utils.json_to_sheet(dataToExport);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Activity Report");
        
        const staffName = staffList.find(s => s._id === selectedStaff)?.name || "Staff";
        XLSX.writeFile(wb, `${staffName}_Report_${selectedDate}.xlsx`);
    };

    const exportSummaryToExcel = () => {
        if (summaryData.length === 0) {
            toast.error("No data to export");
            return;
        }
        
        const dataToExport = summaryData.map(s => ({
            "Staff Name": s.staffName,
            "All Time Leads": s.allTimeTotalLeads,
            "Total Leads (Date)": s.totalLeads,
            "Hot": s.totalHot,
            "Warm": s.totalWarm,
            "Cold": s.totalCold,
            "Frozen": s.totalFrozen,
            "Total Follow Up": s.totalFollowUp,
            "Total Registration": s.totalRegistration,
            "Total Admission": s.totalAdmission
        }));
        
        // Add Total Row
        dataToExport.push({
            "Staff Name": "Total",
            "All Time Leads": summaryData.reduce((acc, curr) => acc + curr.allTimeTotalLeads, 0),
            "Total Leads (Date)": summaryData.reduce((acc, curr) => acc + curr.totalLeads, 0),
            "Hot": summaryData.reduce((acc, curr) => acc + curr.totalHot, 0),
            "Warm": summaryData.reduce((acc, curr) => acc + curr.totalWarm, 0),
            "Cold": summaryData.reduce((acc, curr) => acc + curr.totalCold, 0),
            "Frozen": summaryData.reduce((acc, curr) => acc + curr.totalFrozen, 0),
            "Total Follow Up": summaryData.reduce((acc, curr) => acc + curr.totalFollowUp, 0),
            "Total Registration": summaryData.reduce((acc, curr) => acc + curr.totalRegistration, 0),
            "Total Admission": summaryData.reduce((acc, curr) => acc + curr.totalAdmission, 0)
        });
        
        const ws = XLSX.utils.json_to_sheet(dataToExport);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Overall Summary");
        
        XLSX.writeFile(wb, `Overall_Summary_${selectedDate}.xlsx`);
    };

    return (
        <div className="p-6 max-w-7xl mx-auto">
            <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">Staff Activity Report</h1>
                    <p className="text-sm text-gray-500 mt-1">View detailed daily activity logs or overall summaries for staff.</p>
                </div>
                <div className="flex bg-gray-100 p-1 rounded-lg">
                    <button 
                        onClick={() => setViewMode('individual')}
                        className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${viewMode === 'individual' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-600 hover:text-gray-900'}`}
                    >
                        Individual Log
                    </button>
                    <button 
                        onClick={() => setViewMode('summary')}
                        className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${viewMode === 'summary' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-600 hover:text-gray-900'}`}
                    >
                        Overall Summary
                    </button>
                </div>
            </div>

            <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm mb-6">
                <div className="flex flex-col md:flex-row gap-4 items-end">
                    {viewMode === 'individual' && (
                        <div className="flex-1 max-w-sm">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Select Staff Member</label>
                            <div className="relative">
                                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                <select 
                                    className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 bg-gray-50"
                                    value={selectedStaff}
                                    onChange={(e) => setSelectedStaff(e.target.value)}
                                >
                                    <option value="" disabled>Select Staff...</option>
                                    {staffList.map(s => (
                                        <option key={s._id} value={s._id}>{s.name} ({s.role})</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    )}
                    <div className="flex-1 max-w-sm">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Select Date</label>
                        <div className="relative">
                            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <input 
                                type="date" 
                                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 bg-gray-50"
                                value={selectedDate}
                                onChange={(e) => setSelectedDate(e.target.value)}
                            />
                        </div>
                    </div>
                    <button 
                        onClick={viewMode === 'individual' ? fetchReport : fetchSummary}
                        disabled={loading}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-semibold flex items-center gap-2 transition-colors disabled:opacity-70 h-[42px]"
                    >
                        <Search className="w-4 h-4" /> Generate Report
                    </button>
                </div>
            </div>

            {viewMode === 'individual' ? (
                <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
                    <div className="p-4 border-b bg-gray-50 flex justify-between items-center">
                        <h2 className="font-semibold text-gray-700">Activity Logs ({activities.length})</h2>
                        <button 
                            onClick={exportToExcel}
                            disabled={activities.length === 0}
                            className="bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-1.5 rounded-lg text-sm font-medium flex items-center gap-2 transition-colors disabled:opacity-50"
                        >
                            <LucideFileDown className="w-4 h-4" /> Export to Excel
                        </button>
                    </div>
                    
                    {loading ? (
                        <div className="p-12 text-center text-gray-500">Loading data...</div>
                    ) : activities.length === 0 ? (
                        <div className="p-12 text-center text-gray-400 flex flex-col items-center">
                            <Clock className="w-12 h-12 mb-3 opacity-20" />
                            <p>No activity recorded for this staff on this date.</p>
                        </div>
                    ) : (
                        <div className="divide-y">
                            {activities.map((act, idx) => (
                                <div key={idx} className="p-4 hover:bg-blue-50/50 transition-colors flex gap-4">
                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${act.action.includes('Payment') ? 'bg-emerald-100 text-emerald-600' : 'bg-blue-100 text-blue-600'}`}>
                                        {act.action.includes('Payment') ? <CreditCard className="w-4 h-4" /> : <MessageSquare className="w-4 h-4" />}
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex justify-between items-start">
                                            <h4 className="font-bold text-gray-800 text-sm">{act.action}</h4>
                                            <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2 py-0.5 rounded">
                                                {new Date(act.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </span>
                                        </div>
                                        <p className="text-sm text-gray-600 mt-1">{act.description}</p>
                                        <div className="mt-2 text-xs font-medium text-blue-600 bg-blue-50 inline-block px-2 py-1 rounded">
                                            Lead: {act.leadName} ({act.leadPhone})
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            ) : (
                <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
                    <div className="p-4 border-b bg-gray-50 flex justify-between items-center">
                        <h2 className="font-semibold text-gray-700">Overall Summary ({selectedDate})</h2>
                        <button 
                            onClick={exportSummaryToExcel}
                            disabled={summaryData.length === 0}
                            className="bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-1.5 rounded-lg text-sm font-medium flex items-center gap-2 transition-colors disabled:opacity-50"
                        >
                            <LucideFileDown className="w-4 h-4" /> Export to Excel
                        </button>
                    </div>
                    
                    {loading ? (
                        <div className="p-12 text-center text-gray-500">Loading data...</div>
                    ) : summaryData.length === 0 ? (
                        <div className="p-12 text-center text-gray-400 flex flex-col items-center">
                            <Filter className="w-12 h-12 mb-3 opacity-20" />
                            <p>No summary data available for this date.</p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm text-left text-gray-600">
                                <thead className="text-xs text-gray-700 uppercase bg-gray-50 border-b">
                                    <tr>
                                        <th className="px-4 py-3">Staff Name</th>
                                        <th className="px-4 py-3 text-center text-gray-700">All Time Leads</th>
                                        <th className="px-4 py-3 text-center text-blue-600">Total Leads</th>
                                        <th className="px-4 py-3 text-center text-red-600">Hot</th>
                                        <th className="px-4 py-3 text-center text-orange-500">Warm</th>
                                        <th className="px-4 py-3 text-center text-blue-500">Cold</th>
                                        <th className="px-4 py-3 text-center text-red-700">Frozen</th>
                                        <th className="px-4 py-3 text-center text-orange-600">Total Follow Up</th>
                                        <th className="px-4 py-3 text-center text-purple-600">Total Registration</th>
                                        <th className="px-4 py-3 text-center text-emerald-600">Total Admission</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {summaryData.map((s, idx) => (
                                        <tr key={idx} className="bg-white border-b hover:bg-gray-50">
                                            <td className="px-4 py-3 font-medium text-gray-900">{s.staffName}</td>
                                            <td className="px-4 py-3 text-center font-bold text-gray-700 bg-gray-50/50">{s.allTimeTotalLeads}</td>
                                            <td className="px-4 py-3 text-center font-bold text-blue-600 bg-blue-50/30">{s.totalLeads}</td>
                                            <td className="px-4 py-3 text-center font-medium text-red-600 bg-red-50/30">{s.totalHot}</td>
                                            <td className="px-4 py-3 text-center font-medium text-orange-500 bg-orange-50/30">{s.totalWarm}</td>
                                            <td className="px-4 py-3 text-center font-medium text-blue-500 bg-blue-50/30">{s.totalCold}</td>
                                            <td className="px-4 py-3 text-center font-medium text-red-700 bg-red-50/50">{s.totalFrozen}</td>
                                            <td className="px-4 py-3 text-center font-medium text-orange-600">{s.totalFollowUp}</td>
                                            <td className="px-4 py-3 text-center font-medium text-purple-600">{s.totalRegistration}</td>
                                            <td className="px-4 py-3 text-center font-bold text-emerald-600 bg-emerald-50/30">{s.totalAdmission}</td>
                                        </tr>
                                    ))}
                                </tbody>
                                <tfoot className="bg-gray-100 font-bold border-t">
                                    <tr>
                                        <td className="px-4 py-3">Total</td>
                                        <td className="px-4 py-3 text-center text-gray-700">{summaryData.reduce((acc, curr) => acc + curr.allTimeTotalLeads, 0)}</td>
                                        <td className="px-4 py-3 text-center text-blue-600">{summaryData.reduce((acc, curr) => acc + curr.totalLeads, 0)}</td>
                                        <td className="px-4 py-3 text-center text-red-600">{summaryData.reduce((acc, curr) => acc + curr.totalHot, 0)}</td>
                                        <td className="px-4 py-3 text-center text-orange-500">{summaryData.reduce((acc, curr) => acc + curr.totalWarm, 0)}</td>
                                        <td className="px-4 py-3 text-center text-blue-500">{summaryData.reduce((acc, curr) => acc + curr.totalCold, 0)}</td>
                                        <td className="px-4 py-3 text-center text-red-700">{summaryData.reduce((acc, curr) => acc + curr.totalFrozen, 0)}</td>
                                        <td className="px-4 py-3 text-center text-orange-600">{summaryData.reduce((acc, curr) => acc + curr.totalFollowUp, 0)}</td>
                                        <td className="px-4 py-3 text-center text-purple-600">{summaryData.reduce((acc, curr) => acc + curr.totalRegistration, 0)}</td>
                                        <td className="px-4 py-3 text-center text-emerald-600">{summaryData.reduce((acc, curr) => acc + curr.totalAdmission, 0)}</td>
                                    </tr>
                                </tfoot>
                            </table>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
