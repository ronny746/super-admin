import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-hot-toast";
import { createCenter, getCenterById, updateCenter, getAllExams } from "../../api/slotBookingApi";
import { HiArrowLeft, HiSave } from "react-icons/hi";

const CentersCreatePage = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const isEditMode = !!id;

    const [exams, setExams] = useState([]);
    const [formData, setFormData] = useState({
        name: "",
        examId: "",
        address: "",
        city: "",
        state: "",
        zipCode: "",
        isActive: true,
    });
    const [loading, setLoading] = useState(false);
    const [initialLoading, setInitialLoading] = useState(true);

    useEffect(() => {
        const init = async () => {
            try {
                // Fetch exams for dropdown
                const examsRes = await getAllExams();
                if (examsRes.success) {
                    setExams(examsRes.data);
                }

                if (isEditMode) {
                    const response = await getCenterById(id);
                    if (response) { // getCenterById returns object directly sometimes or {data: ...}
                        const data = response.data || response;
                        setFormData({
                            name: data.name,
                            examId: data.examId?._id || data.examId,
                            address: data.address,
                            city: data.city,
                            state: data.state,
                            zipCode: data.zipCode || data.zip_code,
                            isActive: data.isActive,
                        });
                    }
                }
            } catch (err) {
                console.error(err);
                toast.error("Failed to load data");
            } finally {
                setInitialLoading(false);
            }
        }
        init();
    }, [id, isEditMode]);


    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.name || !formData.examId || !formData.city) {
            toast.error("Please fill required fields");
            return;
        }

        try {
            setLoading(true);
            if (isEditMode) {
                const response = await updateCenter(id, formData);
                if (response.success || response.message) {
                    toast.success("Center updated successfully");
                    navigate("/admin/slot-booking/centers");
                }
            } else {
                const response = await createCenter(formData);
                if (response.message) {
                    toast.success("Center created successfully");
                    navigate("/admin/slot-booking/centers");
                }
            }
        } catch (error) {
            console.error(error);
            toast.error("Error saving center");
        } finally {
            setLoading(false);
        }
    };

    if (initialLoading) return <div className="p-8 text-center">Loading...</div>;

    return (
        <div className="max-w-2xl mx-auto space-y-6">
            <div className="flex items-center gap-4">
                <button
                    onClick={() => navigate("/admin/slot-booking/centers")}
                    className="p-2 rounded-full hover:bg-gray-100 transition"
                >
                    <HiArrowLeft className="w-5 h-5 text-gray-600" />
                </button>
                <h2 className="text-2xl font-bold text-gray-800">
                    {isEditMode ? "Edit Center" : "Add New Center"}
                </h2>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <form onSubmit={handleSubmit} className="space-y-4">

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Select Exam <span className="text-red-500">*</span>
                        </label>
                        <select
                            name="examId"
                            value={formData.examId}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            required
                        >
                            <option value="">-- Select Exam --</option>
                            {exams.map(exam => (
                                <option key={exam._id} value={exam._id}>{exam.name}</option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Center Name <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            placeholder="e.g. Kota Center 1"
                            required
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                City <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                name="city"
                                value={formData.city}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                State
                            </label>
                            <input
                                type="text"
                                name="state"
                                value={formData.state}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Zip Code
                            </label>
                            <input
                                type="text"
                                name="zipCode"
                                value={formData.zipCode}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Full Address
                        </label>
                        <textarea
                            name="address"
                            value={formData.address}
                            onChange={handleChange}
                            rows="3"
                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            placeholder="Enter full address..."
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
                            onClick={() => navigate("/admin/slot-booking/centers")}
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
                            {loading ? "Saving..." : isEditMode ? "Update Center" : "Create Center"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CentersCreatePage;
