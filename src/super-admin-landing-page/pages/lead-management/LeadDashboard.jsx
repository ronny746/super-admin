import {
    LucideTrendingUp, LucideCheckCircle, LucideAlertCircle, LucideUsers,
    LucideTarget, LucideCalendar, LucideClock, LucidePhone, LucideMoreVertical,
    LucideMail, LucideBriefcase, LucideArrowLeft
} from "lucide-react";
import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAppContext } from "../../context/AppContext";
import { getDashboardData } from "../../api/dashboardApi";
import { updateLeadStatus, getAllLeads } from "../../api/leadApi";
import LeadDrawer from "./LeadDrawer";
import toast from "react-hot-toast";

// Counting Animation Component
const Counter = ({ value, duration = 1000 }) => {
    const [count, setCount] = useState(0);
    const numericValue = typeof value === 'string' ? parseInt(value.replace(/,/g, '')) : value;

    useEffect(() => {
        let start = 0;
        const end = numericValue;
        if (start === end) {
            setCount(end);
            return;
        }

        const totalFrames = Math.round(duration / 16);
        const increment = end / totalFrames;
        
        let currentCount = 0;
        const timer = setInterval(() => {
            currentCount += increment;
            if (currentCount >= end) {
                setCount(end);
                clearInterval(timer);
            } else {
                setCount(Math.floor(currentCount));
            }
        }, 16);

        return () => clearInterval(timer);
    }, [numericValue, duration]);

    return <span>{count.toLocaleString()}</span>;
};

