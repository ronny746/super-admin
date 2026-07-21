// src/pages/AdminDashboard.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AdminLayout from "../layouts/AdminLayout";
import { Users, BookOpen, UserCheck, CalendarCheck, FileText, GraduationCap, ArrowRight, Activity, ClipboardList } from "lucide-react";
import { getInstituteStats } from "../api/institute_admin/stats_api";
import { useAppContext } from "../context/AppContext";
import AttendanceTable from "../components/AttendanceTable";

export default function AdminDashboard() {
  const { user } = useAppContext();
  const navigate = useNavigate();
  const [totals, setTotals] = useState({
    students: 0,
    teachers: 0,
    presentToday: 0,
    avgAttendance: 0,
  });
  const [adminInfo, setAdminInfo] = useState({});
  const [instituteInfo, setInstituteInfo] = useState({});

  useEffect(() => {
    async function fetchStats() {
      if (!user?.instituteId) return;

      // If user is SUB_ADMIN and DOES NOT have attendance_system permission, do not fetch stats
      if (user.role === 'SUB_ADMIN' && !user.permissions?.attendance_system) {
        return;
      }

      const stats = await getInstituteStats(user.instituteId);
      setTotals({
        students: stats.studentCount,
        teachers: stats.teacherCount,
        presentToday: stats.presentToday,
        avgAttendance: stats.avgAttendance || 0, // If you add this in backend
      });
      setAdminInfo(stats.admin);
      setInstituteInfo(stats.institute);
    }
    fetchStats();
  }, [user]);


  // Check for restricted access
  if (user?.role === 'SUB_ADMIN' && !user.permissions?.attendance_system) {
    return (
      <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500">
        {/* Modern Welcome Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white rounded-3xl p-8 shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-16 -mt-16 blur-2xl"></div>
          <div className="absolute bottom-0 left-0 w-40 h-40 bg-white/5 rounded-full -ml-10 -mb-10 blur-xl"></div>

          <div className="relative z-10">
            <h1 className="text-3xl font-bold mb-2">Welcome back, {user.name}! 👋</h1>
            <p className="text-blue-100 opacity-90 max-w-2xl text-lg">
              Manage your assigned modules efficiently. Here's an overview of your access permissions.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <span className="bg-white/10 backdrop-blur-md px-4 py-1.5 rounded-full text-sm font-medium border border-white/20 flex items-center gap-2">
                <UserCheck size={16} /> {user.email}
              </span>
            </div>
          </div>
        </div>

        <div>
          <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
            <Activity className="text-blue-600" size={24} />
            Quick Access Modules
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Forms Module Card */}
            {user.permissions?.forms && (
              <div
                onClick={() => navigate('/admin/forms')}
                className="group bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                  <FileText size={100} />
                </div>

                <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-sm">
                  <ClipboardList size={28} />
                </div>

                <h3 className="text-xl font-bold text-gray-800 mb-2 group-hover:text-blue-600 transition-colors">Forms Management</h3>
                <p className="text-gray-500 text-sm mb-6 leading-relaxed">
                  Create custom forms, collect data, and analyze student responses effectively.
                </p>

                <div className="flex items-center text-blue-600 font-semibold text-sm group-hover:gap-2 transition-all">
                  Access Dashboard <ArrowRight size={16} className="ml-1" />
                </div>
              </div>
            )}

            {/* Test System Module Card */}
            {user.permissions?.test_system && (
              <div
                onClick={() => navigate('/admin/tests')}
                className="group bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                  <GraduationCap size={100} />
                </div>

                <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-sm">
                  <GraduationCap size={28} />
                </div>

                <h3 className="text-xl font-bold text-gray-800 mb-2 group-hover:text-blue-600 transition-colors">Test System</h3>
                <p className="text-gray-500 text-sm mb-6 leading-relaxed">
                  Manage computer-based tests, monitor live exams, and review performance reports.
                </p>

                <div className="flex items-center text-blue-600 font-semibold text-sm group-hover:gap-2 transition-all">
                  Manage Tests <ArrowRight size={16} className="ml-1" />
                </div>
              </div>
            )}

            {/* Attendance System Module Card */}
            {user.permissions?.attendance_system && (
              <div
                onClick={() => navigate('/admin/roster')} // Assuming roster is a key part, or could be /admin/dashboard if they have full dashboard access
                className="group bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                  <CalendarCheck size={100} />
                </div>

                <div className="w-14 h-14 bg-green-50 text-green-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-sm">
                  <CalendarCheck size={28} />
                </div>

                <h3 className="text-xl font-bold text-gray-800 mb-2 group-hover:text-green-600 transition-colors">Attendance</h3>
                <p className="text-gray-500 text-sm mb-6 leading-relaxed">
                  Track student and teacher attendance, manage rosters, and view daily stats.
                </p>

                <div className="flex items-center text-green-600 font-semibold text-sm group-hover:gap-2 transition-all">
                  View Attendance <ArrowRight size={16} className="ml-1" />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Heading */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Admin Dashboard</h1>
          <p className="text-gray-500 mt-1">
            {instituteInfo.name} ({instituteInfo.code}) - {instituteInfo.address}
          </p>
          <p className="text-gray-500 mt-1">
            Admin: {adminInfo.name} ({adminInfo.email})
          </p>
        </div>
      </div>

      {/* Stats cards */}
      <div className="grid md:grid-cols-4 gap-6 mb-8">

        <div className="flex items-center gap-4">
          <div className="p-3 bg-blue-600 text-white rounded-xl">
            <Users size={26} />
          </div>
          <div className="text-left">
            <div className="text-2xl font-bold text-gray-800">{totals.students}</div>
            <div className="text-sm text-gray-600">Total Students</div>
          </div>
        </div>


        <div className="flex items-center gap-4">
          <div className="p-3 bg-purple-600 text-white rounded-xl">
            <BookOpen size={26} />
          </div>
          <div className="text-left">
            <div className="text-2xl font-bold text-gray-800">{totals.teachers}</div>
            <div className="text-sm text-gray-600">Total Teachers</div>
          </div>
        </div>



        <div className="flex items-center gap-4">
          <div className="p-3 bg-green-600 text-white rounded-xl">
            <UserCheck size={26} />
          </div>
          <div className="text-left">
            <div className="text-2xl font-bold text-gray-800">{totals.presentToday}</div>
            <div className="text-sm text-gray-600">Present Today</div>
          </div>
        </div>



        <div className="flex items-center gap-4">
          <div className="p-3 bg-yellow-500 text-white rounded-xl">
            <CalendarCheck size={26} />
          </div>
          <div className="text-left">
            <div className="text-2xl font-bold text-gray-800">{totals.avgAttendance}%</div>
            <div className="text-sm text-gray-600">Avg Attendance</div>
          </div>
        </div>

      </div>
      {/* Attendance Table */}
      <div className="mt-8">
        <AttendanceTable />
      </div>



    </>
  );
}
