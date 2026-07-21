import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { getAllCenters, deleteCenter } from "../../api/slotBookingApi";
import { HiPlus, HiPencil, HiTrash, HiSearch, HiOfficeBuilding } from "react-icons/hi";

const CentersPage = () => {
    const navigate = useNavigate();
    const [centers, setCenters] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");

    const fetchCenters = async () => {
        try {
            setLoading(true);
            const response = await getAllCenters();
            if (response.success) {
                setCenters(response.data);
            } else {
                toast.error(response.message || "Failed to fetch centers");
            }
        } catch (error) {
            console.error(error);
            toast.error("Error fetching centers");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCenters();
    }, []);

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this center?")) {
            try {
                const response = await deleteCenter(id);
                if (response.success || response.message === "Exam center deleted successfully") {
                    toast.success("Center deleted successfully");
                    fetchCenters();
                } else {
                    toast.error(response.message || "Failed to delete");
                }
            } catch (error) {
                toast.error("Error deleting center");
            }
        }
    };

    const filteredCenters = centers.filter((center) =>
        center.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        center.city.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <h2 className="text-2xl font-bold text-gray-800">Exam Centers</h2>
                <Link
                    to="/admin/slot-booking/centers/create"
                    className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition"
                >
                    <HiPlus /> Add Center
                </Link>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-4 border-b flex justify-between items-center gap-4">
                    <div className="relative flex-1 max-w-md">
                        <HiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search centers..."
                            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                {loading ? (
                    <div className="p-8 text-center text-gray-500">Loading centers...</div>
                ) : filteredCenters.length === 0 ? (
                    <div className="p-8 text-center text-gray-500">No centers found.</div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
                        {filteredCenters.map((center) => (
                            <div key={center._id || center.id} className="bg-gray-50 rounded-xl p-5 border border-gray-100 hover:shadow-md transition">
                                <div className="flex justify-between items-start mb-3">
                                    <div className="bg-white p-2 rounded-lg shadow-sm text-indigo-600">
                                        <HiOfficeBuilding className="w-6 h-6" />
                                    </div>
                                    <div className="flex space-x-2">
                                        <button
                                            onClick={() => navigate(`/admin/slot-booking/centers/edit/${center._id || center.id}`)}
                                            className="text-gray-400 hover:text-indigo-600 transition"
                                        >
                                            <HiPencil className="w-5 h-5" />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(center._id || center.id)}
                                            className="text-gray-400 hover:text-red-600 transition"
                                        >
                                            <HiTrash className="w-5 h-5" />
                                        </button>
                                    </div>
                                </div>
                                <h3 className="text-lg font-bold text-gray-800 mb-1">{center.name}</h3>
                                <p className="text-sm text-gray-500 mb-3">{center.city}, {center.state}</p>
                                <div className="text-sm text-gray-600">
                                    <p className="line-clamp-2">{center.address}</p>
                                </div>
                                <div className="mt-4 pt-3 border-t border-gray-200 flex justify-between items-center text-xs text-gray-500">
                                    <span>For Exam: <span className="font-medium text-gray-700">{center.examId?.name || "Unknown"}</span></span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default CentersPage;
