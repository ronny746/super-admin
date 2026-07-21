import React, { useState, useEffect } from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import { HiHome, HiCalendar, HiOfficeBuilding, HiCollection, HiClipboardList } from "react-icons/hi";

const SlotBookingLayout = () => {
    const location = useLocation();
    const [activeTab, setActiveTab] = useState("dashboard");

    useEffect(() => {
        // Extract the last segment or "dashboard" if slot-booking
        const path = location.pathname.split("/").pop();
        setActiveTab(path === "slot-booking" ? "dashboard" : path);
    }, [location]);

    const tabs = [
        { id: "dashboard", label: "Dashboard", path: "/admin/slot-booking/dashboard", icon: HiHome },
        { id: "exams", label: "Exams", path: "/admin/slot-booking/exams", icon: HiCollection },
        { id: "centers", label: "Centers", path: "/admin/slot-booking/centers", icon: HiOfficeBuilding },
        { id: "slots", label: "Slots", path: "/admin/slot-booking/slots", icon: HiCalendar },
        { id: "bookings", label: "Bookings", path: "/admin/slot-booking/bookings", icon: HiClipboardList },
    ];

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b pb-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">Slot Booking System</h1>
                    <p className="text-gray-500">Manage exams, centers, slots, and bookings</p>
                </div>
            </div>

            {/* Navigation Tabs */}
            <div className="flex overflow-x-auto gap-2 pb-2">
                {tabs.map((tab) => (
                    <Link
                        key={tab.id}
                        to={tab.path}
                        onClick={() => setActiveTab(tab.id)}
                        className={`
              flex items-center gap-2 px-4 py-2 rounded-lg transition-colors whitespace-nowrap
              ${activeTab === tab.id
                                ? "bg-blue-600 text-white shadow-md"
                                : "bg-white text-gray-600 hover:bg-gray-50 border"
                            }
            `}
                    >
                        <tab.icon size={18} />
                        <span className="font-medium">{tab.label}</span>
                    </Link>
                ))}
            </div>

            {/* Content Area */}
            <div className="bg-white rounded-xl min-h-[500px] p-6 shadow-sm border border-gray-100">
                <Outlet />
            </div>
        </div>
    );
};

export default SlotBookingLayout;
