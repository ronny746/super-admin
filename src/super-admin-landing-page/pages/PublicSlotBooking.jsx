import React, { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import {
    getAllExams,
    getCentersByExamId,
    getAvailableSlots,
    createBooking,
} from "../api/slotBookingApi";
import {
    HiCheck, HiOfficeBuilding, HiCalendar, HiClock, HiUser, HiMail, HiPhone,
    HiBadgeCheck, HiLocationMarker, HiChevronRight, HiChevronDown
} from "react-icons/hi";
import { motion, AnimatePresence } from "framer-motion";

// --- Components ---

const StepIndicator = ({ step, title }) => (
    <div className="flex items-center gap-2 mb-4">
        <span className="flex items-center justify-center w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 font-bold text-sm">
            {step}
        </span>
        <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
    </div>
);

const InputField = ({ label, type = "text", value, onChange, placeholder, required = false, icon: Icon }) => (
    <div className="space-y-1.5">
        <label className="block text-sm font-medium text-gray-700">
            {label} {required && <span className="text-red-500">*</span>}
        </label>
        <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400 group-focus-within:text-indigo-500 transition-colors">
                {Icon && <Icon className="w-5 h-5" />}
            </div>
            <input
                type={type}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                required={required}
                className="block w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 transition-all outline-none text-gray-900 placeholder-gray-400"
            />
        </div>
    </div>
);

const PublicSlotBooking = () => {
    // -- State --
    const [exams, setExams] = useState([]);
    const [centers, setCenters] = useState([]);
    const [timeSlots, setTimeSlots] = useState([]);

    const [loadingExams, setLoadingExams] = useState(true);
    const [loadingCenters, setLoadingCenters] = useState(false);
    const [loadingSlots, setLoadingSlots] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    const [selectedExam, setSelectedExam] = useState("");
    const [selectedCenter, setSelectedCenter] = useState("");
    const [selectedDate, setSelectedDate] = useState("");
    const [selectedTimeSlot, setSelectedTimeSlot] = useState("");

    // UI State for date input placeholder handling
    const [isDateFocused, setIsDateFocused] = useState(false);

    const [guestInfo, setGuestInfo] = useState({
        name: "",
        email: "",
        phone: "",
        notes: "",
    });

    // -- Effects --
    useEffect(() => {
        const fetchExams = async () => {
            try {
                const response = await getAllExams();
                if (response.success) {
                    const activeExams = response.data.filter(e => e.isActive !== false);
                    setExams(activeExams);
                }
            } catch (error) {
                toast.error("Failed to load exams");
            } finally {
                setLoadingExams(false);
            }
        };
        fetchExams();
    }, []);

    useEffect(() => {
        if (selectedExam) {
            const fetchCenters = async () => {
                setLoadingCenters(true);
                setCenters([]);
                setSelectedCenter("");
                setTimeSlots([]);
                setSelectedTimeSlot("");
                try {
                    const response = await getCentersByExamId(selectedExam);
                    if (response.success) setCenters(response.data);
                } catch (error) {
                    toast.error("Failed to load centers");
                } finally {
                    setLoadingCenters(false);
                }
            };
            fetchCenters();
        } else {
            setCenters([]);
        }
    }, [selectedExam]);

    useEffect(() => {
        if (selectedExam && selectedCenter && selectedDate) {
            const fetchSlots = async () => {
                setLoadingSlots(true);
                setTimeSlots([]);
                setSelectedTimeSlot("");
                try {
                    const response = await getAvailableSlots(selectedExam, selectedCenter, selectedDate);
                    if (response.success) setTimeSlots(response.data);
                } catch (error) {
                    toast.error("Failed to load slots");
                } finally {
                    setLoadingSlots(false);
                }
            };
            fetchSlots();
        }
    }, [selectedExam, selectedCenter, selectedDate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!selectedExam || !selectedCenter || !selectedDate || !selectedTimeSlot) {
            toast.error("Please complete all selections");
            return;
        }

        setSubmitting(true);
        try {
            const bookingPayload = {
                examId: selectedExam,
                centerId: selectedCenter,
                slotId: selectedTimeSlot,
                guestName: guestInfo.name,
                guestEmail: guestInfo.email,
                guestPhone: guestInfo.phone,
                notes: guestInfo.notes,
            };

            const response = await createBooking(bookingPayload);
            if (response.success) {
                toast.success("Booking Confirmed! Check your email.");
                setSelectedExam("");
                setGuestInfo({ name: "", email: "", phone: "", notes: "" });
                // Optional: Redirect to a thank you page
            } else {
                toast.error(response.message || "Booking failed");
            }
        } catch (error) {
            const msg = error.response?.data?.message || "Error processing booking";
            toast.error(msg);
        } finally {
            setSubmitting(false);
        }
    };

    // -- Render Helpers --
    const getExamName = () => exams.find(e => e._id === selectedExam)?.name;
    const getCenterName = () => centers.find(c => c._id === selectedCenter)?.name;
    const getSlotTime = () => timeSlots.find(s => s._id === selectedTimeSlot)?.startTime;

    return (
        <div className="min-h-screen bg-[#F8FAFC] font-sans selection:bg-indigo-100 selection:text-indigo-700">
            {/* Header Background */}
            <div className="bg-white border-b border-gray-100">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-indigo-50 rounded-lg">
                            <HiBadgeCheck className="w-6 h-6 text-indigo-600" />
                        </div>
                        <span className="font-bold text-indigo-600 tracking-wide uppercase text-xs">Official Portal</span>
                    </div>
                    <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 tracking-tight">
                        Book Your Exam Slot
                    </h1>
                    <p className="mt-2 text-lg text-gray-500 max-w-2xl">
                        Select your preferred exam, center, and timing to secure your seat instantly.
                    </p>
                </div>
            </div>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">

                    {/* LEFT COLUMN: Steps */}
                    <div className="lg:col-span-2 space-y-10">

                        {/* 1. Exam Selection */}
                        <section className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-gray-100">
                            <StepIndicator step="1" title="Select an Exam" />

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {loadingExams ? (
                                    [1, 2].map(i => <div key={i} className="h-24 bg-gray-50 rounded-xl animate-pulse" />)
                                ) : exams.length === 0 ? (
                                    <p className="text-gray-500 italic">No exams available currently.</p>
                                ) : (
                                    exams.map((exam) => (
                                        <motion.div
                                            key={exam._id}
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                            onClick={() => setSelectedExam(exam._id)}
                                            className={`relative cursor-pointer rounded-xl p-5 border-2 transition-all duration-200 ${selectedExam === exam._id
                                                ? "border-indigo-600 bg-indigo-50/50 shadow-md shadow-indigo-100"
                                                : "border-gray-100 bg-white hover:border-indigo-200 hover:shadow-sm"
                                                }`}
                                        >
                                            <div className="flex justify-between items-start">
                                                <div>
                                                    <h4 className={`font-bold ${selectedExam === exam._id ? 'text-indigo-900' : 'text-gray-900'}`}>
                                                        {exam.name}
                                                    </h4>
                                                    {exam.description && (
                                                        <p className="text-sm text-gray-500 mt-1 line-clamp-2">{exam.description}</p>
                                                    )}
                                                </div>
                                                {selectedExam === exam._id && (
                                                    <div className="bg-indigo-600 rounded-full p-1 text-white shadow-sm">
                                                        <HiCheck className="w-4 h-4" />
                                                    </div>
                                                )}
                                            </div>
                                        </motion.div>
                                    ))
                                )}
                            </div>
                        </section>

                        {/* 2. Center Selection */}
                        <AnimatePresence>
                            {selectedExam && (
                                <motion.section
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-gray-100"
                                >
                                    <StepIndicator step="2" title="Choose a Test Center" />

                                    <div className="relative">
                                        <HiOfficeBuilding className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none" />
                                        <select
                                            value={selectedCenter}
                                            onChange={(e) => setSelectedCenter(e.target.value)}
                                            className="w-full pl-12 pr-10 py-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 transition-all outline-none appearance-none text-gray-900 font-medium cursor-pointer"
                                        >
                                            <option value="">Select a center near you...</option>
                                            {centers.map((center) => (
                                                <option key={center._id} value={center._id}>
                                                    {center.name} — {center.city}
                                                </option>
                                            ))}
                                        </select>
                                        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                                            <HiChevronDown className="w-5 h-5 text-gray-500" />
                                        </div>
                                    </div>
                                    {loadingCenters && <p className="text-sm text-indigo-600 mt-2 animate-pulse">Fetching centers...</p>}
                                </motion.section>
                            )}
                        </AnimatePresence>

                        {/* 3. Date & Time Selection */}
                        <AnimatePresence>
                            {selectedCenter && (
                                <motion.section
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-gray-100"
                                >
                                    <StepIndicator step="3" title="Pick Date & Time" />

                                    <div className="mb-6">
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Select Date</label>
                                        <div className="relative max-w-sm">
                                            <HiCalendar className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                                            <input
                                                type={isDateFocused ? "date" : "text"}
                                                placeholder="DD/MM/YYYY"
                                                min={new Date().toISOString().split("T")[0]}
                                                value={isDateFocused ? selectedDate : (selectedDate ? selectedDate.split("-").reverse().join("/") : "")}
                                                onFocus={() => setIsDateFocused(true)}
                                                onBlur={() => setIsDateFocused(false)}
                                                onChange={(e) => setSelectedDate(e.target.value)}
                                                className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 outline-none transition-all"
                                            />
                                        </div>
                                    </div>

                                    {selectedDate && (
                                        <div className="animate-fade-in">
                                            <label className="block text-sm font-medium text-gray-700 mb-3">Available Slots</label>
                                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                                                {loadingSlots ? (
                                                    [1, 2, 3].map(i => <div key={i} className="h-12 bg-gray-50 rounded-lg animate-pulse" />)
                                                ) : timeSlots.length === 0 ? (
                                                    <p className="col-span-full text-gray-500 italic">No slots available for this date.</p>
                                                ) : (
                                                    timeSlots.map((slot) => {
                                                        const isFull = slot.availableSlots <= 0;
                                                        const isSelected = selectedTimeSlot === slot._id;
                                                        return (
                                                            <button
                                                                key={slot._id}
                                                                disabled={isFull}
                                                                onClick={() => setSelectedTimeSlot(slot._id)}
                                                                className={`
                                                                    flex flex-col items-center justify-center py-3 px-2 rounded-xl border transition-all duration-200
                                                                    ${isFull
                                                                        ? 'bg-gray-50 border-gray-100 opacity-60 cursor-not-allowed'
                                                                        : isSelected
                                                                            ? 'bg-indigo-600 border-indigo-600 text-white shadow-lg shadow-indigo-200 transform scale-105'
                                                                            : 'bg-white border-gray-200 hover:border-indigo-300 hover:shadow-md'
                                                                    }
                                                                `}
                                                            >
                                                                <span className={`font-bold text-sm ${!isSelected && !isFull ? 'text-gray-900' : ''}`}>
                                                                    {slot.startTime}
                                                                </span>
                                                                <span className={`text-[10px] uppercase tracking-wide mt-1 ${isFull ? 'text-red-500 font-bold' : isSelected ? 'text-indigo-200' : 'text-green-600 font-medium'
                                                                    }`}>
                                                                    {isFull ? 'Full' : `${slot.availableSlots} Left`}
                                                                </span>
                                                            </button>
                                                        )
                                                    })
                                                )}
                                            </div>
                                        </div>
                                    )}
                                </motion.section>
                            )}
                        </AnimatePresence>

                        {/* 4. Personal Details */}
                        <AnimatePresence>
                            {selectedTimeSlot && (
                                <motion.section
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-gray-100"
                                >
                                    <StepIndicator step="4" title="Your Details" />

                                    <form onSubmit={handleSubmit} className="space-y-5">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                            <InputField
                                                label="Full Name"
                                                icon={HiUser}
                                                value={guestInfo.name}
                                                onChange={(e) => setGuestInfo({ ...guestInfo, name: e.target.value })}
                                                required
                                                placeholder="Enter your name"
                                            />
                                            <InputField
                                                label="Phone Number"
                                                icon={HiPhone}
                                                type="tel"
                                                value={guestInfo.phone}
                                                onChange={(e) => setGuestInfo({ ...guestInfo, phone: e.target.value })}
                                                required
                                                placeholder="10-digit mobile number"
                                            />
                                        </div>
                                        <InputField
                                            label="Email Address"
                                            icon={HiMail}
                                            type="email"
                                            value={guestInfo.email}
                                            onChange={(e) => setGuestInfo({ ...guestInfo, email: e.target.value })}
                                            required
                                            placeholder="you@example.com"
                                        />
                                        <InputField
                                            label="Additional Notes"
                                            value={guestInfo.notes}
                                            onChange={(e) => setGuestInfo({ ...guestInfo, notes: e.target.value })}
                                            placeholder="School name, Class, etc. (Optional)"
                                        />

                                        <div className="pt-4">
                                            <button
                                                type="submit"
                                                disabled={submitting}
                                                className={`
                                                    w-full py-4 rounded-xl font-bold text-lg text-white shadow-xl transition-all
                                                    flex items-center justify-center gap-2
                                                    ${submitting
                                                        ? 'bg-gray-400 cursor-not-allowed'
                                                        : 'bg-linear-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 transform hover:-translate-y-1 hover:shadow-indigo-500/30'
                                                    }
                                                `}
                                            >
                                                {submitting ? (
                                                    <>Processing...</>
                                                ) : (
                                                    <>Confirm Booking <HiChevronRight className="w-5 h-5" /></>
                                                )}
                                            </button>
                                            <p className="text-center text-xs text-gray-500 mt-4">
                                                By clicking confirm, you agree to our terms of service.
                                            </p>
                                        </div>
                                    </form>
                                </motion.section>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* RIGHT COLUMN: FLOATING SUMMARY */}
                    <div className="lg:col-span-1">
                        <div className="sticky top-8 space-y-6">
                            <div className="bg-white rounded-2xl p-6 shadow-xl shadow-gray-200/50 border border-gray-100">
                                <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
                                    <HiClock className="w-5 h-5 text-indigo-600" />
                                    Booking Summary
                                </h3>

                                <div className="space-y-6 relative">
                                    {/* Timeline line */}
                                    <div className="absolute left-[11px] top-2 bottom-2 w-0.5 bg-gray-100" />

                                    <div className="relative pl-8">
                                        <span className={`absolute left-0 top-1 w-6 h-6 rounded-full border-2 flex items-center justify-center bg-white z-10 ${selectedExam ? 'border-indigo-600 text-indigo-600' : 'border-gray-300'}`}>
                                            <div className={`w-2 h-2 rounded-full ${selectedExam ? 'bg-indigo-600' : 'bg-transparent'}`} />
                                        </span>
                                        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Exam</p>
                                        <p className="text-sm font-medium text-gray-900">{getExamName() || "Not selected"}</p>
                                    </div>

                                    <div className="relative pl-8">
                                        <span className={`absolute left-0 top-1 w-6 h-6 rounded-full border-2 flex items-center justify-center bg-white z-10 ${selectedCenter ? 'border-indigo-600 text-indigo-600' : 'border-gray-300'}`}>
                                            <div className={`w-2 h-2 rounded-full ${selectedCenter ? 'bg-indigo-600' : 'bg-transparent'}`} />
                                        </span>
                                        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Center</p>
                                        <p className="text-sm font-medium text-gray-900">{getCenterName() || "Not selected"}</p>
                                    </div>

                                    <div className="relative pl-8">
                                        <span className={`absolute left-0 top-1 w-6 h-6 rounded-full border-2 flex items-center justify-center bg-white z-10 ${selectedDate ? 'border-indigo-600 text-indigo-600' : 'border-gray-300'}`}>
                                            <div className={`w-2 h-2 rounded-full ${selectedDate ? 'bg-indigo-600' : 'bg-transparent'}`} />
                                        </span>
                                        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Date</p>
                                        <p className="text-sm font-medium text-gray-900">{selectedDate ? new Date(selectedDate).toDateString() : "Not selected"}</p>
                                    </div>

                                    <div className="relative pl-8">
                                        <span className={`absolute left-0 top-1 w-6 h-6 rounded-full border-2 flex items-center justify-center bg-white z-10 ${selectedTimeSlot ? 'border-indigo-600 text-indigo-600' : 'border-gray-300'}`}>
                                            <div className={`w-2 h-2 rounded-full ${selectedTimeSlot ? 'bg-indigo-600' : 'bg-transparent'}`} />
                                        </span>
                                        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Time Slot</p>
                                        <p className="text-sm font-medium text-gray-900">{getSlotTime() || "Not selected"}</p>
                                    </div>
                                </div>

                                <div className="mt-8 pt-6 border-t border-gray-100">
                                    <div className="flex items-start gap-3 p-3 bg-blue-50/50 rounded-lg text-xs text-blue-700 leading-relaxed border border-blue-50">
                                        <HiLocationMarker className="w-4 h-4 shrink-0 mt-0.5" />
                                        <span>Please arrive 15 minutes before your scheduled slot. Bring a valid ID proof.</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </main>
        </div>
    );
};

export default PublicSlotBooking;
