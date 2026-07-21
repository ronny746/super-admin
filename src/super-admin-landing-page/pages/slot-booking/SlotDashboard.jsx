import React, { useEffect, useState } from "react";
import { getBookingStats } from "../../api/slotBookingApi";
import { HiUserGroup, HiCheckCircle, HiXCircle, HiCalendar, HiClipboardCopy } from "react-icons/hi";
import { toast } from "react-hot-toast";

const SlotBookingDashboard = () => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                setLoading(true);
                const response = await getBookingStats();
                if (response.success) {
                    setStats(response.data);
                } else {
                    setError(response.message);
                }
            } catch (err) {
                console.error(err);
                setError("Failed to fetch dashboard stats. Is backend running?");
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, []);

    if (loading) return <div className="p-4">Loading dashboard...</div>;
    if (error) return <div className="p-4 text-red-600">Error: {error}</div>;

    const StatCard = ({ title, value, icon: Icon, color }) => (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center space-x-4">
            <div className={`p-3 rounded-full ${color} bg-opacity-10 text-white`}>
                <Icon className={`w-8 h-8 ${color.replace("bg-", "text-")}`} />
            </div>
            <div>
                <p className="text-sm text-gray-500 font-medium">{title}</p>
                <p className="text-2xl font-bold text-gray-900">{value}</p>
            </div>
        </div>
    );

    const copyPublicLink = () => {
        const url = `${window.location.origin}/book-slot`;
        navigator.clipboard.writeText(url);
        toast.success("Public booking link copied!");
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-800">Booking Overview</h2>
                <button 
                    onClick={copyPublicLink}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition shadow-sm"
                >
                    <HiClipboardCopy className="w-5 h-5" />
                    <span className="font-medium text-sm">Copy Public Link</span>
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                    title="Total Bookings"
                    value={stats?.total_bookings || 0}
                    icon={HiCalendar}
                    color="bg-blue-600"
                />
                <StatCard
                    title="Confirmed"
                    value={stats?.confirmed_bookings || 0}
                    icon={HiCheckCircle}
                    color="bg-green-600"
                />
                <StatCard
                    title="Cancelled"
                    value={stats?.cancelled_bookings || 0}
                    icon={HiXCircle}
                    color="bg-red-600"
                />
                <StatCard
                    title="Unique Guests"
                    value={stats?.unique_guests || 0}
                    icon={HiUserGroup}
                    color="bg-blue-500"
                />
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 mt-8">
                <p className="text-gray-600">
                    Welcome to the Slot Booking Module! You can manage Exams, Centers, and Slots from the sidebar.
                </p>
            </div>
        </div>
    );
};

export default SlotBookingDashboard;
