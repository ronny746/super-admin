import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-hot-toast";
import { createExam, getExamById, updateExam } from "../../api/slotBookingApi";
import { HiArrowLeft, HiSave } from "react-icons/hi";

const ExamsCreatePage = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const isEditMode = !!id;

    const [formData, setFormData] = useState({
        name: "",
        description: "",
        isActive: true,
    });
    const [loading, setLoading] = useState(false);
    const [initialLoading, setInitialLoading] = useState(false);

    useEffect(() => {
        if (isEditMode) {
            const fetchExam = async () => {
                try {
                    setInitialLoading(true);
                    const response = await getExamById(id);
                    if (response.success) {
                        setFormData({
                            name: response.data.name,
                            description: response.data.description,
                            isActive: response.data.isActive,
                        });
                    } else {
                        toast.error("Failed to load exam details");
                        navigate("/admin/slot-booking/exams");
                    }
                } catch (error) {
                    console.error(error);
                    toast.error("Error loading exam");
                } finally {
                    setInitialLoading(false);
                }
            };
            fetchExam();
        }
    }, [id, isEditMode, navigate]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.name) {
            toast.error("Exam Name is required");
            return;
        }

        try {
            setLoading(true);
            if (isEditMode) {
                const response = await updateExam(id, formData);
                if (response.success) {
                    toast.success("Exam updated successfully");
                    navigate("/admin/slot-booking/exams");
                } else {
                    toast.error(response.message);
                }
            } else {
                const response = await createExam(formData);
                if (response.success) {
                    toast.success("Exam created successfully");
                    navigate("/admin/slot-booking/exams");
                } else {
                    toast.error(response.message);
                }
            }
        } catch (error) {
            console.error(error);
            toast.error("Error saving exam");
        } finally {
            setLoading(false);
        }
    };

    if (initialLoading) return <div className="p-8 text-center text-gray-500">Loading exam details...</div>;

    return (
        <div className="max-w-2xl mx-auto space-y-6">
            <div className="flex items-center gap-4">
                <button
                    onClick={() => navigate("/admin/slot-booking/exams")}
                    className="p-2 rounded-full hover:bg-gray-100 transition"
                >
                    <HiArrowLeft className="w-5 h-5 text-gray-600" />
                </button>
                <h2 className="text-2xl font-bold text-gray-800">
                    {isEditMode ? "Edit Exam" : "Create New Exam"}
                </h2>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Exam Name <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            placeholder="e.g. Scholarship Test 2024"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Description
                        </label>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            rows="4"
                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            placeholder="Enter exam description..."
                        />
                    </div>

                    <div className="flex items-center gap-2">
                        <input
                            type="checkbox"
                            id="isActive"
                            name="isActive"
                            checked={formData.isActive}
                            onChange={handleChange}
                            className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                        />
                        <label htmlFor="isActive" className="text-sm font-medium text-gray-700">
                            Active Status
                        </label>
                    </div>

                    <div className="pt-4 flex justify-end gap-3">
                        <button
                            type="button"
                            onClick={() => navigate("/admin/slot-booking/exams")}
                            className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className={`flex items-center gap-2 px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition ${loading ? "opacity-70 cursor-not-allowed" : ""
                                }`}
                        >
                            <HiSave className="w-5 h-5" />
                            {loading ? "Saving..." : isEditMode ? "Update Exam" : "Create Exam"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ExamsCreatePage;
