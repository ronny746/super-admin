import { LucideLayoutDashboard, LucideUsers, LucideListTodo, LucideGift, LucideUserPlus, LucideMessageCircle, LucideStar, LucideFileText, LucideFlame } from "lucide-react";
import React, { useState, useEffect } from "react";
import { Link, Outlet, useLocation } from "react-router-dom";

import { useAppContext } from "../../context/AppContext";

export default function LeadManagementLayout() {
    const location = useLocation();
    const { user } = useAppContext();
    const [activeTab, setActiveTab] = useState("dashboard");

    useEffect(() => {
        const path = location.pathname.split("/").pop();
        setActiveTab(path === "lead-management" ? "dashboard" : path);
    }, [location]);

    const tabs = [
        { id: "dashboard", label: "Dashboard", icon: LucideLayoutDashboard, path: "/admin/lead-management/dashboard" },
        { id: "focus-today", label: "Focus Today", icon: LucideFlame, path: "/admin/lead-management/focus-today" },
        { id: "leads", label: "All Leads", icon: LucideUsers, path: "/admin/lead-management/leads" },
        { id: "tasks", label: "Tasks", icon: LucideListTodo, path: "/admin/lead-management/tasks" },
        { id: "offers", label: "Offers", icon: LucideGift, path: "/admin/lead-management/offers" },
        { id: "staff", label: "Staff", icon: LucideUserPlus, path: "/admin/lead-management/staff" },
        { id: "staff-reports", label: "Reports", icon: LucideFileText, path: "/admin/lead-management/staff-reports" },
        { id: "rewards", label: "Mobile Users", icon: LucideStar, path: "/admin/lead-management/rewards" },
    ];

    const isCounselorView = location.state?.counselor || user?.role === 'COUNSELOR';

    if (isCounselorView) {
        return <Outlet />;
    }

    return (
        <div className="space-y-4">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b pb-2">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">Lead Management System</h1>
                    <p className="text-gray-500 text-sm">Manage leads, tasks, and offers efficiently</p>
                </div>
                <div className="flex gap-2">

                </div>
            </div>

            {/* Navigation Tabs */}
            <div className="flex overflow-x-auto gap-2 pb-1 -mt-2">
                {tabs.map((tab) => (
                    <Link
                        key={tab.id}
                        to={tab.path}
                        onClick={() => setActiveTab(tab.id)}
                        className={`
              flex items-center gap-2 px-3 py-1.5 text-sm rounded-lg transition-colors whitespace-nowrap
              ${activeTab === tab.id
                                ? tab.id === "focus-today" ? "bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-md font-bold" : "bg-blue-600 text-white shadow-md"
                                : tab.id === "focus-today" ? "bg-orange-50 text-orange-600 border border-orange-200 hover:bg-orange-100 font-bold" : "bg-white text-gray-600 hover:bg-gray-50 border"
                            }
            `}
                    >
                        <tab.icon size={18} />
                        <span className="font-medium">{tab.label}</span>
                    </Link>
                ))}
            </div>

            {/* Content Area */}
            <div className="bg-white rounded-xl min-h-[500px]">
                <Outlet />
            </div>
        </div>
    );
}
