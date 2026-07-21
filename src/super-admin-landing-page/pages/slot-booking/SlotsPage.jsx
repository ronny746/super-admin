import React, { useState, useEffect, useMemo } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "react-hot-toast";
import { getAllSlots, deleteSlot, getAllExams } from "../../api/slotBookingApi";
import { HiPlus, HiPencil, HiTrash, HiSearch, HiCalendar, HiChevronLeft, HiChevronRight, HiFilter, HiArrowLeft, HiCollection } from "react-icons/hi";

const SlotsPage = () => {
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();
    const selectedExamId = searchParams.get("examId");

    const [slots, setSlots] = useState([]);
    const [exams, setExams] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(10);
    const [filterCenter, setFilterCenter] = useState("");
    const [filterTime, setFilterTime] = useState("");
    const [filterDate, setFilterDate] = useState("");

    const fetchData = async () => {
        try {
            setLoading(true);
            const [slotsRes, examsRes] = await Promise.all([getAllSlots(), getAllExams()]);
            if (slotsRes.success) setSlots(slotsRes.data);
            if (examsRes.success) setExams(examsRes.data);
        } catch (error) {
            console.error(error);
            toast.error("Error fetching data");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this slot?")) {
            try {
                const response = await deleteSlot(id);
                if (response.success) {
                    toast.success("Slot deleted successfully");
                    fetchData();
                } else {
                    toast.error(response.message);
                }
            } catch (error) {
                toast.error("Error deleting slot");
            }
        }
    };

    // Group slots by exam for the card view stats
    const slotsByExam = useMemo(() => {
        return slots.reduce((acc, slot) => {
            const id = slot.examId?._id || slot.examId;
            if (id) {
                if (!acc[id]) acc[id] = 0;
                acc[id]++;
            }
            return acc;
        }, {});
    }, [slots]);

    const selectedExam = useMemo(() => {
        return exams.find(e => (e._id || e.id) === selectedExamId);
    }, [exams, selectedExamId]);

    const filteredSlots = useMemo(() => {
        let filtered = slots;
        if (selectedExamId) {
            filtered = filtered.filter(s => (s.examId?._id || s.examId) === selectedExamId);
        }
        
        filtered = filtered.filter((slot) => {
            const matchesSearch = (slot.centerId?.name || "").toLowerCase().includes(searchTerm.toLowerCase());
            const matchesCenter = filterCenter === "" || (slot.centerId?._id || slot.centerId) === filterCenter;
            const matchesTime = filterTime === "" || slot.startTime === filterTime;
            const matchesDate = filterDate === "" || slot.date === filterDate;
            return matchesSearch && matchesCenter && matchesTime && matchesDate;
        });
        
        return filtered;
    }, [slots, selectedExamId, searchTerm, filterCenter, filterTime, filterDate]);

    const uniqueCenters = useMemo(() => {
        const centers = slots
            .filter(s => !selectedExamId || (s.examId?._id || s.examId) === selectedExamId)
            .map(s => s.centerId)
            .filter(Boolean);
        
        const seen = new Set();
        return centers.filter(c => {
            const id = c._id || c.id;
            const duplicate = seen.has(id);
            seen.add(id);
            return !duplicate;
        });
    }, [slots, selectedExamId]);

    const uniqueTimes = useMemo(() => {
        const times = slots
            .filter(s => !selectedExamId || (s.examId?._id || s.examId) === selectedExamId)
            .map(s => s.startTime)
            .filter(Boolean);
        return [...new Set(times)].sort();
    }, [slots, selectedExamId]);

    const uniqueDates = useMemo(() => {
        const dates = slots
            .filter(s => !selectedExamId || (s.examId?._id || s.examId) === selectedExamId)
            .map(s => s.date)
            .filter(Boolean);
        return [...new Set(dates)].sort();
    }, [slots, selectedExamId]);

    // Pagination logic
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredSlots.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(filteredSlots.length / itemsPerPage);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    const handleSelectExam = (examId) => {
        setSearchParams({ examId });
        setCurrentPage(1);
    };

    const handleBack = () => {
        setSearchParams({});
        setSearchTerm("");
        setFilterCenter("");
        setFilterTime("");
        setFilterDate("");
    };

    if (loading) return <div className="p-8 text-center text-gray-500">Loading slots...</div>;

    // CARD VIEW (Exam List)
    if (!selectedExamId) {
        return (
            <div className="space-y-6">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <h2 className="text-2xl font-bold text-gray-800">Review Slots</h2>
                    <Link
                        to="/admin/slot-booking/slots/create"
                        className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition shadow-sm"
                    >
                        <HiPlus /> Create Slots
                    </Link>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {exams.map((exam) => (
                        <div 
                            key={exam._id} 
                            onClick={() => handleSelectExam(exam._id)}
                            className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all cursor-pointer group relative overflow-hidden"
                        >
                            <div className="absolute top-0 right-0 w-24 h-24 bg-blue-50 rounded-full -mr-12 -mt-12 transition-transform group-hover:scale-110" />
                            <div className="relative">
                                <div className="bg-blue-600 text-white w-12 h-12 rounded-xl flex items-center justify-center mb-4 shadow-blue-200 shadow-lg">
                                    <HiCollection className="w-6 h-6" />
                                </div>
                                <h3 className="text-lg font-bold text-gray-800 group-hover:text-blue-600 transition-colors">{exam.name}</h3>
                                <p className="text-sm text-gray-500 mt-1 line-clamp-2">{exam.description || "No description available."}</p>
                                
                                <div className="mt-6 flex items-center justify-between">
                                    <span className="text-sm font-medium text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
                                        {slotsByExam[exam._id] || 0} Slots
                                    </span>
                                    <div className="flex items-center text-blue-600 text-sm font-semibold opacity-0 group-hover:opacity-100 transition-opacity">
                                        View Details <HiChevronRight className="ml-1" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                    {exams.length === 0 && (
                        <div className="col-span-full p-12 text-center bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
                            <p className="text-gray-500">No exams found. Create an exam first to manage slots.</p>
                        </div>
                    )}
                </div>
            </div>
        );
    }

    // DETAIL VIEW (Specific Exam Slots)
    return (
        <div className="space-y-6 animate-in fade-in duration-300">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="flex items-center gap-4">
                    <button 
                        onClick={handleBack}
                        className="p-2 rounded-xl hover:bg-white hover:shadow-sm border border-transparent hover:border-gray-100 transition-all text-gray-600"
                    >
                        <HiArrowLeft className="w-5 h-5" />
                    </button>
                    <div>
                        <h2 className="text-2xl font-bold text-gray-800">{selectedExam?.name}</h2>
                        <p className="text-sm text-gray-500">Managing slots for this exam</p>
                    </div>
                </div>
                <Link
                    to="/admin/slot-booking/slots/create"
                    className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
                >
                    <HiPlus /> Add More Slots
                </Link>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-4 border-b space-y-4">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                        <div className="relative flex-1 max-w-md w-full">
                            <HiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search by center name..."
                                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                value={searchTerm}
                                onChange={(e) => {
                                    setSearchTerm(e.target.value);
                                    setCurrentPage(1);
                                }}
                            />
                        </div>
                        <div className="flex items-center gap-3 w-full md:w-auto">
                            <div className="flex items-center gap-2 bg-gray-50 px-3 py-2 rounded-lg border">
                                <HiFilter className="text-gray-400" />
                                <select 
                                    className="bg-transparent text-sm focus:outline-none min-w-[120px]"
                                    value={filterCenter}
                                    onChange={(e) => {
                                        setFilterCenter(e.target.value);
                                        setCurrentPage(1);
                                    }}
                                >
                                    <option value="">All Centers</option>
                                    {uniqueCenters.map(center => (
                                        <option key={center._id} value={center._id}>{center.name}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="flex items-center gap-2 bg-gray-50 px-3 py-2 rounded-lg border">
                                <HiFilter className="text-gray-400" />
                                <select 
                                    className="bg-transparent text-sm focus:outline-none min-w-[120px]"
                                    value={filterDate}
                                    onChange={(e) => {
                                        setFilterDate(e.target.value);
                                        setCurrentPage(1);
                                    }}
                                >
                                    <option value="">All Dates</option>
                                    {uniqueDates.map(date => (
                                        <option key={date} value={date}>{date}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="flex items-center gap-2 bg-gray-50 px-3 py-2 rounded-lg border">
                                <HiFilter className="text-gray-400" />
                                <select 
                                    className="bg-transparent text-sm focus:outline-none min-w-[120px]"
                                    value={filterTime}
                                    onChange={(e) => {
                                        setFilterTime(e.target.value);
                                        setCurrentPage(1);
                                    }}
                                >
                                    <option value="">All Times</option>
                                    {uniqueTimes.map(time => (
                                        <option key={time} value={time}>{time}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </div>
                </div>

                {currentItems.length === 0 ? (
                    <div className="p-12 text-center text-gray-500">
                        <HiCollection className="w-12 h-12 mx-auto text-gray-300 mb-4" />
                        <p className="text-lg font-medium text-gray-600">No slots found</p>
                        <p className="text-sm">Try adjusting your filters or search terms.</p>
                    </div>
                ) : (
                    <>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="bg-gray-50 text-gray-600 font-medium text-sm">
                                    <tr>
                                        <th className="px-6 py-3">Center</th>
                                        <th className="px-6 py-3">Date</th>
                                        <th className="px-6 py-3">Timings</th>
                                        <th className="px-6 py-3">Capacity</th>
                                        <th className="px-6 py-3">Available</th>
                                        <th className="px-6 py-3 text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {currentItems.map((slot) => (
                                        <tr key={slot._id || slot.id} className="hover:bg-gray-50 transition-colors">
                                            <td className="px-6 py-4 text-gray-800">
                                                <div className="font-semibold">{slot.centerId?.name || "Unknown"}</div>
                                                <div className="text-xs text-gray-500 font-normal">{slot.centerId?.city}</div>
                                            </td>
                                            <td className="px-6 py-4 text-gray-700">
                                                <div className="flex items-center gap-1 text-sm font-medium">
                                                    <HiCalendar className="text-gray-400" />
                                                    {slot.date}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-gray-500 text-sm">
                                                {slot.startTime} - {slot.endTime}
                                            </td>
                                            <td className="px-6 py-4 text-gray-500 text-sm">{slot.slotCapacity}</td>
                                            <td className="px-6 py-4">
                                                <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase ${slot.availableSlots > 0 ? 'bg-green-100 text-green-700 border border-green-200' : 'bg-red-100 text-red-700 border border-red-200'}`}>
                                                    {slot.availableSlots !== undefined ? slot.availableSlots : '-'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-right space-x-2">
                                                <button
                                                    onClick={() => navigate(`/admin/slot-booking/slots/edit/${slot._id || slot.id}`)}
                                                    className="text-blue-600 hover:text-blue-800 p-1"
                                                    title="Edit"
                                                >
                                                    <HiPencil className="w-5 h-5" />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(slot._id || slot.id)}
                                                    className="text-red-500 hover:text-red-700 p-1"
                                                    title="Delete"
                                                >
                                                    <HiTrash className="w-5 h-5" />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Pagination */}
                        <div className="p-4 border-t flex flex-col sm:flex-row justify-between items-center bg-gray-50/50 gap-4">
                            <p className="text-sm text-gray-500 order-2 sm:order-1">
                                Showing <span className="font-bold text-gray-900">{indexOfFirstItem + 1}-{Math.min(indexOfLastItem, filteredSlots.length)}</span> of <span className="font-bold text-gray-900">{filteredSlots.length}</span>
                            </p>
                            <div className="flex items-center gap-3 order-1 sm:order-2">
                                <button
                                    onClick={() => paginate(currentPage - 1)}
                                    disabled={currentPage === 1}
                                    className="flex items-center gap-1 px-4 py-2 rounded-xl border bg-white text-sm font-semibold text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition shadow-sm"
                                >
                                    <HiChevronLeft className="w-5 h-5" />
                                    Previous
                                </button>
                                
                                <div className="hidden md:flex items-center px-4 py-2 bg-white border rounded-xl text-sm font-bold text-blue-600 shadow-sm">
                                    Page {currentPage} of {totalPages || 1}
                                </div>

                                <button
                                    onClick={() => paginate(currentPage + 1)}
                                    disabled={currentPage === totalPages || totalPages === 0}
                                    className="flex items-center gap-1 px-4 py-2 rounded-xl border bg-white text-sm font-semibold text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition shadow-sm"
                                >
                                    Next
                                    <HiChevronRight className="w-5 h-5" />
                                </button>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default SlotsPage;
