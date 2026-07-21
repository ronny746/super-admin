import React, { useState, useEffect, useMemo } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "react-hot-toast";
import { getAllBookings, cancelBooking, deleteBooking, getAllExams } from "../../api/slotBookingApi";
import { HiUser, HiTrash, HiSearch, HiBan, HiChevronLeft, HiChevronRight, HiFilter, HiArrowLeft, HiCollection, HiCheckCircle, HiXCircle, HiCalendar } from "react-icons/hi";

const BookingsPage = () => {
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();
    const selectedExamId = searchParams.get("examId");

    const [bookings, setBookings] = useState([]);
    const [exams, setExams] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(10);
    const [filterStatus, setFilterStatus] = useState("");
    const [filterTime, setFilterTime] = useState("");
    const [filterDate, setFilterDate] = useState("");

    const fetchData = async () => {
        try {
            setLoading(true);
            const [bookingsRes, examsRes] = await Promise.all([getAllBookings(), getAllExams()]);
            if (bookingsRes.success) setBookings(bookingsRes.data);
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

    const handleCancel = async (id) => {
        if (window.confirm("Are you sure you want to cancel this booking?")) {
            try {
                const response = await cancelBooking(id);
                if (response.success) {
                    toast.success("Booking cancelled");
                    fetchData();
                } else {
                    toast.error(response.message);
                }
            } catch (error) {
                toast.error("Error cancelling booking");
            }
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this booking record?")) {
            try {
                const response = await deleteBooking(id);
                if (response.message || response.success) {
                    toast.success("Booking deleted");
                    fetchData();
                }
            } catch (error) {
                toast.error("Error deleting booking");
            }
        }
    };

    // Group bookings by exam for the card view stats
    const bookingsByExam = useMemo(() => {
        return bookings.reduce((acc, b) => {
            const id = b.examId?._id || b.examId;
            if (id) {
                if (!acc[id]) acc[id] = 0;
                acc[id]++;
            }
            return acc;
        }, {});
    }, [bookings]);

    const selectedExam = useMemo(() => {
        return exams.find(e => (e._id || e.id) === selectedExamId);
    }, [exams, selectedExamId]);

    const filteredBookings = useMemo(() => {
        let filtered = bookings;
        if (selectedExamId) {
            filtered = filtered.filter(b => (b.examId?._id || b.examId) === selectedExamId);
        }
        
        filtered = filtered.filter((b) => {
            const matchesSearch = 
                b.guestName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                b.guestEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
                (b.centerId?.name || "").toLowerCase().includes(searchTerm.toLowerCase());
            const matchesStatus = filterStatus === "" || b.status === filterStatus;
            const matchesTime = filterTime === "" || b.slotId?.startTime === filterTime;
            const matchesDate = filterDate === "" || b.slotId?.date === filterDate;
            return matchesSearch && matchesStatus && matchesTime && matchesDate;
        });
        
        return filtered;
    }, [bookings, selectedExamId, searchTerm, filterStatus, filterTime, filterDate]);

    // Pagination logic
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredBookings.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(filteredBookings.length / itemsPerPage);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    const handleSelectExam = (examId) => {
        setSearchParams({ examId });
        setCurrentPage(1);
    };

    const handleBack = () => {
        setSearchParams({});
        setSearchTerm("");
        setFilterStatus("");
        setFilterTime("");
        setFilterDate("");
    };

    const uniqueTimes = useMemo(() => {
        const times = bookings
            .filter(b => !selectedExamId || (b.examId?._id || b.examId) === selectedExamId)
            .map(b => b.slotId?.startTime)
            .filter(Boolean);
        return [...new Set(times)].sort();
    }, [bookings, selectedExamId]);

    const uniqueDates = useMemo(() => {
        const dates = bookings
            .filter(b => !selectedExamId || (b.examId?._id || b.examId) === selectedExamId)
            .map(b => b.slotId?.date)
            .filter(Boolean);
        return [...new Set(dates)].sort();
    }, [bookings, selectedExamId]);

    if (loading) return <div className="p-8 text-center text-gray-500">Loading bookings...</div>;

    // CARD VIEW (Exam List)
    if (!selectedExamId) {
        return (
            <div className="space-y-6">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <h2 className="text-2xl font-bold text-gray-800">Booking Management</h2>
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
                                    <HiUser className="w-6 h-6" />
                                </div>
                                <h3 className="text-lg font-bold text-gray-800 group-hover:text-blue-600 transition-colors">{exam.name}</h3>
                                <p className="text-sm text-gray-500 mt-1 line-clamp-2">{exam.description || "View guest bookings for this exam."}</p>
                                
                                <div className="mt-6 flex items-center justify-between">
                                    <span className="text-sm font-medium text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
                                        {bookingsByExam[exam._id] || 0} Bookings
                                    </span>
                                    <div className="flex items-center text-blue-600 text-sm font-semibold opacity-0 group-hover:opacity-100 transition-opacity">
                                        View Bookings <HiChevronRight className="ml-1" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                    {exams.length === 0 && (
                        <div className="col-span-full p-12 text-center bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
                            <p className="text-gray-500">No exams found.</p>
                        </div>
                    )}
                </div>
            </div>
        );
    }

    // DETAIL VIEW (Specific Exam Bookings)
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
                        <h2 className="text-2xl font-bold text-gray-800">{selectedExam?.name} Bookings</h2>
                        <p className="text-sm text-gray-500">Managing student/guest registrations</p>
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-4 border-b space-y-4">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                        <div className="relative flex-1 max-w-md w-full">
                            <HiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search guest or center..."
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
                                    value={filterStatus}
                                    onChange={(e) => {
                                        setFilterStatus(e.target.value);
                                        setCurrentPage(1);
                                    }}
                                >
                                    <option value="">All Statuses</option>
                                    <option value="CONFIRMED">Confirmed</option>
                                    <option value="CANCELLED">Cancelled</option>
                                    <option value="PENDING">Pending</option>
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
                        <p className="text-lg font-medium text-gray-600">No bookings found</p>
                        <p className="text-sm">Try adjusting your filters or search terms.</p>
                    </div>
                ) : (
                    <>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="bg-gray-50 text-gray-600 font-medium text-sm">
                                    <tr>
                                        <th className="px-6 py-3">Guest Details</th>
                                        <th className="px-6 py-3">Center</th>
                                        <th className="px-6 py-3">Slot Schedule</th>
                                        <th className="px-6 py-3">Status</th>
                                        <th className="px-6 py-3 text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {currentItems.map((b) => (
                                        <tr key={b._id || b.id} className="hover:bg-gray-50 transition-colors">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="bg-blue-50 p-2 rounded-xl text-blue-600">
                                                        <HiUser className="w-5 h-5" />
                                                    </div>
                                                    <div>
                                                        <p className="font-bold text-gray-900">{b.guestName}</p>
                                                        <p className="text-xs text-gray-500">{b.guestEmail}</p>
                                                        <p className="text-xs text-gray-500">{b.guestPhone}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <p className="text-sm text-gray-800 font-semibold">{b.centerId?.name || "Unknown Center"}</p>
                                                <p className="text-xs text-gray-500">{b.centerId?.city}</p>
                                            </td>
                                            <td className="px-6 py-4 text-sm">
                                                <div className="flex items-center gap-1 font-bold text-gray-900">
                                                    <HiCalendar className="text-gray-400 w-4 h-4" />
                                                    {b.slotId?.date}
                                                </div>
                                                <p className="text-gray-500 mt-0.5">{b.slotId?.startTime} - {b.slotId?.endTime}</p>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase border ${
                                                    b.status === 'CONFIRMED' ? 'bg-green-50 text-green-700 border-green-100' :
                                                    b.status === 'CANCELLED' ? 'bg-red-50 text-red-700 border-red-100' : 
                                                    'bg-gray-50 text-gray-600 border-gray-100'
                                                }`}>
                                                    {b.status === 'CONFIRMED' && <HiCheckCircle className="w-3 h-3" />}
                                                    {b.status === 'CANCELLED' && <HiXCircle className="w-3 h-3" />}
                                                    {b.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-right space-x-2">
                                                {b.status !== 'CANCELLED' && (
                                                    <button
                                                        onClick={() => handleCancel(b._id || b.id)}
                                                        className="text-orange-500 hover:text-orange-700 p-1 transition-colors"
                                                        title="Cancel Booking"
                                                    >
                                                        <HiBan className="w-5 h-5" />
                                                    </button>
                                                )}
                                                <button
                                                    onClick={() => handleDelete(b._id || b.id)}
                                                    className="text-red-500 hover:text-red-700 p-1 transition-colors"
                                                    title="Delete Record"
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
                                Showing <span className="font-bold text-gray-900">{indexOfFirstItem + 1}-{Math.min(indexOfLastItem, filteredBookings.length)}</span> of <span className="font-bold text-gray-900">{filteredBookings.length}</span>
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

export default BookingsPage;
