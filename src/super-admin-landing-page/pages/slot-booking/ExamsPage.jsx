import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { getAllExams, deleteExam } from "../../api/slotBookingApi";
import { HiPlus, HiPencil, HiTrash, HiSearch } from "react-icons/hi";

const ExamsPage = () => {
    const navigate = useNavigate();
    const [exams, setExams] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");

    const fetchExams = async () => {
        try {
            setLoading(true);
            const response = await getAllExams();
            if (response.success) {
                setExams(response.data);
            } else {
                toast.error(response.message || "Failed to fetch exams");
            }
        } catch (error) {
            console.error(error);
            toast.error("Error fetching exams");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchExams();
    }, []);

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this exam?")) {
            try {
                const response = await deleteExam(id);
                if (response.success) {
                    toast.success("Exam deleted successfully");
                    fetchExams();
                } else {
                    toast.error(response.message);
                }
            } catch (error) {
                toast.error("Error deleting exam");
            }
        }
    };

    const filteredExams = exams.filter((exam) =>
        exam.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <h2 className="text-2xl font-bold text-gray-800">Exams Management</h2>
                <Link
                    to="/admin/slot-booking/exams/create"
                    className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition"
                >
                    <HiPlus /> Create Exam
                </Link>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-4 border-b flex justify-between items-center gap-4">
                    <div className="relative flex-1 max-w-md">
                        <HiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search exams..."
                            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                {loading ? (
                    <div className="p-8 text-center text-gray-500">Loading exams...</div>
                ) : filteredExams.length === 0 ? (
                    <div className="p-8 text-center text-gray-500">No exams found.</div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-gray-50 text-gray-600 font-medium">
                                <tr>
                                    <th className="px-6 py-3">Name</th>
                                    <th className="px-6 py-3">Description</th>
                                    <th className="px-6 py-3">Status</th>
                                    <th className="px-6 py-3">Created At</th>
                                    <th className="px-6 py-3 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {filteredExams.map((exam) => (
                                    <tr key={exam._id || exam.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 font-medium text-gray-900">
                                            {exam.name}
                                        </td>
                                        <td className="px-6 py-4 text-gray-500">
                                            {exam.description || "-"}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2 py-1 text-[10px] font-bold uppercase rounded-full ${exam.isActive !== false
                                                    ? 'bg-green-100 text-green-700 border border-green-200'
                                                    : 'bg-gray-100 text-gray-600 border border-gray-200'
                                                }`}>
                                                {exam.isActive !== false ? 'Active' : 'Hidden'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-gray-500 text-sm">
                                            {new Date(exam.createdAt || exam.created_at).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4 text-right space-x-2">
                                            <button
                                                onClick={() => navigate(`/admin/slot-booking/exams/edit/${exam._id || exam.id}`)}
                                                className="text-indigo-600 hover:text-indigo-800 p-1"
                                                title="Edit"
                                            >
                                                <HiPencil className="w-5 h-5" />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(exam._id || exam.id)}
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
                )}
            </div>
        </div>
    );
};

export default ExamsPage;
