import React, { useState, useMemo, useEffect, useRef } from 'react';
import {
    ChevronLeft,
    ChevronRight,
    Calendar,
    UserCheck,
    UserX,
    Clock,
    Search,
    Download,
    Filter,
    X,
    MoreHorizontal,
    Briefcase,
    CheckCircle2,
    ListFilter,
    FileDown,
    Loader2,
    AlertTriangle,
    Mail,
    Phone,
    User,
    Fingerprint,
    Settings
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Papa from 'papaparse';
import axios from 'axios';
import { useAppContext } from '../context/AppContext';
import toast from 'react-hot-toast';

const STATUS_TYPES = {
    PRESENT: { code: 'P', color: 'bg-emerald-100 text-emerald-700 border-emerald-200', label: 'Present' },
    ABSENT: { code: 'A', color: 'bg-rose-100 text-rose-700 border-rose-200', label: 'Absent' },
    LATE: { code: 'L', color: 'bg-amber-100 text-amber-700 border-amber-200', label: 'Late' },
    LEAVE: { code: 'LV', color: 'bg-blue-100 text-blue-700 border-blue-200', label: 'Leave' },
    HOLIDAY: { code: 'H', color: 'bg-gray-100 text-gray-500 border-gray-200', label: 'Holiday' },
    NONE: { code: '-', color: 'bg-gray-50 text-gray-400 border-gray-100', label: 'Not Marked' },
};

const VIEW_OPTIONS = [
    { id: 'week', label: 'Current Week', days: 7 },
    { id: '2week', label: '2 Weeks', days: 14 },
    { id: 'month', label: 'Full Month', days: 31 },
];

// Determine API Base URL
const API_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';

export default function AttendanceDashboard() {
    const { user } = useAppContext();
    const [currentDate, setCurrentDate] = useState(new Date());
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedDay, setSelectedDay] = useState(null);
    const [showCloseModal, setShowCloseModal] = useState(false);
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [viewMode, setViewMode] = useState('month');
    const [loading, setLoading] = useState(false);
    const [students, setStudents] = useState([]);

    // Extracted years for picker
    const [viewingStatus, setViewingStatus] = useState(null);
    const [pickerYear, setPickerYear] = useState(new Date().getFullYear());
    const [markingAbsent, setMarkingAbsent] = useState(false);
    const [hoveredStudent, setHoveredStudent] = useState(null); // { student, rect }
    const [showSettings, setShowSettings] = useState(false);
    const [punchGapLimit, setPunchGapLimit] = useState(60);
    const [updatingSettings, setUpdatingSettings] = useState(false);

    // Pagination
    const [page, setPage] = useState(1);
    const perPage = 20;

    // Date Helpers
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const monthName = currentDate.toLocaleString('default', { month: 'long' });

    // Ensure pickerYear updates if external navigation happens
    useEffect(() => {
        setPickerYear(year);
    }, [year]);

    // Initialize Data
    const [attendanceData, setAttendanceData] = useState({});
    const [holidays, setHolidays] = useState({});

    // Fetch Attendance Data
    useEffect(() => {
        setPage(1);
        fetchAttendance();
        fetchInstituteSettings();
    }, [currentDate, user]);

    const fetchInstituteSettings = async () => {
        if (!user?.instituteId) return;
        try {
            const token = localStorage.getItem('authToken');
            const res = await axios.get(`${API_URL}/institutes/${user.instituteId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (res.data.success && res.data.institute) {
                setPunchGapLimit(res.data.institute.punchGapLimit || 60);
            }
        } catch (error) {
            console.error("Error fetching institute settings:", error);
        }
    };

    const handleUpdateSettings = async () => {
        if (!user?.instituteId) return;
        setUpdatingSettings(true);
        try {
            const token = localStorage.getItem('authToken');
            const res = await axios.patch(`${API_URL}/institutes/${user.instituteId}/settings`, 
                { punchGapLimit: parseInt(punchGapLimit) },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            if (res.data.success) {
                toast.success("Check-in gap updated successfully!");
                setShowSettings(false);
            }
        } catch (error) {
            console.error("Error updating settings:", error);
            toast.error("Failed to update settings");
        } finally {
            setUpdatingSettings(false);
        }
    };

    const fetchAttendance = async () => {
        if (!user?.instituteId) return;
        setLoading(true);
        try {
            const token = localStorage.getItem('authToken');
            // Pass month + 1 because backend expects 1-12
            // Using relative path assuming proxy or direct URL
            const res = await axios.get(`${API_URL}/attendance/institute/${user.instituteId}/monthly`, {
                params: { month: month + 1, year },
                headers: { Authorization: `Bearer ${token}` }
            });

            if (res.data.success) {
                setStudents(res.data.data);

                // Extract and map attendance data
                const attData = {};
                res.data.data.forEach(std => {
                    attData[std.id] = std.attendance || {};
                });
                setAttendanceData(attData);

                // Auto-mark Sundays
                const tempHolidays = {};
                for (let day = 1; day <= daysInMonth; day++) {
                    const date = new Date(year, month, day);
                    if (date.getDay() === 0) tempHolidays[day] = true;
                }
                setHolidays(tempHolidays);
            }
        } catch (error) {
            console.error("Error fetching attendance:", error);
            toast.error("Failed to load attendance data");
        } finally {
            setLoading(false);
        }
    };


    // Determine the range of days to display
    const displayedDays = useMemo(() => {
        const today = new Date().getDate();
        const currentMonth = new Date().getMonth();

        let startDay = 1;
        let endDay = daysInMonth;

        if (viewMode === 'week') {
            if (month === currentMonth) {
                startDay = Math.max(1, today - 3);
                endDay = Math.min(daysInMonth, startDay + 6);
                if (endDay - startDay < 6) startDay = Math.max(1, endDay - 6);
            } else {
                startDay = 1;
                endDay = 7;
            }
        } else if (viewMode === '2week') {
            if (month === currentMonth) {
                startDay = Math.max(1, today - 7);
                endDay = Math.min(daysInMonth, startDay + 13);
                if (endDay - startDay < 13) startDay = Math.max(1, endDay - 13);
            } else {
                startDay = 1;
                endDay = 14;
            }
        }
        return Array.from({ length: endDay - startDay + 1 }, (_, i) => startDay + i);
    }, [viewMode, daysInMonth, month]);


    const handlePrev = () => setCurrentDate(new Date(year, month - 1, 1));
    const handleNext = () => setCurrentDate(new Date(year, month + 1, 1));

    // Toggle Status (Optimistic Update)
    const toggleStatus = async (studentId, day) => {
        // Disabled: Admin cannot mark attendance manually
    };

    const toggleHoliday = (day) => {
        const isHolidayNow = !holidays[day];
        setHolidays(prev => ({ ...prev, [day]: isHolidayNow }));

        setAttendanceData(prev => {
            const newData = { ...prev };
            students.forEach(std => {
                if (!newData[std.id]) newData[std.id] = {};
                newData[std.id][day] = { ...newData[std.id]?.[day], status: isHolidayNow ? 'HOLIDAY' : 'NONE' };
            });
            return newData;
        });
    };

    const getDayStats = (day) => {
        let stats = { PRESENT: 0, ABSENT: 0, LATE: 0, LEAVE: 0, NONE: 0, HOLIDAY: 0 };
        Object.values(attendanceData).forEach(record => {
            const status = record[day]?.status || 'NONE';
            if (stats[status] !== undefined) stats[status]++;
        });
        return stats;
    };

    const handleExportCSV = () => {
        const headers = ['Student Name', 'Roll No'];
        const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);

        days.forEach(day => {
            headers.push(`${day} ${new Date(year, month, day).toLocaleDateString('en-US', { month: 'short' })}`);
        });

        headers.push('Total Present', 'Total Absent', 'Total Late', 'Total Leave');

        const rows = filteredStudents.map(student => {
            const rowData = [student.name, student.rollNo];
            let present = 0, absent = 0, late = 0, leave = 0;

            days.forEach(day => {
                const statusKey = attendanceData[student.id]?.[day]?.status || 'NONE';
                const isHoliday = holidays[day];

                if (isHoliday) {
                    rowData.push('HOLIDAY');
                } else {
                    const label = STATUS_TYPES[statusKey]?.label || 'Not Marked';
                    rowData.push(label);

                    if (statusKey === 'PRESENT') present++;
                    if (statusKey === 'ABSENT') absent++;
                    if (statusKey === 'LATE') late++;
                    if (statusKey === 'LEAVE') leave++;
                }
            });

            rowData.push(present, absent, late, leave);
            return rowData;
        });

        const csvData = [headers, ...rows];
        const csvString = Papa.unparse(csvData);
        const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `Attendance_Report_${monthName}_${year}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const filteredStudents = (students || []).filter(s =>
        (s?.name?.toLowerCase()?.includes(searchTerm.toLowerCase())) ||
        (s?.rollNo?.includes(searchTerm))
    );

    useEffect(() => {
        setPage(1);
    }, [searchTerm]);

    const paginatedStudents = filteredStudents.slice((page - 1) * perPage, page * perPage);

    const handleCloseAttendanceClick = () => {
        setShowCloseModal(true);
    };

    const confirmCloseAttendance = async (dateStr) => {
        setShowCloseModal(false);
        setMarkingAbsent(true);
        try {
            const token = localStorage.getItem('authToken');
            const res = await axios.post(`${API_URL}/attendance/attendance-close`,
                { date: dateStr },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            if (res.data.success) {
                toast.success(`Done! ${res.data.absenteesMarked} students marked Absent & SMS queued.`);
                fetchAttendance();
            }
        } catch (error) {
            console.error(error);
            toast.error("Failed to mark absentees.");
        } finally {
            setMarkingAbsent(false);
        }
    };
            {/* Close Attendance Confirmation Modal */}
                {showCloseModal && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50"
                            onClick={() => setShowCloseModal(false)}
                        />
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.95, opacity: 0, y: 20 }}
                            transition={{ type: "spring", duration: 0.3 }}
                            className="fixed inset-0 m-auto w-full max-w-sm h-fit bg-white rounded-2xl shadow-2xl z-50 overflow-hidden"
                        >
                            <div className="p-6 text-center">
                                <div className="w-16 h-16 bg-rose-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <AlertTriangle size={32} className="text-rose-600" />
                                </div>

                                <h2 className="text-xl font-bold text-gray-800 mb-2">Close Attendance?</h2>
                                <p className="text-gray-500 text-sm mb-6">
                                    Are you sure you want to mark all remaining students as <span className="font-bold text-rose-600">ABSENT</span> for today?
                                    <br /><br />
                                    <span className="text-xs bg-rose-50 text-rose-800 px-2 py-1 rounded border border-rose-100">
                                        This action cannot be undone automatically.
                                    </span>
                                </p>

                                <div className="flex justify-center gap-3">
                                    <button
                                        onClick={() => setShowCloseModal(false)}
                                        className="px-5 py-2.5 bg-white border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 font-medium transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={() => confirmCloseAttendance(new Date().toISOString().split('T')[0])}
                                        className="px-5 py-2.5 bg-rose-600 text-white rounded-xl hover:bg-rose-700 shadow-lg shadow-rose-200 font-medium transition-transform active:scale-95"
                                    >
                                        Yes, Close It
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </>
                )}

                {/* Punch Gap Settings Modal */}
                {showSettings && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50"
                            onClick={() => setShowSettings(false)}
                        />
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.95, opacity: 0, y: 20 }}
                            transition={{ type: "spring", duration: 0.3 }}
                            className="fixed inset-0 m-auto w-full max-w-sm h-fit bg-white rounded-2xl shadow-2xl z-50 overflow-hidden"
                        >
                            <div className="p-6">
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="p-3 bg-indigo-100 rounded-xl text-indigo-600">
                                        <Clock size={24} />
                                    </div>
                                    <div>
                                        <h2 className="text-xl font-bold text-gray-800">Check-in Gap</h2>
                                        <p className="text-xs text-gray-500">Wait time between punches</p>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">Gap Duration (Minutes)</label>
                                        <div className="relative">
                                            <input
                                                type="number"
                                                value={punchGapLimit}
                                                onChange={(e) => setPunchGapLimit(e.target.value)}
                                                className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-100 rounded-xl focus:border-indigo-500 transition-all outline-none font-bold text-lg"
                                                placeholder="60"
                                            />
                                            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 font-medium">mins</span>
                                        </div>
                                        <p className="mt-2 text-[10px] text-gray-500 leading-relaxed">
                                            Students will have to wait this long before they can punch <span className="font-bold">OUT</span> after punching <span className="font-bold">IN</span>.
                                        </p>
                                    </div>

                                    <div className="flex gap-3 pt-2">
                                        <button
                                            onClick={() => setShowSettings(false)}
                                            className="flex-1 px-4 py-3 bg-gray-50 text-gray-600 rounded-xl hover:bg-gray-100 font-bold transition-colors"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            onClick={handleUpdateSettings}
                                            disabled={updatingSettings}
                                            className="flex-1 px-4 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 shadow-lg shadow-indigo-100 font-bold transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                                        >
                                            {updatingSettings ? <Loader2 size={18} className="animate-spin" /> : "Save Changes"}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </>
                )}

    return (
        <div className="space-y-6 animate-in fade-in zoom-in duration-300 relative pb-20">

            {/* Day Details Modal */}
            <AnimatePresence>
                {/* Close Attendance Confirmation Modal */}

                {/* Day Details Modal (Existing) */}
                {selectedDay && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
                            onClick={() => { setSelectedDay(null); setViewingStatus(null); }}
                        />
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.95, opacity: 0, y: 20 }}
                            transition={{ type: "spring", duration: 0.3 }}
                            className="fixed inset-0 m-auto w-full max-w-md h-fit bg-white rounded-2xl shadow-2xl z-50 overflow-hidden"
                        >
                            <div className="p-6">
                                <div className="flex justify-between items-start mb-6">
                                    <div>
                                        <h2 className="text-2xl font-bold text-gray-800">
                                            {new Date(year, month, selectedDay).toLocaleDateString('en-US', { day: 'numeric', month: 'long' })}
                                        </h2>
                                        <p className="text-gray-500 font-medium">
                                            {new Date(year, month, selectedDay).toLocaleDateString('en-US', { weekday: 'long' })}
                                        </p>
                                    </div>
                                    <button
                                        onClick={() => { setSelectedDay(null); setViewingStatus(null); }}
                                        className="p-2 bg-gray-100 hover:bg-gray-200 rounded-full transition-colors"
                                    >
                                        <X size={20} className="text-gray-600" />
                                    </button>
                                </div>

                                {/* Holiday & Absent Toggle Row */}
                                <div className="grid grid-cols-2 gap-4 mb-6">
                                    {/* Holiday Toggle Card */}
                                    <div
                                        className={`
                                            p-4 rounded-xl border-2 transition-all cursor-pointer flex flex-col gap-2 select-none
                                            ${holidays[selectedDay]
                                                ? 'border-indigo-500 bg-indigo-50'
                                                : 'border-gray-100 hover:border-indigo-200 bg-white shadow-sm'}
                                        `}
                                        onClick={() => toggleHoliday(selectedDay)}
                                    >
                                        <div className="flex items-center justify-between">
                                            <div className={`p-2 rounded-lg ${holidays[selectedDay] ? 'bg-indigo-100 text-indigo-600' : 'bg-gray-100 text-gray-500'}`}>
                                                <Briefcase size={20} />
                                            </div>
                                            <div className={`w-8 h-4 rounded-full p-1 transition-colors ${holidays[selectedDay] ? 'bg-indigo-600' : 'bg-gray-300'}`}>
                                                <div className={`w-2 h-2 rounded-full bg-white transition-transform ${holidays[selectedDay] ? 'translate-x-4' : 'translate-x-0'}`} />
                                            </div>
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-gray-800 text-sm">Holiday</h3>
                                            <p className="text-[10px] text-gray-500">Day off for all</p>
                                        </div>
                                    </div>

                                    {/* Mark Absent Card */}
                                    <div
                                        className={`
                                            p-4 rounded-xl border-2 transition-all cursor-pointer flex flex-col gap-2 group relative overflow-hidden
                                            ${markingAbsent ? 'border-rose-400 bg-rose-50 animate-pulse' : 
                                              getDayStats(selectedDay).ABSENT > 0 ? 'border-gray-100 bg-gray-50 opacity-70 cursor-not-allowed' :
                                              'border-gray-100 bg-white shadow-sm hover:border-rose-300'}
                                        `}
                                        onClick={() => {
                                            if (markingAbsent || getDayStats(selectedDay).ABSENT > 0) return;
                                            const date = new Date(year, month, selectedDay);
                                            const dateStr = new Date(date.getTime() - date.getTimezoneOffset() * 60000).toISOString().split('T')[0];
                                            confirmCloseAttendance(dateStr);
                                        }}
                                    >
                                        <div className="flex items-center justify-between">
                                            <div className={`p-2 rounded-lg transition-colors 
                                              ${markingAbsent ? 'bg-rose-200 text-rose-700' : 
                                                getDayStats(selectedDay).ABSENT > 0 ? 'bg-gray-200 text-gray-500' :
                                                'bg-rose-50 text-rose-500 group-hover:bg-rose-100'}`}>
                                                {markingAbsent ? <Loader2 size={20} className="animate-spin" /> : 
                                                 getDayStats(selectedDay).ABSENT > 0 ? <CheckCircle2 size={20} /> :
                                                 <UserX size={20} />}
                                            </div>
                                            <div className={`text-[10px] font-bold 
                                              ${markingAbsent ? 'text-rose-700' : 
                                                getDayStats(selectedDay).ABSENT > 0 ? 'text-gray-500' :
                                                'text-rose-600'}`}>
                                                {markingAbsent ? 'Processing...' : 
                                                 getDayStats(selectedDay).ABSENT > 0 ? 'Completed' : 'Action'}
                                            </div>
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-gray-800 text-sm">
                                              {getDayStats(selectedDay).ABSENT > 0 ? 'Already Marked' : 'Mark Absent'}
                                            </h3>
                                            <p className="text-[10px] text-gray-500">
                                              {markingAbsent ? 'Sending SMS...' : 
                                               getDayStats(selectedDay).ABSENT > 0 ? 'SMS notifications sent' : 'Auto-mark & SMS'}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Daily Stats Grid */}
                                {!holidays[selectedDay] ? (
                                    <AnimatePresence mode="wait">
                                        {!viewingStatus ? (
                                            <motion.div
                                                key="summary"
                                                initial={{ opacity: 0, x: -20 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                exit={{ opacity: 0, x: 20 }}
                                                className="space-y-4"
                                            >
                                                <div className="flex items-center justify-between">
                                                    <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Attendance Breakdown</h3>
                                                    <span className="text-xs text-gray-400">Total: {students.length} Students</span>
                                                </div>

                                                <div className="grid grid-cols-2 gap-3">
                                                    <motion.div
                                                        whileHover={{ scale: 1.02 }}
                                                        whileTap={{ scale: 0.98 }}
                                                        onClick={() => setViewingStatus('PRESENT')}
                                                        className="bg-emerald-50 p-4 rounded-xl border border-emerald-100 flex items-center justify-between cursor-pointer hover:bg-emerald-100/50 transition-colors"
                                                    >
                                                        <div>
                                                            <span className="text-xs font-bold text-emerald-700 block mb-1">PRESENT</span>
                                                            <span className="text-2xl font-bold text-gray-800">{getDayStats(selectedDay).PRESENT}</span>
                                                        </div>
                                                        <UserCheck size={24} className="text-emerald-300" />
                                                    </motion.div>

                                                    <motion.div
                                                        whileHover={{ scale: 1.02 }}
                                                        whileTap={{ scale: 0.98 }}
                                                        onClick={() => setViewingStatus('ABSENT')}
                                                        className="bg-rose-50 p-4 rounded-xl border border-rose-100 flex items-center justify-between cursor-pointer hover:bg-rose-100/50 transition-colors"
                                                    >
                                                        <div>
                                                            <span className="text-xs font-bold text-rose-700 block mb-1">ABSENT</span>
                                                            <span className="text-2xl font-bold text-gray-800">{getDayStats(selectedDay).ABSENT}</span>
                                                        </div>
                                                        <UserX size={24} className="text-rose-300" />
                                                    </motion.div>

                                                </div>
                                            </motion.div>
                                        ) : (
                                            <motion.div
                                                key="list"
                                                initial={{ opacity: 0, x: 20 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                exit={{ opacity: 0, x: -20 }}
                                                className="space-y-4"
                                            >
                                                <div className="flex items-center justify-between mb-4">
                                                    <button
                                                        onClick={() => setViewingStatus(null)}
                                                        className="flex items-center gap-2 text-indigo-600 hover:text-indigo-700 font-bold text-xs uppercase tracking-wider"
                                                    >
                                                        <ChevronLeft size={16} />
                                                        Back to Summary
                                                    </button>
                                                    <span className={`px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-tight ${STATUS_TYPES[viewingStatus].color}`}>
                                                        {viewingStatus} List
                                                    </span>
                                                </div>

                                                <div className="max-h-[300px] overflow-y-auto pr-2 space-y-2 custom-scrollbar">
                                                    {students
                                                        .filter(student => (attendanceData[student.id]?.[selectedDay]?.status || 'NONE') === viewingStatus)
                                                        .map(student => (
                                                            <div key={student.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl border border-gray-100 hover:border-indigo-200 transition-all">
                                                                <div className="flex items-center gap-3">
                                                                    <img src={student.avatar} alt="" className="w-8 h-8 rounded-full bg-gray-200" />
                                                                    <div>
                                                                        <p className="text-sm font-bold text-gray-800">{student.name}</p>
                                                                        <p className="text-[10px] text-gray-500">#{student.rollNo} • {student.className}-{student.section}</p>
                                                                    </div>
                                                                </div>
                                                                {viewingStatus === 'PRESENT' && attendanceData[student.id]?.[selectedDay]?.firstInTime && (
                                                                    <div className="text-right">
                                                                        <p className="text-[10px] font-bold text-emerald-600">IN: {new Date(attendanceData[student.id]?.[selectedDay]?.firstInTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                                                                    </div>
                                                                )}
                                                            </div>
                                                        ))}
                                                    {students.filter(student => (attendanceData[student.id]?.[selectedDay]?.status || 'NONE') === viewingStatus).length === 0 && (
                                                        <div className="py-10 text-center text-gray-400 text-sm">
                                                            No students found in this status.
                                                        </div>
                                                    )}
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                ) : (
                                    <div className="text-center py-8">
                                        <div className="inline-block p-4 rounded-full bg-indigo-50 mb-3">
                                            <Calendar size={32} className="text-indigo-400" />
                                        </div>
                                        <p className="text-gray-600 font-semibold">It's a Holiday!</p>
                                        <p className="text-sm text-gray-400">Marked as holiday manually or it is a Sunday.</p>
                                    </div>
                                )}

                            </div>
                            <div className="bg-gray-50 p-4 border-t border-gray-100 flex justify-end">
                                <button
                                    onClick={() => { setSelectedDay(null); setViewingStatus(null); }}
                                    className="px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-100 font-medium text-sm transition"
                                >
                                    Close
                                </button>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>


            {/* Main Header & Controls */}
            <div className="flex flex-col gap-5 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">

                {/* Top Row: Title + Date Filter + View Modes */}
                <div className="flex flex-col 2xl:flex-row justify-between items-start 2xl:items-center gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                            <Calendar className="w-6 h-6 text-indigo-600" />
                            Attendance Dashboard
                        </h1>
                        <p className="text-gray-500 text-sm mt-1">Track daily attendance, manage leaves & holidays.</p>
                        {loading && <div className="text-xs text-indigo-600 flex items-center gap-1 mt-1"><Loader2 className="animate-spin w-3 h-3" /> Syncing data...</div>}
                    </div>

                    <div className="flex flex-wrap items-center gap-4 w-full 2xl:w-auto">
                    
                    {/* Date Navigation */}
                    <div className="flex items-center gap-1 bg-gray-50 p-1.5 rounded-xl border border-gray-200 shadow-sm relative">
                        <button disabled={loading} onClick={handlePrev} className="p-2 hover:bg-white hover:shadow-sm rounded-lg transition-all text-gray-600 disabled:opacity-50">
                            <ChevronLeft size={20} />
                        </button>

                        <div className="relative">
                            <button
                                onClick={() => setShowDatePicker(!showDatePicker)}
                                className="text-center min-w-[150px] px-3 py-2 flex items-center justify-center gap-2 hover:bg-white hover:shadow-sm transition-all rounded-lg"
                            >
                                <Calendar size={16} className="text-indigo-600" />
                                <span className="block text-[14px] font-bold text-gray-800 tracking-wide">{monthName}, {year}</span>
                            </button>

                            <AnimatePresence>
                                {showDatePicker && (
                                    <>
                                        <motion.div
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            exit={{ opacity: 0 }}
                                            className="fixed inset-0 z-40"
                                            onClick={() => setShowDatePicker(false)}
                                        />
                                        <motion.div
                                            initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                            animate={{ opacity: 1, y: 0, scale: 1 }}
                                            exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                            transition={{ duration: 0.15 }}
                                            className="absolute top-full left-0 mt-2 w-[280px] bg-white border border-gray-100 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.15)] rounded-xl z-50 p-4"
                                        >
                                            <div className="flex items-center justify-between mb-4 pb-3 border-b border-gray-100">
                                                <button onClick={() => setPickerYear(y => y - 1)} className="p-1.5 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors">
                                                    <ChevronLeft size={16} />
                                                </button>
                                                <span className="font-bold text-gray-800 text-lg">{pickerYear}</span>
                                                <button onClick={() => setPickerYear(y => y + 1)} className="p-1.5 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors">
                                                    <ChevronRight size={16} />
                                                </button>
                                            </div>

                                            <div className="grid grid-cols-3 gap-1.5">
                                                {Array.from({ length: 12 }, (_, i) => {
                                                    const mName = new Date(pickerYear, i, 1).toLocaleString('default', { month: 'short' });
                                                    const isCurrentMonth = i === month && pickerYear === year;
                                                    return (
                                                        <button
                                                            key={i}
                                                            onClick={() => {
                                                                setCurrentDate(new Date(pickerYear, i, 1));
                                                                setShowDatePicker(false);
                                                            }}
                                                            className={`py-2 px-1 rounded-lg text-[12px] font-bold transition-all
                                                                ${isCurrentMonth
                                                                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-200'
                                                                    : 'text-gray-600 hover:bg-indigo-50 hover:text-indigo-700'
                                                                }
                                                            `}
                                                        >
                                                            {mName}
                                                        </button>
                                                    );
                                                })}
                                            </div>
                                        </motion.div>
                                    </>
                                )}
                            </AnimatePresence>
                        </div>

                        <button disabled={loading} onClick={handleNext} className="p-2 hover:bg-white hover:shadow-sm rounded-lg transition-all text-gray-600 disabled:opacity-50">
                            <ChevronRight size={20} />
                        </button>
                    </div>

                    {/* View Modes */}
                    <div className="flex p-1.5 bg-gray-50 rounded-xl border border-gray-200 shadow-sm w-full sm:w-auto">
                        {VIEW_OPTIONS.map(option => (
                            <button
                                key={option.id}
                                onClick={() => setViewMode(option.id)}
                                className={`
                   px-4 py-2 text-sm font-bold rounded-lg transition-all flex-1 sm:flex-none whitespace-nowrap
                   ${viewMode === option.id
                                        ? 'bg-white text-indigo-600 shadow-sm'
                                        : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'}
                 `}
                            >
                                {option.label}
                            </button>
                        ))}
                    </div>
                    </div>
                </div>

                {/* Second Row: Actions & Search */}
                <div className="flex flex-wrap items-center justify-start gap-4 pt-4 border-t border-gray-100">
                    {/* Search */}
                    <div className="relative w-full sm:w-64">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <input
                            type="text"
                            placeholder="Search name or roll no..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-9 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-sm font-medium transition-all"
                        />
                    </div>

                    {/* Actions */}
                    <button
                        onClick={handleCloseAttendanceClick}
                        disabled={getDayStats(new Date().getDate()).ABSENT > 0 || loading}
                        className={`flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl transition-all text-sm font-bold whitespace-nowrap w-full sm:w-auto
                            ${getDayStats(new Date().getDate()).ABSENT > 0 
                                ? 'bg-gray-100 text-gray-400 cursor-not-allowed border border-gray-200' 
                                : 'bg-rose-600 text-white hover:bg-rose-700 shadow-lg shadow-rose-200'}`}
                    >
                        {getDayStats(new Date().getDate()).ABSENT > 0 ? (
                            <>
                                <CheckCircle2 size={16} />
                                Attendance Closed
                            </>
                        ) : (
                            <>
                                <UserX size={16} />
                                Close Attendance Now
                            </>
                        )}
                    </button>

                    <button
                        onClick={handleExportCSV}
                        className="flex items-center justify-center gap-2 px-4 py-2.5 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 shadow-lg shadow-indigo-200 transition-all text-sm font-bold whitespace-nowrap w-full sm:w-auto"
                    >
                        <FileDown size={16} />
                        Export
                    </button>

                    {user?.role === 'ADMIN' && (
                        <button
                            onClick={() => setShowSettings(true)}
                            className="p-2.5 bg-white border border-gray-200 text-gray-600 rounded-xl hover:bg-gray-50 hover:text-indigo-600 transition-all shadow-sm w-full sm:w-auto flex justify-center"
                            title="Punch Settings"
                        >
                            <Settings size={20} />
                        </button>
                    )}
                </div>
            </div>

                {/* Main Matrix Table */}
                <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full border-collapse">
                            <thead>
                                <tr className="bg-gray-50/50 border-b border-gray-200">
                                    <th className="sticky left-0 z-20 bg-white p-4 text-left min-w-[220px] border-r border-gray-200 shadow-[4px_0_12px_-5px_rgba(0,0,0,0.05)]">
                                        <div className="flex items-center gap-2">
                                            <ListFilter size={16} className="text-gray-400" />
                                            <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Student List</span>
                                        </div>
                                    </th>

                                    {displayedDays.map(day => {
                                        const date = new Date(year, month, day);
                                        const isSunday = date.getDay() === 0;
                                        const isHoliday = holidays[day];
                                        const isToday = new Date().getDate() === day && new Date().getMonth() === month;

                                        return (
                                            <th key={day} className={`p-0 min-w-[48px] text-center border-r border-gray-100 last:border-r-0 relative group`}>
                                                <div
                                                    className={`
                          py-3 px-1 text-xs font-semibold cursor-pointer transition-colors flex flex-col items-center justify-center gap-1 h-full
                          ${isHoliday ? 'bg-gray-100 text-gray-400' : isSunday ? 'bg-rose-50 text-rose-500' : 'text-gray-600 hover:bg-gray-100'}
                          ${isToday ? 'bg-indigo-50 text-indigo-700 ring-inset ring-2 ring-indigo-500/20 z-10' : ''}
                        `}
                                                    onClick={() => setSelectedDay(day)}
                                                >
                                                    <span className="text-[10px] uppercase opacity-70">
                                                        {date.toLocaleDateString('en-US', { weekday: 'short' })}
                                                    </span>
                                                    <span className={`text-sm ${isToday ? 'font-black' : ''}`}>{day}</span>

                                                    {isHoliday && (
                                                        <div className="w-1.5 h-1.5 rounded-full bg-gray-400 mt-0.5" />
                                                    )}
                                                    {!isHoliday && isSunday && (
                                                        <div className="w-1.5 h-1.5 rounded-full bg-rose-400 mt-0.5" />
                                                    )}
                                                </div>
                                            </th>
                                        );
                                    })}
                                </tr>
                            </thead>
                            <tbody>
                                {/* If no students returned from API/Search */}
                                {loading ? (
                                    <tr>
                                        <td colSpan={displayedDays.length + 1} className="p-12 text-center">
                                            <div className="flex flex-col items-center gap-3">
                                                <Loader2 className="animate-spin text-indigo-500 w-8 h-8" />
                                                <span className="text-gray-500 font-medium">Loading attendance data...</span>
                                            </div>
                                        </td>
                                    </tr>
                                ) : paginatedStudents.length > 0 ? (
                                    paginatedStudents.map((student) => (
                                        <tr key={student.id} className="group hover:bg-gray-50/50 transition-colors border-b border-gray-100 last:border-none">
                                            {/* Sticky Student Column */}
                                            <td 
                                                className="sticky left-0 z-10 bg-white group-hover:bg-gray-50/50 p-3 pl-4 border-r border-gray-200 shadow-[4px_0_12px_-5px_rgba(0,0,0,0.05)] transition-colors cursor-default"
                                                onMouseEnter={(e) => {
                                                    const rect = e.currentTarget.getBoundingClientRect();
                                                    setHoveredStudent({ student, rect });
                                                }}
                                                onMouseLeave={() => setHoveredStudent(null)}
                                            >
                                                <div className="flex items-center gap-3">
                                                    <div className="relative group/avatar">
                                                        <img
                                                            src={student.avatar}
                                                            alt={student.name}
                                                            className="w-10 h-10 rounded-full bg-gray-100 object-cover border-2 border-white shadow-sm transition-transform group-hover/avatar:scale-110"
                                                        />
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-bold text-gray-900 leading-tight group-hover:text-indigo-600 transition-colors uppercase tracking-tight">{student.name}</p>

                                                        <div className="flex flex-col gap-0.5 mt-0.5">
                                                            <span className="text-[11px] text-gray-500 font-bold tracking-wide">#{student.rollNo}</span>
                                                            {(student.className || student.section) && (
                                                                <span className="text-[10px] bg-indigo-50 text-indigo-700 px-1.5 py-0.5 rounded-md font-bold border border-indigo-100 w-fit">
                                                                    {student.className} {student.section && `- ${student.section}`}
                                                                </span>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>

                                            {/* Attendance Cells */}
                                            {displayedDays.map(day => {
                                                const record = attendanceData[student.id]?.[day] || {};
                                                const statusKey = record.status || 'NONE';
                                                const isHoliday = holidays[day];
                                                const status = STATUS_TYPES[statusKey] || STATUS_TYPES.NONE;

                                                // Format Time for Tooltip
                                                const formatTime = (timeStr) => {
                                                    if (!timeStr) return null;
                                                    let hr, min;
                                                    if (timeStr.includes("T")) {
                                                        const parts = timeStr.split("T")[1].substring(0, 5).split(":");
                                                        hr = parts[0]; min = parts[1];
                                                    } else if (timeStr.includes(":")) {
                                                        const parts = timeStr.split(":");
                                                        hr = parts[0]; min = parts[1];
                                                    } else return timeStr;

                                                    const h = parseInt(hr, 10);
                                                    const ampm = h >= 12 ? "PM" : "AM";
                                                    const fH = h % 12 || 12;
                                                    return `${fH}:${min} ${ampm}`;
                                                };


                                                return (
                                                    <td
                                                        key={day}
                                                        className={`
                          p-1 text-center border-r border-gray-100 last:border-r-0 relative group/cell
                          ${isHoliday ? 'bg-gray-50/80 cursor-not-allowed' : 'cursor-pointer hover:bg-gray-100'}
                        `}
                                                        onClick={() => toggleStatus(student.id, day)}
                                                    >
                                                        {isHoliday ? (
                                                            <div className="w-full h-full flex items-center justify-center opacity-20" title="Holiday">
                                                                <Briefcase size={14} className="text-gray-500" />
                                                            </div>
                                                        ) : (
                                                            <>
                                                                {(record.updatedByAdmin || (record.punches && record.punches.length > 0)) ? (
                                                                    <div className="relative group/tooltip flex justify-center items-center">
                                                                        <div
                                                                            className={`
                                                                                w-8 h-8 mx-auto rounded-lg flex items-center justify-center text-xs font-bold transition-all transform scale-95 group-hover/cell:scale-100
                                                                                ${status.color} border shadow-sm
                                                                            `}
                                                                        >
                                                                            {status.code}
                                                                        </div>
                                                                        {/* Floating Info Tooltip */}

                                                                        {/* Advanced Floating Tooltip */}
                                                                        <div className="absolute opacity-0 group-hover/tooltip:opacity-100 transition-all bottom-full mb-3 left-1/2 -translate-x-1/2 bg-gray-900 border border-gray-700 text-white text-[11px] py-2.5 px-3 rounded-xl shadow-2xl z-50 pointer-events-none scale-90 group-hover/tooltip:scale-100 min-w-[150px]">
                                                                            
                                                                            {record.updatedByAdmin && (
                                                                                <div className="flex items-center gap-1.5 text-amber-400 font-black mb-2 border-b border-white/10 pb-2 uppercase text-[9px] tracking-widest">
                                                                                    <User size={10} />
                                                                                    Admin Manual
                                                                                </div>
                                                                            )}

                                                                            {record.punches && record.punches.length > 0 && (
                                                                                <div className="space-y-1.5">
                                                                                    <div className="text-[9px] uppercase font-bold text-gray-400 mb-1 border-b border-white/10 pb-1 flex justify-between">
                                                                                        <span>Activity Log</span>
                                                                                        <span>Time</span>
                                                                                    </div>
                                                                                    {record.punches.map((p, idx) => (
                                                                                        <div key={idx} className="flex justify-between gap-6 items-center">
                                                                                            <span className={`font-extrabold text-[9px] px-1 rounded-sm ${p.punchType === 'IN' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'}`}>{p.punchType}</span>
                                                                                            <span className="text-gray-200 font-mono tracking-tight">{formatTime(p.punchTime)}</span>
                                                                                        </div>
                                                                                    ))}
                                                                                </div>
                                                                            )}

                                                                            <div className="absolute top-[95%] left-1/2 -translate-x-1/2 w-3.5 h-3.5 bg-gray-900 rotate-45 border-r border-b border-gray-700 z-[-1]" />
                                                                        </div>
                                                                    </div>
                                                                ) : (
                                                                    /* Simple view without tooltip */
                                                                    <div
                                                                        className={`
                                                                            w-8 h-8 mx-auto rounded-lg flex items-center justify-center text-xs font-bold transition-all transform scale-95 group-hover/cell:scale-100
                                                                            ${status.color} border shadow-sm
                                                                        `}
                                                                    >
                                                                        {status.code}
                                                                    </div>
                                                                )}
                                                            </>
                                                        )}
                                                    </td>
                                                );
                                            })}
                                        </tr>
                                    ))) : (
                                    <tr>
                                        <td colSpan={displayedDays.length + 1} className="p-12 text-center text-gray-400">
                                            No students found.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    {filteredStudents.length > perPage && (
                        <div className="flex justify-between items-center px-6 py-4 bg-gray-50 border-t border-gray-100 rounded-b-2xl">
                            <button
                                disabled={page === 1}
                                onClick={() => setPage(p => p - 1)}
                                className="px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors disabled:opacity-50 text-sm font-semibold"
                            >
                                Previous
                            </button>
                            <span className="text-gray-500 text-sm font-medium">
                                Page <span className="text-indigo-600 font-bold">{page}</span> of {Math.ceil(filteredStudents.length / perPage)}
                            </span>
                            <button
                                disabled={page >= Math.ceil(filteredStudents.length / perPage)}
                                onClick={() => setPage(p => p + 1)}
                                className="px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors disabled:opacity-50 text-sm font-semibold"
                            >
                                Next
                            </button>
                        </div>
                    )}
                </div>

                {/* Footer Legend */}
                <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-white/90 backdrop-blur-md border border-gray-200 shadow-2xl rounded-full px-6 py-3 flex gap-6 text-xs font-medium z-30">
                    {Object.entries(STATUS_TYPES).map(([key, type]) => key !== 'NONE' && key !== 'HOLIDAY' && key !== 'LATE' && key !== 'LEAVE' && (
                        <div key={key} className="flex items-center gap-2">
                            <div className={`w-2.5 h-2.5 rounded-sm ${type.color.split(' ')[0]} border ${type.color.split(' ')[2]}`}></div>
                            <span className="text-gray-600 capitalize">{type.label}</span>
                        </div>
                    ))}
                    <div className="w-px h-4 bg-gray-300 mx-1"></div>
                    <div className="flex items-center gap-2">
                        <div className="w-2.5 h-2.5 rounded-sm bg-gray-100 border border-gray-300"></div>
                        <span className="text-gray-500">Holiday</span>
                    </div>
                </div>

                {/* Floating Student Detail Tooltip (Fixed Portal) */}
                <AnimatePresence>
                    {hoveredStudent && (
                        <motion.div
                            initial={{ opacity: 0, x: -10, scale: 0.95 }}
                            animate={{ opacity: 1, x: 0, scale: 1 }}
                            exit={{ opacity: 0, x: -10, scale: 0.95 }}
                            transition={{ duration: 0.2 }}
                            style={{
                                position: 'fixed',
                                left: hoveredStudent.rect.right + 10,
                                top: hoveredStudent.rect.top + (hoveredStudent.rect.height / 2),
                                translateY: '-50%',
                                zIndex: 9999
                            }}
                            className="pointer-events-none"
                        >
                            <div className="bg-white/95 backdrop-blur-xl rounded-xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.1)] border border-gray-200/50 p-3.5 w-56 overflow-hidden">
                                {/* Header Accents */}
                                <div className="absolute top-0 left-0 right-0 h-1 bg-indigo-500" />
                                
                                <div className="relative">
                                    <div className="flex items-center gap-3 mb-3 border-b border-gray-100 pb-3">
                                        <div className="w-12 h-12 rounded-lg border border-gray-100 shadow-sm overflow-hidden bg-white shrink-0">
                                            <img src={hoveredStudent.student.avatar} alt={hoveredStudent.student.name} className="w-full h-full object-cover" />
                                        </div>
                                        <div className="min-w-0">
                                            <h4 className="font-bold text-slate-800 text-sm leading-tight truncate">{hoveredStudent.student.name}</h4>
                                            <span className="text-[10px] font-bold text-indigo-600 bg-indigo-50 px-1.5 py-0.5 rounded-md mt-1 inline-block">ID: #{hoveredStudent.student.rollNo}</span>
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <div className="flex items-center gap-2.5 text-[11px] text-slate-600">
                                            <div className="p-1.5 rounded-md bg-slate-50 text-slate-400 group-hover:text-indigo-500"><User size={13} /></div>
                                            <span className="font-bold truncate">{hoveredStudent.student.className} {hoveredStudent.student.section && `• ${hoveredStudent.student.section}`}</span>
                                        </div>
                                        
                                        {hoveredStudent.student.phone && (
                                            <div className="flex items-center gap-2.5 text-[11px] text-slate-600">
                                                <div className="p-1.5 rounded-md bg-slate-50 text-slate-400"><Phone size={13} /></div>
                                                <span className="font-semibold">{hoveredStudent.student.phone}</span>
                                            </div>
                                        )}
                                        
                                        {hoveredStudent.student.email && (
                                            <div className="flex items-center gap-2.5 text-[11px] text-slate-600">
                                                <div className="p-1.5 rounded-md bg-slate-50 text-slate-400"><Mail size={13} /></div>
                                                <span className="truncate font-medium">{hoveredStudent.student.email}</span>
                                            </div>
                                        )}

                                        {hoveredStudent.student.rfidCardId && (
                                            <div className="flex flex-col gap-1 pt-2 mt-1 border-t border-gray-50">
                                                <div className="flex items-center gap-2 text-[9px] uppercase font-bold text-slate-400">
                                                    <Fingerprint size={10} className="text-amber-500" />
                                                    RFID Card
                                                </div>
                                                <span className="font-mono text-[10px] font-bold text-slate-700 bg-slate-50 px-2 py-1 rounded border border-slate-100">{hoveredStudent.student.rfidCardId}</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                            {/* Refined Arrow */}
                            <div className="absolute left-[-4px] top-1/2 -translate-y-1/2 w-2 h-2 bg-white/95 border-l border-b border-gray-200/50 rotate-45" />
                        </motion.div>
                    )}
                </AnimatePresence>
        </div>
    );
}
