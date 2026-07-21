import React, { useState, useEffect } from "react";
import { LucideUserPlus, LucideTrash2, LucideMail, LucidePhone, LucideStar, LucideLayoutDashboard, LucideKey } from "lucide-react";
import { Link } from "react-router-dom";
import CreateStaffModal from "./CreateStaffModal";
import DeleteConfirmModal from "./DeleteConfirmModal";
import { createStaff, getStaff, deleteStaff } from "../../api/staffApi";
import toast from "react-hot-toast";

const mockStaff = [
    {
        id: 1,
        name: "Amit Sharma",
        role: "Counselor",
        mobile: "9876543210",
        email: "amit.s@academy.com",
        status: "Active",
        activeLeads: 156,
        stats: [
            { label: "Total Leads", value: "156", change: "+12%", color: "text-blue-600", fromColor: "from-blue-500", toColor: "to-cyan-400", bg: "bg-blue-50" },
            { label: "Converted", value: "24", change: "+5%", color: "text-green-600", fromColor: "from-emerald-500", toColor: "to-teal-400", bg: "bg-green-50" },
            { label: "Follow Ups", value: "32", change: "-2%", color: "text-orange-600", fromColor: "from-orange-500", toColor: "to-amber-400", bg: "bg-orange-50" },
            { label: "Target Achieved", value: "85%", change: "+8%", color: "text-purple-600", fromColor: "from-violet-500", toColor: "to-fuchsia-400", bg: "bg-purple-50" },
        ],
        tasks: [
            { id: 101, title: "Call Rohit (Student)", type: "Call", time: "10:30 AM", status: "Pending", priority: "High" },
            { id: 102, title: "Parent Meeting (Mrs. Verma)", type: "Meeting", time: "02:00 PM", status: "Confirmed", priority: "High" },
            { id: 103, title: "Update Lead - Amina", type: "Update", time: "04:00 PM", status: "Pending", priority: "Medium" },
        ],
        recentLeads: [
            { id: "L101", name: "Aarav Patel", course: "IIT-JEE", status: "New", lastUpdate: "10 mins ago" },
            { id: "L102", name: "Meera Reddy", course: "NEET", status: "In Process", lastUpdate: "1 hour ago" },
            { id: "L103", name: "Suresh Raina", course: "Foundation", status: "Follow Up", lastUpdate: "3 hours ago" },
            { id: "L104", name: "Priya Malik", course: "IIT-JEE", status: "Converted", lastUpdate: "Yesterday" },
        ]
    },
    {
        id: 2,
        name: "Sneha Verma",
        role: "Sales Executive",
        mobile: "8765432109",
        email: "sneha.v@academy.com",
        status: "Active",
        activeLeads: 89,
        stats: [
            { label: "Total Leads", value: "89", change: "+4%", color: "text-blue-600", fromColor: "from-blue-500", toColor: "to-cyan-400", bg: "bg-blue-50" },
            { label: "Converted", value: "12", change: "+1%", color: "text-green-600", fromColor: "from-emerald-500", toColor: "to-teal-400", bg: "bg-green-50" },
            { label: "Follow Ups", value: "15", change: "+5%", color: "text-orange-600", fromColor: "from-orange-500", toColor: "to-amber-400", bg: "bg-orange-50" },
            { label: "Target Achieved", value: "60%", change: "-2%", color: "text-purple-600", fromColor: "from-violet-500", toColor: "to-fuchsia-400", bg: "bg-purple-50" },
        ],
        tasks: [
            { id: 201, title: "Follow up with Vikram", type: "Call", time: "11:00 AM", status: "Pending", priority: "Medium" },
            { id: 202, title: "Send Brochure to Aryan", type: "Email", time: "01:30 PM", status: "Done", priority: "Low" },
        ],
        recentLeads: [
            { id: "L201", name: "Vikram Singh", course: "NEET", status: "New", lastUpdate: "20 mins ago" },
            { id: "L202", name: "Aryan Khan", course: "IIT-JEE", status: "In Process", lastUpdate: "2 hours ago" },
        ]
    },
    {
        id: 3,
        name: "Rohan Das",
        role: "Telecaller",
        mobile: "7654321098",
        email: "rohan.d@academy.com",
        status: "Inactive",
        activeLeads: 0,
        stats: [
            { label: "Total Calls", value: "0", change: "0%", color: "text-gray-600", fromColor: "from-gray-400", toColor: "to-gray-300", bg: "bg-gray-50" },
            { label: "Connected", value: "0", change: "0%", color: "text-gray-600", fromColor: "from-gray-400", toColor: "to-gray-300", bg: "bg-gray-50" },
            { label: "Follow Ups", value: "0", change: "0%", color: "text-gray-600", fromColor: "from-gray-400", toColor: "to-gray-300", bg: "bg-gray-50" },
            { label: "Target", value: "0%", change: "0%", color: "text-gray-600", fromColor: "from-gray-400", toColor: "to-gray-300", bg: "bg-gray-50" },
        ],
        tasks: [],
        recentLeads: []
    },
];

