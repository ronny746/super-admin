import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-hot-toast";
import { createSlot, updateSlot, getSlotById, getAllExams, getCentersByExamId } from "../../api/slotBookingApi";
import { HiArrowLeft, HiSave } from "react-icons/hi";

const SlotsCreatePage = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const isEditMode = !!id;

    const [exams, setExams] = useState([]);
    const [centers, setCenters] = useState([]);
    const [loading, setLoading] = useState(false);
    const [initialLoading, setInitialLoading] = useState(true);

    const [formData, setFormData] = useState({
        examId: "",
        centerId: "",
        startDate: "",
        endDate: "",
        startTime: "",
        endTime: "",
        duration: 60,
        slotCapacity: 10,
        isActive: true,
    });

    useEffect(() => {
        const init = async () => {
            try {
                // Fetch Exams
                const examsRes = await getAllExams();
                if (examsRes.success) setExams(examsRes.data);

                if (isEditMode) {
                    const slotRes = await getSlotById(id);
                    if (slotRes.success) {
                        const data = slotRes.data;
                        setFormData({
                            examId: data.examId?._id || data.examId,
                            centerId: data.centerId?._id || data.centerId,
                            startDate: data.date, // Single date edit maps here
                            endDate: data.date,
                            startTime: data.startTime,
                            endTime: data.endTime,
                            duration: data.duration,
                            slotCapacity: data.slotCapacity,
                            isActive: data.isActive
                        });
                        // Allow centers to load based on exam
                        if (data.examId) {
                            const centersRes = await getCentersByExamId(data.examId?._id || data.examId);
                            if (centersRes.success) setCenters(centersRes.data);
                        }
                    }
                }
            } catch (error) {
                console.error(error);
                toast.error("Failed to load data");
            } finally {
                setInitialLoading(false);
            }
        };
        init();
    }, [id, isEditMode]);

    // Fetch centers when exam changes
    const handleExamChange = async (e) => {
        const examId = e.target.value;
        setFormData(prev => ({ ...prev, examId, centerId: "" }));

        if (examId) {
            try {
                const res = await getCentersByExamId(examId);
                if (res.success) setCenters(res.data);
            } catch (error) {
                console.error(error);
                toast.error("Failed to load centers");
            }
        } else {
            setCenters([]);
        }
    };

    // Helper to calc minutes
    const getMinutes = (timeStr) => {
        if (!timeStr) return 0;
        const [h, m] = timeStr.split(':').map(Number);
        return h * 60 + m;
    };

    // Auto-calculate duration when start/end time changes
    useEffect(() => {
        if (formData.startTime && formData.endTime) {
            const start = getMinutes(formData.startTime);
            const end = getMinutes(formData.endTime);
            if (end > start) {
                setFormData(prev => ({ ...prev, duration: end - start }));
            }
        }
    }, [formData.startTime, formData.endTime]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Frontend Validation
        const start = getMinutes(formData.startTime);
        const end = getMinutes(formData.endTime);
        if (end <= start) {
            toast.error("End time must be after start time");
            return;
        }
        if (formData.duration > (end - start)) {
            toast.error(`Duration (${formData.duration} min) cannot exceed available time (${end - start} min)`);
            return;
        }

        try {
            setLoading(true);
            if (isEditMode) {
                // Edit single slot
                const response = await updateSlot(id, {
                    ...formData,
                    date: formData.startDate // Map back to single date
                });
                if (response.success) {
                    toast.success("Slot updated successfully");
                    navigate("/admin/slot-booking/slots");
                }
            } else {
                // Bulk create slots
                const response = await createSlot(formData);
                if (response.message) {
                    toast.success(`Slots created: ${response.count}, Skipped: ${response.skippedCount}`);
                    navigate("/admin/slot-booking/slots");
                }
            }
        } catch (error) {
            console.error(error);
            toast.error(error.message || "Error saving slots");
        } finally {
            setLoading(false);
        }
    };

    if (initialLoading) return <div className="p-8 text-center text-gray-500">Loading...</div>;

    return (
        <div className="max-w-3xl mx-auto space-y-6">
            <div className="flex items-center gap-4">
                <button onClick={() => navigate("/admin/slot-booking/slots")} className="p-2 rounded-full hover:bg-gray-100 transition">
                    <HiArrowLeft className="w-5 h-5 text-gray-600" />
                </button>
                <h2 className="text-2xl font-bold text-gray-800">{isEditMode ? "Edit Slot" : "Generate Slots"}</h2>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Exam & Center Selection */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Select Exam <span className="text-red-500">*</span></label>
                            <select
                                name="examId"
                                value={formData.examId}
                                onChange={handleExamChange}
                                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
                                required
                                disabled={isEditMode}
                            >
                                <option value="">-- Select Exam --</option>
                                {exams.map(exam => (
                                    <option key={exam._id} value={exam._id}>{exam.name}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Select Center <span className="text-red-500">*</span></label>
                            <select
                                name="centerId"
                                value={formData.centerId}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
                                required
                                disabled={!formData.examId || isEditMode}
                            >
                                <option value="">-- Select Center --</option>
                                {centers.map(center => (
                                    <option key={center._id} value={center._id}>{center.name}, {center.city}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* Date Range */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                {isEditMode ? "Date" : "Start Date"} <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="date"
                                name="startDate"
                                value={formData.startDate}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
                                required
                            />
                        </div>
                        {!isEditMode && (
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">End Date <span className="text-red-500">*</span></label>
                                <input
                                    type="date"
                                    name="endDate"
                                    value={formData.endDate}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
                                    required
                                />
                            </div>
                        )}
                    </div>

                    {/* Time Range */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Daily Start Time <span className="text-red-500">*</span></label>
                            <input
                                type="time"
                                name="startTime"
                                value={formData.startTime}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Daily End Time <span className="text-red-500">*</span></label>
                            <input
                                type="time"
                                name="endTime"
                                value={formData.endTime}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
                                required
                            />
                        </div>
                    </div>

                    {/* Slot Config */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Slot Duration (min) <span className="text-red-500">*</span></label>
                            <input
                                type="number"
                                name="duration"
                                value={formData.duration}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
                                required
                                min="1"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Capacity per Slot <span className="text-red-500">*</span></label>
                            <input
                                type="number"
                                name="slotCapacity"
                                value={formData.slotCapacity}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
                                required
                                min="1"
                            />
                        </div>
                    </div>

                    <div className="pt-4 flex justify-end gap-3 border-t">
                        <button
                            type="button"
                            onClick={() => navigate("/admin/slot-booking/slots")}
                            className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className={`flex items-center gap-2 px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition ${loading ? "opacity-70 cursor-not-allowed" : ""}`}
                        >
                            <HiSave className="w-5 h-5" />
                            {loading ? "Processing..." : isEditMode ? "Update Slot" : "Generate Slots"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default SlotsCreatePage;