export default function LeadDashboard() {
    const location = useLocation();
    const navigate = useNavigate();
    const { user } = useAppContext();
    const [filter, setFilter] = useState("today");
    const [dashboardData, setDashboardData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [selectedLeadForDetails, setSelectedLeadForDetails] = useState(null);
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    
    const [showingAllLeads, setShowingAllLeads] = useState(false);
    const [allLeads, setAllLeads] = useState([]);
    const [loadingAllLeads, setLoadingAllLeads] = useState(false);

    // Determine if we are viewing as a counselor (self) or admin viewing a counselor
    const isSelfView = user?.role === 'COUNSELOR';
    const locationCounselor = location.state?.counselor;
    const showBackButton = !!locationCounselor;

    useEffect(() => {
        fetchDashboard();
    }, []);

    const fetchDashboard = async () => {
        try {
            setLoading(true);
            const counselorId = locationCounselor?.id || locationCounselor?._id;
            const res = await getDashboardData(counselorId);
            if (res.success) {
                setDashboardData(res.data);
            }
        } catch (error) {
            console.error("Failed to fetch dashboard data", error);
        } finally {
            setLoading(false);
        }
    };

    const handleStatusUpdate = async (leadId, newStatus) => {
        try {
            const res = await updateLeadStatus(leadId, newStatus);
            if (res.success) {
                toast.success(`Status updated to ${newStatus}`);
                fetchDashboard(); // Refresh to update stats
            }
        } catch (error) {
            console.error("Status update error details:", error.response?.data || error.message);
            const errorMsg = error.response?.data?.message || "Failed to update status";
            toast.error(errorMsg);
        }
    };

    const isAdmin = ['SUPER_ADMIN', 'ADMIN', 'SUB_ADMIN'].includes(user?.role);

    const organizationStats = dashboardData ? [
        { label: "Total Organization Leads", value: dashboardData.stats?.totalLeads || 0, change: "+0%", icon: LucideUsers, color: "text-blue-600", fromColor: "from-blue-500", toColor: "to-cyan-400", bg: "bg-blue-50" },
        { label: "Total Admissions", value: dashboardData.stats?.totalAdmissions || 0, change: "+0%", icon: LucideCheckCircle, color: "text-green-600", fromColor: "from-emerald-500", toColor: "to-teal-400", bg: "bg-green-50" },
        { label: "New Leads", value: dashboardData.stats?.statusCounts?.["New"] || 0, change: "+0%", icon: LucideTrendingUp, color: "text-purple-600", fromColor: "from-violet-500", toColor: "to-fuchsia-400", bg: "bg-purple-50" },
        { label: "Follow Ups Needed", value: dashboardData.stats?.statusCounts?.["Follow Up"] || 0, change: "+0%", icon: LucidePhone, color: "text-orange-600", fromColor: "from-orange-500", toColor: "to-amber-400", bg: "bg-orange-50" },
    ] : [];

    const formatDashboardToCounselor = (user, data) => ({
        id: user?._id || user?.id,
        name: user?.name,
        role: "Counselor",
        email: user?.email,
        mobile: user?.mobileNumber || user?.mobile || "N/A",
        status: user?.isActive || user?.status === "Active" ? "Active" : "Inactive",
        activeLeads: data.stats?.totalLeads || 0,
        stats: [
            { label: "My Leads", value: data.stats?.totalLeads || 0, change: "+0%", color: "text-blue-600", fromColor: "from-blue-500", toColor: "to-cyan-400", bg: "bg-blue-50" },
            { label: "My Admissions", value: data.stats?.totalAdmissions || 0, change: "+0%", color: "text-green-800", fromColor: "from-emerald-500", toColor: "to-teal-400", bg: "bg-green-50" },
            { label: "Pending Follow Up", value: data.stats?.statusCounts?.["Follow Up"] || 0, change: "-0%", color: "text-orange-800", fromColor: "from-orange-500", toColor: "to-amber-400", bg: "bg-orange-50" },
            { label: "Conversion Rate", value: data.stats?.totalLeads ? `${Math.round((data.stats.totalAdmissions / data.stats.totalLeads) * 100)}%` : "0%", change: "+0%", color: "text-purple-600", fromColor: "from-violet-500", toColor: "to-fuchsia-400", bg: "bg-purple-50" },
        ],
        tasks: data.tasks || [],
        recentLeads: data.recentLeads?.map(l => ({
            id: l._id,
            name: l.studentName || l.firstName, // Fallback
            course: l.course || "N/A",
            status: l.status,
            lastUpdate: new Date(l.updatedAt).toLocaleDateString(),
            fullLead: l // Pass full object for Modal
        })) || []
    });

    const counselor = (locationCounselor && dashboardData) 
        ? formatDashboardToCounselor(locationCounselor, dashboardData) 
        : locationCounselor || (isSelfView && dashboardData ? formatDashboardToCounselor(user, dashboardData) : null);

    // Final stats to display
    const currentStats = counselor ? counselor.stats.map(s => ({
        ...s,
        icon: s.label.includes("Admissions") || s.label.includes("Converted") ? LucideCheckCircle :
            s.label.includes("Follow") ? LucidePhone :
                s.label.includes("Rate") || s.label.includes("Target") ? LucideTarget : LucideUsers
    })) : organizationStats;

    const currentTasks = counselor?.tasks || dashboardData?.tasks || [];
    const recentLeads = counselor?.recentLeads || dashboardData?.recentLeads?.map(l => ({
        id: l._id,
        name: l.studentName,
        course: l.course,
        status: l.status,
        lastUpdate: new Date(l.updatedAt).toLocaleDateString(),
        fullLead: l 
    })) || [];
    
    const displayLeads = showingAllLeads ? (allLeads.length > 0 ? allLeads : recentLeads) : recentLeads;

    if (loading && !dashboardData) {
        return (
            <div className="flex flex-col items-center justify-center h-[60vh] space-y-4">
                <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                <p className="text-gray-500 font-bold animate-pulse">Syncing real-time lead data...</p>
            </div>
        );
    }

    return (
        <div className="space-y-8 p-2">
            <LeadDrawer 
                isOpen={isDrawerOpen} 
                onClose={() => setIsDrawerOpen(false)} 
                lead={selectedLeadForDetails}
                onLeadUpdated={() => {
                    fetchDashboard(); // Simple refresh for dashboard stats
                }}
            />
            {/* Header Section */}
            {counselor ? (
                <div className="space-y-6">
                    {showBackButton && (
                        <button
                            onClick={() => navigate("/admin/lead-management/staff")}
                            className="flex items-center gap-2 text-gray-500 hover:text-gray-800 transition-colors mb-2 font-medium"
                        >
                            <LucideArrowLeft size={20} />
                            Back to Staff List
                        </button>
                    )}
                    <div className="bg-linear-to-r from-slate-900 to-slate-800 rounded-2xl p-6 text-white shadow-xl relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full -mr-16 -mt-16 blur-2xl"></div>
                        <div className="flex flex-col md:flex-row items-center gap-6 relative z-10">
                            <div className="w-20 h-20 rounded-full bg-linear-to-br from-blue-400 to-indigo-500 p-1 shadow-lg">
                                <div className="w-full h-full rounded-full bg-slate-800 flex items-center justify-center text-2xl font-bold text-blue-200">
                                    {(counselor.name || "C").charAt(0)}
                                </div>
                            </div>
                            <div className="text-center md:text-left">
                                <h1 className="text-3xl font-bold">{counselor.name}</h1>
                                <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 mt-2 text-slate-300 text-sm">
                                    <span className="flex items-center gap-1"><LucideBriefcase size={14} /> {counselor.role}</span>
                                    {counselor.mobile && <span className="flex items-center gap-1"><LucidePhone size={14} /> {counselor.mobile}</span>}
                                    {counselor.email && <span className="flex items-center gap-1"><LucideMail size={14} /> {counselor.email}</span>}
                                </div>
                            </div>
                            <div className="ml-auto flex gap-3">
                                <div className="px-4 py-2 bg-white/10 rounded-lg text-center backdrop-blur-sm border border-white/10">
                                    <div className="text-xs text-slate-400">Status</div>
                                    <div className="text-green-400 font-semibold">{counselor.status}</div>
                                </div>
                                <div className="px-4 py-2 bg-white/10 rounded-lg text-center backdrop-blur-sm border border-white/10">
                                    <div className="text-xs text-slate-400">Leads</div>
                                    <div className="text-blue-300 font-semibold">
                                        <Counter value={counselor.activeLeads} />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
                    <div>
                        <h1 className="text-3xl font-bold bg-linear-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                            Hello, {user?.name || 'Admin'} 👋
                        </h1>
                        <p className="text-gray-500 mt-1">
                            Here's the overview of your entire lead management system.
                        </p>
                    </div>
                    <div className="flex gap-2">
                        <select
                            value={filter}
                            onChange={(e) => setFilter(e.target.value)}
                            className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
                        >
                            <option value="today">Today</option>
                            <option value="week">This Week</option>
                            <option value="month">This Month</option>
                        </select>
                    </div>
                </div>
            )}
            
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {currentStats.map((stat, idx) => (
                    <div key={idx} className="relative group overflow-hidden bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300">
                        <div className={`absolute top-0 right-0 w-24 h-24 bg-linear-to-br ${stat.fromColor} ${stat.toColor} opacity-10 rounded-bl-full -mr-4 -mt-4 transition-transform group-hover:scale-110 duration-500`}></div>
                        <div className="flex justify-between items-start relative z-10">
                            <div>
                                <p className="text-sm font-medium text-gray-500">{stat.label}</p>
                                <h3 className="text-3xl font-bold mt-2 text-gray-800">
                                    {stat.label.includes("%") || typeof stat.value === 'string' && stat.value.includes("%") 
                                        ? stat.value 
                                        : <Counter value={stat.value} />
                                    }
                                </h3>
                            </div>
                            <div className={`p-3 rounded-xl ${stat.bg} ${stat.color} shadow-sm group-hover:scale-110 transition-transform duration-300`}>
                                <stat.icon size={24} />
                            </div>
                        </div>
                        <div className="mt-4 flex items-center text-sm relative z-10">
                            <span className={`flex items-center font-semibold ${stat.change?.startsWith("+") ? "text-green-600" : "text-gray-500"} bg-gray-50 px-2 py-0.5 rounded-md`}>
                                <LucideTrendingUp size={14} className="mr-1" />
                                {stat.change}
                            </span>
                            <span className="text-gray-400 ml-2">real-time sync</span>
                        </div>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Content Area: Leads/Chart */}
                <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm p-6 relative overflow-hidden">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                            <LucideTrendingUp size={20} className="text-blue-500" />
                            {counselor ? "My Assigned Leads" : "Recent Organization Activity"}
                        </h3>
                        {!counselor && (
                            <button className="text-gray-400 hover:text-blue-600 transition-colors">
                                <LucideMoreVertical size={20} />
                            </button>
                        )}
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead className="bg-gray-50/50 border-b border-gray-100">
                                <tr>
                                    <th className="p-3 text-sm font-medium text-gray-500">Lead Name</th>
                                    {!counselor && <th className="p-3 text-sm font-medium text-gray-500">Assigned To</th>}
                                    <th className="p-3 text-sm font-medium text-gray-500">Course</th>
                                    <th className="p-3 text-sm font-medium text-gray-500">Date/Update</th>
                                    <th className="p-3 text-sm font-medium text-gray-500">Status</th>
                                    <th className="p-3 text-sm font-medium text-gray-500 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {loadingAllLeads ? (
                                    <tr>
                                        <td colSpan={!counselor ? "6" : "5"} className="p-8 text-center text-gray-500">Loading leads...</td>
                                    </tr>
                                ) : displayLeads.length > 0 ? displayLeads.map((lead) => (
                                    <tr key={lead.id} className="hover:bg-blue-50/50 transition-colors group">
                                        <td className="p-3 font-medium text-gray-800">{lead.name}</td>
                                        {!counselor && (
                                            <td className="p-3">
                                                <span className="text-sm text-gray-600 bg-gray-100 px-2 py-1 rounded-md border border-gray-200">
                                                    {lead.assignedTo?.name || (lead.assignedToLeadUser ? `${lead.assignedToLeadUser.firstName} ${lead.assignedToLeadUser.lastName}` : "Unassigned")}
                                                </span>
                                            </td>
                                        )}
                                        <td className="p-3 text-sm text-gray-600">{lead.course}</td>
                                        <td className="p-3 text-sm text-gray-400">{lead.lastUpdate}</td>
                                        <td className="p-3">
                                            <span
                                                className={`px-3 py-1 rounded-full text-xs font-semibold ${lead.status === 'New' ? 'bg-blue-100 text-blue-700' :
                                                    lead.status === 'In Process' ? 'bg-yellow-100 text-yellow-700' :
                                                        lead.status === 'Admission Done' ? 'bg-green-100 text-green-700' :
                                                            'bg-gray-100 text-gray-700'
                                                    }`}
                                            >
                                                {lead.status}
                                            </span>
                                        </td>
                                        <td className="p-3 text-right">
                                            <button 
                                                onClick={() => {
                                                    setSelectedLeadForDetails(lead.fullLead);
                                                    setIsDrawerOpen(true);
                                                }}
                                                className="px-3 py-1 bg-gray-100 text-gray-600 rounded-lg text-xs font-bold hover:bg-blue-600 hover:text-white transition-all shadow-sm"
                                            >
                                                View
                                            </button>
                                        </td>
                                    </tr>
                                )) : (
                                    <tr>
                                        <td colSpan={!counselor ? "6" : "5"} className="p-8 text-center text-gray-400 text-sm">No recent leads found.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                        <div className="mt-4 text-center">
                            {counselor ? (
                                !showingAllLeads ? (
                                    <button 
                                        onClick={async () => {
                                            setShowingAllLeads(true);
                                            setLoadingAllLeads(true);
                                            try {
                                                const res = await getAllLeads(1, 5000, { assignedTo: counselor.id });
                                                if (res && res.data) {
                                                    setAllLeads(res.data.map(l => ({
                                                        id: l._id,
                                                        name: l.studentName || l.firstName,
                                                        course: l.course || "N/A",
                                                        status: l.status,
                                                        lastUpdate: new Date(l.updatedAt).toLocaleDateString(),
                                                        fullLead: l 
                                                    })));
                                                }
                                            } catch (e) {
                                                console.error(e);
                                            }
                                            setLoadingAllLeads(false);
                                        }}
                                        disabled={loadingAllLeads}
                                        className="text-sm font-medium text-blue-600 hover:underline bg-transparent border-none cursor-pointer"
                                    >
                                        View All Leads
                                    </button>
                                ) : (
                                    <button 
                                        onClick={() => setShowingAllLeads(false)}
                                        className="text-sm font-medium text-blue-600 hover:underline bg-transparent border-none cursor-pointer"
                                    >
                                        Show Less
                                    </button>
                                )
                            ) : (
                                <Link to="/admin/lead-management/leads" className="text-sm font-medium text-blue-600 hover:underline">
                                    View All Leads
                                </Link>
                            )}
                        </div>
                    </div>
                </div>

                {/* Today's Schedule / Tasks */}
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 relative">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                            <LucideCalendar size={20} className="text-orange-500" />
                            {counselor ? "My Focus Today" : "Today's Agenda"}
                        </h2>
                        <Link to="/admin/lead-management/tasks" className="text-xs font-semibold text-blue-600 hover:text-blue-700 hover:underline">
                            View All
                        </Link>
                    </div>

                    <div className="space-y-4">
                        {currentTasks.length > 0 ? currentTasks.map((task) => (
                            <div key={task.id} className="group flex items-start gap-4 p-4 rounded-xl border border-gray-100 bg-gray-50/50 hover:bg-white hover:shadow-md hover:border-blue-100 transition-all duration-300 cursor-pointer">
                                <div className={`mt-1 w-2 h-2 rounded-full shrink-0 ${task.priority === 'High' ? 'bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.6)]' :
                                    task.priority === 'Medium' ? 'bg-orange-500' : 'bg-blue-500'
                                    }`}></div>
                                <div className="flex-1">
                                    <h4 className="font-semibold text-gray-800 text-sm group-hover:text-blue-600 transition-colors">{task.title}</h4>
                                    <div className="flex items-center gap-3 mt-2 text-xs text-gray-500">
                                        <span className="flex items-center gap-1 bg-white px-2 py-1 rounded-md border border-gray-100">
                                            <LucideClock size={12} className="text-gray-400" /> {task.time || "Pending"}
                                        </span>
                                        <span className={`px-2 py-1 rounded-md border ${task.type === 'Call' ? 'bg-green-50 text-green-600 border-green-100' :
                                            task.type === 'Meeting' ? 'bg-purple-50 text-purple-600 border-purple-100' :
                                                'bg-blue-50 text-blue-600 border-blue-100'
                                            }`}>
                                            {task.type}
                                        </span>
                                    </div>
                                </div>
                                <div className="self-center opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all duration-300">
                                    <button className="p-2 hover:bg-blue-50 text-blue-600 rounded-full">
                                        <LucideCheckCircle size={18} />
                                    </button>
                                </div>
                            </div>
                        )) : (
                            <div className="text-center py-8 text-gray-400 text-sm">No tasks for today</div>
                        )}
                    </div>

                    <button className="w-full mt-6 py-3 rounded-xl border-2 border-dashed border-gray-200 text-gray-400 font-medium text-sm hover:border-blue-400 hover:text-blue-600 hover:bg-blue-50 transition-all duration-300 flex items-center justify-center gap-2">
                        <span>+ Add Quick Task</span>
                    </button>
                </div>
            </div>
        </div>
    );
}