export default function StaffPage() {
    const [searchTerm, setSearchTerm] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [selectedStaff, setSelectedStaff] = useState(null);
    const [staffList, setStaffList] = useState([]);

    useEffect(() => {
        fetchStaff();
    }, []);

    const fetchStaff = async () => {
        try {
            const res = await getStaff();
            if (res.success) {
                const formattedStaff = res.data.map(user => ({
                    id: user._id,
                    name: user.name || `${user.firstName || ''} ${user.lastName || ''}`.trim(),
                    role: user.role === 'COUNSELOR' ? 'Counselor' : (user.role.charAt(0).toUpperCase() + user.role.slice(1).toLowerCase().replace('_', ' ')),
                    mobile: user.mobileNumber || "N/A",
                    email: user.email,
                    status: "Active", // Assuming active if returned
                    activeLeads: user.activeLeads || 0,
                    stats: [
                        { label: "Total Leads", value: (user.activeLeads || 0).toString(), change: "0%", color: "text-blue-600", fromColor: "from-blue-500", toColor: "to-cyan-400", bg: "bg-blue-50" },
                        { label: "Converted", value: "0", change: "0%", color: "text-green-600", fromColor: "from-emerald-500", toColor: "to-teal-400", bg: "bg-green-50" },
                        { label: "Follow Ups", value: "0", change: "0%", color: "text-orange-600", fromColor: "from-orange-500", toColor: "to-amber-400", bg: "bg-orange-50" },
                        { label: "Target Achieved", value: "0%", change: "0%", color: "text-purple-600", fromColor: "from-violet-500", toColor: "to-fuchsia-400", bg: "bg-purple-50" },
                    ],
                    tasks: [],
                    recentLeads: []
                }));
                setStaffList(formattedStaff);
            }
        } catch (error) {
            console.error("Failed to fetch staff:", error);
            // toast.error("Failed to load staff list"); // Optional
            setStaffList(mockStaff); // Fallback to mock if failed (or remove if unwanted)
        }
    };

    const handleCreateStaff = async (formData) => {
        try {
            const res = await createStaff(formData);
            if (res.success) {
                toast.success(`Staff ${res.user.name} created successfully!`);
                fetchStaff(); // Refresh list
            }
        } catch (error) {
            console.error("Create staff error:", error);
            toast.error(error.response?.data?.message || "Failed to create staff");
        }
    };

    const handleDeleteStaff = async (staffId, staffName) => {
        setSelectedStaff({ id: staffId, name: staffName });
        setIsDeleteModalOpen(true);
    };

    const confirmDelete = async () => {
        if (!selectedStaff) return;

        try {
            const res = await deleteStaff(selectedStaff.id);
            if (res.success) {
                toast.success(`${selectedStaff.name} removed successfully!`);
                fetchStaff(); // Refresh list
            }
        } catch (error) {
            console.error("Delete staff error:", error);
            toast.error(error.response?.data?.message || "Failed to remove staff");
        } finally {
            setIsDeleteModalOpen(false);
            setSelectedStaff(null);
        }
    };

    const filteredStaff = staffList.filter(s =>
        s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.mobile.includes(searchTerm)
    );

    return (
        <>
            <CreateStaffModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSubmit={handleCreateStaff}
            />
            <DeleteConfirmModal
                isOpen={isDeleteModalOpen}
                onClose={() => {
                    setIsDeleteModalOpen(false);
                    setSelectedStaff(null);
                }}
                onConfirm={confirmDelete}
                staffName={selectedStaff?.name || ""}
            />
            <div className="p-6 space-y-6">
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-center gap-4 bg-linear-to-r from-blue-50 to-indigo-50 p-6 rounded-2xl border border-blue-100">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                            <LucideKey className="text-blue-600" size={24} />
                            Staff & Credentials Manager
                        </h2>
                        <p className="text-gray-600 mt-1">Create accounts and manage dashboards for your counselors and sales team.</p>
                    </div>
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 shadow-lg hover:shadow-blue-200 transition-all font-medium"
                    >
                        <LucideUserPlus size={20} />
                        Add New Counselor
                    </button>
                </div>

                {/* List */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredStaff.map((staff) => (
                        <div key={staff.id} className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 group p-6 relative">
                            <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button className="text-gray-400 hover:text-yellow-500 transition-colors">
                                    <LucideStar size={20} />
                                </button>
                            </div>

                            <div className="flex items-center gap-4 mb-6">
                                <div className="w-14 h-14 rounded-full bg-linear-to-br from-blue-100 to-indigo-200 flex items-center justify-center text-blue-700 font-bold text-xl shadow-inner">
                                    {staff.name.charAt(0)}
                                </div>
                                <div>
                                    <h3 className="font-bold text-gray-800 text-lg">{staff.name}</h3>
                                    <div className="flex items-center gap-2 mt-1">
                                        <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md border border-blue-100">
                                            {staff.role}
                                        </span>
                                        <span className={`text-xs font-semibold px-2 py-0.5 rounded-md border ${staff.status === 'Active' ? 'text-green-600 bg-green-50 border-green-100' : 'text-gray-500 bg-gray-50 border-gray-200'}`}>
                                            {staff.status}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-3 mb-6 bg-gray-50 p-4 rounded-xl border border-gray-100">
                                <div className="flex items-center text-sm text-gray-600 gap-3">
                                    <LucidePhone size={16} className="text-gray-400" />
                                    {staff.mobile}
                                </div>
                                <div className="flex items-center text-sm text-gray-600 gap-3">
                                    <LucideMail size={16} className="text-gray-400" />
                                    {staff.email}
                                </div>
                            </div>

                            <div className="flex items-center justify-between mb-4">
                                <span className="text-sm text-gray-500">Active Leads</span>
                                <span className="text-lg font-bold text-gray-800">{staff.activeLeads}</span>
                            </div>

                            <div className="grid grid-cols-2 gap-3 pt-2">
                                <Link to="/admin/lead-management/dashboard" state={{ counselor: staff }} className="flex items-center justify-center gap-2 py-2.5 text-sm rounded-lg font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 transition-colors">
                                    <LucideLayoutDashboard size={16} />
                                    View Dashboard
                                </Link>
                                <button
                                    onClick={() => handleDeleteStaff(staff.id, staff.name)}
                                    className="flex items-center justify-center gap-2 py-2.5 text-sm rounded-lg font-medium text-red-600 bg-red-50 hover:bg-red-100 transition-colors"
                                >
                                    <LucideTrash2 size={16} />
                                    Remove
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
}
