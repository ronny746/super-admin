import React, { useState, useEffect } from "react";
import { LucideUsers, LucideStar, LucidePhone, LucideMail, LucideAward, LucideSearch, LucideRefreshCcw, LucideSettings2 } from "lucide-react";
import { getLeadUsers, updateLeadUser } from "../../api/leadApi";
import ManageRewardsModal from "./ManageRewardsModal";
import toast from "react-hot-toast";

export default function MobileUsersPage() {
    const [searchTerm, setSearchTerm] = useState("");
    const [users, setUsers] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedUserForReward, setSelectedUserForReward] = useState(null);

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            setIsLoading(true);
            const res = await getLeadUsers();
            if (res.success) {
                setUsers(res.data);
            }
        } catch (error) {
            console.error("Failed to fetch lead users:", error);
            toast.error("Failed to load mobile users list");
        } finally {
            setIsLoading(false);
        }
    };

    const filteredUsers = users.filter(u =>
        `${u.firstName} ${u.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.mobileNumber.includes(searchTerm)
    );

    return (
        <div className="p-6 space-y-6">
            <ManageRewardsModal 
                isOpen={!!selectedUserForReward}
                onClose={() => setSelectedUserForReward(null)}
                user={selectedUserForReward}
                onUpdate={fetchUsers}
            />

            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-center gap-4 bg-linear-to-r from-blue-50 to-indigo-50 p-6 rounded-2xl border border-blue-100">
                <div>
                    <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                        <LucideAward className="text-blue-600" size={24} />
                        Mobile App Users & Rewards
                    </h2>
                    <p className="text-gray-600 mt-1">Manage rewards and monitor performance for mobile counselors.</p>
                </div>
                <div className="flex items-center gap-3 w-full md:w-auto">
                    <div className="relative flex-1 md:w-64">
                        <LucideSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        <input
                            type="text"
                            placeholder="Search by name or mobile..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                        />
                    </div>
                    <button 
                        onClick={fetchUsers}
                        className="p-2.5 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 text-gray-600 transition-all"
                        title="Refresh List"
                    >
                        <LucideRefreshCcw size={20} className={isLoading ? "animate-spin" : ""} />
                    </button>
                </div>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                    <div className="text-sm font-medium text-gray-500 mb-1">Total Mobile Users</div>
                    <div className="text-3xl font-bold text-gray-800">{users.length}</div>
                </div>
                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm border-l-4 border-l-blue-600">
                    <div className="text-sm font-medium text-gray-500 mb-1">Total Rewards Distributed</div>
                    <div className="text-3xl font-bold text-blue-600">
                        {users.reduce((acc, u) => acc + (u.points || 0), 0).toLocaleString()} <span className="text-sm font-normal text-gray-400">Points</span>
                    </div>
                </div>
            </div>

            {/* Users Table/Grid */}
            <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50 border-b border-gray-200">
                            <tr>
                                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">User</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Contact</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Role</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-center">Total Leads</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-right">Points</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-right">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {filteredUsers.map((user) => (
                                <tr key={user._id} className="hover:bg-blue-50/30 transition-colors group">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
                                                {user.firstName.charAt(0)}
                                            </div>
                                            <div>
                                                <div className="font-bold text-gray-800">{user.firstName} {user.lastName}</div>
                                                <div className="text-xs text-gray-500">Member since {new Date(user.createdAt).toLocaleDateString()}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm text-gray-700 flex flex-col gap-1">
                                            <span className="flex items-center gap-1.5"><LucidePhone size={14} className="text-gray-400" /> {user.mobileNumber}</span>
                                            <span className="flex items-center gap-1.5"><LucideMail size={14} className="text-gray-400" /> {user.email}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-gray-100 text-gray-600 border border-gray-200">
                                            {user.role}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-center">
                                        <span className="text-sm font-bold text-gray-700 bg-blue-50 px-3 py-1 rounded-lg border border-blue-100">
                                            {user.totalLeads || 0}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <span className="text-lg font-black text-blue-600">{user.points || 0}</span>
                                            <LucideStar size={16} className="text-yellow-500 fill-yellow-500" />
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right">
                                        <button 
                                            onClick={() => setSelectedUserForReward(user)}
                                            className="px-4 py-2 bg-blue-600 text-white rounded-lg font-bold text-xs hover:bg-blue-700 transition-all flex items-center gap-2 shadow-sm ml-auto"
                                        >
                                            <LucideAward size={14} /> Manage Rewards
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            {filteredUsers.length === 0 && !isLoading && (
                                <tr>
                                    <td colSpan="8" className="px-6 py-12 text-center text-gray-500 italic">
                                        No mobile users found matching your search.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
